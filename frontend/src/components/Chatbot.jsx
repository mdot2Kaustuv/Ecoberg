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
    <div className="flex flex-col h-[560px] w-full max-w-md mx-auto rounded-2xl border border-stone-200 overflow-hidden font-sans shadow-xl shadow-emerald-900/5 bg-stone-50">
      
      {/* Header - Earthy Forest Gradient */}
      <div className="flex items-center gap-4 px-5 py-4 bg-gradient-to-r from-emerald-900 to-emerald-800 shadow-sm relative z-10">
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-emerald-50 text-emerald-700 shadow-inner flex-shrink-0">
          {/* Leaf Icon */}
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.65 8.98C13.84 8.61 12.97 8.35 12.06 8.24C11.15 8.13 10.21 8.16 9.3 8.36C8.39 8.56 7.52 8.92 6.74 9.44C5.96 9.96 5.28 10.64 4.74 11.44C4.2 12.24 3.82 13.15 3.63 14.12C3.44 15.09 3.45 16.09 3.66 17.06C3.87 18.03 4.28 18.94 4.86 19.74C4.94 19.86 5.05 19.95 5.18 20.02C5.31 20.09 5.46 20.12 5.61 20.11C5.76 20.1 5.9 20.04 6.02 19.95C6.14 19.86 6.23 19.74 6.28 19.59C6.34 19.45 6.36 19.3 6.33 19.15C6.3 19 6.23 18.86 6.13 18.75C5.78 18.3 5.49 17.8 5.28 17.27C4.69 15.7 4.76 13.92 5.48 12.41C6.2 10.9 7.49 9.8 9.07 9.34C10.65 8.88 12.38 9.13 13.79 10.02C15.2 10.91 16.14 12.34 16.35 13.97C16.38 14.19 16.38 14.41 16.36 14.63C16.31 15.06 16.16 15.47 15.93 15.82C15.69 16.17 15.38 16.45 15 16.65C14.62 16.85 14.2 16.96 13.77 16.98C13.34 17 12.91 16.92 12.51 16.76C12.11 16.6 11.74 16.36 11.43 16.05C11.12 15.74 10.88 15.37 10.72 14.97C10.56 14.57 10.48 14.14 10.49 13.71C10.51 13.28 10.61 12.86 10.8 12.48C10.92 12.24 10.95 11.97 10.88 11.71C10.81 11.45 10.65 11.23 10.43 11.09C10.21 10.95 9.94 10.9 9.68 10.95C9.42 11 9.19 11.15 9.03 11.37C8.61 11.92 8.36 12.55 8.3 13.22C8.24 13.89 8.37 14.56 8.67 15.17C8.97 15.78 9.42 16.3 10 16.68C10.58 17.06 11.25 17.29 11.94 17.34C12.63 17.39 13.32 17.26 13.94 16.96C14.56 16.66 15.09 16.2 15.48 15.63C15.87 15.06 16.1 14.4 16.15 13.71C16.18 13.33 16.16 12.96 16.08 12.58C16.29 12.55 16.5 12.49 16.7 12.4C17 12.26 17.27 12.08 17.51 11.86C17.65 11.73 17.74 11.56 17.78 11.38C17.82 11.2 17.78 11.01 17.66 10.86V11.2Z" />
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-white text-base font-semibold tracking-wide">Ecoberg</p>
          <p className="text-emerald-200 text-xs flex items-center gap-1.5 font-medium mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Climate Assistant
          </p>
        </div>
      </div>

      {/* Messages Area - Warm Stone Background */}
      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 bg-stone-50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 max-w-[88%] ${msg.role === "user" ? "self-end flex-row-reverse" : "self-start"}`}>
            {msg.role === "bot" && (
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 bg-emerald-100 text-emerald-800">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                   <path d="M17 8C8 10 5.9 16.17 3.82 19.82A2 2 0 003 21c0 0 3-1 6-3s8-5 8-10z" />
                   <path d="M3 21s1-5 5-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
            
            <div className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
              <div
                className={`px-4 py-3 text-[15px] leading-relaxed shadow-sm ${
                  msg.role === "user"
                    ? "bg-emerald-700 text-white rounded-2xl rounded-tr-sm"
                    : "bg-white text-stone-700 border border-stone-200 rounded-2xl rounded-tl-sm"
                }`}
              >
                {msg.text}
              </div>

              {msg.showSuggestions && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="px-3.5 py-1.5 rounded-full text-sm font-medium border border-emerald-200 text-emerald-700 bg-white hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200 shadow-sm"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
              <span className="text-[11px] text-stone-400 mt-1.5 px-1 font-medium">{msg.time}</span>
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex gap-3 self-start max-w-[80%]">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-emerald-100 text-emerald-800">
               <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                   <path d="M17 8C8 10 5.9 16.17 3.82 19.82A2 2 0 003 21c0 0 3-1 6-3s8-5 8-10z" />
                   <path d="M3 21s1-5 5-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white border border-stone-200 shadow-sm flex gap-1.5 items-center h-[46px]">
              {[0, 0.15, 0.3].map((delay, i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-emerald-600/60"
                  style={{ animation: `bounce 1.4s ${delay}s infinite ease-in-out both` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-stone-200">
        <div className="flex gap-3 items-end bg-stone-50 border border-stone-200 rounded-xl p-1.5 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all shadow-sm">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
            }}
            onKeyDown={handleKeyDown}
            placeholder="Ask about emissions, climate data..."
            className="flex-1 resize-none bg-transparent px-3 py-2 text-stone-700 text-[15px] outline-none placeholder-stone-400"
            style={{ maxHeight: "120px" }}
            disabled={loading}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="w-10 h-10 mb-0.5 mr-0.5 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: loading || !input.trim() ? "#e7e5e4" : "#064e3b",
            }}
            aria-label="Send message"
          >
            <svg 
              viewBox="0 0 24 24" 
              width="18" 
              height="18" 
              fill="none" 
              stroke={loading || !input.trim() ? "#a8a29e" : "#ffffff"} 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className={!(loading || !input.trim()) ? "group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" : ""}
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}