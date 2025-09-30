"use client";

import React, { useState, useEffect, useRef } from "react";
import { FolderIcon } from "../ui/FolderIcon";

interface BreadcrumbItem {
  label: string;
  id: string;
}

interface ModernHeaderProps {
  userName: string;
  breadcrumbItems: BreadcrumbItem[];
  onBreadcrumbClick: (id: string) => void;
}

const ModernHeader: React.FC<ModernHeaderProps> = ({
  userName,
  breadcrumbItems,
  onBreadcrumbClick,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const handleMouseMove = (e: MouseEvent) => {
      if (bannerRef.current) {
        const rect = bannerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        bannerRef.current.style.setProperty("--mouse-x", `${x}px`);
        bannerRef.current.style.setProperty("--mouse-y", `${y}px`);
      }
    };

    const currentBanner = bannerRef.current;
    currentBanner?.addEventListener("mousemove", handleMouseMove);

    return () => {
      clearInterval(timer);
      currentBanner?.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const formattedTime = currentTime
    .toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replace(/\./g, ":");

  const formattedDate = currentTime.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    // --- PERBAIKAN 1: Wrapper utama untuk event mouse dan efek ---
    <div ref={bannerRef} className="group relative w-full">
      {/* --- PERBAIKAN 2: Elemen untuk border yang akan menyala --- */}
      <div
        className="pointer-events-none absolute -inset-0.5 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(400px at var(--mouse-x) var(--mouse-y), rgb(77, 238, 32), transparent 80%)",
        }}
      />
      {/* --- Kartu Konten Utama --- */}
      <div className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-green-700 to-teal-600 p-11 text-white shadow-lg">
        <div className="absolute inset-0 bg-black/10 mix-blend-multiply"></div>
        <div className="relative z-10 flex flex-col justify-between h-full">
          {/* Baris Atas */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-base font-medium text-green-100">
                Welcome back to SIADIL
              </p>
              <h1 className="mt-1 text-3xl font-bold">Hi, {userName}</h1>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-3xl font-bold tracking-wider">
                {formattedTime}
              </p>
              <p className="text-sm opacity-90">{formattedDate}</p>
            </div>
          </div>

          {/* Baris Bawah */}
          <div className="mt-4 flex justify-between items-end">
            <p className="max-w-lg text-sm text-green-50">
              Manage all your digital documents and archives easily in one
              place.
            </p>
            <div className="flex items-center space-x-2">
              {breadcrumbItems.map((item, index) => (
                <React.Fragment key={item.id}>
                  {index > 0 && <span className="text-white/50">/</span>}
                  <button
                    onClick={() => onBreadcrumbClick(item.id)}
                    disabled={index === breadcrumbItems.length - 1}
                    className="flex items-center gap-1.5 rounded-md bg-white/10 px-3 py-1.5 text-xs font-medium transition hover:bg-white/20 disabled:cursor-default disabled:bg-white/20"
                  >
                    <FolderIcon />
                    <span>{item.label}</span>
                  </button>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernHeader;
