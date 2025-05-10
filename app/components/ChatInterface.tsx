"use client";

import { useState } from "react";
import { Brain, User } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user" as const, content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput(""); // Clear input field

    try {
      // Send the conversation (messages) to the backend API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage], // Include the entire conversation history
          userLocation: "pakistan",  // Adjust based on actual user location
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      const aiMessage = { role: "assistant" as const, content: data.response };
      setMessages((prevMessages) => [...prevMessages, aiMessage]); // Add the assistant's response
    } catch (error) {
      console.error("Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((m, index) => (
          <div key={index} className={flex ${m.role === "user" ? "justify-end" : "justify-start"}}>
            <div className={flex items-end ${m.role === "user" ? "flex-row-reverse" : "flex-row"}}>
              <div className={rounded-full p-2 ${m.role === "user" ? "bg-primary text-white" : "bg-gray-200"} mr-2}>
                {m.role === "user" ? <User className="h-6 w-6" /> : <Brain className="h-6 w-6" />}
              </div>
              <div className={rounded-lg p-3 max-w-md ${m.role === "user" ? "bg-primary text-white" : "bg-gray-100"}}>
                {m.content}
              </div>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}