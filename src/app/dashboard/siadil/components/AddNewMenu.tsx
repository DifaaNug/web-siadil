// src/app/dashboard/siadil/components/AddNewMenu.tsx
"use client";

import { useRef, useEffect, useState } from "react";
import { useOnClickOutside } from "../hooks/useOnClickOutside";

type AddNewMenuProps = {
  onClose: () => void;
  onNewFolder: () => void;
  onFileUpload: () => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
};

export const AddNewMenu = ({
  onClose,
  onNewFolder,
  onFileUpload,
  buttonRef,
}: AddNewMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useOnClickOutside(menuRef, onClose, buttonRef);

  useEffect(() => {
    // Efek animasi saat muncul
    setIsVisible(true);
  }, []);

  return (
    <div
      ref={menuRef}
      className={`absolute left-0 top-full mt-2 w-60 origin-top-left bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 p-2 transition-all duration-200 ease-out
        ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
      <ul>
        <li>
          <button
            onClick={() => {
              onNewFolder();
              onClose();
            }}
            className="w-full flex items-center px-3 py-2 text-sm rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <svg
              className="w-5 h-5 mr-3 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h5l2 2h5a2 2 0 012 2v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
            <span>Folder Baru</span>
          </button>
        </li>
        <li>
          <button
            onClick={() => {
              onFileUpload();
              onClose();
            }}
            className="w-full flex items-center px-3 py-2 text-sm rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <svg
              className="w-5 h-5 mr-3 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            <span>Unggah File</span>
          </button>
        </li>
      </ul>
    </div>
  );
};
