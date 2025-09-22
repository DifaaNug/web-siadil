// difaanug/web-siadil/web-siadil-9d382b671ccebb6b16f9f0993135c2cbb491120b/src/app/dashboard/siadil/components/DocumentTable.tsx

import { useState } from "react";
import { Document } from "../types";
import { ActionMenu } from "./ActionMenu";
import { HeaderSortMenu } from "./HeaderSortMenu";
import { ContextMenu } from "./ContextMenu";

type ContextMenuState = {
  x: number;
  y: number;
  documentId: string;
} | null;

type ActiveMenuState = { docId: string; buttonEl: HTMLButtonElement } | null;
type ActiveHeaderMenuState = {
  columnId: keyof Document;
  buttonEl: HTMLButtonElement;
} | null;

type DocumentTableProps = {
  documents: Document[];
  visibleColumns: Set<string>;
  onSortChange: (column: keyof Document, order: "asc" | "desc") => void;
  onColumnToggle: (columnId: string) => void;
  sortColumn: keyof Document | null;
  sortOrder: "asc" | "desc" | null;
  selectedDocumentIds: Set<string>;
  onDocumentSelect: (id: string, event?: React.MouseEvent) => void;
  onMove: (docId: string) => void;
};

export const DocumentTable = ({
  documents,
  visibleColumns,
  onSortChange,
  onColumnToggle,
  sortColumn,
  sortOrder,
  selectedDocumentIds,
  onDocumentSelect,
  onMove,
}: DocumentTableProps) => {
  const [activeActionMenu, setActiveActionMenu] =
    useState<ActiveMenuState>(null);
  const [activeHeaderMenu, setActiveHeaderMenu] =
    useState<ActiveHeaderMenuState>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>(null);

  const handleContextMenu = (event: React.MouseEvent, docId: string) => {
    event.preventDefault();
    onDocumentSelect(docId);
    setContextMenu({ x: event.clientX, y: event.clientY, documentId: docId });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleMenuToggle = (docId: string, buttonEl: HTMLButtonElement) => {
    setActiveActionMenu((prev) =>
      prev?.docId === docId ? null : { docId, buttonEl }
    );
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "numeric",
      year: "numeric",
    });

  const SortIndicator = ({ columnId }: { columnId: keyof Document }) => {
    if (sortColumn === columnId) {
      if (sortOrder === "asc") {
        return (
          <svg
            className="w-4 h-4 text-gray-900 dark:text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 15l7-7 7 7"
            />
          </svg>
        );
      }
      return (
        <svg
          className="w-4 h-4 text-gray-900 dark:text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      );
    }
    return (
      <svg
        className="w-4 h-4 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 9l4-4 4 4m0 6l-4 4-4-4"
        />
      </svg>
    );
  };

  const SortableHeader = ({
    columnId,
    label,
    align = "left",
  }: {
    columnId: keyof Document;
    label: string;
    align?: "left" | "right";
  }) => (
    <th className={`px-4 py-3 text-${align}`}>
      <button
        onClick={(e) =>
          setActiveHeaderMenu({ columnId, buttonEl: e.currentTarget })
        }
        className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-800 dark:hover:text-white transition-colors">
        {label}
        <SortIndicator columnId={columnId} />
      </button>
    </th>
  );

  return (
    <>
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <SortableHeader columnId="id" label="ID" />
            {visibleColumns.has("numberAndTitle") && (
              <SortableHeader columnId="number" label="Number & Title" />
            )}
            {visibleColumns.has("description") && (
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Description
              </th>
            )}
            {visibleColumns.has("documentDate") && (
              <SortableHeader columnId="documentDate" label="Document Date" />
            )}
            {visibleColumns.has("contributors") && (
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Contributors
              </th>
            )}
            {visibleColumns.has("archive") && (
              <SortableHeader columnId="archive" label="Archive" />
            )}
            {visibleColumns.has("updatedAndCreatedBy") && (
              <SortableHeader
                columnId="updatedDate"
                label="Update & Create By"
              />
            )}
            {visibleColumns.has("actions") && (
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {documents.map((doc) => (
            <tr
              key={doc.id}
              id={`doc-table-${doc.id}`} // <-- PERBAIKAN: Tambahkan ID unik di sini
              onContextMenu={(e) => handleContextMenu(e, doc.id)}
              onClick={(e) => onDocumentSelect(doc.id, e)}
              className={`transition-colors cursor-pointer ${
                selectedDocumentIds.has(doc.id)
                  ? "bg-green-50 dark:bg-green-900/50"
                  : "hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {doc.id}
              </td>
              {visibleColumns.has("numberAndTitle") && (
                <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                  <div className="font-medium">{doc.number}</div>
                  <div className="text-gray-500 dark:text-gray-400">
                    {doc.title}
                  </div>
                </td>
              )}
              {visibleColumns.has("description") && (
                <td
                  className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs "
                  title={doc.description}>
                  {doc.description}
                </td>
              )}
              {visibleColumns.has("documentDate") && (
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {formatDate(doc.documentDate)}
                </td>
              )}
              {visibleColumns.has("contributors") && (
                <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                  <div className="flex -space-x-2">
                    {doc.contributors.slice(0, 3).map((c, i) => (
                      <div
                        key={i}
                        title={c.name}
                        className="w-7 h-7 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300 ring-2 ring-white dark:ring-gray-800">
                        {c.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                    ))}
                    {doc.contributors.length > 3 && (
                      <div className="w-7 h-7 bg-gray-300 dark:bg-gray-500 rounded-full flex items-center justify-center text-xs font-medium text-gray-700 dark:text-gray-200 ring-2 ring-white dark:ring-gray-800">
                        +{doc.contributors.length - 3}
                      </div>
                    )}
                  </div>
                </td>
              )}
              {visibleColumns.has("archive") && (
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    {doc.archive}
                  </span>
                </td>
              )}
              {visibleColumns.has("updatedAndCreatedBy") && (
                <td className="px-4 py-4 text-sm">
                  <div>
                    <div className="text-gray-900 dark:text-white">
                      Updated: {formatDate(doc.updatedDate)}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">
                      by {doc.updatedBy}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 mt-1">
                      Created by: {doc.createdBy}
                    </div>
                  </div>
                </td>
              )}
              {visibleColumns.has("actions") && (
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuToggle(doc.id, e.currentTarget);
                    }}
                    className="text-gray-500 hover:text-gray-900 dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                  </button>
                  {activeActionMenu?.docId === doc.id && (
                    <ActionMenu
                      documentId={doc.id}
                      onClose={() => setActiveActionMenu(null)}
                      buttonEl={activeActionMenu.buttonEl}
                      onMove={onMove}
                    />
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {activeHeaderMenu && (
        <HeaderSortMenu
          buttonEl={activeHeaderMenu.buttonEl}
          onClose={() => setActiveHeaderMenu(null)}
          onSortAsc={() => {
            onSortChange(activeHeaderMenu.columnId, "asc");
            setActiveHeaderMenu(null);
          }}
          onSortDesc={() => {
            onSortChange(activeHeaderMenu.columnId, "desc");
            setActiveHeaderMenu(null);
          }}
          onHide={() => {
            onColumnToggle(activeHeaderMenu.columnId);
            setActiveHeaderMenu(null);
          }}
        />
      )}
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
