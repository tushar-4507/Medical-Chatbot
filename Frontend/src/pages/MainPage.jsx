import React, { useState } from "react";
import Navbar from "../components/Navbar";

// A simple Message component to render chat bubbles
const Message = ({ type, text }) => (
  <div className={`flex items-end gap-2 mb-4 ${type === 'user' ? 'self-end' : ''}`}>
    <span className={`text-${type === 'user' ? 'purple-600' : 'purple-600'} text-xl`}>
      {type === 'user' ? '➡️' : '💬'}
    </span>
    <div className={`text-gray-700 px-4 py-2 rounded-xl max-w-[75%] ${type === 'user' ? 'bg-purple-100 self-end' : 'bg-purple-100'}`}>
      <p>{text}</p>
    </div>
  </div>
);

const MainPage = () => {
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hey there 👋' },
    { type: 'bot', text: 'How can I help you today?' },
  ]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage = { type: 'user', text: query };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setQuery("");
    setIsLoading(true);

    try {
      const apiResponse = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query }),
      });

      if (!apiResponse.ok) {
        throw new Error("Network response was not ok.");
      }

      const data = await apiResponse.json();
      const botMessage = { type: 'bot', text: data.response };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error fetching data:', error);
      const errorMessage = { type: 'bot', text: 'Sorry, an error occurred. Please try again.' };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-purple-100 to-purple-200">
      <Navbar solidBackground={true} />
      <div className="pt-[120px] flex justify-center items-center h-[calc(100vh-80px)] px-4">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl flex flex-col justify-between h-[650px] overflow-hidden border border-gray-300">
          <div className="bg-purple-600 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-semibold text-lg">
              <span className="text-xl">💬</span> HealthChatbot
            </div>
            <button className="material-symbols-rounded text-white text-3xl ml-auto hover:text-gray-200">
              keyboard_arrow_down
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((msg, index) => (
              <Message key={index} type={msg.type} text={msg.text} />
            ))}
          </div>
          <div className="p-4 bg-white relative">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Message..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-purple-600 pr-12" // Increased padding for the button
                disabled={isLoading}
              />
              <button
                type="submit"
                className={`absolute right-6 top-1/2 -translate-y-1/2 p-2 rounded-full ${query.trim() ? ' text-purple-600' : ' text-gray-300'}`}
                disabled={isLoading || !query.trim()}
              >
                <span className="material-symbols-rounded">
                  {query.trim() ? 'send' : 'arrow_right_alt'}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;