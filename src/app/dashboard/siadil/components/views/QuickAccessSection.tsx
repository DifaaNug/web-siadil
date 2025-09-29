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
  onViewAll?: () => void;
}

const QuickAccessSection: React.FC<QuickAccessSectionProps> = ({
  documents,
  onDocumentClick,
  isInfoPanelOpen,
  onViewAll,
}) => {
  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    doc: Document
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onDocumentClick(doc);
    }
  };

  const getArchiveName = (doc: Document) =>
    ARCHIVE_BY_ID.get(doc.parentId) ||
    (doc.archive ? ARCHIVE_BY_CODE.get(doc.archive) : undefined) ||
    "Tidak diketahui";

  // Label singkat untuk badge: gunakan code (mis. TIK) bila ada, selain itu fallback ke nama
  const getArchiveLabel = (doc: Document) => doc.archive || getArchiveName(doc);

  // Saat panel info terbuka, kurangi 1 item di paling kanan
  const displayedDocs = isInfoPanelOpen
    ? documents.slice(0, Math.max(documents.length - 1, 0))
    : documents;

  // Jangan sembunyikan seksi; tampilkan empty state saat belum ada dokumen

  // Grid rapat dengan auto-fill agar card lebih berdekatan
  // Tetapkan jumlah kolom agar baris pertama pas ke kanan:
  // - Panel detail terbuka: 4 kolom
  // - Panel detail tertutup: 5 kolom
  const gridClasses = isInfoPanelOpen
    ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
    : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5";

  return (
    <div className="mb-10">
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
        Quick access to the documents you recently viewed and edited.
      </p>
      {displayedDocs.length === 0 ? (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/40 p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#01793B] to-emerald-500 text-white ring-1 ring-white/20">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-white">No Quick Access yet</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Documents you open will appear here automatically.</p>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Tip: open a document from the Archives section below to get started.</p>
        </div>
      ) : (
        <div className={`grid ${gridClasses} gap-4 md:gap-5`}>
          {displayedDocs.map((doc) => (
          <div
            key={doc.id}
            role="button"
            tabIndex={0}
            aria-label={`Open document ${doc.title}`}
            onKeyDown={(e) => handleKeyDown(e, doc)}
            onClick={() => onDocumentClick(doc)}
                className="group relative mx-auto cursor-pointer overflow-hidden rounded-xl bg-white/60 p-4 ring-1 ring-gray-200/70 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:ring-[#01793B]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#01793B]/45 dark:bg-gray-900/40 dark:ring-white/10 backdrop-blur-sm aspect-square w-full">
                <div className="flex h-full w-full flex-col items-center">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#01793B] to-emerald-500 text-white shadow-sm ring-1 ring-inset ring-white/20">
                <svg
                      className="h-6 w-6"
                      width="24"
                      height="24"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.6"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="mt-3 min-w-0 w-full px-2 text-center">
                <h4
                  className="truncate text-sm font-semibold leading-5 text-gray-900 dark:text-white"
                  title={doc.title}
                >
                  {doc.title}
                </h4>
                <div className="mt-2 flex w-full flex-wrap items-center justify-center gap-2">
                  <span
                    className="inline-flex items-center rounded-lg bg-gray-100 px-2 py-0.5 text-[10px] sm:text-[11px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300 whitespace-nowrap"
                    title={`Archive: ${getArchiveName(doc)}`}
                  >
                    {getArchiveLabel(doc)}
                  </span>
                  
                </div>
                <div className="mt-auto flex w-full items-end justify-center pt-3">
                  <span className="inline-flex items-center rounded-lg bg-gray-100 px-2 py-0.5 text-[10px] sm:text-[11px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300 whitespace-nowrap">
                    Updated: {formatDate(doc.updatedDate)}
                  </span>
                </div>
              </div>
              <svg
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100 dark:text-gray-500"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M9 5l7 7-7 7"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuickAccessSection;
