export function DemoAssistantMessage({ text }: { text: string }) {
  return (
    <div className="flex justify-start">
      <div className="max-w-[80%] rounded-2xl rounded-bl-md px-4 py-2.5 bg-[#FFFAF8] border border-[#EADAD6] text-[#2F2624] text-sm leading-relaxed">
        {text}
      </div>
    </div>
  );
}
