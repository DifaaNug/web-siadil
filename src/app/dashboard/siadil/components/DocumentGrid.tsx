// src/app/dashboard/siadil/components/DocumentGrid.tsx
import { useState } from "react";
import { Document } from "../types";
import { ActionMenu } from "./ActionMenu";
import { ContextMenu } from "./ContextMenu";

type ContextMenuState = {
  x: number;
  y: number;
  documentId: string;
} | null;

export const DocumentGrid = ({
  documents,
  selectedDocumentId,
  onDocumentSelect,
}: {
  documents: Document[];
  selectedDocumentId: string | null;
  onDocumentSelect: (id: string) => void;
}) => {
  const [activeActionMenu, setActiveActionMenu] = useState<null | {
    docId: string;
    buttonEl: HTMLButtonElement;
  }>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>(null);

  const handleContextMenu = (event: React.MouseEvent, docId: string) => {
    event.preventDefault();
    onDocumentSelect(docId); // Pilih dokumen saat klik kanan
    setContextMenu({ x: event.clientX, y: event.clientY, documentId: docId });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  return (
    <>
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {documents.map((doc) => (
          <div
            key={doc.id}
            onContextMenu={(e) => handleContextMenu(e, doc.id)}
            onClick={() => onDocumentSelect(doc.id)}
            className={`group relative rounded-lg border p-4 transition-all cursor-pointer ${
              selectedDocumentId === doc.id
                ? "bg-green-50 border-green-500 dark:bg-green-900/50 dark:border-green-700"
                : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}>
            <button
              className="absolute top-2 right-2 z-10 text-gray-500 hover:text-gray-900 dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"
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
            <div className="flex items-start mb-3">
              <div className="flex-shrink-0">
                <svg
                  className="w-8 h-8 text-gray-400 dark:text-gray-500 transition-colors group-hover:text-brand"
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
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Updated: {new Date(doc.updatedDate).toLocaleDateString("id-ID")}
            </p>
            {activeActionMenu?.docId === doc.id && (
              <ActionMenu
                documentId={doc.id}
                onClose={() => setActiveActionMenu(null)}
                buttonEl={activeActionMenu.buttonEl}
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
        />
      )}
    </>
  );
};
