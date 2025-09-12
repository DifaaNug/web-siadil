"use client";
import { useState, useEffect } from "react";

const SiadilHeader = () => {
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);

  // Fungsi untuk set tema
  const setTheme = (theme: "light" | "dark") => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
      localStorage.setItem("theme", theme);
    }
    setShowThemeDropdown(false);
  };

  // Auto load theme dari localStorage saat pertama render
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-2">
      <div className="flex items-center justify-end">
        <div className="flex items-center space-x-4">
          {/* Search Command Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search command..."
              className="pl-4 pr-12 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-64 text-sm bg-white text-gray-900"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <kbd className="inline-flex items-center border bg-gray-100 rounded px-2 text-xs font-sans font-normal text-gray-400">
                <span className="text-xs">⌘</span>
                <span className="text-xs ml-1">K</span>
              </kbd>
            </div>
          </div>

          {/* Notification Bell Icon */}
          <button className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none">
            {/* Efek ping */}
            <span className="ping-notif"></span>
            {/* Bulatan hijau tetap */}
            <span className="bg-green-700 absolute top-1 right-1 block h-2 w-2 rounded-full ring-2 ring-white"></span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-900"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.7}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>

          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center overflow-hidden border-2 border-white">
            <span className="text-white font-semibold text-xs">DF</span>
          </div>

          {/* Theme Icon & Dropdown */}
          <div className="relative">
            <button
              className="p-1.5 rounded-full hover:bg-gray-100 focus:outline-none"
              onClick={() => setShowThemeDropdown((v) => !v)}>
              {/* Matahari icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-900"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.7}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.05 17.95l-1.414 1.414M17.95 17.95l-1.414-1.414M6.05 6.05L4.636 7.464"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="5"
                  stroke="currentColor"
                  strokeWidth={1.7}
                />
              </svg>
            </button>
            {/* Dropdown Theme */}
            <div
              className={`absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded shadow-lg z-10 transition-all duration-300
                ${
                  showThemeDropdown
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 -translate-y-4 pointer-events-none"
                }
              `}
              style={{ willChange: "transform, opacity" }}>
              <button
                className="flex items-center w-full px-3 py-1.5 hover:bg-gray-50 text-gray-900 transition-colors text-sm"
                onClick={() => setTheme("light")}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5 mr-2 text-gray-900"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.7}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.05 17.95l-1.414 1.414M17.95 17.95l-1.414-1.414M6.05 6.05L4.636 7.464"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="5"
                    stroke="currentColor"
                    strokeWidth={1.7}
                  />
                </svg>
                Light
              </button>
              <button
                className="flex items-center w-full px-3 py-1.5 hover:bg-gray-50 text-gray-900 transition-colors text-sm"
                onClick={() => setTheme("dark")}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5 mr-2 text-gray-900"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.7}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
                  />
                </svg>
                Dark
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiadilHeader;
