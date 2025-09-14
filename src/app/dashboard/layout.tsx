// src/app/dashboard/layout.tsx

"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import SiadilHeader from "@/components/SiadilHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <div
        className={`sticky top-0 h-full transition-all duration-300 shrink-0 ${
          isSidebarCollapsed ? "w-20" : "w-60"
        }`}>
        <Sidebar onCollapseChange={setIsSidebarCollapsed} />
      </div>
      <main className="flex-1 flex flex-col min-w-0">
        <SiadilHeader />
        <div className="p-6 flex-1 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
