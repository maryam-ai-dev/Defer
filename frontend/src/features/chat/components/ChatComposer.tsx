"use client";

import { useState } from "react";

const quickScenarios = [
  "My order hasn't arrived",
  "I already tried that",
  "This is the third time I've contacted you",
];

export function ChatComposer({
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-[#EADAD6] px-4 py-3">
      <div className="flex gap-1.5 mb-2">
        {quickScenarios.map((s) => (
          <button
            key={s}
            onClick={() => !disabled && onSend(s)}
            disabled={disabled}
            className="px-2 py-1 rounded text-[10px] text-[#A9908D] bg-[#FFFAF8] border border-[#EADAD6] hover:text-[#7A6664] hover:border-[#A24B50]/30 transition-colors disabled:opacity-50"
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
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Type a message..."
          className="flex-1 bg-[#FFFAF8] border border-[#EADAD6] rounded-md px-3 py-2 text-sm text-[#2F2624] placeholder-[#A9908D] focus:outline-none focus:border-[#A24B50]/50 disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={disabled || !input.trim()}
          className="px-4 py-2 rounded-md bg-[#A24B50] text-white text-sm font-medium hover:bg-[#B5686D] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </div>
  );
}
