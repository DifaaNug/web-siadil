"use client";

import { useEffect, useRef, useState } from "react";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";

import {
  IconDelete,
  IconEdit,
  IconManageContributors,
  IconManageFiles,
} from "./ActionIcons";

type ActionMenuProps = {
  documentId: string;
  onClose: () => void;
  buttonEl: HTMLButtonElement;
  onMove: (documentId: string) => void;
  onEdit: (documentId: string) => void;
  onDelete: (documentId: string) => void;
  onManageContributors: (documentId: string) => void; // Tambahkan ini
};

export const ActionMenu = ({
  documentId,
  onClose,
  buttonEl,
  onMove,
  onEdit,
  onDelete,
  onManageContributors, // Tambahkan ini
}: ActionMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(buttonEl);
  const [style, setStyle] = useState<React.CSSProperties>({
    position: "fixed",
    visibility: "hidden",
  });

  // Update buttonRef when buttonEl changes
  useEffect(() => {
    buttonRef.current = buttonEl;
  }, [buttonEl]);

  useOnClickOutside(menuRef, onClose, buttonRef);

  useEffect(() => {
    if (menuRef.current && buttonEl) {
      const menuRect = menuRef.current.getBoundingClientRect();
      const buttonRect = buttonEl.getBoundingClientRect();
      const { innerHeight: windowHeight } = window;
      const newStyle: React.CSSProperties = { position: "fixed" };

      const spaceBelow = windowHeight - buttonRect.bottom;
      if (spaceBelow >= menuRect.height || spaceBelow > buttonRect.top) {
        newStyle.top = buttonRect.bottom + 4;
      } else {
        newStyle.bottom = windowHeight - buttonRect.top + 4;
      }

      const leftAligned = buttonRect.right - menuRect.width;
      if (leftAligned < 0) {
        newStyle.left = buttonRect.left;
      } else {
        newStyle.left = leftAligned;
      }

      newStyle.visibility = "visible";
      setStyle(newStyle);
    }
  }, [buttonEl]);

  const menuItems = [
    {
      label: "Edit",
      icon: <IconEdit />,
      onClick: () => onEdit(documentId),
    },
    {
      label: "Pindahkan",
      icon: <IconManageFiles />,
      onClick: () => onMove(documentId),
    },
    {
      label: "Delete",
      icon: <IconDelete />,
      onClick: () => onDelete(documentId),
      isDestructive: true,
    },
    { isSeparator: true },
    {
      label: "Manage Contributors",
      icon: <IconManageContributors />,
      onClick: () => onManageContributors(documentId), // Ganti ini
    },
    { isSeparator: true },
    {
      label: "Manage Files",
      icon: <IconManageFiles />,
      onClick: () => alert(`Manage Files for ${documentId}`),
    },
  ];

  return (
    <div
      ref={menuRef}
      onClick={(e) => e.stopPropagation()}
      className="w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50"
      style={style}>
      <div className="p-2">
        <div className="px-2 py-1 text-left">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            ID #{documentId}
          </p>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
        <ul>
          {menuItems.map((item, index) => {
            if (item.isSeparator) {
              return (
                <div
                  key={index}
                  className="border-t border-gray-200 dark:border-gray-700 my-1"
                />
              );
            }
            return (
              <li key={index}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    item.onClick?.();
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
            );
          })}
        </ul>
      </div>
    </div>
  );
};
