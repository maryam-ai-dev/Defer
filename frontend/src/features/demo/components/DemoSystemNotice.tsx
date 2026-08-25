const notices: Record<string, string> = {
  HUMAN_ESCALATION: "Connecting you to a specialist. A support agent will review your case shortly.",
  CLARIFICATION_REQUIRED: "We need a bit more information to help you.",
  SAFE_REFUSAL: "This request is outside the scope of our support. Please contact us through another channel.",
};

export function DemoSystemNotice({ mode }: { mode: string }) {
  const text = notices[mode];
  if (!text) return null;

  return (
    <div className="flex justify-center">
      <div className="px-3 py-1.5 rounded-full bg-[#FCF4F1] text-xs text-[#7A6664]">
        {text}
      </div>
    </div>
  );
}
