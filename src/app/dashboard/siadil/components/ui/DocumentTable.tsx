import { useState } from "react";
import { Document } from "../../types";
import { ActionMenu } from "./ActionMenu";
import { HeaderSortMenu } from "./HeaderSortMenu";
// Right-click context menu removed per request

// Context menu state removed

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
  onEdit: (docId: string) => void;
  onDelete: (docId: string) => void;
  onManageContributors: (docId: string) => void;
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
  onEdit,
  onDelete,
  onManageContributors,
}: DocumentTableProps) => {
  const [activeActionMenu, setActiveActionMenu] =
    useState<ActiveMenuState>(null);
  const [activeHeaderMenu, setActiveHeaderMenu] =
    useState<ActiveHeaderMenuState>(null);
  // Removed custom context menu logic

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
            className="w-4 h-4 text-green-700 dark:text-green-200"
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
          className="w-4 h-4 text-green-700 dark:text-green-200"
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
        className="w-4 h-4 text-green-400 dark:text-green-300"
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
    align?: "left" | "center" | "right";
  }) => (
    <th
      className={`px-4 py-3 text-${align} sticky top-0 z-10 bg-green-50 dark:bg-green-900 border-r border-green-200 dark:border-green-700 last:border-r-0`}>
      <button
        onClick={(e) =>
          setActiveHeaderMenu({ columnId, buttonEl: e.currentTarget })
        }
        className="flex items-center gap-2 text-sm font-bold text-green-800 dark:text-green-100 tracking-wider hover:text-green-900 dark:hover:text-white transition-colors">
        {label}
        <SortIndicator columnId={columnId} />
      </button>
    </th>
  );

  return (
    <>
      <div className="overflow-hidden border-green-200 dark:border-green-700">
        <table className="w-full border-collapse">
          <thead className="bg-green-50 dark:bg-green-900 border-green-300 dark:border-green-600 sticky top-0 z-10 shadow-sm">
            <tr>
              {visibleColumns.has("actions") && (
                <th className="px-4 py-3 text-left text-sm font-medium text-green-800 dark:text-green-100 tracking-wider sticky top-0 z-10 bg-green-50 dark:bg-green-900 border-r border-green-200 dark:border-green-700">
                  Actions
                </th>
              )}
              <SortableHeader columnId="id" label="ID" />
              {visibleColumns.has("numberAndTitle") && (
                <SortableHeader columnId="number" label="Number & Title" />
              )}
              {visibleColumns.has("description") && (
                <th className="px-4 py-3 text-left text-sm font-medium text-green-800 dark:text-green-100 tracking-wider sticky top-0 z-10 bg-green-50 dark:bg-green-900 border-r border-green-200 dark:border-green-700">
                  Description
                </th>
              )}
              {visibleColumns.has("documentDate") && (
                <SortableHeader
                  columnId="documentDate"
                  label="Document Date"
                  align="center"
                />
              )}
              {visibleColumns.has("contributors") && (
                <th className="px-4 py-3 text-left text-sm font-medium text-green-800 dark:text-green-100 tracking-wider sticky top-0 z-10 bg-green-50 dark:bg-green-900 border-r border-green-200 dark:border-green-700">
                  Contributors
                </th>
              )}
              {visibleColumns.has("archive") && (
                <SortableHeader columnId="archive" label="Archive" />
              )}
              {visibleColumns.has("updatedAndCreatedBy") && (
                <SortableHeader
                  columnId="updatedDate"
                  label="Update & Create by"
                />
              )}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
            {documents.map((doc) => (
              <tr
                key={doc.id}
                id={`doc-table-${doc.id}`}
                // right-click context menu disabled
                onClick={(e) => onDocumentSelect(doc.id, e)}
                className={`transition-colors cursor-pointer  border-gray-200 dark:border-gray-600 ${
                  selectedDocumentIds.has(doc.id)
                    ? "bg-green-50 dark:bg-green-900/50"
                    : "hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}>
                {visibleColumns.has("actions") && (
                  <td
                    onClick={(e) => e.stopPropagation()}
                    className="px-4 py-4 whitespace-nowrap pl-7 text-sm font-medium relative border-r border-gray-200 dark:border-gray-600">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleMenuToggle(doc.id, e.currentTarget);
                      }}
                      className={`group relative transition-all duration-300 p-2 rounded-lg transform hover:scale-105 active:scale-95 ${
                        activeActionMenu?.docId === doc.id
                          ? "text-green-600 dark:text-green-400 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/40 dark:to-green-800/40 shadow-md ring-1 ring-green-200 dark:ring-green-700"
                          : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-700/50 dark:hover:to-gray-600/50 hover:shadow-sm"
                      }`}>
                      {/* Background glow effect */}
                      <div
                        className={`absolute inset-0 rounded-lg transition-opacity duration-300 ${
                          activeActionMenu?.docId === doc.id
                            ? "bg-green-200/30 opacity-100"
                            : "bg-gray-200/20 opacity-0 group-hover:opacity-100"
                        } blur-sm -z-10`}></div>

                      <svg
                        className={`w-5 h-5 transition-all duration-300 ${
                          activeActionMenu?.docId === doc.id
                            ? "rotate-90 scale-110"
                            : "group-active:rotate-90"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={
                          activeActionMenu?.docId === doc.id ? 2.5 : 2
                        }>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                      </svg>

                      {/* Ripple effect on click */}
                      <div className="absolute inset-0 rounded-lg bg-green-300/40 opacity-0 group-active:opacity-60 group-active:animate-ping pointer-events-none"></div>
                    </button>
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
                  </td>
                )}
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                  {doc.id}
                </td>
                {visibleColumns.has("numberAndTitle") && (
                  <td className="px-4 py-4 text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                    <div className="font-medium">{doc.number}</div>
                    <div className="text-gray-500 dark:text-gray-400">
                      {doc.title}
                    </div>
                  </td>
                )}
                {visibleColumns.has("description") && (
                  <td
                    className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs border-r border-gray-200 dark:border-gray-600"
                    title={doc.description}>
                    {doc.description}
                  </td>
                )}
                {visibleColumns.has("documentDate") && (
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 text-center">
                    {formatDate(doc.documentDate)}
                  </td>
                )}
                {visibleColumns.has("contributors") && (
                  <td className="px-4 py-4 text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
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
                  <td className="px-4 py-4 whitespace-nowrap text-sm border-r border-gray-200 dark:border-gray-600">
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
      {/* Context menu removed */}
    </>
  );
};
