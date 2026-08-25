export function DemoShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F6ECEA] flex flex-col">
      {children}
    </div>
  );
}
