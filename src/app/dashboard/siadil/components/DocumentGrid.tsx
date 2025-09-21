import { useState } from "react";
import { Document } from "../types";
import { ActionMenu } from "./ActionMenu";
import { ContextMenu } from "./ContextMenu";

type ContextMenuState = { x: number; y: number; documentId: string } | null;

export const DocumentGrid = ({
  documents,
  selectedDocumentIds,
  onDocumentSelect,
  onMove,
  onToggleStar,
}: {
  documents: Document[];
  selectedDocumentIds: Set<string>;
  onDocumentSelect: (id: string, event?: React.MouseEvent) => void;
  onMove: (docId: string) => void;
  onToggleStar: (docId: string, event: React.MouseEvent) => void;
}) => {
  const [activeActionMenu, setActiveActionMenu] = useState<null | {
    docId: string;
    buttonEl: HTMLButtonElement;
  }>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>(null);

  const handleContextMenu = (event: React.MouseEvent, docId: string) => {
    event.preventDefault();
    if (!selectedDocumentIds.has(docId)) {
      onDocumentSelect(docId, event);
    }
    setContextMenu({ x: event.clientX, y: event.clientY, documentId: docId });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  // Fungsi helper untuk format tanggal
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("id-ID");

  return (
    <>
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {documents.map((doc) => (
          <div
            key={doc.id}
            onContextMenu={(e) => handleContextMenu(e, doc.id)}
            onClick={(e) => onDocumentSelect(doc.id, e)}
            // ▼▼▼ PERUBAHAN 1: Tambahkan flexbox untuk layout yang lebih baik ▼▼▼
            className={`group relative rounded-lg border p-4 transition-all cursor-pointer flex flex-col h-full ${
              selectedDocumentIds.has(doc.id)
                ? "bg-green-50 border-green-500 dark:bg-green-900/50 dark:border-green-700 ring-2 ring-green-500"
                : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}>
            {/* --- Bagian Header Kartu (untuk Ikon) --- */}
            <div className="flex justify-between items-center mb-1">
              <button
                onClick={(e) => onToggleStar(doc.id, e)}
                // ▼▼▼ PERUBAHAN 2: Sesuaikan posisi dan ukuran ikon bintang ▼▼▼
                className="relative z-10 p-1 text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label="Toggle Star">
                <svg
                  className={`w-4 h-4 transition-all ${
                    doc.isStarred
                      ? "text-yellow-400 fill-current"
                      : "hover:text-yellow-400"
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </button>

              <button
                className="relative z-10 text-gray-500 hover:text-gray-900 dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"
                aria-label="Actions"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveActionMenu({
                    docId: doc.id,
                    buttonEl: e.currentTarget,
                  });
                }}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor">
                  <circle cx="5" cy="12" r="1.7" />
                  <circle cx="12" cy="12" r="1.7" />
                  <circle cx="19" cy="12" r="1.7" />
                </svg>
              </button>
            </div>

            {/* --- Bagian Konten Kartu --- */}
            <div className="flex-grow">
              {" "}
              {/* flex-grow agar konten mengisi ruang */}
              <div className="flex items-start">
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
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                    {doc.number}
                  </p>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white mt-1">
                    {doc.title}
                  </h4>
                </div>
              </div>
            </div>

            {/* --- Bagian Footer Kartu (untuk Tanggal) --- */}
            {/* ▼▼▼ PERUBAHAN 3: Tampilkan Created & Updated Date ▼▼▼ */}
            <div className="mt-auto pt-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Updated: {formatDate(doc.updatedDate)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Created: {formatDate(doc.createdDate)}
              </p>
            </div>

            {activeActionMenu?.docId === doc.id && (
              <ActionMenu
                documentId={doc.id}
                onClose={() => setActiveActionMenu(null)}
                buttonEl={activeActionMenu.buttonEl}
                onMove={onMove}
              />
            )}
          </div>
        ))}
      </div>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          documentId={contextMenu.documentId}
          onClose={handleCloseContextMenu}
          onMove={onMove}
        />
      )}
    </>
  );
};
