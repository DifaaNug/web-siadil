"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";

type Reminder = {
  id: string;
  title: string;
  description: string;
  message: string;
  type: "error" | "warning";

  documentId?: string;
  expireDate?: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  reminders: Reminder[];

  onDocumentClick?: (documentId: string) => void;
  initialTab?: ActiveTab;
};

type SortOption = "default" | "title-asc" | "expiry-asc";
type ActiveTab = "all" | "error" | "warning";

export const AllRemindersModal = ({
  isOpen,
  onClose,
  reminders,
  onDocumentClick,
  initialTab = "all",
}: Props) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const sortTriggerRef = useRef<HTMLButtonElement | null>(null);
  // Don't close modal when clicking inside the popover content or on the trigger
  useOnClickOutside(modalRef, onClose, sortTriggerRef, [
    "[data-reminders-sort-popover]",
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("default");
  const [activeTab, setActiveTab] = useState<ActiveTab>(initialTab);
  const [sortOpen, setSortOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  const processedReminders = useMemo(() => {
    let filtered = reminders;

    if (activeTab !== "all") {
      filtered = filtered.filter((r) => r.type === activeTab);
    }

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(lowercasedTerm) ||
          r.description.toLowerCase().includes(lowercasedTerm) ||
          r.message.toLowerCase().includes(lowercasedTerm)
      );
    }

    switch (sortOption) {
      case "title-asc":
        return [...filtered].sort((a, b) => a.title.localeCompare(b.title));
      case "expiry-asc":
        return [...filtered].sort((a, b) => {
          if (!a.expireDate || !b.expireDate) return 0;
          return (
            new Date(a.expireDate).getTime() - new Date(b.expireDate).getTime()
          );
        });
      default:
        return [...filtered].sort((a, b) => {
          if (a.type === "error" && b.type === "warning") return -1;
          if (a.type === "warning" && b.type === "error") return 1;
          return 0;
        });
    }
  }, [searchTerm, reminders, sortOption, activeTab]);

  if (!isOpen) return null;

  const getReminderStyles = (type: "error" | "warning") => {
    switch (type) {
      case "error":
        return {
          bgColor:
            "bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20",
          borderColor: "border-red-200/60 dark:border-red-800/60",
          accentColor: "bg-gradient-to-b from-red-500 to-rose-600",
          iconBg:
            "bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-900/50 dark:to-rose-900/50",
          iconColor: "text-red-600 dark:text-red-400",
          titleColor: "text-red-900 dark:text-red-200",
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.636-1.026 2.85-1.026 3.486 0l5.58 8.998c.636 1.026-.234 2.403-1.743 2.403H4.42c-1.51 0-2.379-1.377-1.743-2.403l5.58-8.998zM10 13a1 1 0 100-2 1 1 0 000 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          ),
        };
      default:
        return {
          bgColor:
            "bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20",
          borderColor: "border-amber-200/60 dark:border-amber-800/60",
          accentColor: "bg-gradient-to-b from-amber-500 to-yellow-600",
          iconBg:
            "bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/50 dark:to-yellow-900/50",
          iconColor: "text-amber-600 dark:text-amber-400",
          titleColor: "text-amber-900 dark:text-amber-200",
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                clipRule="evenodd"
              />
            </svg>
          ),
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="flex w-full max-w-2xl flex-col rounded-xl bg-white shadow-2xl dark:bg-gray-800 max-h-[90vh]"
      >
        {/* Header */}
        <div className="border-b p-5 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              All Reminders
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Review all document expiry reminders here.
          </p>
        </div>

        {/* Kontrol (Tab, Search, Sort) */}
        <div className="p-5 flex flex-col md:flex-row gap-4 items-center border-b dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20">
          {/* Tabs */}
          <div className="flex-shrink-0 bg-gray-200 dark:bg-gray-700 p-1 rounded-lg flex items-center">
            <TabButton
              isActive={activeTab === "all"}
              onClick={() => setActiveTab("all")}
            >
              All
            </TabButton>
            <TabButton
              isActive={activeTab === "error"}
              onClick={() => setActiveTab("error")}
            >
              Expired
            </TabButton>
            <TabButton
              isActive={activeTab === "warning"}
              onClick={() => setActiveTab("warning")}
            >
              Upcoming
            </TabButton>
          </div>
          {/* Search and Sort */}
          <div className="flex-grow w-full flex items-center gap-4">
            <input
              type="text"
              placeholder="Search reminders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white py-2 px-4 text-sm text-gray-900 focus:border-demplon focus:ring-demplon dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            />
            {/* Animated dropdown like starred action menu */}
            <Popover open={sortOpen} onOpenChange={setSortOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  aria-haspopup="listbox"
                  aria-expanded={sortOpen}
                  ref={sortTriggerRef}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center justify-between gap-2 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-demplon dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 min-w-[9rem] whitespace-nowrap"
                >
                  {sortOption === "expiry-asc"
                    ? "Nearest Date"
                    : sortOption === "title-asc"
                    ? "Title (A-Z)"
                    : "Sort"}
                  <svg
                    className={`h-5 w-5 opacity-100 transition-transform duration-200 ${
                      sortOpen ? "rotate-180" : "rotate-0"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.25}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </PopoverTrigger>
              <PopoverContent
                data-reminders-sort-popover
                align="end"
                onClick={(e) => e.stopPropagation()}
                className="w-56 p-2 rounded-xl shadow-2xl ring-1 ring-black/5 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-gray-200/60 dark:border-gray-700/60"
              >
                <ul role="listbox" className="py-1">
                  <li>
                    <button
                      type="button"
                      role="option"
                      aria-selected={sortOption === "default"}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSortOption("default");
                        setSortOpen(false);
                      }}
                      className={`group w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${
                        sortOption === "default"
                          ? "text-demplon"
                          : "text-gray-700 dark:text-gray-300"
                      } hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-700/50 dark:hover:to-gray-600/50 hover:shadow-sm hover:ring-1 hover:ring-gray-200 dark:hover:ring-gray-600 focus:outline-none`}
                    >
                      <span>Sort</span>
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      role="option"
                      aria-selected={sortOption === "expiry-asc"}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSortOption("expiry-asc");
                        setSortOpen(false);
                      }}
                      className={`group w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${
                        sortOption === "expiry-asc"
                          ? "text-demplon"
                          : "text-gray-700 dark:text-gray-300"
                      } hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-700/50 dark:hover:to-gray-600/50 hover:shadow-sm hover:ring-1 hover:ring-gray-200 dark:hover:ring-gray-600 focus:outline-none`}
                    >
                      <span>Nearest Date</span>
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      role="option"
                      aria-selected={sortOption === "title-asc"}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSortOption("title-asc");
                        setSortOpen(false);
                      }}
                      className={`group w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${
                        sortOption === "title-asc"
                          ? "text-demplon"
                          : "text-gray-700 dark:text-gray-300"
                      } hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-700/50 dark:hover:to-gray-600/50 hover:shadow-sm hover:ring-1 hover:ring-gray-200 dark:hover:ring-gray-600 focus:outline-none`}
                    >
                      <span>Title (A-Z)</span>
                    </button>
                  </li>
                </ul>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Daftar Konten */}
        <div className="flex-1 space-y-3 overflow-y-auto p-6">
          {processedReminders.length > 0 ? (
            processedReminders.map((reminder) => {
              const styles = getReminderStyles(reminder.type);
              const isClickable = onDocumentClick && reminder.documentId;
              const Component = isClickable ? "button" : "div";

              return (
                <Component
                  key={reminder.id}
                  onClick={
                    isClickable
                      ? () => {
                          onDocumentClick(reminder.documentId!);
                          onClose();
                        }
                      : undefined
                  }
                  className={`group w-full text-left relative flex items-start gap-4 overflow-hidden rounded-xl border p-4 transition-all duration-300 ${
                    isClickable
                      ? "cursor-pointer hover:shadow-lg hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.99]"
                      : ""
                  } ${styles.borderColor} ${styles.bgColor}`}
                >
                  {/* Accent bar on left */}
                  <div
                    className={`absolute left-0 top-0 h-full w-1 ${
                      styles.accentColor
                    } transition-all duration-300 ${
                      isClickable ? "group-hover:w-1.5" : ""
                    }`}
                  />

                  {/* Icon */}
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${
                      styles.iconBg
                    } ${styles.iconColor} transition-transform duration-300 ${
                      isClickable
                        ? "group-hover:scale-110 group-hover:rotate-3"
                        : ""
                    }`}
                  >
                    {styles.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4
                          className={`text-sm font-bold mb-1 ${styles.titleColor} line-clamp-1`}
                        >
                          {reminder.title}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                          {reminder.description}
                        </p>
                      </div>

                      {/* Arrow icon - only show if clickable */}
                      {isClickable && (
                        <div className="flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-lg bg-white/50 dark:bg-gray-700/50 transition-all duration-300 group-hover:bg-white dark:group-hover:bg-gray-700 group-hover:shadow-md">
                          <svg
                            className="h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-gray-700 dark:group-hover:text-gray-200"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Message */}
                    <div className="mt-2 pt-2 border-t border-gray-200/50 dark:border-gray-600/50">
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                        <svg
                          className="w-3.5 h-3.5 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="line-clamp-1">{reminder.message}</span>
                      </p>
                    </div>
                  </div>
                </Component>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                No reminders found
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                No reminders match your current filters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Komponen helper untuk Tab
const TabButton = ({
  isActive,
  onClick,
  children,
}: {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
      isActive
        ? "bg-white dark:bg-gray-800 text-demplon shadow-sm"
        : "text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50"
    }`}
  >
    {children}
  </button>
);
