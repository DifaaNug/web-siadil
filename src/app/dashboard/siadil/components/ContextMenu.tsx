// src/app/dashboard/siadil/components/ContextMenu.tsx
"use client";

import { useEffect, useRef } from "react";
import {
  IconDetail,
  IconEdit,
  IconDelete,
  IconManageFiles,
} from "./ActionIcons";

type ContextMenuProps = {
  x: number;
  y: number;
  documentId: string;
  onClose: () => void;
  onMove: (documentId: string) => void;
};

export const ContextMenu = ({
  x,
  y,
  documentId,
  onClose,
  onMove,
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
      label: "Detail",
      icon: <IconDetail />,
      action: () => alert(`Detail for ${documentId}`),
    },
    {
      label: "Edit",
      icon: <IconEdit />,
      action: () => alert(`Edit for ${documentId}`),
    },
    {
      label: "Pindahkan",
      icon: <IconManageFiles />,
      action: () => onMove(documentId),
    },
    {
      label: "Delete",
      icon: <IconDelete />,
      isDestructive: true,
      action: () => alert(`Delete ${documentId}`),
    },
  ];

  return (
    <div
      ref={menuRef}
      className="fixed z-50 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg p-2"
      style={{ top: y, left: x }}>
      <div className="px-2 py-1 mb-1">
        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
          ID: {documentId}
        </p>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
      <ul>
        {menuItems.map((item, index) => (
          <li key={index}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                item.action();
                onClose();
              }}
              className={`w-full flex items-center px-2 py-1.5 text-sm rounded-md ${
                item.isDestructive
                  ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}>
              <span className="mr-2">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
