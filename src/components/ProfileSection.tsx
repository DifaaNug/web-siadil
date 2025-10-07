"use client";

import { useSession, signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import Image from "next/image";

interface ProfileSectionProps {
  isCollapsed: boolean;
}

export function ProfileSection({ isCollapsed }: ProfileSectionProps) {
  const { data: session } = useSession();

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  // Jika belum login, tampilkan placeholder
  if (!session?.user) {
    return (
      <div
        className={`${
          isCollapsed ? "px-2" : "px-4"
        } py-3 transition-all duration-300`}
      >
        <div
          className={`flex items-center ${
            isCollapsed ? "justify-center" : "space-x-3"
          }`}
        >
          <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center shrink-0">
            <span className="text-white font-semibold text-sm">?</span>
          </div>
          {!isCollapsed && (
            <div className="opacity-100 transition-opacity duration-300">
              <div className="font-medium text-gray-900 text-sm">Guest</div>
              <div className="text-xs text-gray-600">Not logged in</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Ambil inisial dari nama
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div
      className={`${
        isCollapsed ? "px-2" : "px-4"
      } py-3 transition-all duration-300`}
    >
      <div className="relative group">
        <div
          className={`flex items-center ${
            isCollapsed ? "justify-center" : "space-x-3"
          } cursor-pointer`}
        >
          {/* Profile Picture dari API atau Fallback ke inisial */}
          {session.user.pic ? (
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-gray-200">
              <Image
                src={session.user.pic}
                alt={session.user.name}
                width={40}
                height={40}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback jika gambar gagal load
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          ) : (
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
              <span className="text-white font-semibold text-sm">
                {getInitials(session.user.name)}
              </span>
            </div>
          )}

          {!isCollapsed && (
            <div className="opacity-100 transition-opacity duration-300 flex-1">
              <div className="font-medium text-gray-900 text-sm truncate">
                {session.user.name}
              </div>
              <div className="text-xs text-gray-600 truncate">
                {session.user.username}
              </div>
              {session.user.organization && (
                <div className="text-xs text-gray-500 truncate mt-0.5">
                  {session.user.organization.name}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Logout Button - muncul saat hover */}
        {!isCollapsed && (
          <button
            onClick={handleLogout}
            className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 hover:bg-red-50 rounded-lg"
            title="Logout"
          >
            <LogOut className="w-4 h-4 text-red-600" />
          </button>
        )}

        {/* Tooltip untuk collapsed state */}
        {isCollapsed && (
          <div className="absolute left-full ml-2 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white rounded-lg shadow-lg p-3 z-50 whitespace-nowrap min-w-[200px]">
            <div className="space-y-2">
              <div>
                <div className="font-medium text-gray-900 text-sm">
                  {session.user.name}
                </div>
                <div className="text-xs text-gray-600">
                  {session.user.username}
                </div>
                {session.user.organization && (
                  <div className="text-xs text-gray-500 mt-1">
                    {session.user.organization.name}
                  </div>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 hover:bg-red-50 rounded-md text-sm text-red-600 w-full"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
