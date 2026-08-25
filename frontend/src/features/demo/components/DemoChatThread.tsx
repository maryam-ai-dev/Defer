"use client";

import { useEffect, useRef } from "react";
import { DemoCustomerMessage } from "./DemoCustomerMessage";
import { DemoAssistantMessage } from "./DemoAssistantMessage";

export interface DemoMessage {
  id: string;
  role: "customer" | "assistant" | "system";
  text: string;
}

export function DemoChatThread({
  messages,
  sending,
}: {
  messages: DemoMessage[];
  sending: boolean;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, sending]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[680px] mx-auto px-4 py-6 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[#A9908D] text-sm">How can we help you today?</p>
          </div>
        )}
        {messages.map((msg) => {
          if (msg.role === "customer") {
            return <DemoCustomerMessage key={msg.id} text={msg.text} />;
          }
          if (msg.role === "assistant") {
            return <DemoAssistantMessage key={msg.id} text={msg.text} />;
          }
          return (
            <div key={msg.id} className="flex justify-center">
              <div className="px-3 py-1.5 rounded-full bg-[#EADAD6] text-xs text-[#7A6664]">
                {msg.text}
              </div>
            </div>
          );
        })}
        {sending && (
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-2xl bg-[#FFFAF8] border border-[#EADAD6]">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#A24B50] animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#A24B50] animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#A24B50] animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                <span className="text-[10px] text-[#A9908D] font-[family-name:var(--font-geist-mono)]">
                  Defer is evaluating your case...
                </span>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
