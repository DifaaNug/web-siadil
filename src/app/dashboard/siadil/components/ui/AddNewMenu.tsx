// src/app/dashboard/siadil/components/AddNewMenu.tsx
"use client";

import { useRef, useEffect, useState } from "react";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";

type MenuItem = {
  label: string;
  icon: string;
  action: () => void;
  isSeparator?: false;
};

type MenuSeparator = {
  isSeparator: true;
};

type MenuAction = MenuItem | MenuSeparator;

// --- Batas Perbaikan ---

type AddNewMenuProps = {
  onClose: () => void;
  onNewFolder: () => void;
  onFileUpload: () => void;
  buttonRef: React.RefObject<HTMLDivElement | null>;
  context?: "archives" | "documents";
};

const Icon = ({ path }: { path: string }) => (
  <svg
    className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

export const AddNewMenu = ({
  onClose,
  onNewFolder,
  onFileUpload,
  buttonRef,
  context = "archives",
}: AddNewMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useOnClickOutside(menuRef, onClose, buttonRef);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  const menuItems: { [key in "archives" | "documents"]: MenuAction[] } = {
    archives: [
      {
        label: "Folder Arsip Baru",
        icon: "M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h5l2 2h5a2 2 0 012 2v11a2 2 0 01-2 2H5a2 2 0 01-2-2z",
        action: onNewFolder,
      },
    ],
    documents: [
      {
        label: "Folder Baru",
        icon: "M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h5l2 2h5a2 2 0 012 2v11a2 2 0 01-2 2H5a2 2 0 01-2-2z",
        action: onNewFolder,
      },
      {
        label: "Unggah File",
        icon: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12",
        action: onFileUpload,
      },
      {
        label: "Unggah Folder",
        icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z",
        action: () => alert("Fitur Unggah Folder belum tersedia"),
      },
      { isSeparator: true },
      {
        label: "Dokumen Teks",
        icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
        action: () => alert("Fitur Dokumen Teks belum tersedia"),
      },
      {
        label: "Spreadsheet",
        icon: "M3 10h18M3 14h18M3 6h18M3 18h18",
        action: () => alert("Fitur Spreadsheet belum tersedia"),
      },
      {
        label: "Presentasi",
        icon: "M16 4h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
        action: () => alert("Fitur Presentasi belum tersedia"),
      },
    ],
  };

  const itemsToRender = menuItems[context];

  return (
    <div
      ref={menuRef}
      className={`absolute left-0 top-full mt-2 w-60 origin-top-left rounded-xl border border-gray-200 bg-white p-2 shadow-2xl transition-all duration-200 ease-out dark:border-gray-700 dark:bg-gray-800 z-50 ${
        isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
      }`}
    >
      <ul>
        {itemsToRender.map((item, index) =>
          item.isSeparator ? (
            <li key={index}>
              <div className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
            </li>
          ) : (
            <li key={index}>
              <button
                onClick={() => handleAction(item.action)}
                className="flex w-full items-center rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Icon path={item.icon} />
                <span>{item.label}</span>
              </button>
            </li>
          )
        )}
      </ul>
    </div>
  );
};
