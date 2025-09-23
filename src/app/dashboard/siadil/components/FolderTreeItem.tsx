// src/app/dashboard/siadil/components/FolderTreeItem.tsx
"use client";

import { useState } from "react";
import { Archive } from "../types";

type FolderTreeItemProps = {
  folder: Archive;
  allFolders: Archive[];
  onMove: (targetId: string) => void;
  level: number; // Untuk indentasi
};

export const FolderTreeItem = ({
  folder,
  allFolders,
  onMove,
  level,
}: FolderTreeItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Cari semua subfolder dari folder saat ini
  const children = allFolders.filter((f) => f.parentId === folder.id);

  return (
    <li>
      <div
        className="flex items-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
        // Atur indentasi berdasarkan level kedalaman folder
        style={{ paddingLeft: `${level * 24}px` }}>
        {/* Tombol expand/collapse yang lebih jelas */}
        <div className="flex items-center justify-center w-7 h-7">
          {children.length > 0 && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 rounded-md">
              <svg
                className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${
                  isOpen ? "rotate-90" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Tombol utama untuk memilih folder */}
        <button
          onClick={() => onMove(folder.id)}
          className="flex-1 text-left flex items-center gap-3 px-2 py-2">
          <svg
            className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
            />
          </svg>
          <span className="text-sm text-gray-800 dark:text-gray-200 truncate">
            {folder.name}
          </span>
        </button>
      </div>

      {/* Render subfolder jika terbuka */}
      {isOpen && children.length > 0 && (
        <ul>
          {children.map((child) => (
            <FolderTreeItem
              key={child.id}
              folder={child}
              allFolders={allFolders}
              onMove={onMove}
              level={level + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
};
