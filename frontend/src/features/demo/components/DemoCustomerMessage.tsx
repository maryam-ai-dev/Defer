export function DemoCustomerMessage({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[75%] rounded-2xl rounded-br-md px-4 py-2.5 bg-[#A24B50]/20 text-[#2F2624] text-sm leading-relaxed">
        {text}
      </div>
    </div>
  );
}
