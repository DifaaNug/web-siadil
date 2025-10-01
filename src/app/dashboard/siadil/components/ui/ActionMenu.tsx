"use client";

import { useEffect, useRef, useState } from "react";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";

const fadeInKeyframes = `
  @keyframes fadeIn {
    from { 
      opacity: 0; 
      transform: translateY(-12px) scale(0.95); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0) scale(1); 
    }
  }
`;

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
  onManageContributors,
}: ActionMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(buttonEl);
  const [style, setStyle] = useState<React.CSSProperties>({
    position: "fixed",
    visibility: "hidden",
  });

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
      onClick: () => onManageContributors(documentId),
    },
    { isSeparator: true },
    {
      label: "Manage Files",
      icon: <IconManageFiles />,
      onClick: () => alert(`Manage Files for ${documentId}`),
    },
  ];

  return (
    <>
      <style jsx>{fadeInKeyframes}</style>
      <div
        ref={menuRef}
        onClick={(e) => e.stopPropagation()}
        className="w-60 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-gray-200/60 dark:border-gray-700/60 rounded-xl shadow-2xl ring-1 ring-black/5 dark:ring-white/5 z-50"
        style={{
          ...style,
          animation: "fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          opacity: 0,
        }}>
        <div className="p-3">
          <div className="px-2 py-2 text-left bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-lg mb-2">
            <p className="text-sm font-bold text-green-700 dark:text-green-300 tracking-wide">
              ID #{documentId}
            </p>
          </div>
          <div className="border-t border-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-gray-700 my-2" />
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
                <li key={index} style={{ animationDelay: `${index * 40}ms` }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      item.onClick?.();
                      onClose();
                    }}
                    className={`group w-full flex items-center px-3 py-2.5 text-sm rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${
                      item.isDestructive
                        ? "text-red-600 dark:text-red-400 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 dark:hover:from-red-900/30 dark:hover:to-red-800/30 hover:shadow-sm hover:ring-1 hover:ring-red-200 dark:hover:ring-red-800"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-700/50 dark:hover:to-gray-600/50 hover:shadow-sm hover:ring-1 hover:ring-gray-200 dark:hover:ring-gray-600"
                    }`}
                    style={{
                      animation: `fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards ${
                        index * 40
                      }ms both`,
                    }}>
                    <span className="mr-3 transition-transform duration-200 group-hover:scale-110">
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>

                    {/* Subtle highlight effect */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};
