"use client";
import { useState, useRef, useEffect } from "react";
import type { Analysis } from "../page";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SUGGESTED_QUESTIONS = [
  "What are the biggest risks in this document?",
  "Can I get out of this agreement early?",
  "What happens if I violate the non-compete?",
  "Is this clause standard or unusual?",
  "What should I negotiate before signing?",
  "Summarize my obligations in one paragraph",
];

interface Props {
  documentText: string;
  analysis: Analysis;
  language: string;
}

export default function ChatInterface({ documentText, analysis, language }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `I've finished analyzing your **${analysis.documentType}**. I found ${analysis.risks.length} risk(s) — ${analysis.risks.filter((r) => r.severity === "high").length} high severity. Ask me anything about this document, and I'll give you a straight answer.${language !== "English" ? ` (I'll respond in ${language})` : ""}`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    setInput("");
    const userMessage: Message = {
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentText,
          message: messageText,
          history,
          mode: "chat",
          language,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `⚠️ Error: ${err.message || "Something went wrong. Please try again."}`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatMessage = (text: string) => {
    // Basic markdown-ish formatting
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#C8963E">$1</strong>')
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br/>");
  };

  return (
    <div className="flex flex-col h-[70vh] rounded-2xl overflow-hidden"
      style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
    >
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-up`}
          >
            {msg.role === "assistant" && (
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-sm mr-2 flex-shrink-0 mt-1"
                style={{ background: "linear-gradient(135deg,#C8963E,#8B1A1A)" }}
              >
                ⚖
              </div>
            )}
            <div
              className={`max-w-[75%] px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"
              }`}
              style={{ color: msg.role === "user" ? "#0f0f1a" : "rgba(255,255,255,0.85)" }}
              dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
            />
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
              style={{ background: "linear-gradient(135deg,#C8963E,#8B1A1A)" }}
            >
              ⚖
            </div>
            <div
              className="px-4 py-3 rounded-2xl flex gap-1"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ background: "#C8963E", animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested questions */}
      {messages.length <= 1 && (
        <div className="px-6 pb-2">
          <p className="text-xs mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.slice(0, 4).map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="text-xs px-3 py-1.5 rounded-full transition-all hover:opacity-80"
                style={{
                  background: "rgba(200,150,62,0.1)",
                  border: "1px solid rgba(200,150,62,0.2)",
                  color: "#C8963E",
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div
        className="p-4 border-t"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder={language !== "English" ? `Ask in any language — responses in ${language}...` : "Ask anything about this document..."}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#F5F0E8",
            }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-40"
            style={{ background: "#C8963E", color: "#0f0f1a" }}
          >
            Send
          </button>
        </div>
        <p className="text-xs mt-2 text-center" style={{ color: "rgba(255,255,255,0.2)" }}>
          Not legal advice. Consult a qualified lawyer for important decisions.
        </p>
      </div>
    </div>
  );
}
