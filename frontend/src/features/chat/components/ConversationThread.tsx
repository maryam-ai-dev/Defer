"use client";

import { useEffect, useRef } from "react";
import { WorkspaceMessage } from "@/features/workspace/types/workspace";
import { CustomerMessage } from "./CustomerMessage";
import { AssistantMessage } from "./AssistantMessage";

export function ConversationThread({ messages }: { messages: WorkspaceMessage[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
      {messages.length === 0 && (
        <div className="flex items-center justify-center h-full">
          <p className="text-[#A9908D] text-sm">No messages yet. Send a message to start.</p>
        </div>
      )}
      {messages.map((msg) =>
        msg.senderType === "CUSTOMER" ? (
          <CustomerMessage key={msg.id} message={msg} />
        ) : (
          <AssistantMessage key={msg.id} message={msg} />
        )
      )}
      <div ref={bottomRef} />
    </div>
  );
}
