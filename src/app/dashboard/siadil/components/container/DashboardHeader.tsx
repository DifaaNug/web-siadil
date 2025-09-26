// src/app/dashboard/siadil/components/container/ModernHeader.tsx

"use client";

import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
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

  const currentFolder = breadcrumbItems[breadcrumbItems.length - 1];
  const parentFolder =
    breadcrumbItems.length > 1
      ? breadcrumbItems[breadcrumbItems.length - 2]
      : null;

  return (
    // --- PERUBAHAN WARNA ADA DI BARIS INI ---
    <div className="relative w-full overflow-hidden rounded-xl bg-gradient-to-br from-green-600 via-teal-600 to-yellow-300 p-8 text-white shadow-lg">
      {/* Efek Garis Bergelombang (Wavy Lines) dengan SVG */}
      <div className="absolute top-0 right-0 h-full w-full opacity-20">
        <svg
          className="absolute -right-20 -top-10 h-[150%] w-[150%]"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          viewBox="0 0 800 800"
        >
          <g fill="none" stroke="#FFF" strokeWidth="1">
            <path d="M-200,300 Q-100,250 0,300 t200,0 t200,0 t200,0 t200,0 t200,0" />
            <path d="M-200,350 Q-100,300 0,350 t200,0 t200,0 t200,0 t200,0 t200,0" />
            <path d="M-200,400 Q-100,350 0,400 t200,0 t200,0 t200,0 t200,0 t200,0" />
          </g>
        </svg>
      </div>

      <div className="relative z-10 flex items-end justify-between">
        <div>
          <p className="text-lg font-medium text-green-100">Welcome,</p>
          <h1 className="mt-1 text-4xl font-bold">Hi, {userName}</h1>
          <p className="mt-2 max-w-lg text-sm text-green-50">
            Kelola semua dokumen dan arsip digital Anda dengan mudah di satu
            tempat.
          </p>
          <div className="mt-20 mb-0">
            {currentFolder && (
              <button
                onClick={() =>
                  parentFolder && onBreadcrumbClick(parentFolder.id)
                }
                disabled={!parentFolder}
                className="flex items-center gap-2 rounded-lg border border-white/50 bg-white/10 px-3 py-2 text-sm font-medium transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FolderIcon />
                <span>{currentFolder.label}</span>
              </button>
            )}
          </div>
        </div>

        <div className="text-right">
          <p className="text-4xl font-bold tracking-wider">{formattedTime}</p>
          <p className="opacity-90">{formattedDate}</p>
        </div>
      </div>
    </div>
  );
};

export default ModernHeader;
