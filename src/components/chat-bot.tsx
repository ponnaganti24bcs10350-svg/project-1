"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, Sparkles, BookOpen, Bot, User, ArrowRight } from "lucide-react";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: Date;
}

const SUGGESTIONS = [
  "Explain the CAP Theorem",
  "When is the next ML class?",
  "What is the HLD curriculum?",
  "Tell me about Transformers"
];

// Curated high-fidelity knowledge responses for students
const KNOWLEDGE_BASE: Record<string, string> = {
  cap: "The CAP Theorem states that in a distributed data store, you can only guarantee two out of three of: Consistency, Availability, and Partition Tolerance. For high-scale systems, Partition Tolerance (P) is mandatory, so you must choose between Consistency (C) and Availability (A)!",
  ml: "Your next ML III class is 'Initialization, Normalization & Debugging' scheduled for TODAY at 11:30 AM. Don't miss it!",
  hld: "Your SST High Level Design 101 course features 15 comprehensive lectures covering System Design 101, Load Balancing, Caching, and Database Case Studies (Netflix, Uber, Messaging Systems). Access it in Subject 3!",
  transformer: "Transformers are neural network models that rely on self-attention mechanisms to process sequential data in parallel. They power state-of-the-art LLMs by learning context and relationships between words regardless of distance!",
  dbms: "Your SST Advanced DBMS syllabus is covering Storage Engines, Buffer Pools, Indexing, and Query Execution/Optimization. Currently, you are scheduled for 'Index Structures_2'!",
  genai: "Your SST GenAI Engineering track covers Prompt Engineering, RAG (Retrieval-Augmented Generation), Agent SDK, Memory Systems, Model Context Protocol (MCP), and safety guardrails!"
};

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      sender: "bot",
      text: "Hi! I am your SST Sem 4 Study Companion. 🚀 Ask me about deep learning models, distributed architectures, databases, or your class schedule!",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Math.random().toString(),
      sender: "user",
      text,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let replyText = "I'm looking into that for you! That topic is covered in your Sem 4 curriculum. Let me know if you want me to summarize your active syllabus or provide tips on distributed systems!";
      
      const normalizedText = text.toLowerCase();
      if (normalizedText.includes("cap") || normalizedText.includes("consistency")) {
        replyText = KNOWLEDGE_BASE.cap;
      } else if (normalizedText.includes("ml") || normalizedText.includes("machine learning") || normalizedText.includes("neural")) {
        replyText = KNOWLEDGE_BASE.ml;
      } else if (normalizedText.includes("hld") || normalizedText.includes("design") || normalizedText.includes("high level")) {
        replyText = KNOWLEDGE_BASE.hld;
      } else if (normalizedText.includes("transformer") || normalizedText.includes("attention")) {
        replyText = KNOWLEDGE_BASE.transformer;
      } else if (normalizedText.includes("dbms") || normalizedText.includes("database") || normalizedText.includes("sql")) {
        replyText = KNOWLEDGE_BASE.dbms;
      } else if (normalizedText.includes("genai") || normalizedText.includes("agent") || normalizedText.includes("rag")) {
        replyText = KNOWLEDGE_BASE.genai;
      } else if (normalizedText.includes("hi") || normalizedText.includes("hello") || normalizedText.includes("hey")) {
        replyText = "Hello! 👋 Ready to smash your SST Sem 4 preparation? Choose one of the quick suggestions below or ask me any question about your curriculum!";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: "bot",
          text: replyText,
          timestamp: new Date()
        }
      ]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-all duration-300 relative group animate-pulse"
        >
          <MessageSquare size={24} />
          <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-md">
            SST Companion AI ✨
          </span>
        </button>
      )}

      {/* Collapsible Chat Window */}
      {isOpen && (
        <div className="w-[360px] h-[500px] bg-white rounded-2xl border border-slate-100 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                  SST Study Companion
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping"></span>
                </h3>
                <p className="text-[10px] text-blue-100">Powered by SST AI</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 max-w-[85%] ${
                  msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-slate-100 text-slate-700 shadow-sm"
                  }`}
                >
                  {msg.sender === "user" ? <User size={14} /> : <Bot size={14} className="text-blue-600" />}
                </div>
                <div className="space-y-1">
                  <div
                    className={`text-[12px] leading-relaxed p-3 rounded-2xl ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-500/10"
                        : "bg-white border border-slate-100 text-slate-700 rounded-tl-none shadow-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <p className="text-[9px] text-slate-400 px-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {/* Bouncing Dots Loader */}
            {isTyping && (
              <div className="flex gap-2.5 mr-auto max-w-[80%]">
                <div className="w-7 h-7 bg-white border border-slate-100 rounded-lg flex items-center justify-center shadow-sm">
                  <Bot size={14} className="text-blue-600" />
                </div>
                <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions Chips */}
          <div className="p-3 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto shrink-0 scrollbar-none">
            {SUGGESTIONS.map((sug, i) => (
              <button
                key={i}
                onClick={() => handleSend(sug)}
                className="text-[10px] font-bold text-blue-600 bg-blue-50/50 hover:bg-blue-50 border border-blue-100/50 rounded-full px-3 py-1.5 whitespace-nowrap transition-colors flex items-center gap-1 shrink-0"
              >
                <Sparkles size={8} />
                {sug}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputValue);
            }}
            className="p-3 border-t border-slate-100 bg-white flex gap-2 items-center shrink-0"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask your companion..."
              className="flex-1 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs text-slate-800 placeholder-slate-400 border border-transparent focus:border-blue-500/30 rounded-xl px-3.5 py-2.5 focus:outline-none transition-all"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="h-9 w-9 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 text-white disabled:text-slate-400 rounded-xl flex items-center justify-center transition-all shadow-md shadow-blue-500/10 active:scale-95"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
