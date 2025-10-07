import { useState } from "react";
import { Document } from "../../types";
import { ActionMenu } from "./ActionMenu";
import { HeaderSortMenu } from "./HeaderSortMenu";
// Right-click context menu removed per request

// Context menu state removed

// Tooltip component for long text
const Tooltip = ({
  text,
  children,
}: {
  text: string;
  children: React.ReactNode;
}) => {
  const [show, setShow] = useState(false);

  return (
    <div
      className="relative inline-block w-full"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className="absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 dark:bg-gray-700 rounded-lg shadow-lg bottom-full left-1/2 transform -translate-x-1/2 mb-2 min-w-[200px] max-w-[400px]">
          {text}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
            <div className="border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
          </div>
        </div>
      )}
    </div>
  );
};

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
            strokeWidth={2}
          >
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
          strokeWidth={2}
        >
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
        stroke="currentColor"
      >
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
      className={`px-4 py-3 text-${align} sticky top-0 z-10 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700 border-r border-gray-200 dark:border-gray-600 last:border-r-0`}
    >
      <button
        onClick={(e) =>
          setActiveHeaderMenu({ columnId, buttonEl: e.currentTarget })
        }
        className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 tracking-wider hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
      >
        {label}
        <SortIndicator columnId={columnId} />
      </button>
    </th>
  );

  return (
    <>
      <div className="overflow-hidden border-green-200 dark:border-green-700">
        <table className="w-full border-collapse">
          <thead className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700 border-gray-200 dark:border-gray-600 sticky top-0 z-10 shadow-sm">
            <tr>
              {visibleColumns.has("actions") && (
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 tracking-wider sticky top-0 z-10 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700 border-r border-gray-200 dark:border-gray-600">
                  Actions
                </th>
              )}
              <SortableHeader columnId="id" label="ID" />
              {visibleColumns.has("numberAndTitle") && (
                <SortableHeader columnId="number" label="Number & Title" />
              )}
              {visibleColumns.has("description") && (
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 tracking-wider sticky top-0 z-10 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700 border-r border-gray-200 dark:border-gray-600">
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
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 tracking-wider sticky top-0 z-10 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700 border-r border-gray-200 dark:border-gray-600">
                  Contributors
                </th>
              )}
              {visibleColumns.has("archive") && (
                <SortableHeader columnId="archive" label="Archive" />
              )}
              {visibleColumns.has("updatedAndCreatedBy") && (
                <SortableHeader columnId="updatedDate" label="Updated" />
              )}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
            {documents.map((doc) => (
              <tr
                key={doc.id}
                id={`doc-table-${doc.id}`}
                // right-click context menu disabled
                onClick={(e) => onDocumentSelect(doc.id, e)}
                className={`transition-all duration-200 cursor-pointer border-gray-100 dark:border-gray-700 ${
                  selectedDocumentIds.has(doc.id)
                    ? "bg-teal-50 dark:bg-teal-900/30 shadow-sm"
                    : "hover:bg-gray-50/50 dark:hover:bg-gray-700/50"
                }`}
              >
                {visibleColumns.has("actions") && (
                  <td
                    onClick={(e) => e.stopPropagation()}
                    className="px-4 py-4 whitespace-nowrap pl-7 text-sm font-medium relative border-r border-gray-200 dark:border-gray-600"
                  >
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
                          ? "text-[#0F9D58] dark:text-green-400 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/40 dark:to-green-800/40 shadow-md ring-1 ring-green-200 dark:ring-green-700"
                          : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-700/50 dark:hover:to-gray-600/50 hover:shadow-sm"
                      }`}
                    >
                      {/* Background glow effect */}
                      <div
                        className={`absolute inset-0 rounded-lg transition-opacity duration-300 ${
                          activeActionMenu?.docId === doc.id
                            ? "bg-green-200/30 opacity-100"
                            : "bg-gray-200/20 opacity-0 group-hover:opacity-100"
                        } blur-sm -z-10`}
                      ></div>

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
                        }
                      >
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
                <td className="px-4 py-4 whitespace-nowrap text-sm border-r border-gray-100 dark:border-gray-700">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white text-xs font-semibold shadow-sm">
                    {doc.id}
                  </span>
                </td>
                {visibleColumns.has("numberAndTitle") && (
                  <td className="px-4 py-4 text-sm border-r border-gray-100 dark:border-gray-700">
                    <div className="font-semibold text-gray-900 dark:text-white mb-1">
                      {doc.number}
                    </div>
                    <Tooltip text={doc.title}>
                      <div className="text-gray-600 dark:text-gray-400 line-clamp-2 leading-snug">
                        {doc.title}
                      </div>
                    </Tooltip>
                  </td>
                )}
                {visibleColumns.has("description") && (
                  <td className="px-4 py-4 text-sm max-w-xs border-r border-gray-100 dark:border-gray-700">
                    <Tooltip text={doc.description}>
                      <div className="text-gray-600 dark:text-gray-400 line-clamp-2 leading-snug">
                        {doc.description}
                      </div>
                    </Tooltip>
                  </td>
                )}
                {visibleColumns.has("documentDate") && (
                  <td className="px-4 py-4 whitespace-nowrap text-sm border-r border-gray-100 dark:border-gray-700 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-semibold shadow-sm">
                      {formatDate(doc.documentDate)}
                    </span>
                  </td>
                )}
                {visibleColumns.has("contributors") && (
                  <td className="px-4 py-4 text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                    <div className="flex -space-x-2">
                      {doc.contributors.slice(0, 3).map((c, i) => (
                        <div
                          key={i}
                          title={c.name}
                          className="w-7 h-7 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300 ring-2 ring-white dark:ring-gray-800"
                        >
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
                  <td className="px-4 py-4 whitespace-nowrap text-sm border-r border-gray-100 dark:border-gray-700">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                      {doc.archive}
                    </span>
                  </td>
                )}
                {visibleColumns.has("updatedAndCreatedBy") && (
                  <td className="px-4 py-4 text-sm">
                    <div className="space-y-1">
                      <div className="text-gray-900 dark:text-white font-medium">
                        Updated: {formatDate(doc.updatedDate)}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400 text-xs">
                        by {doc.updatedBy}
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
