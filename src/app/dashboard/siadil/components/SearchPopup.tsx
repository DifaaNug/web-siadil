"use client"; // Pastikan "use client" ada di atas

import { Document } from "../types";
import { allArchives } from "../data"; // Impor allArchives

type SearchPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  documents: Document[];
  // ▼▼▼ TAMBAHKAN PROPERTI BARU INI ▼▼▼
  onDocumentSelect: (document: Document) => void;
};

export const SearchPopup = ({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery,
  documents,
  onDocumentSelect, // <-- Ambil prop baru
}: SearchPopupProps) => {
  if (!isOpen) return null;

  // Fungsi helper untuk mendapatkan nama arsip dari kodenya
  const getArchivePath = (parentId: string): string => {
    const path = [];
    let currentId = parentId;
    while (currentId !== "root") {
      const folder = allArchives.find((a) => a.id === currentId);
      if (folder) {
        path.unshift(folder.name);
        currentId = folder.parentId;
      } else {
        break;
      }
    }
    return path.join(" / ");
  };

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 sm:p-16 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-full">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search by number, title, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 text-sm border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              autoFocus
            />
            <button
              onClick={onClose}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <kbd className="inline-flex items-center border bg-gray-100 dark:bg-gray-900 rounded px-2 text-xs font-sans font-normal text-gray-400">
                Esc
              </kbd>
            </button>
          </div>
        </div>
        <div className="overflow-y-auto">
          {searchQuery && filteredDocuments.length > 0 ? (
            <ul className="p-2">
              {filteredDocuments.map((doc) => (
                <li key={doc.id}>
                  <button
                    // ▼▼▼ PERBAIKI AKSI onClick DI SINI ▼▼▼
                    onClick={() => onDocumentSelect(doc)}
                    className="w-full text-left flex items-start space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {doc.title}
                      </p>
                      {/* Tampilkan lokasi file */}
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        In: {getArchivePath(doc.parentId) || "Root"}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center p-12">
              <p className="text-gray-500 dark:text-gray-400">
                {searchQuery
                  ? "No documents found."
                  : "Start typing to search."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
