"use client";

import { useState, useRef, useEffect } from "react";
import { apiFetch } from "@/lib/apiClient";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIAssistantProps {
  courseContext?: string;
  defaultOpen?: boolean;
  variant?: "sidebar" | "card";
}

export function AIAssistant({ courseContext, defaultOpen = false, variant = "sidebar" }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setLoading(true);

    try {
      const res = await apiFetch("/api/ai/chat", {
        method: "POST",
        body: JSON.stringify({
          message: trimmed,
          courseContext: courseContext || undefined,
        }),
      });

      const data = await res.json();
      const reply = data.reply || "Sorry, I couldn't process that. Please try again.";

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Network error. Please check your connection and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const isCard = variant === "card";

  return (
    <div className={isCard ? "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" : "mt-4 border-t border-slate-200 pt-4"}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 px-3 py-2.5 font-medium text-white shadow-sm hover:from-violet-600 hover:to-purple-700 transition-colors ${isCard ? "text-base" : "text-sm"}`}
      >
        <span className="flex items-center gap-2">
          <span>✨</span>
          AI Study Assistant
        </span>
        <span className="text-xs opacity-90">{isOpen ? "▼" : "▶"}</span>
      </button>

      {isOpen && (
        <div className={`mt-3 rounded-lg border border-slate-200 bg-slate-50 ${isCard ? "max-h-80" : ""}`}>
          <div className={`overflow-y-auto p-3 space-y-3 ${isCard ? "max-h-72" : "max-h-64"}`}>
            {messages.length === 0 && (
              <p className={`text-slate-500 text-center py-4 ${isCard ? "text-sm" : "text-xs"}`}>
                {courseContext
                  ? `Ask anything about ${courseContext}! E.g. &quot;Explain OOP&quot; or &quot;Help with this concept&quot;`
                  : "Ask about learning, study tips, or any topic! E.g. &quot;How do I stay motivated?&quot; or &quot;Explain recursion&quot;"}
              </p>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[90%] rounded-lg px-3 py-2 text-sm ${
                    msg.role === "user"
                      ? "bg-primary-600 text-white"
                      : "bg-white border border-slate-200 text-slate-700"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-lg bg-white border border-slate-200 px-3 py-2">
                  <span className="inline-flex gap-1">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-slate-400" />
                    <span className="h-2 w-2 animate-pulse rounded-full bg-slate-400" />
                    <span className="h-2 w-2 animate-pulse rounded-full bg-slate-400" />
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="border-t border-slate-200 p-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder="Ask a question..."
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
