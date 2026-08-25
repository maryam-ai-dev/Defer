"use client";

import { SidebarNav } from "./SidebarNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#F6ECEA] overflow-hidden">
      <SidebarNav />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
