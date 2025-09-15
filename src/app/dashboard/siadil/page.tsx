"use client";

import {
  useState,
  useMemo,
  ChangeEvent,
  ReactNode,
  useRef,
  useEffect,
  forwardRef,
} from "react";
import ReactDOM from "react-dom";
import Breadcrumb from "@/components/Breadcrumb";

// Tipe data
type Contributor = { name: string; role: string };
type Archive = { id: string; name: string; code: string; parentId: string };
type Document = {
  id: string;
  number: string;
  title: string;
  description: string;
  documentDate: string;
  contributors: Contributor[];
  archive: string;
  expireDate: string;
  status: string;
  updatedBy: string;
  createdBy: string;
  createdDate: string;
  updatedDate: string;
  parentId: string;
};
type Filters = {
  keyword: string;
  archive: string;
  docDateStart: string;
  docDateEnd: string;
  expireDateStart: string;
  expireDateEnd: string;
  expireIn: string[];
};

type NewDocumentData = {
  number: string;
  title: string;
  description: string;
  documentDate: string;
  archive: string;
  expireDate: string;
  file: File | null;
};

// Data Dummy (tidak berubah)
const allArchives: Archive[] = [
  {
    id: "tik",
    name: "Teknologi, Informasi & Komunikasi",
    code: "TIK",
    parentId: "root",
  },
  { id: "legal", name: "Legal", code: "Legal", parentId: "root" },
  { id: "finance", name: "Finance", code: "Finance", parentId: "root" },
  { id: "hr", name: "Human Resources", code: "HR", parentId: "root" },
  { id: "audit", name: "Audit", code: "Audit", parentId: "root" },
  {
    id: "tik_laporan",
    name: "Laporan Bulanan",
    code: "TIK-Laporan",
    parentId: "tik",
  },
  {
    id: "tik_proyek",
    name: "Dokumen Proyek",
    code: "TIK-Proyek",
    parentId: "tik",
  },
];
const generateDummyData = (count: number): Document[] => {
  const generatedDocs: Document[] = [];
  const sampleTitles = [
    "Surat Keputusan",
    "Memorandum of Understanding",
    "Standard Operating Procedure",
    "Laporan Keuangan",
    "Laporan Audit Internal",
    "Kebijakan Keamanan",
    "Materi Training",
    "Kontrak Pengadaan",
  ];
  const sampleNames = [
    "Budi Santoso",
    "Siti Aisyah",
    "Rizki Pratama",
    "Dewi Lestari",
    "Agus Wijaya",
    "Rina Hartono",
  ];
  const sampleDepts = [
    "IT Department",
    "Legal Dept",
    "Finance Dept",
    "HR Department",
    "Internal Audit",
    "Management",
  ];

  for (let i = 1; i <= count; i++) {
    const parentFolder = allArchives[i % allArchives.length];
    const createdDate = new Date(2023, 0, 1 + i * 3);
    const updatedDate = new Date(
      createdDate.getTime() + 2 * 24 * 60 * 60 * 1000
    );
    const expireDate = new Date(
      updatedDate.getFullYear() + 2,
      updatedDate.getMonth(),
      updatedDate.getDate()
    );

    const doc: Document = {
      id: `DOC${String(i).padStart(3, "0")}`,
      parentId: parentFolder.id,
      number: `${parentFolder.code}/${String(i).padStart(
        3,
        "0"
      )}/${createdDate.getFullYear()}`,
      title: `${sampleTitles[i % sampleTitles.length]} #${i}`,
      description: `Deskripsi untuk dokumen nomor ${i}.`,
      documentDate: createdDate.toISOString().split("T")[0],
      contributors: [
        { name: sampleNames[i % sampleNames.length], role: "Penulis" },
      ],
      archive: parentFolder.code,
      expireDate: expireDate.toISOString().split("T")[0],
      status: Math.random() > 0.1 ? "Active" : "Expired",
      updatedBy: sampleDepts[i % sampleDepts.length],
      createdBy: sampleDepts[(i + 1) % sampleDepts.length],
      createdDate: createdDate.toISOString().split("T")[0],
      updatedDate: updatedDate.toISOString().split("T")[0],
    };
    generatedDocs.push(doc);
  }
  return generatedDocs;
};
const allDocuments: Document[] = generateDummyData(100);
const reminders = [
  {
    id: "ssl-1",
    title: "SSL",
    description: "ssl.kampus-kujang.co.id (Non GCP)",
    message: "This document is expired 2 months 1 days",
    type: "error" as const,
  },
];

function useOnClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  handler: (event: MouseEvent | TouchEvent) => void,
  buttonRef?: React.RefObject<HTMLElement | null>
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (
        !ref.current ||
        ref.current.contains(event.target as Node) ||
        (buttonRef?.current && buttonRef.current.contains(event.target as Node))
      ) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler, buttonRef]);
}
const ViewModeToggle = ({
  viewMode,
  setViewMode,
}: {
  viewMode: "list" | "grid";
  setViewMode: (mode: "list" | "grid") => void;
}) => {
  const CheckmarkIcon = () => (
    <svg
      className="w-4 h-4 mr-1 flex-shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );

  return (
    <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
      <button
        onClick={() => setViewMode("list")}
        className={`flex items-center justify-center px-3 py-1 text-sm rounded-md transition-colors ${
          viewMode === "list"
            ? "bg-white dark:bg-gray-900 shadow-sm text-gray-800 dark:text-white font-semibold"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
        }`}>
        {viewMode === "list" && <CheckmarkIcon />}
        <svg
          className="w-5 h-5 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 10h16M4 14h16M4 18h16"
          />
        </svg>
      </button>
      <button
        onClick={() => setViewMode("grid")}
        className={`flex items-center justify-center px-3 py-1 text-sm rounded-md transition-colors ${
          viewMode === "grid"
            ? "bg-white dark:bg-gray-900 shadow-sm text-gray-800 dark:text-white font-semibold"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
        }`}>
        {viewMode === "grid" && <CheckmarkIcon />}
        <svg
          className="w-5 h-5 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      </button>
    </div>
  );
};
const ArchiveCard = ({
  archive,
  docCount,
  onClick,
}: {
  archive: Archive;
  docCount: number;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 transition-all duration-200 ease-in-out hover:shadow-lg hover:-translate-y-1 cursor-pointer flex items-center min-h-[110px]">
    <div className="flex items-center space-x-4">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: "#01793B" }}>
        <svg
          className="w-5 h-5 text-white"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none">
          <path
            d="M3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V9C21 7.89543 20.1046 7 19 7H9L7 5H5C3.89543 5 3 5.89543 3 7Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
          {archive.name}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {docCount} items
        </p>
      </div>
    </div>
  </div>
);
const expireInOptions = [
  { id: "1w", label: "In 1 Week" },
  { id: "2w", label: "In 2 Weeks" },
  { id: "1m", label: "In 1 Month" },
  { id: "3m", label: "In 3 Months" },
  { id: "6m", label: "In 6 Months" },
  { id: "expired", label: "Already Expired" },
];
type FilterPopoverProps = {
  filters: Filters;
  archives: Archive[];
  onFilterChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onCheckboxChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  onApply: () => void;
  expireFilterMethod: "range" | "period";
  setExpireFilterMethod: (method: "range" | "period") => void;
};
// GANTI KOMPONEN FilterPopover LAMA DENGAN INI

// GANTI SELURUH KOMPONEN FilterPopover LAMA DENGAN INI

const FilterPopover = forwardRef<HTMLDivElement, FilterPopoverProps>(
  (
    {
      filters,
      archives,
      onFilterChange,
      onCheckboxChange,
      onReset,
      onApply,
      expireFilterMethod,
      setExpireFilterMethod,
    },
    ref
  ) => {
    const activeTabClass =
      "text-green-600 dark:text-green-400 border-b-2 border-green-600";
    const inactiveTabClass =
      "text-gray-500 dark:text-gray-400 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200";

    return (
      <div
        ref={ref}
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl w-full max-w-md flex flex-col"
        style={{ maxHeight: "85vh" }}>
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Filter Dokumen
          </h3>
        </div>
        <div className="flex-grow overflow-y-auto min-h-0">
          <div className="p-5 space-y-8">
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="keyword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Pencarian Utama
                </label>
                {/* PERBAIKAN: Menambahkan px-3 py-2 */}
                <input
                  type="text"
                  id="keyword"
                  name="keyword"
                  value={filters.keyword}
                  onChange={onFilterChange}
                  placeholder="Cari berdasarkan nomor, judul..."
                  className="w-full text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md focus:ring-green-500 focus:border-green-500 text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 px-3 py-2"
                />
              </div>
              <div className="relative">
                <label
                  htmlFor="archive-filter"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Arsip
                </label>
                {/* PERBAIKAN: Menambahkan px-3 py-2 */}
                <select
                  id="archive-filter"
                  name="archive"
                  value={filters.archive}
                  onChange={onFilterChange}
                  className="w-full text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md focus:ring-green-500 focus:border-green-500 text-gray-900 dark:text-gray-200 appearance-none pr-8 px-3 py-2">
                  <option value="All">Semua Arsip</option>
                  {archives.map((a) => (
                    <option key={a.code} value={a.code}>
                      {a.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 top-7 flex items-center px-2 text-gray-700 dark:text-gray-400">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Tanggal Dokumen
                </label>
                <div className="flex items-center gap-3">
                  {/* PERBAIKAN: Menambahkan px-3 py-2 */}
                  <input
                    type="date"
                    name="docDateStart"
                    value={filters.docDateStart}
                    onChange={onFilterChange}
                    className="w-full text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md focus:ring-green-500 focus:border-green-500 text-gray-900 dark:text-gray-200 px-3 py-2"
                  />
                  <span className="text-gray-500 text-sm">to</span>
                  {/* PERBAIKAN: Menambahkan px-3 py-2 */}
                  <input
                    type="date"
                    name="docDateEnd"
                    value={filters.docDateEnd}
                    onChange={onFilterChange}
                    className="w-full text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md focus:ring-green-500 focus:border-green-500 text-gray-900 dark:text-gray-200 px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tanggal Kedaluwarsa
                </label>
                <div className="flex border-b border-gray-200 dark:border-gray-700 mb-3">
                  <button
                    onClick={() => setExpireFilterMethod("range")}
                    className={`w-1/2 pb-2 text-sm font-semibold transition-colors ${
                      expireFilterMethod === "range"
                        ? activeTabClass
                        : inactiveTabClass
                    }`}>
                    By Date Range
                  </button>
                  <button
                    onClick={() => setExpireFilterMethod("period")}
                    className={`w-1/2 pb-2 text-sm font-semibold transition-colors ${
                      expireFilterMethod === "period"
                        ? activeTabClass
                        : inactiveTabClass
                    }`}>
                    By Period
                  </button>
                </div>
                <div>
                  {expireFilterMethod === "range" && (
                    <div className="flex items-center gap-3">
                      {/* PERBAIKAN: Menambahkan px-3 py-2 */}
                      <input
                        type="date"
                        name="expireDateStart"
                        value={filters.expireDateStart}
                        onChange={onFilterChange}
                        className="w-full text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md focus:ring-green-500 focus:border-green-500 text-gray-900 dark:text-gray-200 px-3 py-2"
                      />
                      <span className="text-gray-500 text-sm">to</span>
                      {/* PERBAIKAN: Menambahkan px-3 py-2 */}
                      <input
                        type="date"
                        name="expireDateEnd"
                        value={filters.expireDateEnd}
                        onChange={onFilterChange}
                        className="w-full text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md focus:ring-green-500 focus:border-green-500 text-gray-900 dark:text-gray-200 px-3 py-2"
                      />
                    </div>
                  )}
                  {expireFilterMethod === "period" && (
                    <div className="space-y-2.5">
                      {expireInOptions.map((option) => (
                        <label
                          key={option.id}
                          className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            name="expireIn"
                            value={option.id}
                            checked={filters.expireIn.includes(option.id)}
                            onChange={onCheckboxChange}
                            className="rounded text-green-600 focus:ring-green-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-end items-center space-x-3">
          <button
            onClick={onReset}
            className="px-4 py-2 text-sm font-semibold border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            Reset
          </button>
          <button
            onClick={onApply}
            className="px-4 py-2 text-sm font-semibold rounded-lg text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#01793B" }}>
            Apply Filters
          </button>
        </div>
      </div>
    );
  }
);
FilterPopover.displayName = "FilterPopover";

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
};
const DocumentsContainer = ({
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
}: DocumentsContainerProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useOnClickOutside(popoverRef, () => setIsFilterOpen(false), filterButtonRef);

  useEffect(() => {
    if (isFilterOpen && filterButtonRef.current) {
      const calculatePosition = () => {
        if (!popoverRef.current || !filterButtonRef.current) return;

        const buttonRect = filterButtonRef.current.getBoundingClientRect();
        const popoverHeight = popoverRef.current.offsetHeight;
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
        setPopoverPosition({ top, left });
      };

      const timer = setTimeout(calculatePosition, 0);

      window.addEventListener("resize", calculatePosition);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("resize", calculatePosition);
      };
    }
  }, [isFilterOpen]);

  const handleFilterToggle = () => setIsFilterOpen(!isFilterOpen);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center flex-wrap gap-2">
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
        {isClient &&
          isFilterOpen &&
          ReactDOM.createPortal(
            <div
              style={{
                position: "fixed",
                top: `${popoverPosition.top}px`,
                left: `${popoverPosition.left}px`,
                zIndex: 50,
                visibility: popoverPosition.top === 0 ? "hidden" : "visible",
                display: "flex",
                maxHeight: "85vh",
                width: "448px",
              }}>
              <FilterPopover
                ref={popoverRef}
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
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center space-x-2">
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
          <button className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center space-x-2">
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
const DocumentTable = ({ documents }: { documents: Document[] }) => {
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "numeric",
      year: "numeric",
    });

  return (
    <table className="w-full">
      <thead className="bg-gray-50 dark:bg-gray-700">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            ID
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Number & Title
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Description
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Document Date
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Contributors
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Archive
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Update & Create By
          </th>
          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        {documents.map((doc) => (
          <tr
            key={doc.id}
            className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              {doc.id}
            </td>
            <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
              <div className="font-medium">{doc.number}</div>
              <div className="text-gray-500 dark:text-gray-400">
                {doc.title}
              </div>
            </td>
            <td
              className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate"
              title={doc.description}>
              {doc.description}
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              {formatDate(doc.documentDate)}
            </td>
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
            <td className="px-4 py-4 whitespace-nowrap text-sm">
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                {doc.archive}
              </span>
            </td>
            <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
              <div>
                <div className="font-semibold">
                  Updated: {formatDate(doc.updatedDate)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  by {doc.updatedBy}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Created by: {doc.createdBy}
                </div>
              </div>
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button className="text-gray-500 hover:text-gray-900 dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600">
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
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
const DocumentGrid = ({ documents }: { documents: Document[] }) => (
  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
    {documents.map((doc) => (
      <div
        key={doc.id}
        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-center mb-3">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
            <svg
              className="w-4 h-4 text-blue-600 dark:text-blue-400"
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
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
            {doc.number}
          </p>
        </div>
        <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate mb-1">
          {doc.title}
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Updated: {new Date(doc.updatedDate).toLocaleDateString("id-ID")}
        </p>
      </div>
    ))}
  </div>
);
const FolderIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path
      d="M3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V9C21 7.89543 20.1046 7 19 7H9L7 5H5C3.89543 5 3 5.89543 3 7Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

// GANTI SELURUH KOMPONEN AddDocumentModal LAMA DENGAN INI

type AddDocumentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  newDocument: NewDocumentData;
  setNewDocument: (
    value: NewDocumentData | ((prevState: NewDocumentData) => NewDocumentData)
  ) => void;
  archives: Archive[];
};

const AddDocumentModal = ({
  isOpen,
  onClose,
  onSave,
  newDocument,
  setNewDocument,
  archives,
}: AddDocumentModalProps) => {
  if (!isOpen) return null;

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (e.target.type === "file") {
      const files = (e.target as HTMLInputElement).files;
      setNewDocument((prevDoc) => ({
        ...prevDoc,
        file: files ? files[0] : null,
      }));
    } else {
      setNewDocument((prevDoc) => ({ ...prevDoc, [name]: value }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-opacity duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl">
        <div className="flex items-start justify-between p-5 border-b border-gray-200 dark:border-gray-700 rounded-t-lg">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Add New Document
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Add new document here. Click save when youre done.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
            <div className="relative">
              <label
                htmlFor="archive"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Archive
              </label>
              {/* PERBAIKAN: Menambahkan px-3 py-2 */}
              <select
                name="archive"
                id="archive"
                value={newDocument.archive}
                onChange={handleInputChange}
                className="w-full text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md focus:ring-green-500 focus:border-green-500 text-gray-900 dark:text-gray-200 appearance-none pr-8 px-3 py-2">
                <option value="" disabled>
                  Select Archive
                </option>
                {archives.map((a) => (
                  <option key={a.id} value={a.code}>
                    {a.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 top-6 flex items-center px-2 text-gray-700 dark:text-gray-400">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>

            <div>
              <label
                htmlFor="number"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Number
              </label>
              {/* PERBAIKAN: Menambahkan px-3 py-2 */}
              <input
                type="text"
                name="number"
                id="number"
                value={newDocument.number}
                onChange={handleInputChange}
                placeholder="Enter Number"
                className="w-full text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md focus:ring-green-500 focus:border-green-500 text-gray-900 dark:text-gray-200 px-3 py-2"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Seperti nomor Memo/PR/PO/dsb.
              </p>
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              {/* PERBAIKAN: Menambahkan px-3 py-2 */}
              <input
                type="text"
                name="title"
                id="title"
                value={newDocument.title}
                onChange={handleInputChange}
                placeholder="Enter Title"
                className="w-full text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md focus:ring-green-500 focus:border-green-500 text-gray-900 dark:text-gray-200 px-3 py-2"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Judul dokumen
              </p>
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              {/* PERBAIKAN: Menambahkan px-3 py-2 */}
              <textarea
                name="description"
                id="description"
                rows={3}
                value={newDocument.description}
                onChange={handleInputChange}
                placeholder="Enter Description"
                className="w-full text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md focus:ring-green-500 focus:border-green-500 text-gray-900 dark:text-gray-200 px-3 py-2"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Deskripsikan dokumen secara singkat
              </p>
            </div>

            <div>
              <label
                htmlFor="documentDate"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Document Date
              </label>
              {/* PERBAIKAN: Menambahkan px-3 py-2 */}
              <input
                type="date"
                name="documentDate"
                id="documentDate"
                value={newDocument.documentDate}
                onChange={handleInputChange}
                className="w-full text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md focus:ring-green-500 focus:border-green-500 text-gray-900 dark:text-gray-200 px-3 py-2"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Tanggal dokumen
              </p>
            </div>

            <div>
              <label
                htmlFor="expireDate"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Document Expire Date
              </label>
              {/* PERBAIKAN: Menambahkan px-3 py-2 */}
              <input
                type="date"
                name="expireDate"
                id="expireDate"
                value={newDocument.expireDate}
                onChange={handleInputChange}
                className="w-full text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md focus:ring-green-500 focus:border-green-500 text-gray-900 dark:text-gray-200 px-3 py-2"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Tanggal akhir dokumen berlaku
              </p>
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="file"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                File
              </label>
              <input
                type="file"
                name="file"
                id="file"
                onChange={handleInputChange}
                className="w-full text-sm text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 rounded-b-lg space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 text-sm font-semibold rounded-lg text-white flex items-center gap-2"
            style={{ backgroundColor: "#01793B" }}>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V3"
              />
            </svg>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
export default function SiadilPage() {
  const [isSearchPopupOpen, setIsSearchPopupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [currentFolderId, setCurrentFolderId] = useState("root");
  const [expireFilterMethod, setExpireFilterMethod] = useState<
    "range" | "period"
  >("range");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDocument, setNewDocument] = useState<NewDocumentData>({
    number: "",
    title: "",
    description: "",
    documentDate: "",
    archive: "",
    expireDate: "",
    file: null,
  });

  const initialFilters: Filters = {
    keyword: "",
    archive: "All",
    docDateStart: "",
    docDateEnd: "",
    expireDateStart: "",
    expireDateEnd: "",
    expireIn: [],
  };
  const [filters, setFilters] = useState(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const breadcrumbItems = useMemo(() => {
    const path = [];
    let currentId = currentFolderId;

    while (currentId !== "root") {
      const folder = allArchives.find((a) => a.id === currentId);
      if (folder) {
        path.unshift({ label: folder.name, id: folder.id });
        currentId = folder.parentId;
      } else {
        break;
      }
    }

    path.unshift({ label: "Root", id: "root" });

    return path.map((item) => ({
      label: item.label,
      icon: <FolderIcon />,
      onClick: () => setCurrentFolderId(item.id),
    }));
  }, [currentFolderId]);

  const displayedArchives = useMemo(
    () => allArchives.filter((a) => a.parentId === currentFolderId),
    [currentFolderId]
  );
  const documentsInCurrentFolder = useMemo(() => {
    if (currentFolderId === "root") {
      return allDocuments;
    }
    return allDocuments.filter((d) => d.parentId === currentFolderId);
  }, [currentFolderId]);

  const handleFilterChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFilters((prev) => {
      const expireIn = prev.expireIn || [];
      if (checked) {
        return { ...prev, expireIn: [...expireIn, value] };
      } else {
        return { ...prev, expireIn: expireIn.filter((item) => item !== value) };
      }
    });
    setCurrentPage(1);
  };

  const filteredDocuments = useMemo(() => {
    return documentsInCurrentFolder.filter((doc) => {
      const keywordMatch =
        filters.keyword.toLowerCase() === "" ||
        doc.number.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        doc.title.toLowerCase().includes(filters.keyword.toLowerCase());
      const archiveMatch =
        filters.archive === "All" || doc.archive === filters.archive;
      const docDateStartMatch =
        filters.docDateStart === "" ||
        new Date(doc.documentDate) >= new Date(filters.docDateStart);
      const docDateEndMatch =
        filters.docDateEnd === "" ||
        new Date(doc.documentDate) <= new Date(filters.docDateEnd);
      const expireDateStartMatch =
        filters.expireDateStart === "" ||
        new Date(doc.expireDate) >= new Date(filters.expireDateStart);
      const expireDateEndMatch =
        filters.expireDateEnd === "" ||
        new Date(doc.expireDate) <= new Date(filters.expireDateEnd);
      const expireInMatch =
        filters.expireIn.length === 0 ||
        filters.expireIn.some((period) => {
          const now = new Date();
          const expireDate = new Date(doc.expireDate);
          if (period === "expired") return expireDate < now;
          const targetDate = new Date();
          if (period.endsWith("w")) {
            targetDate.setDate(now.getDate() + parseInt(period) * 7);
          } else if (period.endsWith("m")) {
            targetDate.setMonth(now.getMonth() + parseInt(period));
          }
          return expireDate >= now && expireDate <= targetDate;
        });
      return (
        keywordMatch &&
        archiveMatch &&
        docDateStartMatch &&
        docDateEndMatch &&
        expireDateStartMatch &&
        expireDateEndMatch &&
        expireInMatch
      );
    });
  }, [documentsInCurrentFolder, filters]);

  const paginatedDocuments = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredDocuments.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredDocuments, currentPage, rowsPerPage]);

  const archiveDocCounts = useMemo(() => {
    return allDocuments.reduce((acc, doc) => {
      const archiveCode = doc.archive;
      acc[archiveCode] = (acc[archiveCode] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, []);

  const handleSaveDocument = () => {
    console.log("Saving new document:", newDocument);
    // Di sini Anda akan menambahkan logika untuk mengirim data ke API/backend

    // Setelah berhasil, tutup modal dan reset form
    setIsAddModalOpen(false);
    setNewDocument({
      number: "",
      title: "",
      description: "",
      documentDate: "",
      archive: "",
      expireDate: "",
      file: null,
    });
  };

  return (
    <>
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              SIADIL
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Sistem Arsip Digital
            </p>
            <Breadcrumb items={breadcrumbItems} />
          </div>
          <div className="flex flex-col space-y-4 ml-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 w-[300px]">
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center mb-3">
                  <span className="text-lg font-bold text-white">DF</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center space-x-2 mb-1">
                    <svg
                      className="h-4 w-4 text-gray-900 dark:text-gray-400"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" />
                      <rect x="5" y="11" width="14" height="10" rx="2" />
                      <circle cx="12" cy="16" r="1" />
                      <path d="M8 11v-4a4 4 0 0 1 8 0v4" />
                    </svg>
                    <p className="font-semibold text-gray-900 dark:text-white text-base">
                      Personal
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    1990123
                  </p>
                </div>
              </div>
            </div>
            <div className="w-[300px]">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                Reminders
              </h3>
              <div className="space-y-2">
                {reminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className="bg-red-700 text-white rounded-lg p-3 w-full">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <div className="w-5 h-5 bg-red-800 rounded-full flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-xs mb-1 text-white">
                          {reminder.title}
                        </p>
                        <p className="text-xs text-white leading-relaxed opacity-90">
                          {reminder.description}
                        </p>
                        <p className="text-xs text-white leading-relaxed opacity-90 mt-1">
                          {reminder.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Archives
          </h2>
          <button
            className="text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center space-x-1.5 transition-colors hover:opacity-90"
            style={{ backgroundColor: "#01793B" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 5V19M5 12H19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span>Create new archive</span>
          </button>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6">
          {displayedArchives.length === 0 && currentFolderId !== "root" && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                Folder arsip ini kosong.
              </p>
            </div>
          )}
          {displayedArchives.map((archive) => (
            <ArchiveCard
              key={archive.id}
              archive={archive}
              docCount={archiveDocCounts[archive.code] || 0}
              onClick={() => setCurrentFolderId(archive.id)}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Dokumen
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSearchPopupOpen(true)}
              className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left flex items-center gap-2">
              <svg
                className="text-gray-400 w-4 h-4"
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
              <span>Search Document</span>
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center space-x-1.5 transition-colors hover:opacity-90"
              style={{ backgroundColor: "#01793B" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 5V19M5 12H19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span>Add New</span>
            </button>
            <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
          </div>
        </div>
        <DocumentsContainer
          archives={allArchives}
          filters={filters}
          onFilterChange={handleFilterChange}
          onCheckboxChange={handleCheckboxChange}
          onFilterReset={() => {
            setFilters(initialFilters);
            setExpireFilterMethod("range");
          }}
          expireFilterMethod={expireFilterMethod}
          setExpireFilterMethod={setExpireFilterMethod}
          pagination={{
            totalRows: filteredDocuments.length,
            rowsPerPage: rowsPerPage,
            currentPage: currentPage,
          }}
          onPageChange={(page: number) => setCurrentPage(page)}
          onRowsPerPageChange={(value: number) => {
            setRowsPerPage(value);
            setCurrentPage(1);
          }}>
          {viewMode === "list" ? (
            <DocumentTable documents={paginatedDocuments} />
          ) : (
            <DocumentGrid documents={paginatedDocuments} />
          )}
        </DocumentsContainer>
      </div>

      {isSearchPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Search Documents
              </h3>
              <button
                onClick={() => setIsSearchPopupOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6">
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
                  className="w-full pl-10 pr-4 py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
              {searchQuery ? (
                <div className="p-4">
                  {allDocuments
                    .filter(
                      (doc) =>
                        doc.title
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()) ||
                        doc.description
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()) ||
                        doc.number
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                    )
                    .map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-start space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                        onClick={() => {
                          setIsSearchPopupOpen(false);
                          setSearchQuery("");
                        }}>
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-blue-600 dark:text-blue-400"
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
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {doc.number}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300 truncate">
                            {doc.title}
                          </div>
                        </div>
                      </div>
                    ))}
                  {allDocuments.filter(
                    (doc) =>
                      doc.title
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      doc.description
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      doc.number
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                  ).length === 0 && (
                    <div className="text-center py-8">
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        No documents found
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Start typing to search for documents
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <AddDocumentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveDocument}
        newDocument={newDocument}
        setNewDocument={setNewDocument}
        archives={allArchives}
      />
    </>
  );
}
