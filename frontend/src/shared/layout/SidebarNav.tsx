"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/cases", label: "Cases", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
  { href: "/evals", label: "Evals", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col h-full w-[220px] bg-[#F6ECEA] border-r border-[#EADAD6] py-4">
      <div className="px-4 mb-6">
        <h1 className="text-[#2F2624] text-xl font-medium tracking-tight font-[family-name:var(--font-serif)]">
          defer
        </h1>
        <p className="text-[#A9908D] text-xs mt-0.5 font-[family-name:var(--font-geist-mono)]">
          support copilot
        </p>
      </div>

      <div className="flex flex-col gap-0.5 px-2 flex-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-[#FFFAF8] text-[#A24B50]"
                  : "text-[#7A6664] hover:text-[#2F2624] hover:bg-[#FFFAF8]/50"
              }`}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="px-2 mt-auto">
        <Link
          href="/demo"
          target="_blank"
          className="flex items-center justify-center gap-2 mx-1 px-3 py-2 rounded-md text-xs font-medium text-[#A24B50] border border-[#A24B50]/30 bg-[#A24B50]/5 hover:bg-[#A24B50]/10 hover:border-[#A24B50]/50 transition-colors"
        >
          Open Customer Demo
          <span className="text-[10px]">&#8599;</span>
        </Link>
      </div>
    </nav>
  );
}
