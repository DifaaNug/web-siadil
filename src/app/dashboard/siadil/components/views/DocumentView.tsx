// src/app/dashboard/siadil/components/views/DocumentView.tsx

import React from "react";
import {
  Document,
  Archive,
  Filters,
  Pagination,
  TableColumn,
} from "../../types";
import { DocumentsContainer } from "../container/DocumentsContainer";
import { DocumentTable } from "../ui/DocumentTable";
import { DocumentGrid } from "../ui/DocumentGrid";
import ViewModeToggle from "../ui/ViewModeToggle";
import { ArchiveCard, PersonalArchiveCard } from "../ui/ArchiveCards";

interface DocumentViewProps {
  archives: Archive[];
  paginatedDocuments: Document[];
  visibleColumns: Set<string>;
  sortColumn: keyof Document | null;
  sortOrder: "asc" | "desc" | null;
  selectedDocumentIds: Set<string>;
  filters: Filters;
  expireFilterMethod: "range" | "period";
  pagination: Pagination;
  isExporting: boolean;
  viewMode: "list" | "grid";
  allTableColumns: TableColumn[];
  archiveDocCounts: Record<string, number>;
  onManageContributors: (docId: string) => void;
  onGoBack: () => void;
  setViewMode: (mode: "list" | "grid") => void;
  onFilterChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterReset: () => void;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (value: number) => void;
  setExpireFilterMethod: (method: "range" | "period") => void;
  onColumnToggle: (columnId: string) => void;
  onArchiveCheckboxChange: (archiveCode: string, isChecked: boolean) => void;
  onExport: () => void;
  onSortChange: (columnId: keyof Document) => void;
  onDocumentSelect: (docId: string, event?: React.MouseEvent) => void;
  onMove: (docId: string) => void;
  onEdit: (docId: string) => void;
  onDelete: (docId: string) => void;
  onToggleStar: (docId: string, event: React.MouseEvent) => void;
  isInfoPanelOpen: boolean;
  currentFolderName: string | undefined;
  onArchiveClick: (id: string) => void;
  onArchiveMenuClick?: (e: React.MouseEvent, archiveId: string) => void;
}

const DocumentView: React.FC<DocumentViewProps> = (props) => {
  const {
    archives,
    paginatedDocuments,
    visibleColumns,
    sortColumn,
    sortOrder,
    selectedDocumentIds,
    filters,
    expireFilterMethod,
    pagination,
    isExporting,
    viewMode,
    onGoBack,
    setViewMode,
    onFilterChange,
    onCheckboxChange,
    onFilterReset,
    onPageChange,
    onRowsPerPageChange,
    setExpireFilterMethod,
    allTableColumns,
    onColumnToggle,
    onArchiveCheckboxChange,
    onExport,
    onSortChange,
    onDocumentSelect,
    onMove,
    onEdit,
    onDelete,
    onToggleStar,
    currentFolderName,
    archiveDocCounts,
    onArchiveClick,
    onManageContributors,
    isInfoPanelOpen,
    onArchiveMenuClick,
  } = props;

  const hasDocuments = paginatedDocuments.length > 0;

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onGoBack}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Kembali"
          >
            <svg
              className="w-6 h-6 text-gray-600 dark:text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {currentFolderName || "Arsip"}
          </h2>
        </div>
      </div>

      {archives.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Sub-Archives
          </h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6">
            {archives.map((archive) =>
              archive.code === "PERSONAL" ? (
                <PersonalArchiveCard
                  key={archive.id}
                  archive={archive}
                  onClick={() => onArchiveClick(archive.id)}
                />
              ) : (
                <ArchiveCard
                  key={archive.id}
                  archive={archive}
                  docCount={archiveDocCounts[archive.code] || 0}
                  onClick={() => onArchiveClick(archive.id)}
                  onMenuClick={onArchiveMenuClick}
                />
              )
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Dokumen
        </h2>
        <div className="flex items-center gap-3">
          <div className="transition-all duration-200 hover:shadow-md rounded-lg">
            <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
          </div>
        </div>
      </div>
      <DocumentsContainer
        archives={archives}
        filters={filters}
        onFilterChange={onFilterChange}
        onCheckboxChange={onCheckboxChange}
        onFilterReset={onFilterReset}
        pagination={pagination}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        expireFilterMethod={expireFilterMethod}
        setExpireFilterMethod={setExpireFilterMethod}
        allTableColumns={allTableColumns}
        visibleColumns={visibleColumns}
        onColumnToggle={onColumnToggle}
        isExporting={isExporting}
        onArchiveCheckboxChange={onArchiveCheckboxChange}
        onExport={onExport}
        viewMode={viewMode}
        setViewMode={setViewMode}
      >
        {hasDocuments ? (
          viewMode === "list" ? (
            <DocumentTable
              documents={paginatedDocuments}
              visibleColumns={visibleColumns}
              onSortChange={onSortChange}
              sortColumn={sortColumn}
              sortOrder={sortOrder}
              onColumnToggle={onColumnToggle}
              selectedDocumentIds={selectedDocumentIds}
              onDocumentSelect={onDocumentSelect}
              onMove={onMove}
              onEdit={onEdit}
              onDelete={onDelete}
              onManageContributors={onManageContributors}
            />
          ) : (
            <DocumentGrid
              documents={paginatedDocuments}
              selectedDocumentIds={selectedDocumentIds}
              archives={archives}
              onDocumentSelect={onDocumentSelect}
              onMove={onMove}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleStar={onToggleStar}
              isInfoPanelOpen={isInfoPanelOpen}
              onManageContributors={onManageContributors}
            />
          )
        ) : (
          <div className="py-10 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              Tidak ada dokumen yang cocok dengan pencarian Anda.
            </p>
          </div>
        )}
      </DocumentsContainer>
    </div>
  );
};

export default DocumentView;
