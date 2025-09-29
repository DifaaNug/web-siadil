// src/app/dashboard/siadil/components/views/QuickAccessSection.tsx

import React from "react";
import { Document } from "../../types";

interface QuickAccessSectionProps {
  documents: Document[];
  onDocumentClick: (doc: Document) => void;
  isInfoPanelOpen: boolean;
}

// Helper untuk mendapatkan inisial dari nama
const getInitials = (name: string) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2);
};

// Helper untuk memilih ikon berdasarkan tipe file
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
  // Ikon default
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
}) => {
  if (documents.length === 0) return null;

  const gridClasses = isInfoPanelOpen
    ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    : "grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5";

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Quick Access
        </h2>
        <a
          href="#"
          className="text-sm font-medium text-demplon hover:underline">
          View All
        </a>
      </div>
      <div className={`grid ${gridClasses} gap-5`}>
        {documents.map((doc) => (
          <div
            key={doc.id}
            onClick={() => onDocumentClick(doc)}
            className="group relative flex flex-col cursor-pointer overflow-hidden rounded-xl border bg-white p-4 shadow-sm transition-all duration-300 ease-in-out hover:border-demplon hover:shadow-lg hover:-translate-y-1 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-green-600">
            <div className="flex items-start justify-between mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
                {getFileIcon(doc.fileType)}
              </div>
              <div className="flex -space-x-2">
                <div
                  title={doc.updatedBy}
                  className="w-7 h-7 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300 ring-2 ring-white dark:ring-gray-800">
                  {getInitials(doc.updatedBy)}
                </div>
              </div>
            </div>

            <div className="flex-grow">
              <h4
                className="font-bold text-sm text-gray-800 dark:text-white leading-tight"
                title={doc.title}>
                {doc.title}
              </h4>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50 text-xs text-gray-500 dark:text-gray-400">
              Diubah: {new Date(doc.updatedDate).toLocaleDateString("id-ID")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickAccessSection;
