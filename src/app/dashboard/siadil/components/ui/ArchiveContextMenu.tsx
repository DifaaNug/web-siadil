"use client";

import { useEffect, useRef } from "react";

type ArchiveContextMenuProps = {
  x: number;
  y: number;
  archiveId: string;
  onClose: () => void;
  onEdit: (archiveId: string) => void;
  onMove: (archiveId: string) => void;
  onDelete: (archiveId: string) => void;
  onManageContributors: (archiveId: string) => void;
  onManageFiles: (archiveId: string) => void;
};

export const ArchiveContextMenu = ({
  x,
  y,
  archiveId,
  onClose,
  onEdit,
  onMove,
  onDelete,
  onManageContributors,
  onManageFiles,
}: ArchiveContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Smart positioning to prevent menu from being cut off
  const getPosition = () => {
    const menuWidth = 256; // w-64 = 16rem = 256px
    const menuHeight = 320; // approximate height
    const padding = 16;

    let finalX = x;
    let finalY = y;

    // Check right boundary
    if (x + menuWidth > window.innerWidth - padding) {
      finalX = window.innerWidth - menuWidth - padding;
    }

    // Check bottom boundary
    if (y + menuHeight > window.innerHeight - padding) {
      finalY = window.innerHeight - menuHeight - padding;
    }

    // Ensure not too close to left edge
    if (finalX < padding) {
      finalX = padding;
    }

    // Ensure not too close to top edge
    if (finalY < padding) {
      finalY = padding;
    }

    return { x: finalX, y: finalY };
  };

  const position = getPosition();

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
      icon: (
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
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
      ),
      action: () => onEdit(archiveId),
      color: "text-gray-700 dark:text-gray-300",
      hoverBg: "hover:bg-gray-50 dark:hover:bg-gray-700",
    },
    {
      label: "Pindahkan",
      icon: (
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
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      action: () => onMove(archiveId),
      color: "text-gray-700 dark:text-gray-300",
      hoverBg: "hover:bg-gray-50 dark:hover:bg-gray-700",
    },
    {
      label: "Delete",
      icon: (
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
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      ),
      action: () => onDelete(archiveId),
      color: "text-red-600 dark:text-red-400",
      hoverBg: "hover:bg-red-50 dark:hover:bg-red-900/30",
      isDestructive: true,
    },
    {
      label: "Manage Contributors",
      icon: (
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
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
      action: () => onManageContributors(archiveId),
      color: "text-gray-700 dark:text-gray-300",
      hoverBg: "hover:bg-gray-50 dark:hover:bg-gray-700",
    },
    {
      label: "Manage Files",
      icon: (
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
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      action: () => onManageFiles(archiveId),
      color: "text-gray-700 dark:text-gray-300",
      hoverBg: "hover:bg-gray-50 dark:hover:bg-gray-700",
    },
  ];

  return (
    <div
      ref={menuRef}
      className="fixed z-50 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
      style={{ top: position.y, left: position.x }}
    >
      {/* Header with ID */}
      <div className="bg-gray-50 dark:bg-gray-900/50 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <p className="text-sm font-bold text-teal-600 dark:text-teal-400">
          ID #{archiveId}
        </p>
      </div>

      {/* Menu Items */}
      <div className="p-2">
        <ul className="space-y-0.5">
          {menuItems.map((item, index) => (
            <li key={index}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  item.action();
                  onClose();
                }}
                className={`group w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${item.color} ${item.hoverBg}`}
              >
                {item.icon}
                <span className="flex-1 text-left">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
