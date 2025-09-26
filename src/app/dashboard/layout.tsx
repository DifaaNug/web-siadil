"use client";

import { useState, useRef, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import SiadilHeader from "@/components/SiadilHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // logika pendeteksi scroll
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const contentRef = useRef<HTMLDivElement>(null); // Ref untuk div konten

  useEffect(() => {
    const contentElement = contentRef.current;

    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 1000); // Scrollbar akan hilang setelah 1 detik tidak scroll
    };

    if (contentElement) {
      contentElement.addEventListener("scroll", handleScroll);
    }

    // Cleanup function
    return () => {
      if (contentElement) {
        contentElement.removeEventListener("scroll", handleScroll);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []); // [] berarti efek ini hanya berjalan sekali

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <div
        className={`sticky top-0 h-full transition-all duration-300 shrink-0 ${
          isSidebarCollapsed ? "w-20" : "w-60"
        }`}
      >
        <Sidebar onCollapseChange={setIsSidebarCollapsed} />
      </div>
      <main className="flex-1 flex flex-col min-w-0">
        <SiadilHeader />
        {/* 3. Terapkan 'ref' dan kelas-kelasnya di sini */}
        <div
          ref={contentRef}
          className={`p-6 flex-1 overflow-y-auto custom-scrollbar ${
            isScrolling ? "scrolling" : ""
          }`}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
