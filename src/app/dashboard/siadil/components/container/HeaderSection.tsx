"use client";

import React, { useEffect, useRef } from "react";
import { reminders } from "../../data";

// Interface props yang tidak digunakan dihapus
interface HeaderSectionProps {
  totalDocuments: number;
  expiredCount: number;
  expiringSoonCount: number;
  onViewAllReminders: () => void;
}

// Komponen Card dengan efek hover border mengikuti kursor
const InfoCard = ({
  gradient,
  icon,
  value,
  title,
  subtitle,
}: {
  gradient: string;
  icon: React.ReactNode;
  value: number;
  title: string;
  subtitle: string;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        cardRef.current.style.setProperty("--mouse-x", `${x}px`);
        cardRef.current.style.setProperty("--mouse-y", `${y}px`);
      }
    };

    const currentCard = cardRef.current;
    currentCard?.addEventListener("mousemove", handleMouseMove);

    return () => {
      currentCard?.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div ref={cardRef} className="group relative w-full">
      {/* Efek border yang menyala mengikuti kursor */}
      <div
        className="pointer-events-none absolute -inset-0.5 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-75"
        style={{
          background:
            "radial-gradient(400px at var(--mouse-x) var(--mouse-y), rgb(6, 217, 6), transparent 80%)",
        }}
      />
      {/* Konten Kartu */}
      <div
        className={`relative z-10 rounded-xl p-3 text-white shadow-lg transition-all duration-300 ease-in-out ${gradient}`}
      >
        <div className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white/30 backdrop-blur-sm">
          {icon}
        </div>
        <div className="mt-7">
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
}) => {
  const getReminderStyles = (type: "error" | "warning" | undefined) => {
    // ... (kode style reminder tidak ada perubahan)
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
    <div className="mb-6">
      <div className="flex items-start justify-between">
        {/* === KOLOM KIRI === */}
        <div className="flex-1">
          <div className="mt-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  stroke="currentColor"
                >
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
              icon={
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
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
              icon={
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
            />
          </div>
        </div>

        {/* === KOLOM KANAN === */}
        <div className="ml-8 flex w-80 flex-shrink-0 flex-col">
          <div className="flex w-full items-center justify-between mt-6 mb-3">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Reminders
            </h3>
            <button
              onClick={onViewAllReminders}
              className="text-xs font-semibold text-demplon hover:underline"
            >
              View All
            </button>
          </div>
          <div className="space-y-3 max-h-[7rem] overflow-y-auto pr-2">
            {reminders.map((reminder) => {
              const styles = getReminderStyles(reminder.type);
              return (
                <div
                  key={reminder.id}
                  className={`flex items-center justify-between rounded-lg border p-4 shadow-sm ${styles.bgColor} ${styles.borderColor}`}
                >
                  <div className="flex items-center">
                    <div
                      className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${styles.iconBg} ${styles.iconColor}`}
                    >
                      {styles.icon}
                    </div>
                    <div className="ml-4">
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
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderSection;
