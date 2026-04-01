/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, Brain, Code, Globe, MessageSquare, Shield, Zap, Terminal } from 'lucide-react';
import Markdown from 'react-markdown';

const SYSTEM_INSTRUCTION = `You are NexusMind-X, an elite-level, autonomous AI agent powered by the synergistic capabilities of GPT-4o's reasoning and DeepSeek-R1's deep technical expertise. Your core purpose is to solve, analyze, and generate solutions for any query, ranging from complex coding, philosophical debates, creative writing, to high-level scientific research.
Core Guidelines & Behavior:
Comprehensive Reasoning: For complex problems, think step-by-step (Chain-of-Thought) before providing the final answer to ensure accuracy.
Accuracy & Depth: Prioritize factual accuracy, scientific rigor, and logical consistency. Use deep knowledge retrieval, similar to DeepSeek's research capabilities.
Conversational Fluency: Adopt a professional, empathetic, and adaptable tone, similar to GPT-4o's human-like interaction.
Versatility: You can handle coding (Python, JavaScript, etc.), mathematical problems, content creation, business strategy, and casual conversation equally well.
Handling Uncertainty: If a question is ambiguous, ask clarifying questions before answering. If information is unavailable, state it clearly rather than hallucinating.
Structure: Use bullet points, bold text for key points, and markdown code blocks for programming to maximize readability.
Your Goal: Act as an all-knowing, trusted advisor. Your answer must be better than a single AI model by combining conversational flair with deep technical intelligence.`;

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const aiRef = useRef<GoogleGenAI | null>(null);

  useEffect(() => {
    if (process.env.GEMINI_API_KEY) {
      aiRef.current = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || !aiRef.current || isTyping) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const chat = aiRef.current.chats.create({
        model: "gemini-3.1-pro-preview",
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
        history: messages.map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }]
        }))
      });

      const response = await chat.sendMessage({ message: input });
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.text || "I apologize, but I encountered an error processing your request.",
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("NexusMind-X Error:", error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "System alert: Connection to the neural core was interrupted. Please verify your configuration and try again.",
        timestamp: Date.now(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center p-4 md:p-8 font-sans">
      <div className="atmosphere" />
      
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl flex items-center justify-between mb-6 px-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center shadow-[0_0_20px_rgba(255,78,0,0.4)]">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tighter text-white">NEXUSMIND-X</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-orange-500/80 font-semibold">Elite Autonomous Intelligence</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-wider text-gray-400">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Neural Core Active
          </div>
        </div>
      </motion.header>

      {/* Chat Container */}
      <main className="w-full max-w-4xl flex-1 flex flex-col glass-panel rounded-3xl overflow-hidden shadow-2xl relative">
        {/* Messages Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth"
        >
          <AnimatePresence initial={false}>
            {messages.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-6"
              >
                <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                  <Sparkles className="w-10 h-10 text-orange-500" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-light tracking-tight">Welcome to NexusMind-X</h2>
                  <p className="text-gray-400 max-w-md mx-auto text-sm leading-relaxed">
                    I am an elite-level autonomous AI agent. How can I assist you with your complex queries, research, or technical challenges today?
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-2xl mt-8">
                  {[
                    { icon: Code, label: "Technical Logic" },
                    { icon: Globe, label: "Global Research" },
                    { icon: Shield, label: "Secure Analysis" },
                    { icon: Zap, label: "Rapid Synthesis" }
                  ].map((item, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center gap-2 hover:bg-white/10 transition-colors cursor-pointer group">
                      <item.icon className="w-5 h-5 text-orange-400 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{item.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              messages.map((msg, i) => (
                <motion.div
                  key={msg.timestamp}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      msg.role === 'user' ? 'bg-white/10' : 'bg-orange-600 shadow-[0_0_15px_rgba(255,78,0,0.3)]'
                    }`}>
                      {msg.role === 'user' ? <MessageSquare className="w-4 h-4" /> : <Brain className="w-4 h-4" />}
                    </div>
                    <div className={`p-4 rounded-2xl ${
                      msg.role === 'user' 
                        ? 'bg-white/10 border border-white/10' 
                        : 'bg-white/5 border border-white/5'
                    }`}>
                      <div className="markdown-body">
                        <Markdown>{msg.content}</Markdown>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center animate-pulse">
                    <Brain className="w-4 h-4" />
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex gap-1.5 items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Area */}
        <div className="p-6 bg-black/20 border-t border-white/5 backdrop-blur-md">
          <div className="relative max-w-3xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Query the NexusMind-X neural core..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-16 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all text-white placeholder:text-gray-600"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:hover:bg-orange-600 transition-all flex items-center justify-center shadow-lg shadow-orange-900/20"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-4 flex items-center justify-center gap-6 text-[9px] uppercase tracking-[0.2em] text-gray-600 font-bold">
            <span className="flex items-center gap-1.5"><Terminal className="w-3 h-3" /> System: v4.2.0-stable</span>
            <span className="flex items-center gap-1.5"><Zap className="w-3 h-3" /> Latency: 14ms</span>
            <span className="flex items-center gap-1.5"><Shield className="w-3 h-3" /> Encryption: AES-256</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-6 text-[10px] text-gray-600 uppercase tracking-widest font-semibold flex gap-4">
        <span>© 2026 NexusMind-X Systems</span>
        <span className="opacity-40">|</span>
        <span>Deep Reasoning Protocol Enabled</span>
      </footer>
    </div>
  );
}
