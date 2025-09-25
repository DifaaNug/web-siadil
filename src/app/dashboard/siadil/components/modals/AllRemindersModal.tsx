"use client";

import { useState, useRef, useMemo } from "react";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";

type Reminder = {
  id: string;
  title: string;
  description: string;
  message: string;
  type: "error" | "warning";
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  reminders: Reminder[];
};

export const AllRemindersModal = ({ isOpen, onClose, reminders }: Props) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(modalRef, onClose);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredReminders = useMemo(() => {
    if (!searchTerm) {
      return reminders;
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    return reminders.filter(
      (r) =>
        r.title.toLowerCase().includes(lowercasedTerm) ||
        r.description.toLowerCase().includes(lowercasedTerm) ||
        r.message.toLowerCase().includes(lowercasedTerm)
    );
  }, [searchTerm, reminders]);

  if (!isOpen) return null;

  // FUNGSI INI SEBELUMNYA KOSONG, SEKARANG SUDAH DIISI KEMBALI
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div
        ref={modalRef}
        className="flex w-full max-w-lg flex-col rounded-lg bg-white shadow-xl dark:bg-gray-800 max-h-[90vh]">
        <div className="border-b p-4 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              All Reminders
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
              <svg
                className="h-6 w-6 text-gray-500 dark:text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="relative mt-4">
            <input
              type="text"
              placeholder="Search reminders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 focus:border-demplon focus:ring-demplon dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="space-y-4 overflow-y-auto p-6">
          {filteredReminders.length > 0 ? (
            filteredReminders.map((reminder) => {
              const styles = getReminderStyles(reminder.type);
              return (
                <div
                  key={reminder.id}
                  className={`flex items-center justify-between rounded-lg border p-4 shadow-sm ${styles.bgColor} ${styles.borderColor}`}>
                  <div className="flex items-center">
                    <div
                      className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${styles.iconBg} ${styles.iconColor}`}>
                      {styles.icon}
                    </div>
                    <div className="ml-4">
                      <p
                        className={`text-sm font-semibold ${styles.titleColor}`}>
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
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="py-8 text-center text-sm text-gray-500">
              No reminders found matching your search.
            </p>
          )}
        </div>
        <div className="flex justify-end rounded-b-lg border-t bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-800/50">
          <button
            onClick={onClose}
            className="rounded-md border bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
