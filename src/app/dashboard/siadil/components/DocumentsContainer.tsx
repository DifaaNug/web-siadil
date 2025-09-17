import { useState, useEffect, useRef, ReactNode, ChangeEvent } from "react";
import ReactDOM from "react-dom";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import { FilterPopover } from "./FilterPopover";
import { ColumnTogglePopover } from "./ColumnTogglePopover";
import { Filters, Archive } from "../types";

type Column = {
  id: string;
  label: string;
};

type DocumentsContainerProps = {
  children: ReactNode;
  archives: Archive[];
  filters: Filters;
  onFilterChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onCheckboxChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onFilterReset: () => void;
  expireFilterMethod: "range" | "period";
  setExpireFilterMethod: (method: "range" | "period") => void;
  pagination: { totalRows: number; rowsPerPage: number; currentPage: number };
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (value: number) => void;
  allTableColumns: Column[];
  visibleColumns: Set<string>;
  onColumnToggle: (columnId: string) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;
  onExport: () => void;
  isExporting: boolean;
};

export const DocumentsContainer = ({
  children,
  archives,
  filters,
  onFilterChange,
  onCheckboxChange,
  onFilterReset,
  pagination,
  onPageChange,
  onRowsPerPageChange,
  expireFilterMethod,
  setExpireFilterMethod,
  allTableColumns,
  visibleColumns,
  onColumnToggle,
  sortOrder,
  setSortOrder,
  onExport,
  isExporting,
}: DocumentsContainerProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isColumnToggleOpen, setIsColumnToggleOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const filterPopoverRef = useRef<HTMLDivElement>(null);
  const columnTogglePopoverRef = useRef<HTMLDivElement>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const columnToggleButtonRef = useRef<HTMLButtonElement>(null);
  const [filterPopoverPosition, setFilterPopoverPosition] = useState({
    top: 0,
    left: 0,
  });
  const [columnTogglePopoverPosition, setColumnTogglePopoverPosition] =
    useState({ top: 0, left: 0 });

  // Sort menu state
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const sortMenuButtonRef = useRef<HTMLButtonElement>(null);
  const sortMenuPopoverRef = useRef<HTMLDivElement>(null);
  const [sortMenuPopoverPosition, setSortMenuPopoverPosition] = useState({
    top: 0,
    left: 0,
  });

  // 1. Tambahkan state & ref baru untuk Export Popover
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const exportMenuButtonRef = useRef<HTMLButtonElement>(null);
  const exportMenuPopoverRef = useRef<HTMLDivElement>(null);
  const [exportMenuPopoverPosition, setExportMenuPopoverPosition] = useState({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useOnClickOutside(
    filterPopoverRef,
    () => setIsFilterOpen(false),
    filterButtonRef
  );
  useOnClickOutside(
    columnTogglePopoverRef,
    () => setIsColumnToggleOpen(false),
    columnToggleButtonRef
  );
  useOnClickOutside(
    sortMenuPopoverRef,
    () => setIsSortMenuOpen(false),
    sortMenuButtonRef
  );

  useEffect(() => {
    if (isFilterOpen && filterButtonRef.current) {
      const calculatePosition = () => {
        if (!filterPopoverRef.current || !filterButtonRef.current) return;

        const buttonRect = filterButtonRef.current.getBoundingClientRect();
        const popoverHeight = filterPopoverRef.current.offsetHeight;
        const spaceBelow = window.innerHeight - buttonRect.bottom;
        const spaceAbove = buttonRect.top;
        const margin = 8;
        let top = 0;
        const left = buttonRect.left;

        if (spaceBelow > popoverHeight + margin) {
          top = buttonRect.bottom + margin;
        } else if (spaceAbove > popoverHeight + margin) {
          top = buttonRect.top - popoverHeight - margin;
        } else {
          top = buttonRect.bottom + margin;
        }

        if (top < margin) {
          top = margin;
        }
        if (top + popoverHeight > window.innerHeight - margin) {
          top = window.innerHeight - popoverHeight - margin;
        }
        setFilterPopoverPosition({ top, left });
      };

      const timer = setTimeout(calculatePosition, 0);

      window.addEventListener("resize", calculatePosition);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("resize", calculatePosition);
      };
    }
  }, [isFilterOpen]);

  useEffect(() => {
    if (isColumnToggleOpen && columnToggleButtonRef.current) {
      const calculatePosition = () => {
        if (!columnTogglePopoverRef.current || !columnToggleButtonRef.current)
          return;

        const buttonRect =
          columnToggleButtonRef.current.getBoundingClientRect();
        const popoverRect =
          columnTogglePopoverRef.current.getBoundingClientRect();
        const margin = 8;

        let top = buttonRect.bottom + margin;
        let left = buttonRect.right - popoverRect.width;

        if (top + popoverRect.height > window.innerHeight) {
          top = buttonRect.top - popoverRect.height - margin;
        }
        if (left < 0) {
          left = buttonRect.left;
        }

        setColumnTogglePopoverPosition({ top, left });
      };
      const timer = setTimeout(calculatePosition, 0);
      window.addEventListener("resize", calculatePosition);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("resize", calculatePosition);
      };
    }
  }, [isColumnToggleOpen]);

  useEffect(() => {
    if (isSortMenuOpen && sortMenuButtonRef.current) {
      const calculatePosition = () => {
        if (!sortMenuPopoverRef.current || !sortMenuButtonRef.current) return;
        const buttonRect = sortMenuButtonRef.current.getBoundingClientRect();
        const popoverRect = sortMenuPopoverRef.current.getBoundingClientRect();
        const margin = 8;
        let top = buttonRect.bottom + margin;
        const left = buttonRect.left;

        if (top + popoverRect.height > window.innerHeight) {
          top = buttonRect.top - popoverRect.height - margin;
        }
        setSortMenuPopoverPosition({ top, left });
      };
      const timer = setTimeout(calculatePosition, 0);
      window.addEventListener("resize", calculatePosition);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("resize", calculatePosition);
      };
    }
  }, [isSortMenuOpen]);

  useEffect(() => {
    if (isExportMenuOpen && exportMenuButtonRef.current) {
      const calculatePosition = () => {
        if (!exportMenuPopoverRef.current || !exportMenuButtonRef.current)
          return;
        const buttonRect = exportMenuButtonRef.current.getBoundingClientRect();
        const popoverRect =
          exportMenuPopoverRef.current.getBoundingClientRect();
        const margin = 8;
        let top = buttonRect.bottom + margin;
        const left = buttonRect.right - popoverRect.width;

        if (top + popoverRect.height > window.innerHeight) {
          top = buttonRect.top - popoverRect.height - margin;
        }
        setExportMenuPopoverPosition({ top, left });
      };
      const timer = setTimeout(calculatePosition, 0);
      window.addEventListener("resize", calculatePosition);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("resize", calculatePosition);
      };
    }
  }, [isExportMenuOpen]);

  // Handler untuk toggle popover
  const handleFilterToggle = () => setIsFilterOpen((v) => !v);
  const handleColumnToggle = () => setIsColumnToggleOpen((v) => !v);
  const handleSortMenuToggle = () => setIsSortMenuOpen((v) => !v);
  const handleExportMenuToggle = () => setIsExportMenuOpen((v) => !v);

  // 2. Tambahkan hook baru untuk menutup popover saat klik di luar
  useOnClickOutside(
    filterPopoverRef,
    () => setIsFilterOpen(false),
    filterButtonRef
  );
  useOnClickOutside(
    columnTogglePopoverRef,
    () => setIsColumnToggleOpen(false),
    columnToggleButtonRef
  );
  useOnClickOutside(
    sortMenuPopoverRef,
    () => setIsSortMenuOpen(false),
    sortMenuButtonRef
  );
  useOnClickOutside(
    exportMenuPopoverRef,
    () => setIsExportMenuOpen(false),
    exportMenuButtonRef
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <button
            ref={filterButtonRef}
            onClick={handleFilterToggle}
            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center space-x-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Filter</span>
          </button>
        </div>
        {isClient &&
          isFilterOpen &&
          ReactDOM.createPortal(
            <div
              style={{
                position: "fixed",
                top: `${filterPopoverPosition.top}px`,
                left: `${filterPopoverPosition.left}px`,
                zIndex: 50,
                visibility:
                  filterPopoverPosition.top === 0 ? "hidden" : "visible",
                display: "flex",
                maxHeight: "70vh",
                width: "448px",
              }}>
              <FilterPopover
                ref={filterPopoverRef}
                filters={filters}
                archives={archives}
                onFilterChange={onFilterChange}
                onCheckboxChange={onCheckboxChange}
                onReset={() => {
                  onFilterReset();
                  setIsFilterOpen(false);
                }}
                onApply={() => setIsFilterOpen(false)}
                expireFilterMethod={expireFilterMethod}
                setExpireFilterMethod={setExpireFilterMethod}
              />
            </div>,
            document.body
          )}
        {isClient &&
          isExportMenuOpen &&
          ReactDOM.createPortal(
            <div
              ref={exportMenuPopoverRef}
              style={{
                position: "fixed",
                top: `${exportMenuPopoverPosition.top}px`,
                left: `${exportMenuPopoverPosition.left}px`,
                zIndex: 50,
                visibility:
                  exportMenuPopoverPosition.top === 0 ? "hidden" : "visible",
              }}
              className="w-36 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
              <div className="p-2">
                <div className="px-2 py-1">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Export data to
                  </p>
                </div>
                <div className="border-t border-gray-100 dark:border-gray-700 my-1" />
                <button
                  onClick={() => {
                    onExport(); // Panggil fungsi ekspor
                    setIsExportMenuOpen(false); // Tutup popover
                  }}
                  disabled={isExporting}
                  className="w-full flex items-center px-2 py-1.5 text-sm rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isExporting ? (
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  )}
                  <span>{isExporting ? "Exporting..." : "Excel"}</span>
                </button>
              </div>
            </div>,
            document.body
          )}

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <button
              ref={sortMenuButtonRef}
              onClick={handleSortMenuToggle}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center space-x-2">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                />
              </svg>
              <span>Sort</span>
            </button>
            <button
              ref={exportMenuButtonRef}
              onClick={handleExportMenuToggle}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center space-x-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15M7 10L12 15L17 10M12 15V3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Export</span>
            </button>
            <button
              ref={columnToggleButtonRef}
              onClick={handleColumnToggle}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center space-x-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 12L5 10M5 10L3 8M5 10H11M13 12L15 10M15 10L13 8M15 10H21M7 20H17C18.1046 20 19 19.1046 19 18V6C19 4.89543 18.1046 4 17 4H7C5.89543 4 5 6V18C5 19.1046 5.89543 20 7 20Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>View</span>
            </button>
          </div>
          {isClient &&
            isColumnToggleOpen &&
            ReactDOM.createPortal(
              <div
                style={{
                  position: "fixed",
                  top: `${columnTogglePopoverPosition.top}px`,
                  left: `${columnTogglePopoverPosition.left}px`,
                  zIndex: 50,
                  visibility:
                    columnTogglePopoverPosition.top === 0
                      ? "hidden"
                      : "visible",
                }}>
                <ColumnTogglePopover
                  ref={columnTogglePopoverRef}
                  columns={allTableColumns}
                  visibleColumns={visibleColumns}
                  onColumnToggle={onColumnToggle}
                />
              </div>,
              document.body
            )}
          {/* PERBAIKAN TAMPILAN POPOVER SORT */}
          {isClient &&
            isSortMenuOpen &&
            ReactDOM.createPortal(
              <div
                ref={sortMenuPopoverRef}
                style={{
                  position: "fixed",
                  top: `${sortMenuPopoverPosition.top}px`,
                  left: `${sortMenuPopoverPosition.left}px`,
                  zIndex: 50,
                  visibility:
                    sortMenuPopoverPosition.top === 0 ? "hidden" : "visible",
                }}
                // Kelas Tailwind untuk styling konsisten
                className="w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg p-1">
                <button
                  onClick={() => {
                    setSortOrder("asc");
                    setIsSortMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-sm rounded-md flex items-center gap-2 ${
                    sortOrder === "asc"
                      ? "'font-semibold bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4h13M3 8h9m-9 4h6m4-4l4 4m0 0l4-4m-4 4v12"
                    />
                  </svg>
                  <span>Ascending</span>
                </button>

                <button
                  onClick={() => {
                    setSortOrder("desc");
                    setIsSortMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-sm rounded-md flex items-center gap-2 ${
                    sortOrder === "desc"
                      ? "'font-semibold bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4h13M3 8h9m-9 4h9m-9 4h13M17 20l4-4m0 0l-4-4m4 4H3"
                    />
                  </svg>
                  <span>Descending</span>
                </button>
              </div>,
              document.body
            )}
        </div>
      </div>
      <div className="overflow-x-auto">{children}</div>
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex items-center justify-between flex-wrap gap-2">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Showing{" "}
          {Math.min(
            pagination.rowsPerPage * pagination.currentPage,
            pagination.totalRows
          )}{" "}
          of {pagination.totalRows} row(s).
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Rows per page
          </span>
          <select
            value={pagination.rowsPerPage}
            onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Page {pagination.currentPage} of{" "}
            {Math.ceil(pagination.totalRows / pagination.rowsPerPage) > 0
              ? Math.ceil(pagination.totalRows / pagination.rowsPerPage)
              : 1}
          </span>
          <button
            onClick={() => onPageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="p-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={() => onPageChange(pagination.currentPage + 1)}
            disabled={
              pagination.currentPage ===
                Math.ceil(pagination.totalRows / pagination.rowsPerPage) ||
              pagination.totalRows === 0
            }
            className="p-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
