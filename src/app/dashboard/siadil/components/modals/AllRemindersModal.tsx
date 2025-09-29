"use client";

import { useState, useRef, useMemo } from "react";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";

// Tipe data untuk sebuah pengingat
type Reminder = {
  id: string;
  title: string;
  description: string;
  message: string;
  type: "error" | "warning";
  // Properti baru untuk aksi dan tanggal
  documentId?: string;
  expireDate?: string;
};

// Tipe data untuk props komponen
type Props = {
  isOpen: boolean;
  onClose: () => void;
  reminders: Reminder[];
  // Prop baru untuk menangani aksi klik pada dokumen
  onDocumentClick?: (documentId: string) => void;
};

type SortOption = "default" | "title-asc" | "expiry-asc";
type ActiveTab = "all" | "error" | "warning";

export const AllRemindersModal = ({
  isOpen,
  onClose,
  reminders,
  onDocumentClick,
}: Props) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(modalRef, onClose);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("default");
  const [activeTab, setActiveTab] = useState<ActiveTab>("all");

  const processedReminders = useMemo(() => {
    let filtered = reminders;

    // 1. Filter berdasarkan Tab
    if (activeTab !== "all") {
      filtered = filtered.filter((r) => r.type === activeTab);
    }

    // 2. Filter berdasarkan Pencarian
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(lowercasedTerm) ||
          r.description.toLowerCase().includes(lowercasedTerm) ||
          r.message.toLowerCase().includes(lowercasedTerm)
      );
    }

    // 3. Lakukan Pengurutan
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
        // Urutan default: error dulu, baru warning
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
          bgColor: "bg-red-50 dark:bg-red-900/50",
          borderColor: "border-red-200 dark:border-red-700",
          iconBg: "bg-red-100 dark:bg-red-900",
          iconColor: "text-red-600 dark:text-red-400",
          titleColor: "text-red-800 dark:text-red-200",
          icon: (
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.636-1.026 2.85-1.026 3.486 0l5.58 8.998c.636 1.026-.234 2.403-1.743 2.403H4.42c-1.51 0-2.379-1.377-1.743-2.403l5.58-8.998zM10 13a1 1 0 100-2 1 1 0 000 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          ),
        };
      default: // 'warning'
        return {
          bgColor: "bg-yellow-50 dark:bg-yellow-900/50",
          borderColor: "border-yellow-200 dark:border-yellow-700",
          iconBg: "bg-yellow-100 dark:bg-yellow-900",
          iconColor: "text-yellow-600 dark:text-yellow-400",
          titleColor: "text-yellow-800 dark:text-yellow-200",
          icon: (
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
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
            Tinjau semua pengingat kedaluwarsa dokumen Anda di sini.
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
              Semua
            </TabButton>
            <TabButton
              isActive={activeTab === "error"}
              onClick={() => setActiveTab("error")}
            >
              Kedaluwarsa
            </TabButton>
            <TabButton
              isActive={activeTab === "warning"}
              onClick={() => setActiveTab("warning")}
            >
              Akan Datang
            </TabButton>
          </div>
          {/* Search and Sort */}
          <div className="flex-grow w-full flex items-center gap-4">
            <input
              type="text"
              placeholder="Cari pengingat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white py-2 px-4 text-sm text-gray-900 focus:border-demplon focus:ring-demplon dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="rounded-md border-gray-300 bg-white py-2 px-3 text-sm focus:border-demplon focus:ring-demplon dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="default">Urutkan</option>
              <option value="expiry-asc">Tanggal Terdekat</option>
              <option value="title-asc">Judul (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Daftar Konten */}
        <div className="flex-1 space-y-4 overflow-y-auto p-6">
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
                  className={`w-full flex items-center justify-between rounded-lg border p-4 shadow-sm transition-all ${
                    isClickable
                      ? "cursor-pointer hover:shadow-md hover:border-gray-300 dark:hover:border-gray-500"
                      : ""
                  } ${styles.bgColor} ${styles.borderColor}`}
                >
                  <div className="flex items-center">
                    <div
                      className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${styles.iconBg} ${styles.iconColor}`}
                    >
                      {styles.icon}
                    </div>
                    <div className="ml-4 text-left">
                      <p
                        className={`text-sm font-semibold ${styles.titleColor}`}
                      >
                        {reminder.title}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {reminder.description}
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                        {reminder.message}
                      </p>
                    </div>
                  </div>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10">
                    <svg
                      className="h-5 w-5 text-gray-400"
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
                  </div>
                </Component>
              );
            })
          ) : (
            <p className="py-12 text-center text-sm text-gray-500">
              Tidak ada pengingat yang cocok dengan filter Anda.
            </p>
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
