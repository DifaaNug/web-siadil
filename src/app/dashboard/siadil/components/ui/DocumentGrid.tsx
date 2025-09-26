import { useState } from "react";
import { Document, Archive } from "../../types";
import { ActionMenu } from "./ActionMenu";
import { ContextMenu } from "./ContextMenu";

type ContextMenuState = { x: number; y: number; documentId: string } | null;

type DocumentGridProps = {
  documents: Document[];
  archives: Archive[];
  selectedDocumentIds: Set<string>;
  onDocumentSelect: (id: string, event?: React.MouseEvent) => void;
  onMove: (docId: string) => void;
  onToggleStar: (docId: string, event: React.MouseEvent) => void;
  onEdit: (docId: string) => void;
  onDelete: (docId: string) => void;
  onManageContributors: (docId: string) => void;
};

export const DocumentGrid = ({
  documents,
  archives,
  selectedDocumentIds,
  onDocumentSelect,
  onMove,
  onToggleStar,
  onEdit,
  onDelete,
  onManageContributors,
}: DocumentGridProps) => {
  const [activeActionMenu, setActiveActionMenu] = useState<null | {
    docId: string;
    buttonEl: HTMLButtonElement;
  }>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>(null);

  const handleContextMenu = (event: React.MouseEvent, docId: string) => {
    event.stopPropagation();
    event.preventDefault();
    if (!selectedDocumentIds.has(docId)) {
      onDocumentSelect(docId, event);
    }
    setContextMenu({ x: event.clientX, y: event.clientY, documentId: docId });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("id-ID");

  const getParentArchiveName = (parentId: string) => {
    const parent = archives.find((a) => a.id === parentId);
    return parent ? parent.name : "Root";
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {documents.map((doc) => (
          <div
            key={doc.id}
            id={`doc-grid-${doc.id}`}
            onContextMenu={(e) => handleContextMenu(e, doc.id)}
            onClick={(e) => onDocumentSelect(doc.id, e)}
            className={`group relative flex flex-col cursor-pointer overflow-hidden rounded-xl border bg-white p-4 transition-all duration-300 dark:bg-gray-800 ${
              selectedDocumentIds.has(doc.id)
                ? "border-green-500 ring-2 ring-green-500/50 dark:border-green-700"
                : "border-gray-200 hover:shadow-lg hover:border-green-500 dark:border-gray-700 dark:hover:border-green-500"
            }`}>
            {/* Bagian Atas: Ikon Dokumen dan Tombol Aksi */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
                <svg
                  className="h-6 w-6 text-gray-500 dark:text-gray-400"
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
              <div className="flex items-center -mr-2">
                <button
                  onClick={(e) => onToggleStar(doc.id, e)}
                  className="relative z-10 p-2 text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Toggle Star">
                  <svg
                    className={`w-4 h-4 transition-all ${
                      doc.isStarred
                        ? "text-yellow-400 fill-current"
                        : "hover:text-yellow-400"
                    }`}
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
                  className="relative z-10 text-gray-400 hover:text-gray-700 dark:hover:text-white p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Actions"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveActionMenu({
                      docId: doc.id,
                      buttonEl: e.currentTarget,
                    });
                  }}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor">
                    <circle cx="5" cy="12" r="2" />{" "}
                    <circle cx="12" cy="12" r="2" />{" "}
                    <circle cx="19" cy="12" r="2" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Bagian Konten Utama */}
            <div className="flex-grow">
              <h4
                className="font-bold text-gray-800 dark:text-white leading-tight"
                title={doc.title}>
                {doc.title}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                in {getParentArchiveName(doc.parentId)}
              </p>
            </div>

            {/* Bagian Footer Kartu */}
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex justify-between">
                <span>{doc.number}</span>
                <span>{formatDate(doc.updatedDate)}</span>
              </div>
            </div>

            {activeActionMenu?.docId === doc.id && (
              <ActionMenu
                documentId={doc.id}
                onClose={() => setActiveActionMenu(null)}
                buttonEl={activeActionMenu.buttonEl}
                onMove={onMove}
                onEdit={onEdit}
                onDelete={onDelete}
                onManageContributors={onManageContributors}
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
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </>
  );
};
