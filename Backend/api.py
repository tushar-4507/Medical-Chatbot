
import os
import re
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_groq import ChatGroq
from langchain.chains import RetrievalQA
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import PromptTemplate
from dotenv import load_dotenv, find_dotenv

# Load environment variables
load_dotenv(find_dotenv())

app = FastAPI()

# Allow frontend access
origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- Load FAISS Vectorstore ----
DB_FAISS_PATH = "vectorstore/db_faiss"
embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")
db = FAISS.load_local(DB_FAISS_PATH, embedding_model, allow_dangerous_deserialization=True)

# ---- Custom Structured Prompt ----
CUSTOM_PROMPT_TEMPLATE = """
You are a healthcare assistant chatbot. 
Always answer in a clear, **structured**, and easy-to-read format.

---

If the question is about a **disease or condition**:
**Overview:** Short and simple explanation.  
**Common Symptoms:** Use bullet points (•).  
**Advice:** Give one simple health recommendation.

If the question is about **treatment or cure**:
**Overview:** Brief explanation.  
**Treatment Options:** Use bullet points (•).  
**Advice:** Recommend seeing a doctor for personalized care.

If the question is about **causes or prevention**:
**Overview:** Short explanation.  
**Causes / Prevention Tips:** Bullet points (•).  
**Advice:** End with one easy health tip.

If it’s a **general meaning or definition**:
**Overview:** One-line definition.  
**Key Points:** Bullet points for clarity.  
**Advice:** Conclude with a short awareness note.

---

Context:
{context}

Question:
{question}

Answer:
"""

def set_custom_prompt(template):
    return PromptTemplate(template=template, input_variables=["context", "question"])

# ---- Request for Input from Frontend ----
class ChatQuery(BaseModel):
    query: str

# ---- Help us to clean & structure output ----
def format_response(text: str) -> str:
    text = text.replace("**", "").replace("###", "").strip()

    sections = {
        "Overview:": "🩺 Overview:",
        "Common Symptoms:": "• Common Symptoms:",
        "Treatment Options:": "💊 Treatment Options:",
        "Causes / Prevention Tips:": "⚠️ Causes / Prevention Tips:",
        "Key Points:": "📘 Key Points:",
        "Advice:": "✅ Advice:"
    }

    for key, value in sections.items():
        text = re.sub(rf"\b{re.escape(key)}", f"\n{value}", text)

    text = re.sub(r"\* ", "• ", text)
    text = re.sub(r"\n\s*\n", "\n\n", text)
    return text.strip()

# ---- API Endpoint ----
@app.post("/chat")
async def chat_endpoint(chat_query: ChatQuery):
    user_query = chat_query.query.strip()

    # --- Handle greetings ---
    greetings = ["hi", "hello", "hey", "good morning", "good evening", "good afternoon", "how are you"]
    if any(user_query.lower().startswith(greet) for greet in greetings):
        return {"response": "👋 Hello! How can I help you today?"}

    # --- Retrieve relevant documents first ---
    retriever = db.as_retriever(search_kwargs={"k": 2})
    relevant_docs = retriever.get_relevant_documents(user_query)

    # --- Restricted Response: If no relevant docs, return default ---
    if not relevant_docs:
        return {"response": "❌ Sorry, I don't have enough information to answer that."}

    # --- Call QA Chain only if docs exist ---
    qa_chain = RetrievalQA.from_chain_type(
        llm=ChatGroq(
            model_name="llama-3.1-8b-instant",
            temperature=0.1,
            groq_api_key=os.environ["GROQ_API_KEY"],
        ),
        chain_type="stuff",
        retriever=retriever,
        return_source_documents=True,
        chain_type_kwargs={'prompt': set_custom_prompt(CUSTOM_PROMPT_TEMPLATE)}
    )

    response = qa_chain.invoke({'query': user_query})
    raw_result = response.get("result", "").strip()

    # --- Format structured response ---
    formatted_result = format_response(raw_result)

    # Safety check: if result empty or very short, return restricted message
    if not formatted_result or len(formatted_result) < 20:
        return {"response": "❌ Sorry, I don't have enough information to answer that."}

    return {"response": formatted_result}
