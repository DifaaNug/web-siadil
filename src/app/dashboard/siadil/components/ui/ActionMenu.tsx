"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";

const MENU_WIDTH = 240; // Tailwind w-60
const MENU_HEIGHT_ESTIMATE = 300;
const MENU_OFFSET = 8;
const VIEWPORT_PADDING = 12;

const computePlacement = (
  triggerRect: DOMRect,
  menuRect?: DOMRect
): {
  style: React.CSSProperties;
  origin: React.CSSProperties["transformOrigin"];
} => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const menuWidth = menuRect?.width ?? MENU_WIDTH;
  const menuHeight = menuRect?.height ?? MENU_HEIGHT_ESTIMATE;

  let top = triggerRect.bottom + MENU_OFFSET;
  let origin: React.CSSProperties["transformOrigin"] = "top right";

  const maxTop = viewportHeight - menuHeight - VIEWPORT_PADDING;
  top = Math.min(
    Math.max(VIEWPORT_PADDING, top),
    Math.max(VIEWPORT_PADDING, maxTop)
  );

  const notEnoughSpaceBelow =
    triggerRect.bottom + MENU_OFFSET + menuHeight >
    viewportHeight - VIEWPORT_PADDING;
  const enoughSpaceAbove =
    triggerRect.top - MENU_OFFSET - menuHeight > VIEWPORT_PADDING;

  if (notEnoughSpaceBelow && enoughSpaceAbove) {
    top = Math.max(
      VIEWPORT_PADDING,
      triggerRect.top - menuHeight - MENU_OFFSET
    );
    origin = "bottom right";
  }

  let left = triggerRect.right - menuWidth;
  if (left < VIEWPORT_PADDING) {
    left = VIEWPORT_PADDING;
  }
  if (left + menuWidth > viewportWidth - VIEWPORT_PADDING) {
    left = Math.max(
      VIEWPORT_PADDING,
      viewportWidth - menuWidth - VIEWPORT_PADDING
    );
  }

  const maxHeight = viewportHeight - VIEWPORT_PADDING * 2;

  return {
    style: {
      position: "fixed",
      top,
      left,
      opacity: 1,
      maxHeight,
    },
    origin,
  };
};

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
  anchorRect?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
    width: number;
    height: number;
  };
  onMove: (documentId: string) => void;
  onEdit: (documentId: string) => void;
  onDelete: (documentId: string) => void;
  onManageContributors: (documentId: string) => void; // Tambahkan ini
};

export const ActionMenu = ({
  documentId,
  onClose,
  buttonEl,
  anchorRect,
  onMove,
  onEdit,
  onDelete,
  onManageContributors,
}: ActionMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(buttonEl);
  const initialPosition = (() => {
    if (typeof window === "undefined") {
      return {
        style: {
          position: "fixed",
          top: 0,
          left: 0,
          opacity: 1,
        } as React.CSSProperties,
        origin: "top right" as React.CSSProperties["transformOrigin"],
      };
    }
    const triggerRect: DOMRect = anchorRect
      ? ({
          ...anchorRect,
          x: anchorRect.left,
          y: anchorRect.top,
          toJSON: () => anchorRect,
        } as unknown as DOMRect)
      : buttonEl.getBoundingClientRect();
    return computePlacement(triggerRect);
  })();

  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>(
    initialPosition.style
  );
  const [transformOrigin, setTransformOrigin] = useState<
    React.CSSProperties["transformOrigin"]
  >(initialPosition.origin);
  const [isReady, setIsReady] = useState(false);

  const updateMenuPosition = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }
    const triggerRect = buttonRef.current?.getBoundingClientRect();
    const menuRect = menuRef.current?.getBoundingClientRect();

    if (!triggerRect || !menuRect) {
      return;
    }

    const { style, origin } = computePlacement(triggerRect, menuRect);

    setMenuStyle((prev) => {
      const keys = new Set([...Object.keys(prev), ...Object.keys(style)]);
      for (const key of keys) {
        if (
          prev[key as keyof React.CSSProperties] !==
          style[key as keyof React.CSSProperties]
        ) {
          return style;
        }
      }
      return prev;
    });
    setTransformOrigin(origin);
  }, []);

  useEffect(() => {
    buttonRef.current = buttonEl;
  }, [buttonEl]);

  useOnClickOutside(menuRef, onClose, buttonRef);
  useLayoutEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    updateMenuPosition();
    setIsReady(true);

    let animationFrame: number | null = null;
    const handleWindowChange = () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      animationFrame = requestAnimationFrame(updateMenuPosition);
    };

    const observer =
      typeof ResizeObserver !== "undefined" && menuRef.current
        ? new ResizeObserver(() => handleWindowChange())
        : null;

    if (observer && menuRef.current) {
      observer.observe(menuRef.current);
    }

    window.addEventListener("resize", handleWindowChange);
    window.addEventListener("scroll", handleWindowChange, true);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      observer?.disconnect();
      window.removeEventListener("resize", handleWindowChange);
      window.removeEventListener("scroll", handleWindowChange, true);
    };
  }, [buttonEl, updateMenuPosition]);

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

  const content = (
    <>
      <style jsx>{fadeInKeyframes}</style>
      <div
        ref={menuRef}
        onClick={(e) => e.stopPropagation()}
        className="w-60 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-gray-200/60 dark:border-gray-700/60 rounded-xl shadow-2xl ring-1 ring-black/5 dark:ring-white/5 z-[9999]"
        style={{
          ...menuStyle,
          opacity: isReady ? 1 : 0,
          pointerEvents: isReady ? undefined : "none",
          animation: isReady
            ? "fadeIn 0.12s cubic-bezier(0.16, 1, 0.3, 1) forwards"
            : undefined,
          transformOrigin,
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
              if (item.isSeparator)
                return (
                  <div
                    key={index}
                    className="border-t border-gray-200 dark:border-gray-700 my-1"
                  />
                );
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
                      animation: `fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards ${
                        index * 40
                      }ms both`,
                    }}>
                    <span className="mr-3 transition-transform duration-200 group-hover:scale-110">
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
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

  if (typeof window === "undefined") return content;
  const portalTarget = document.body;
  return createPortal(content, portalTarget);
};
