import { useState, useRef, useEffect } from "react";

const BACKEND_URL = "http://127.0.0.1:8000/chatbot/";

const SUGGESTIONS = [
  "Nepal's CO₂ emissions",
  "What is a carbon footprint?",
  "Global warming explained",
];

function getTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function EcobergChat() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi! I'm the Ecoberg assistant 🌿 I can help you understand greenhouse gas emissions, climate data, and environmental trends. What would you like to explore?",
      time: getTime(),
      showSuggestions: true,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text = input) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: trimmed, time: getTime() }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: data.reply || "Something went wrong. Please try again.",
          time: getTime(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Could not reach the server. Make sure your Django backend is running.",
          time: getTime(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[520px] rounded-xl border border-gray-200 overflow-hidden font-sans shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3" style={{ background: "#054335" }}>
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "#00d084" }}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#054335" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 8C8 10 5.9 16.17 3.82 19.82A2 2 0 003 21c0 0 3-1 6-3s8-5 8-10z" />
            <path d="M3 21s1-5 5-8" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-white text-sm font-medium leading-tight">Ecoberg Assistant</p>
          <p className="text-xs flex items-center gap-1" style={{ color: "#9fe1cb" }}>
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "#00d084" }} />
            Online
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-gray-50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 max-w-[85%] ${msg.role === "user" ? "self-end flex-row-reverse" : "self-start"}`}>
            {msg.role === "bot" && (
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: "#00d084" }}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#054335" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 8C8 10 5.9 16.17 3.82 19.82A2 2 0 003 21c0 0 3-1 6-3s8-5 8-10z" />
                  <path d="M3 21s1-5 5-8" />
                </svg>
              </div>
            )}
            <div>
              <div
                className="px-3.5 py-2.5 rounded-xl text-sm leading-relaxed"
                style={
                  msg.role === "user"
                    ? { background: "#054335", color: "#e1f5ee", borderBottomRightRadius: "3px" }
                    : { background: "white", color: "#1a1a1a", border: "0.5px solid #e5e7eb", borderBottomLeftRadius: "3px" }
                }
              >
                {msg.text}
              </div>
              {msg.showSuggestions && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="px-3 py-1 rounded-full text-xs border cursor-pointer transition-colors"
                      style={{ borderColor: "#1D9E75", color: "#1D9E75", background: "transparent" }}
                      onMouseEnter={(e) => { e.target.style.background = "#E1F5EE"; }}
                      onMouseLeave={(e) => { e.target.style.background = "transparent"; }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-400 mt-1 px-1">{msg.time}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-2 self-start">
            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#00d084" }}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#054335" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 8C8 10 5.9 16.17 3.82 19.82A2 2 0 003 21c0 0 3-1 6-3s8-5 8-10z" />
                <path d="M3 21s1-5 5-8" />
              </svg>
            </div>
            <div className="px-4 py-3 rounded-xl bg-white border border-gray-100 flex gap-1 items-center">
              {[0, 0.2, 0.4].map((delay, i) => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{ background: "#1D9E75", animation: `bounce 1.2s ${delay}s infinite` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 items-end p-3 border-t border-gray-200 bg-white">
        <textarea
          ref={textareaRef}
          rows={1}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
          }}
          onKeyDown={handleKeyDown}
          placeholder="Ask about emissions, climate data..."
          className="flex-1 resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-green-600 transition-colors"
          style={{ maxHeight: "100px", fontFamily: "inherit" }}
          disabled={loading}
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
          style={{
            background: loading || !input.trim() ? "#e5e7eb" : "#054335",
            color: loading || !input.trim() ? "#9ca3af" : "#00d084",
            border: "none",
            cursor: loading || !input.trim() ? "not-allowed" : "pointer",
          }}
          aria-label="Send message"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}