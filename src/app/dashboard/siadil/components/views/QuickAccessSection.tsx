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
  onViewAllClick: () => void;
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
  onViewAllClick,
}) => {
  if (documents.length === 0) return null;

  // Logika dinamis untuk kelas grid
  const gridClasses = isInfoPanelOpen
    ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" // Saat panel terbuka, maksimal 4 kolom
    : "grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5"; // Saat panel tertutup, bisa sampai 5 kolom

  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Quick Access
      </h2>
      <div className={`grid ${gridClasses} gap-5`}>
        {documents.map((doc) => (
          <div
            key={doc.id}
            onClick={() => onDocumentClick(doc)}
            className="group relative rounded-lg border p-4 transition-all cursor-pointer border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
            <div className="flex items-center">
              <div className="flex-shrink-0">
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
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Diubah:{" "}
                  {new Date(doc.updatedDate).toLocaleDateString("id-ID")}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickAccessSection;
