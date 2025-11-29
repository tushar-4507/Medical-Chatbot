import os
import pandas as pd
from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.docstore.document import Document
from tqdm import tqdm

DATA_PATH = "data/"

def load_pdf_files(data_path):
    loader = DirectoryLoader(data_path, glob='*.pdf', loader_cls=PyPDFLoader)
    documents = loader.load()
    return documents

def load_csv_data(data_path):
    all_documents = []
    csv_files = [f for f in os.listdir(data_path) if f.endswith('.csv')]
    
    if not csv_files:
        return []

    for file_name in csv_files:
        file_path = os.path.join(data_path, file_name)
        try:
            df = pd.read_csv(file_path)
            
            # --- Specific handling for different CSV formats ---
            
            # medquad.csv format (Q&A pairs)
            if 'question' in df.columns and 'answer' in df.columns:
                print(f"Processing Q&A data from {file_name}...")
                for _, row in df.iterrows():
                    content = f"Question: {row['question']}\nAnswer: {row['answer']}"
                    all_documents.append(Document(page_content=content, metadata={"source": file_path}))

            # COVID-19 time series data
            elif 'Combined_Key' in df.columns and 'Population' in df.columns:
                print(f"Processing US COVID-19 data from {file_name}...")
                for _, row in df.iterrows():
                    # Extracting meaningful context from the row
                    if not pd.isna(row['Combined_Key']) and not pd.isna(row['Population']):
                        content = f"COVID-19 data for {row['Combined_Key']}, population: {row['Population']}."
                        all_documents.append(Document(page_content=content, metadata={"source": file_path}))

            # Fallback for other CSV formats
            else:
                print(f"Processing general CSV data from {file_name}...")
                content = df.to_string()
                all_documents.append(Document(page_content=content, metadata={"source": file_path}))
                
        except Exception as e:
            print(f"Error loading {file_path}: {e}")
            continue
    return all_documents

# --- Main script execution ---
all_documents = []

if os.path.exists(DATA_PATH):
    print("Loading all files from the 'data' folder...")
    pdf_docs = load_pdf_files(DATA_PATH)
    all_documents.extend(pdf_docs)
    csv_docs = load_csv_data(DATA_PATH)
    all_documents.extend(csv_docs)

if not all_documents:
    print("No documents found. Please ensure you have files in the 'data/' directory.")
else:
    print(f"Total documents loaded: {len(all_documents)}")
    def create_chunks(extracted_data):
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        text_chunks = text_splitter.split_documents(extracted_data)
        return text_chunks

    text_chunks = create_chunks(extracted_data=all_documents)
    print(f"Length of Text Chunks: {len(text_chunks)}")
    
    def get_embedding_model():
        embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
        return embedding_model
    embedding_model = get_embedding_model()

    DB_FAISS_PATH = "vectorstore/db_faiss"
    if os.path.exists(DB_FAISS_PATH):
        db = FAISS.load_local(DB_FAISS_PATH, embedding_model, allow_dangerous_deserialization=True)
        print("Vector store loaded from disk.")
    else:
        print("Creating a new vector store with progress updates...")
        if not text_chunks:
            print("No text chunks to process. Exiting.")
            exit()
            
        db = FAISS.from_documents([text_chunks[0]], embedding_model)
        for chunk in tqdm(text_chunks[1:], desc="Adding chunks to FAISS index"):
            db.add_documents([chunk])
    db.save_local(DB_FAISS_PATH)
    print("Vector store created successfully.")