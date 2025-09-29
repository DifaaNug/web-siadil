// src/app/dashboard/siadil/components/views/QuickAccessSection.tsx

import React from "react";
import { Document } from "../../types";
import { allArchives } from "../../data";

// Peta bantuan (dibuat sekali di level modul)
const ARCHIVE_BY_ID = new Map<string, string>(
  allArchives.map((a) => [a.id, a.name])
);
const ARCHIVE_BY_CODE = new Map<string, string>(
  allArchives.map((a) => [a.code, a.name])
);

interface QuickAccessSectionProps {
  documents: Document[];
  onDocumentClick: (doc: Document) => void;
  isInfoPanelOpen: boolean;
<<<<<<< HEAD
  onViewAllClick: () => void;
=======
  onViewAll?: () => void;
>>>>>>> 0c4d7e224a10401003d1547baa9e20b69cdfecb2
}

const getInitials = (name: string) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2);
};

const getFileIcon = (fileType?: string) => {
  const type = fileType?.toLowerCase() || "";
  if (type.includes("pdf")) {
    return (
      <svg
        className="w-6 h-6 text-red-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    );
  }
  if (type.includes("png") || type.includes("jpg") || type.includes("jpeg")) {
    return (
      <svg
        className="w-6 h-6 text-purple-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    );
  }
  if (type.includes("ppt")) {
    return (
      <svg
        className="w-6 h-6 text-orange-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
        />
      </svg>
    );
  }
  if (type.includes("doc")) {
    return (
      <svg
        className="w-6 h-6 text-blue-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    );
  }
  if (type.includes("xls")) {
    return (
      <svg
        className="w-6 h-6 text-green-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    );
  }
  return (
    <svg
      className="w-6 h-6 text-gray-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
};

const QuickAccessSection: React.FC<QuickAccessSectionProps> = ({
  documents,
  onDocumentClick,
  isInfoPanelOpen,
<<<<<<< HEAD
  onViewAllClick,
=======
  onViewAll,
>>>>>>> 0c4d7e224a10401003d1547baa9e20b69cdfecb2
}) => {
  if (documents.length === 0) return null;

  // Logika dinamis untuk kelas grid
  const gridClasses = isInfoPanelOpen
    ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" // Saat panel terbuka, maksimal 4 kolom
    : "grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5"; // Saat panel tertutup, bisa sampai 5 kolom

  return (
    <div className="mb-10">
<<<<<<< HEAD
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Quick Access
      </h2>
      <div className={`grid ${gridClasses} gap-5`}>
        {documents.map((doc) => (
=======
      <div className="mb-2 flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Quick Access
        </h2>
        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#01793B]/40 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            aria-label="Lihat semua Quick Access"
          >
            View All
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
        Akses cepat ke dokumen yang terakhir kamu lihat dan ubah.
      </p>
          <div className={`grid ${gridClasses} gap-4 md:gap-5`}>
            {displayedDocs.map((doc) => (
>>>>>>> 0c4d7e224a10401003d1547baa9e20b69cdfecb2
          <div
            key={doc.id}
            onClick={() => onDocumentClick(doc)}
<<<<<<< HEAD
            className="group relative rounded-lg border p-4 transition-all cursor-pointer border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
            <div className="flex items-center">
              <div className="flex-shrink-0">
=======
                className="group relative mx-auto cursor-pointer overflow-hidden rounded-xl bg-white/60 p-4 ring-1 ring-gray-200/70 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:ring-[#01793B]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#01793B]/45 dark:bg-gray-900/40 dark:ring-white/10 backdrop-blur-sm aspect-square w-full">
                <div className="flex h-full w-full flex-col items-center">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#01793B] to-emerald-500 text-white shadow-sm ring-1 ring-inset ring-white/20">
>>>>>>> 0c4d7e224a10401003d1547baa9e20b69cdfecb2
                <svg
                  className="w-8 h-8 text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="ml-3 min-w-0">
                <h4
                  className="text-sm font-bold text-gray-900 dark:text-white truncate"
                  title={doc.title}>
                  {doc.title}
                </h4>
<<<<<<< HEAD
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Diubah:{" "}
                  {new Date(doc.updatedDate).toLocaleDateString("id-ID")}
                </p>
=======
                <div className="mt-2 flex w-full flex-wrap items-center justify-center gap-2">
                  <span
                    className="inline-flex items-center rounded-lg bg-gray-100 px-2 py-0.5 text-[10px] sm:text-[11px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300 whitespace-nowrap"
                    title={`Arsip: ${getArchiveName(doc)}`}
                  >
                    {getArchiveLabel(doc)}
                  </span>
                  
                </div>
                <div className="mt-auto flex w-full items-end justify-center pt-3">
                  <span className="inline-flex items-center rounded-lg bg-gray-100 px-2 py-0.5 text-[10px] sm:text-[11px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300 whitespace-nowrap">
                    Diubah: {formatDate(doc.updatedDate)}
                  </span>
                </div>
>>>>>>> 0c4d7e224a10401003d1547baa9e20b69cdfecb2
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickAccessSection;
