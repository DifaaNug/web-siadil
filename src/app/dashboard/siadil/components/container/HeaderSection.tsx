"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Reminder } from "../../types";
import { AddNewMenu } from "../ui/AddNewMenu";

interface HeaderSectionProps {
  totalDocuments: number;
  expiredCount: number;
  expiringSoonCount: number;
  onViewAllReminders: () => void;
  addNewButtonRef: React.RefObject<HTMLDivElement | null>;
  isAddNewMenuOpen: boolean;
  onToggleAddNewMenu: () => void;
  onCloseAddNewMenu: () => void;
  onNewFolder: () => void;
  onFileUpload: () => void;
  currentFolderId: string;
  onExpiredCardClick: () => void;
  onExpiringSoonCardClick: () => void;
  reminders: Reminder[];
}

const InfoCard = ({
  gradient,
  icon,
  value,
  title,
  subtitle,
  onClick,
}: {
  gradient: string;
  icon: React.ReactNode;
  value: number;
  title: string;
  subtitle: string;
  onClick?: () => void;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const currentCard = cardRef.current;
      if (!currentCard) return;
      const rect = currentCard.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      currentCard.style.setProperty("--mouse-x", `${x}px`);
      currentCard.style.setProperty("--mouse-y", `${y}px`);
    };

    const currentCard = cardRef.current;
    currentCard?.addEventListener("mousemove", handleMouseMove);

    return () => {
      currentCard?.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`group relative w-full ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}>
      {/* Efek border yang menyala mengikuti kursor */}
      <div
        className="pointer-events-none absolute -inset-0.5 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-75"
        style={{
          background:
            "radial-gradient(400px at var(--mouse-x) var(--mouse-y), rgb(4, 207, 18), transparent 80%)",
        }}
      />
      <div
        className={`relative z-10 rounded-xl p-3 pb-1 pt-1 text-white shadow-lg transition-all duration-300 ease-in-out ${gradient}`}>
        <div className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white/30 backdrop-blur-sm">
          {icon}
        </div>
        <div className="mt-7 p-2 pt-0">
          <p className="text-3xl font-bold">{value}</p>
          <p className="text-base font-semibold mt-1">{title}</p>
          <p className="text-xs opacity-80">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

const HeaderSection: React.FC<HeaderSectionProps> = ({
  totalDocuments,
  expiredCount,
  expiringSoonCount,
  onViewAllReminders,
  addNewButtonRef,
  isAddNewMenuOpen,
  onToggleAddNewMenu,
  onCloseAddNewMenu,
  onNewFolder,
  onFileUpload,
  currentFolderId,
  onExpiredCardClick,
  onExpiringSoonCardClick,
  reminders,
}) => {
  const [currentReminderIndex, setCurrentReminderIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentReminderIndex((prev) =>
        prev === reminders.length - 1 ? 0 : prev + 1
      );
    }, 3000);
  }, [reminders.length]);

  const stopInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (reminders.length > 1) {
      startInterval();
    }
    return () => stopInterval();
  }, [reminders.length, startInterval, stopInterval]);
  const getReminderStyles = (type: "error" | "warning" | undefined) => {
    switch (type) {
      case "error":
        return {
          bgColor: "bg-red-50 dark:bg-red-900/50",
          borderColor: "border-red-200 dark:border-red-700",
          accentColor: "bg-red-500",
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
      default:
        return {
          bgColor: "bg-yellow-50 dark:bg-yellow-900/50",
          borderColor: "border-yellow-200 dark:border-yellow-700",
          accentColor: "bg-yellow-500",
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
    <div className="mb-2">
      <div className="flex flex-col lg:flex-row items-start justify-between">
        {/* === KOLOM KIRI === */}
        <div className="flex-1 w-full lg:mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <InfoCard
              gradient="bg-gradient-to-br from-demplon to-teal-600"
              value={totalDocuments}
              title="Dokumen"
              subtitle="Total Arsip Aktif"
              icon={
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              }
            />
            <InfoCard
              gradient="bg-gradient-to-br from-red-700 to-red-500"
              value={expiredCount}
              title="Kedaluwarsa"
              subtitle="Butuh Perhatian Segera"
              onClick={onExpiredCardClick}
              icon={
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
            />
            <InfoCard
              gradient="bg-gradient-to-br from-yellow-600 to-yellow-500"
              value={expiringSoonCount}
              title="Akan Kedaluwarsa"
              subtitle="Dalam 30 Hari Kedepan"
              onClick={onExpiringSoonCardClick}
              icon={
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
            />
            {/* Kartu "Add New" */}
            <div
              ref={addNewButtonRef}
              onClick={onToggleAddNewMenu}
              className="group relative flex h-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/50 p-5 shadow-sm transition-all duration-300 ease-in-out hover:border-demplon hover:bg-green-50/50 hover:shadow-md dark:border-gray-600 dark:bg-gray-800/50 dark:hover:border-demplon dark:hover:bg-demplon/10">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-400 ring-1 ring-slate-200 transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-demplon group-hover:to-teal-500 group-hover:text-white group-hover:ring-white/20 group-hover:shadow-lg group-hover:shadow-teal-500/20 dark:bg-slate-800 dark:text-slate-500 dark:ring-slate-700">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v12m6-6H6"
                  />
                </svg>
              </div>
              <h3 className="mt-3 text-sm font-bold text-gray-800 dark:text-gray-200">
                Add New
              </h3>
              {isAddNewMenuOpen && (
                <AddNewMenu
                  buttonRef={addNewButtonRef}
                  onClose={onCloseAddNewMenu}
                  onNewFolder={onNewFolder}
                  onFileUpload={onFileUpload}
                  context={
                    currentFolderId === "root" ? "archives" : "documents"
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* === REMINDERS SECTION === */}
      <div className="w-full mt-6 mb-6">
        <div className="flex w-full items-center justify-between mb-3">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Reminders
          </h3>
          <button
            type="button"
            onClick={onViewAllReminders}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#01793B]/40 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            aria-label="View all Reminders">
            View All
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor">
              <path
                d="M9 5l7 7-7 7"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          onMouseEnter={stopInterval}
          onMouseLeave={startInterval}>
          {[0, 1, 2].map((cardIndex) => {
            const reminderIndex =
              (currentReminderIndex + cardIndex) % reminders.length;
            const reminder = reminders[reminderIndex];
            const styles = getReminderStyles(reminder.type);

            return (
              <div
                key={`${reminder.id}-${cardIndex}`}
                className="relative flex items-center overflow-hidden rounded-lg border p-0 shadow-sm transition-all h-27">
                {/* Div ini yang akan membuat efek transisi konten */}
                <div className="w-full transition-all duration-500 ease-in-out">
                  <div
                    className={`relative flex items-center gap-4 p-3 rounded-lg ${styles.bgColor} ${styles.borderColor}`}>
                    <div
                      className={`absolute left-0 top-0 h-full w-1.5 ${styles.accentColor}`}></div>
                    <div
                      className={`ml-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${styles.iconBg} ${styles.iconColor}`}>
                      {styles.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-semibold truncate ${styles.titleColor}`}>
                        {reminder.title}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {reminder.description}
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                        {reminder.message}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HeaderSection;
