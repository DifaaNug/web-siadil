"use client";

import { useEffect, useRef } from "react";
import { IconEdit, IconDelete, IconManageFiles } from "./ActionIcons";

type ContextMenuProps = {
  x: number;
  y: number;
  documentId: string;
  onClose: () => void;
  onMove: (documentId: string) => void;
  onEdit: (documentId: string) => void;
  onDelete: (documentId: string) => void;
};

export const ContextMenu = ({
  x,
  y,
  documentId,
  onClose,
  onMove,
  onEdit,
  onDelete,
}: ContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const menuItems = [
    {
      label: "Edit",
      icon: <IconEdit />,
      action: () => onEdit(documentId),
      color: "text-blue-600 dark:text-blue-400",
      hoverBg: "hover:bg-blue-50 dark:hover:bg-blue-900/30",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      label: "Pindahkan",
      icon: <IconManageFiles />,
      action: () => onMove(documentId),
      color: "text-purple-600 dark:text-purple-400",
      hoverBg: "hover:bg-purple-50 dark:hover:bg-purple-900/30",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      label: "Delete",
      icon: <IconDelete />,
      action: () => onDelete(documentId),
      color: "text-red-600 dark:text-red-400",
      hoverBg: "hover:bg-red-50 dark:hover:bg-red-900/30",
      gradient: "from-red-500 to-red-600",
      isDestructive: true,
    },
  ];

  return (
    <div
      ref={menuRef}
      className="fixed z-50 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
      style={{ top: y, left: x }}
    >
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-demplon to-teal-600 px-4 py-3">
        <p className="text-sm font-bold text-white flex items-center gap-2">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          ID #{documentId}
        </p>
      </div>

      {/* Menu Items */}
      <div className="p-2">
        <ul className="space-y-1">
          {menuItems.map((item, index) => (
            <li key={index}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  item.action?.();
                  onClose();
                }}
                className={`group w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${item.color} ${item.hoverBg} hover:scale-[1.02] active:scale-95`}
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br ${item.gradient} text-white shadow-sm group-hover:shadow-md transition-shadow`}
                >
                  {item.icon}
                </div>
                <span className="flex-1 text-left">{item.label}</span>
                <svg
                  className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer hint */}
      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Click outside to close
        </p>
      </div>
    </div>
  );
};
