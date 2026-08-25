"use client";

import { useState } from "react";

const quickScenarios = [
  "My order hasn't arrived",
  "I already tried that",
  "This is the third time I've contacted you",
];

export function DemoChatComposer({
  onSend,
  disabled,
}: {
  onSend: (message: string) => void;
  disabled?: boolean;
}) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput("");
  };

  return (
    <div className="bg-[#FFFAF8] border-t border-[#EADAD6]">
      <div className="max-w-[680px] mx-auto px-4 py-3">
        <div className="flex gap-1.5 mb-2">
          {quickScenarios.map((s) => (
            <button
              key={s}
              onClick={() => !disabled && onSend(s)}
              disabled={disabled}
              className="px-3 py-1.5 rounded-full text-[11px] text-[#7A6664] border border-[#EADAD6] bg-[#F6ECEA] hover:border-[#A24B50]/40 hover:text-[#2F2624] transition-colors disabled:opacity-40"
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={disabled}
            placeholder="Type your message..."
            className="flex-1 bg-[#F6ECEA] border border-[#EADAD6] rounded-md px-4 py-2.5 text-sm text-[#2F2624] placeholder-[#A9908D] focus:outline-none focus:border-[#A24B50]/50 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={disabled || !input.trim()}
            className="px-5 py-2.5 rounded-md bg-[#A24B50] text-white text-sm font-medium hover:bg-[#B5686D] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
