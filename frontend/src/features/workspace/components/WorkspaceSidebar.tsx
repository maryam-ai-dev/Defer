import { CaseList } from "@/features/cases/components/CaseList";

export function WorkspaceSidebar() {
  return (
    <div className="w-[280px] shrink-0 bg-[#F6ECEA] border-r border-[#EADAD6] h-full overflow-hidden">
      <CaseList />
    </div>
  );
}
