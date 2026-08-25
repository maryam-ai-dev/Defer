export function WorkspaceRightPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-[360px] shrink-0 bg-[#FFFAF8] border-l border-[#EADAD6] h-full overflow-y-auto">
      {children}
    </div>
  );
}
