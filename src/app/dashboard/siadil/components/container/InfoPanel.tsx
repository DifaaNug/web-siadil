"use client";

import { Document } from "../../types";

type InfoPanelProps = {
  selectedDocument: Document | null;
  onClose: () => void;
};

export const InfoPanel = ({ selectedDocument, onClose }: InfoPanelProps) => {
  if (!selectedDocument) {
    return null;
  }

  return (
    <div className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-lg z-40 transform transition-transform duration-300 ease-in-out translate-x-0">
      <div className="flex flex-col h-full">
        {/* Header Panel */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Detail Dokumen
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <svg
              className="w-6 h-6 text-gray-600 dark:text-gray-300"
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

        {/* Konten Panel */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="text-center mb-4">
            <svg
              className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <h4 className="mt-2 text-lg font-bold text-gray-900 dark:text-white">
              {selectedDocument.title}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {selectedDocument.number}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h5 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
                Deskripsi
              </h5>
              <p className="text-sm text-gray-800 dark:text-gray-200">
                {selectedDocument.description}
              </p>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700"></div>
            <div>
              <h5 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                Properti
              </h5>
              <dl className="text-sm">
                <div className="flex justify-between py-1">
                  <dt className="text-gray-500 dark:text-gray-400">Arsip</dt>
                  <dd className="text-gray-800 dark:text-gray-200">
                    {selectedDocument.archive}
                  </dd>
                </div>
                <div className="flex justify-between py-1">
                  <dt className="text-gray-500 dark:text-gray-400">
                    Tanggal Dokumen
                  </dt>
                  <dd className="text-gray-800 dark:text-gray-200">
                    {new Date(selectedDocument.documentDate).toLocaleDateString(
                      "id-ID"
                    )}
                  </dd>
                </div>
                <div className="flex justify-between py-1">
                  <dt className="text-gray-500 dark:text-gray-400">
                    Terakhir diubah
                  </dt>
                  <dd className="text-gray-800 dark:text-gray-200">
                    {new Date(selectedDocument.updatedDate).toLocaleDateString(
                      "id-ID"
                    )}
                  </dd>
                </div>
                <div className="flex justify-between py-1">
                  <dt className="text-gray-500 dark:text-gray-400">
                    Dibuat oleh
                  </dt>
                  <dd className="text-gray-800 dark:text-gray-200">
                    {selectedDocument.createdBy}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
