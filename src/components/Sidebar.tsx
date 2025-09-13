"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Props
interface SidebarProps {
  onCollapseChange?: (collapsed: boolean) => void;
}

const Sidebar = ({ onCollapseChange }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showArrow, setShowArrow] = useState(false);
  const pathname = usePathname();

  const handleCollapseToggle = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onCollapseChange?.(newCollapsed);
  };

  return (
    <div
      className={`min-h-screen border-r bg-white transition-all duration-300 relative ${
        isCollapsed ? "w-20" : "w-60"
      }`}
      onMouseEnter={() => setShowArrow(true)}
      onMouseLeave={() => setShowArrow(false)}>
      {/* Bagian Logo & Profile (Tidak ada perubahan) */}
      <div className="px-3 py-4 relative">
        <div
          className={`flex ${
            isCollapsed ? "justify-center items-center" : "flex-col"
          } space-y-2`}>
          <Image
            src="/logo-demplon.png"
            alt="Demplon Logo"
            width={isCollapsed ? 60 : 150}
            height={isCollapsed ? 60 : 150}
            className="rounded transition-all duration-300"
            priority
          />
        </div>
        {/* Tombol Toggle Arrow - PERUBAHAN DI SINI */}
        {showArrow && (
          <button
            onClick={handleCollapseToggle}
            // --- Perubahan Rounded Corner (rounded-lg -> rounded-md) ---
            className="absolute -right-2.5 top-5 bg-white border border-gray-200 rounded-md p-0.5 transition-all duration-200 z-10 flex items-center justify-center" // rounded-md
          >
            <svg
              className={` w-4 h-4 text-gray-800 transition-transform duration-200  ${
                isCollapsed ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l-7-7m0 0l7-7m-7 7h13"
              />
            </svg>
          </button>
        )}
      </div>
      <div
        className={`${
          isCollapsed ? "px-2" : "px-4"
        } py-3 transition-all duration-300`}>
        <div
          className={`flex items-center ${
            isCollapsed ? "justify-center" : "space-x-3"
          }`}>
          <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shrink-0">
            <span className="text-white font-semibold text-sm">DF</span>
          </div>
          {!isCollapsed && (
            <div className="opacity-100 transition-opacity duration-300">
              <div className="font-medium text-gray-900 text-sm">
                Difa Nugraha
              </div>
              <div className="text-xs text-gray-600">10122059</div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav
        className={`${
          isCollapsed ? "px-2" : "px-4"
        } py-4 transition-all duration-300`}>
        {/* --- PERUBAHAN STRUKTUR UTAMA ADA DI SINI --- */}

        {/* GENERALS Section */}
        <div>
          {/* Judul ini sekarang punya tinggi tetap (h-8) */}
          <div className="h-8 flex items-center">
            <div
              className={`text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 transition-opacity duration-200 ${
                isCollapsed ? "opacity-0" : "opacity-100"
              }`}>
              GENERALS
            </div>
          </div>
          <ul className="space-y-1">
            <MenuItemLink
              href="/dashboard"
              currentPath={pathname}
              isCollapsed={isCollapsed}
              icon={<HomeIcon isCollapsed={isCollapsed} />}>
              Home
            </MenuItemLink>
            <MenuItemLink
              href="/dashboard/profile"
              currentPath={pathname}
              isCollapsed={isCollapsed}
              icon={<ProfileIcon isCollapsed={isCollapsed} />}>
              Profile
            </MenuItemLink>
            <MenuItemLink
              href="/dashboard/employment"
              currentPath={pathname}
              isCollapsed={isCollapsed}
              icon={<EmploymentIcon isCollapsed={isCollapsed} />}>
              Employment
            </MenuItemLink>
            <MenuItemLink
              href="/dashboard/kehadiran"
              currentPath={pathname}
              isCollapsed={isCollapsed}
              icon={<ClockIcon isCollapsed={isCollapsed} />}
              title="Kehadiran, Koreksi, Cuti, dan Dinas">
              Kehadiran, Koreksi, Cuti, dan Dinas
            </MenuItemLink>
          </ul>
        </div>

        {/* MAIN MENU Section */}
        <div className="mt-4">
          {" "}
          {/* Menggunakan margin-top untuk jarak antar section */}
          <div className="h-8 flex items-center">
            <div
              className={`text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 transition-opacity duration-200 ${
                isCollapsed ? "opacity-0" : "opacity-100"
              }`}>
              MAIN MENU
            </div>
          </div>
          <ul className="space-y-1">
            <MenuItemLink
              href="/dashboard/portal"
              currentPath={pathname}
              isCollapsed={isCollapsed}
              icon={<PackageIcon isCollapsed={isCollapsed} />}>
              Portal Aplikasi
            </MenuItemLink>
            <MenuItemLink
              href="/dashboard/kujang-ai"
              currentPath={pathname}
              isCollapsed={isCollapsed}
              icon={<SparklesIcon isCollapsed={isCollapsed} />}>
              Kujang Ai
            </MenuItemLink>
            <MenuItemLink
              href="/dashboard/library"
              currentPath={pathname}
              isCollapsed={isCollapsed}
              icon={<LibraryIcon isCollapsed={isCollapsed} />}>
              Library
            </MenuItemLink>
            <MenuItemLink
              href="/dashboard/shortlink"
              currentPath={pathname}
              isCollapsed={isCollapsed}
              icon={<LinkIcon isCollapsed={isCollapsed} />}>
              Shortlink
            </MenuItemLink>
          </ul>
        </div>

        {/* APPS & FEATURE Section */}
        <div className="mt-4">
          <div className="h-8 flex items-center">
            <div
              className={`text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 transition-opacity duration-200 ${
                isCollapsed ? "opacity-0" : "opacity-100"
              }`}>
              APPS & FEATURE
            </div>
          </div>
          <ul className="space-y-1">
            <MenuItemLink
              href="/dashboard/siadil"
              currentPath={pathname}
              isCollapsed={isCollapsed}
              icon={<FileIcon isCollapsed={isCollapsed} />}>
              SIADIL
            </MenuItemLink>
          </ul>
        </div>
      </nav>
    </div>
  );
};

// Komponen Helper untuk membuat kode menu lebih bersih dan bisa dipakai ulang
interface MenuItemLinkProps {
  href: string;
  currentPath: string;
  isCollapsed: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
  title?: string;
  hasNotification?: boolean;
  isHighlighted?: boolean;
}

const MenuItemLink = ({
  href,
  currentPath,
  isCollapsed,
  icon,
  children,
  title,
  hasNotification,
  isHighlighted,
}: MenuItemLinkProps) => {
  const isActive =
    href === "/dashboard" ? currentPath === href : currentPath.startsWith(href);

  return (
    <li>
      <Link
        href={href}
        // --- PERUBAHAN UTAMA ADA DI BARIS INI ---
        className={`w-full flex items-center ${
          isCollapsed ? "justify-center px-2" : "justify-between" // Dinamis: center saat collapsed
        } py-2 transition-all duration-300 text-sm rounded-md ${
          isActive
            ? "bg-green-700 text-white"
            : isHighlighted
            ? "text-green-800 hover:bg-green-50"
            : "text-gray-700 hover:bg-gray-100"
        }`}
        title={isCollapsed ? title || String(children) : ""}>
        {/* Grup untuk ikon dan teks di kiri */}
        <div
          className={`flex items-center ${
            isCollapsed ? "" : "space-x-3 px-3"
          }`}>
          {icon}
          {!isCollapsed && (
            <span className="text-left opacity-100 transition-opacity duration-300">
              {children}
            </span>
          )}
        </div>

        {/* Notifikasi akan muncul di kanan jika 'hasNotification' true */}
        {!isCollapsed && hasNotification && (
          <div className="relative w-5 h-5 flex items-center justify-center mr-3">
            <span className="ping-notif"></span>
            <span className="absolute block w-3 h-3 rounded-full bg-green-200"></span>
            <span className="relative block h-2 w-2 rounded-full bg-[#01793B]"></span>
          </div>
        )}
      </Link>
    </li>
  );
};

// Kumpulan Komponen Ikon (agar kode utama tidak terlalu panjang)
const Icon = ({
  isCollapsed,
  children,
  strokeWidth = 1.7,
}: {
  isCollapsed: boolean;
  children: React.ReactNode;
  strokeWidth?: number;
}) => (
  <svg
    className={`${
      isCollapsed ? "w-6 h-6" : "w-5 h-5"
    } transition-all duration-300 shrink-0`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round">
    {children}
  </svg>
);

const HomeIcon = ({ isCollapsed }: { isCollapsed: boolean }) => (
  <Icon isCollapsed={isCollapsed}>
    <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </Icon>
);
const ProfileIcon = ({ isCollapsed }: { isCollapsed: boolean }) => (
  <Icon isCollapsed={isCollapsed}>
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </Icon>
);
const EmploymentIcon = ({ isCollapsed }: { isCollapsed: boolean }) => (
  <Icon isCollapsed={isCollapsed}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <polyline points="16 11 18 13 22 9"></polyline>
  </Icon>
);
const ClockIcon = ({ isCollapsed }: { isCollapsed: boolean }) => (
  <Icon isCollapsed={isCollapsed}>
    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </Icon>
);
const PackageIcon = ({ isCollapsed }: { isCollapsed: boolean }) => (
  <Icon isCollapsed={isCollapsed} strokeWidth={1.4}>
    <path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z"></path>
    <path d="m7 16.5-4.74-2.85"></path>
    <path d="m7 16.5 5-3"></path>
    <path d="M7 16.5v5.17"></path>
    <path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z"></path>
    <path d="m17 16.5-5-3"></path>
    <path d="m17 16.5 4.74-2.85"></path>
    <path d="M17 16.5v5.17"></path>
    <path d="M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z"></path>
    <path d="M12 8 7.26 5.15"></path>
    <path d="m12 8 4.74-2.85"></path>
    <path d="M12 13.5V8"></path>
  </Icon>
);
const SparklesIcon = ({ isCollapsed }: { isCollapsed: boolean }) => (
  <Icon isCollapsed={isCollapsed} strokeWidth={1.4}>
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
    <path d="M5 3v4"></path>
    <path d="M19 17v4"></path>
    <path d="M3 5h4"></path>
    <path d="M17 19h4"></path>
  </Icon>
);
const LibraryIcon = ({ isCollapsed }: { isCollapsed: boolean }) => (
  <Icon isCollapsed={isCollapsed}>
    <path d="m16 6 4 14"></path>
    <path d="M12 6v14"></path>
    <path d="M8 8v12"></path>
    <path d="M4 4v16"></path>
  </Icon>
);
const LinkIcon = ({ isCollapsed }: { isCollapsed: boolean }) => (
  <Icon isCollapsed={isCollapsed} strokeWidth={1.4}>
    <path d="M9 17H7A5 5 0 0 1 7 7h2"></path>
    <path d="M15 7h2a5 5 0 1 1 0 10h-2"></path>
    <line x1="8" x2="16" y1="12" y2="12"></line>
  </Icon>
);
const FileIcon = ({ isCollapsed }: { isCollapsed: boolean }) => (
  <Icon isCollapsed={isCollapsed}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" x2="8" y1="13" y2="13"></line>
    <line x1="16" x2="8" y1="17" y2="17"></line>
    <line x1="10" x2="8" y1="9" y2="9"></line>
  </Icon>
);

export default Sidebar;
