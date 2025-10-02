"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FolderIcon } from "../ui/FolderIcon";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";

// Definisikan tipe data di sini
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

  // State dan Ref untuk dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownContainerRef = useRef<HTMLDivElement>(null);
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);

  // Hook untuk menutup dropdown saat klik di luar
  useOnClickOutside(
    dropdownContainerRef,
    () => setIsDropdownOpen(false),
    dropdownButtonRef
  );

  // Efek untuk waktu dan sorotan mouse
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
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
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Logika untuk item breadcrumb
  const dropdownItems = breadcrumbItems.slice(0, -1);
  const currentItem = breadcrumbItems[breadcrumbItems.length - 1];

  return (
    <div ref={bannerRef} className="group relative w-full">
      <div
        className="pointer-events-none absolute -inset-0.5 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(400px at var(--mouse-x) var(--mouse-y), rgb(77, 238, 32), transparent 80%)",
        }}
      />
      {/* --- KARTU KONTEN UTAMA DENGAN PADDING BARU --- */}
      <div className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-green-700 to-teal-600 px-11 py-7 text-white shadow-lg">
        <div className="absolute inset-0 bg-black/10 mix-blend-multiply"></div>
        <div className="relative z-10 flex flex-col justify-between h-full">
          {/* Baris Atas */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-lg font-medium text-green-100">
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
          <div className="mt-3 flex justify-between items-end">
            <p className="max-w-lg text-sm text-green-50">
              Manage all your digital documents and archives easily in one
              place.
            </p>

            <div className="relative flex items-center gap-1.5 rounded-lg bg-black/10 p-1 backdrop-blur-sm">
              {dropdownItems.length > 0 && (
                <>
                  <button
                    ref={dropdownButtonRef}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex flex-shrink-0 items-center justify-center h-full rounded-md px-2 py-1.5 text-green-100 hover:bg-white/10 transition-colors"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 12h.01M12 12h.01M19 12h.01"
                      />
                    </svg>
                  </button>
                  <svg
                    className="h-4 w-4 flex-shrink-0 text-white/40"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </>
              )}

              <DropdownMenu
                isOpen={isDropdownOpen}
                items={dropdownItems}
                triggerRef={dropdownButtonRef}
                containerRef={dropdownContainerRef}
                onItemClick={(id) => {
                  onBreadcrumbClick(id);
                  setIsDropdownOpen(false);
                }}
              />

              {currentItem && (
                <div className="flex flex-shrink-0 cursor-default items-center gap-1.5 whitespace-nowrap rounded-md bg-white/20 px-3 py-2 text-xs font-medium text-white">
                  <FolderIcon />
                  <span title={currentItem.label}>{currentItem.label}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- KOMPONEN DROPDOWN MENU DENGAN WARNA BARU ---
const DropdownMenu = ({
  isOpen,
  items,
  triggerRef,
  containerRef,
  onItemClick,
}: {
  isOpen: boolean;
  items: BreadcrumbItem[];
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onItemClick: (id: string) => void;
}) => {
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8,
        left: rect.left,
        width: 224,
      });
    }
  }, [isOpen, triggerRef]);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${position.width}px`,
        animation: "scale-in 0.1s ease-out forwards",
        zIndex: 50,
      }}
      className="origin-top-left rounded-lg bg-teal-800/80 p-2 shadow-lg backdrop-blur-lg ring-1 ring-teal-400/20"
    >
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => onItemClick(item.id)}
              className="w-full flex items-center gap-2 rounded px-3 py-2 text-left text-xs text-green-100 hover:bg-white/10"
            >
              <FolderIcon />
              <span>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>,
    document.body
  );
};

export default ModernHeader;
