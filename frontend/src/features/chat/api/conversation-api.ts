import { TurnResponse } from "../types/message";
import { DEMO_MODE } from "@/lib/mock/demo-mode";
import { sendTurn as mockSendTurn, createConversation } from "@/lib/mock/store";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function sendTurn(
  conversationId: string,
  message: string
): Promise<TurnResponse> {
  if (DEMO_MODE) return mockSendTurn(conversationId, message);

  const res = await fetch(
    `${API_BASE}/api/v1/conversations/${conversationId}/turn`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    }
  );
  if (!res.ok) throw new Error(`Turn failed: ${res.status}`);
  return res.json();
}

export async function startConversation(
  channel: string = "web"
): Promise<{ id: string }> {
  if (DEMO_MODE) return createConversation(channel);

  const customerId = crypto.randomUUID();
  const res = await fetch(`${API_BASE}/api/v1/conversations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ channel, customerId }),
  });
  if (!res.ok) throw new Error(`Start conversation failed: ${res.status}`);
  return res.json();
}
