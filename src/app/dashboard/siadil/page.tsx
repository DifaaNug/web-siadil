"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import * as XLSX from "xlsx";

import {
  Document,
  Archive,
  NewDocumentData,
  TableColumn,
  Contributor,
} from "./types";

import { reminders } from "./data";
import { useData } from "./hooks/useData";
import { useDocumentSorters } from "./hooks/useDocumentSorters";
import { useDocumentPagination } from "./hooks/useDocumentPagination";
import { useDocumentFilters } from "./hooks/useDocumentFilters";
import { useSelection } from "./hooks/useSelection";
import { useModals } from "./hooks/useModals";

import HeaderSection from "./components/container/HeaderSection";
import QuickAccessSection from "./components/views/QuickAccessSection";
import ArchiveView from "./components/views/ArchiveView";
import DocumentView from "./components/views/DocumentView";
import StarredView from "./components/views/StarredView";
import TrashView from "./components/views/TrashView";
import { AddNewMenu } from "./components/ui/AddNewMenu";
import { InfoPanel } from "./components/container/InfoPanel";
import CreateArchiveModal from "./components/modals/CreateArchiveModal";
import { AddDocumentModal } from "./components/modals/AddDocumentModal";
import { SearchPopup } from "./components/modals/SearchPopup";
import { MoveToModal } from "./components/modals/MoveToModal";
import ManageContributorsModal from "./components/modals/ManageContributorsModal";

const allTableColumns: TableColumn[] = [
  { id: "numberAndTitle", label: "Number & Title" },
  { id: "description", label: "Description" },
  { id: "documentDate", label: "Document Date" },
  { id: "contributors", label: "Contributors" },
  { id: "archive", label: "Archive" },
  { id: "updatedAndCreatedBy", label: "Update & Create By" },
  { id: "actions", label: "Actions" },
];

const initialNewDocument: NewDocumentData = {
  number: "",
  title: "",
  description: "",
  documentDate: "",
  archive: "",
  expireDate: "",
  file: null,
};

export default function SiadilPage() {
  const [currentFolderId, setCurrentFolderId] = useState("root");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [pageView, setPageView] = useState<"archives" | "starred" | "trash">(
    "archives"
  );
  const [isAddNewMenuOpen, setIsAddNewMenuOpen] = useState(false);
  const addNewButtonRef = useRef<HTMLButtonElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [documentCurrentPage, setDocumentCurrentPage] = useState(1);
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(allTableColumns.map((c) => c.id))
  );

  const [isContributorsModalOpen, setIsContributorsModalOpen] = useState(false);
  const [selectedDocForContributors, setSelectedDocForContributors] =
    useState<Document | null>(null);

  const {
    documents,
    setDocuments,
    archives,
    setArchives,
    searchableDocuments,
    documentsForFiltering,
    breadcrumbItems,
    archiveDocCounts,
    quickAccessDocuments,
    starredDocuments,
    subfolderArchives,
    handleToggleStar,
  } = useData(currentFolderId);

  const trashedDocuments = useMemo(() => {
    return documents.filter((doc) => doc.status === "Trashed");
  }, [documents]);

  const handleOpenContributorsModal = (docId: string) => {
    setDocuments((prevDocs) =>
      prevDocs.map((doc) =>
        doc.id === docId
          ? { ...doc, lastAccessed: new Date().toISOString() }
          : doc
      )
    );

    const doc = documents.find((d) => d.id === docId);
    if (doc) {
      setSelectedDocForContributors(doc);
      setIsContributorsModalOpen(true);
    }
  };

  const handleSaveContributors = (
    docId: string,
    newContributors: Contributor[]
  ) => {
    setDocuments((docs) =>
      docs.map((doc) =>
        doc.id === docId ? { ...doc, contributors: newContributors } : doc
      )
    );
  };

  const handleColumnToggle = (columnId: string) => {
    setVisibleColumns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(columnId)) {
        newSet.delete(columnId);
      } else {
        newSet.add(columnId);
      }
      return newSet;
    });
  };

  const {
    filters,
    expireFilterMethod,
    handleFilterChange,
    handleCheckboxChange,
    handleArchiveCheckboxChange,
    handleExpireMethodChange,
    handleFilterReset,
    filteredDocuments,
  } = useDocumentFilters(documentsForFiltering, setDocumentCurrentPage);

  const { sortOrder, sortColumn, handleSort, sortedDocuments } =
    useDocumentSorters(filteredDocuments);

  const {
    rowsPerPage,
    handleRowsPerPageChange,
    paginatedDocuments,
    pagination,
  } = useDocumentPagination(
    sortedDocuments,
    documentCurrentPage,
    setDocumentCurrentPage
  );

  const {
    selectedDocumentIds,
    setSelectedDocumentIds,
    infoPanelDocument,
    setInfoPanelDocument,
    handleDocumentSelect,
    handleCloseInfoPanel,
  } = useSelection(setDocuments, paginatedDocuments, documents);

  const {
    isCreateModalOpen,
    setIsCreateModalOpen,
    isAddModalOpen,
    isMoveModalOpen,
    setIsMoveModalOpen,
    isSearchPopupOpen,
    setIsSearchPopupOpen,
    newDocument,
    setNewDocument,
    editingDocId,
    documentToMove,
    setDocumentToMove,
    handleOpenEditModal,
    handleOpenMoveModal,
    handleOpenAddModalInContext,
    closeModal,
  } = useModals(
    initialNewDocument,
    documents,
    archives,
    currentFolderId,
    setDocuments
  );

  const handleGoBack = () => {
    const currentFolder = archives.find((a) => a.id === currentFolderId);
    if (currentFolder && currentFolder.parentId) {
      setCurrentFolderId(currentFolder.parentId);
    } else {
      setCurrentFolderId("root");
    }
  };

  const handleDeleteDocument = (docId: string) => {
    const docToTrash = documents.find((doc) => doc.id === docId);
    if (!docToTrash) return;

    if (
      window.confirm(
        `Apakah Anda yakin ingin memindahkan dokumen "${docToTrash.title}" ke Sampah?`
      )
    ) {
      setDocuments((currentDocs) =>
        currentDocs.map((doc) =>
          doc.id === docId ? { ...doc, status: "Trashed" } : doc
        )
      );
      if (infoPanelDocument?.id === docId) {
        setInfoPanelDocument(null);
      }
      setSelectedDocumentIds(new Set());
      alert(`Dokumen "${docToTrash.title}" berhasil dipindahkan ke Sampah.`);
    }
  };

  const handleRestoreDocument = (docId: string) => {
    setDocuments((currentDocs) =>
      currentDocs.map((doc) =>
        doc.id === docId ? { ...doc, status: "Active" } : doc
      )
    );
    alert(`Dokumen berhasil dipulihkan.`);
  };

  const handleDeletePermanently = (docId: string) => {
    const docToDelete = documents.find((doc) => doc.id === docId);
    if (!docToDelete) return;

    if (
      window.confirm(
        `Dokumen "${docToDelete.title}" akan dihapus permanen. Anda yakin?`
      )
    ) {
      setDocuments((currentDocs) =>
        currentDocs.filter((doc) => doc.id !== docId)
      );
      alert(`Dokumen berhasil dihapus permanen.`);
    }
  };

  const handleSaveArchive = (archiveData: {
    name: string;
    parentId: string;
  }) => {
    const { name, parentId } = archiveData;
    const newArchive: Archive = {
      id: name.toLowerCase().replace(/\s+/g, "-") + `-${Date.now()}`,
      code: name.toUpperCase().replace(/\s+/g, ""),
      name: name,
      parentId: parentId,
    };
    setArchives((currentArchives) => [...currentArchives, newArchive]);
    alert(`Arsip "${name}" berhasil dibuat!`);
  };

  const handleSaveDocument = () => {
    if (editingDocId) {
      setDocuments((docs) =>
        docs.map((doc) =>
          doc.id === editingDocId
            ? {
                ...doc,
                ...newDocument,
                id: editingDocId,
                updatedDate: new Date().toISOString(),
              }
            : doc
        )
      );
      alert(`Dokumen ID: ${editingDocId} berhasil diperbarui.`);
    } else {
      if (!newDocument.file) {
        alert("Silakan pilih file untuk diunggah.");
        return;
      }

      const getNextId = () => {
        const numericIds = documents
          .map((doc) => parseInt(doc.id, 10))
          .filter((id) => !isNaN(id));
        if (numericIds.length === 0) return "75001";
        const maxId = Math.max(...numericIds);
        return (maxId + 1).toString();
      };

      const newDoc: Document = {
        id: getNextId(),
        parentId: currentFolderId,
        title: newDocument.title || newDocument.file.name,

        number: newDocument.number,
        description: newDocument.description,
        documentDate:
          newDocument.documentDate || new Date().toISOString().split("T")[0],
        archive: newDocument.archive,
        expireDate: newDocument.expireDate,
        contributors: [{ name: "Someone", role: "Uploader" }],
        status: "Active",
        createdBy: "10122059",
        updatedBy: "10122059",
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
      };
      setDocuments((docs) => [...docs, newDoc]);
      alert(
        `Dokumen "${newDoc.title}" berhasil diunggah dengan ID: ${newDoc.id}.`
      );
    }
    closeModal();
  };

  const handleExport = () => {
    if (filteredDocuments.length === 0) {
      alert("Tidak ada data untuk diekspor.");
      return;
    }
    setIsExporting(true);
    setTimeout(() => {
      const dataToExport = filteredDocuments.map((doc) => ({
        ID: doc.id,
        "Nomor Dokumen": doc.number,
        Judul: doc.title,
        Deskripsi: doc.description,
        "Tanggal Dokumen": new Date(doc.documentDate).toLocaleDateString(
          "id-ID"
        ),
        Arsip: doc.archive,
        Status: doc.status,
        "Tanggal Kedaluwarsa": new Date(doc.expireDate).toLocaleDateString(
          "id-ID"
        ),
        "Dibuat Oleh": doc.createdBy,
        "Tanggal Dibuat": new Date(doc.createdDate).toLocaleString("id-ID"),
        "Diubah Oleh": doc.updatedBy,
        "Tanggal Diubah": new Date(doc.updatedDate).toLocaleString("id-ID"),
      }));
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Dokumen");
      worksheet["!cols"] = [
        { wch: 8 },
        { wch: 20 },
        { wch: 40 },
        { wch: 50 },
        { wch: 15 },
        { wch: 15 },
        { wch: 10 },
        { wch: 18 },
        { wch: 12 },
        { wch: 18 },
        { wch: 12 },
        { wch: 18 },
      ];

      const currentFolder = archives.find((a) => a.id === currentFolderId);
      let folderName = currentFolder ? currentFolder.name : "SIADIL";

      const hasSubfolders = subfolderArchives.length > 0;

      if (currentFolder && currentFolder.parentId === "root" && hasSubfolders) {
        const uniqueArchivesInExport = [
          ...new Set(filteredDocuments.map((doc) => doc.archive)),
        ];

        if (uniqueArchivesInExport.length > 1) {
          folderName = `${folderName}_dan_Subfolder`;
        } else if (uniqueArchivesInExport.length === 1) {
          const singleArchiveCode = uniqueArchivesInExport[0];
          const archiveName = archives.find(
            (a) => a.code === singleArchiveCode
          )?.name;
          if (archiveName) {
            folderName = archiveName;
          }
        }
      }

      const safeFolderName = folderName
        .replace(/\s+/g, "_")
        .replace(/[^a-zA-Z0-9_]/g, "");
      const fileName = `Daftar_Dokumen_${safeFolderName}.xlsx`;

      XLSX.writeFile(workbook, fileName);
      setIsExporting(false);
    }, 500);
  };

  const handleConfirmMove = (targetArchiveId: string) => {
    if (!documentToMove) return;
    setDocuments((currentDocs) =>
      currentDocs.map((doc) =>
        doc.id === documentToMove ? { ...doc, parentId: targetArchiveId } : doc
      )
    );
    const targetArchive = archives.find((a) => a.id === targetArchiveId);
    alert(
      `Dokumen ID: ${documentToMove} berhasil dipindahkan ke ${
        targetArchive?.name || "folder tujuan"
      }.`
    );
    setIsMoveModalOpen(false);
    setDocumentToMove(null);
  };

  const handleQuickAccessClick = (doc: Document) => {
    const docsInTargetFolder = documents.filter(
      (d) => d.parentId === doc.parentId
    );
    const docIndex = docsInTargetFolder.findIndex((d) => d.id === doc.id);
    if (docIndex !== -1) {
      const targetPage = Math.floor(docIndex / rowsPerPage) + 1;
      setDocumentCurrentPage(targetPage);
    } else {
      setDocumentCurrentPage(1);
    }
    setCurrentFolderId(doc.parentId);
    setSelectedDocumentIds(new Set([doc.id]));
  };

  const handleSearchSelect = (doc: Document) => {
    setIsSearchPopupOpen(false);
    setSearchQuery("");
    setCurrentFolderId(doc.parentId);
    handleDocumentSelect(doc.id);
    const docsInTargetFolder = documents.filter(
      (d) => d.parentId === doc.parentId
    );
    const docIndex = docsInTargetFolder.findIndex((d) => d.id === doc.id);
    if (docIndex !== -1) {
      const targetPage = Math.floor(docIndex / rowsPerPage) + 1;
      setDocumentCurrentPage(targetPage);
    }
  };

  useEffect(() => {
    if (selectedDocumentIds.size === 1) {
      const selectedId = Array.from(selectedDocumentIds)[0];
      setTimeout(() => {
        const element =
          document.getElementById(`doc-grid-${selectedId}`) ||
          document.getElementById(`doc-table-${selectedId}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
  }, [paginatedDocuments, selectedDocumentIds]);

  const isInfoPanelOpen = infoPanelDocument !== null;

  return (
    <>
      <div
        className={`transition-all duration-300 ease-in-out ${
          isInfoPanelOpen ? "mr-80" : "mr-0"
        }`}>
        <HeaderSection
          breadcrumbItems={breadcrumbItems}
          onBreadcrumbClick={setCurrentFolderId}
        />
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            {/* --- Baris Stat Cards --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
              {/* Kartu Total Dokumen */}
              <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 rounded-md bg-demplon dark:bg-green-800 p-3">
                    <svg
                      className="h-6 w-6 text-white dark:text-green-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                        Total Dokumen
                      </dt>
                      <dd>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {documents.length}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              {/* Kartu Total Arsip */}
              <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 rounded-md bg-blue-500 dark:bg-blue-800 p-3">
                    <svg
                      className="h-6 w-6 text-white dark:text-blue-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                        Total Arsip
                      </dt>
                      <dd>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {archives.length}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mb-10">
              <button
                ref={addNewButtonRef}
                onClick={() => setIsAddNewMenuOpen(!isAddNewMenuOpen)}
                className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold px-5 py-2.5 rounded-lg shadow hover:shadow-lg transition-all duration-200 ease-in-out flex items-center border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                <svg
                  className="w-5 h-5 mr-2 -ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>Add New</span>
              </button>
              {isAddNewMenuOpen && (
                <AddNewMenu
                  buttonRef={addNewButtonRef}
                  onClose={() => setIsAddNewMenuOpen(false)}
                  onNewFolder={() => setIsCreateModalOpen(true)}
                  onFileUpload={handleOpenAddModalInContext}
                  context={
                    currentFolderId === "root" ? "archives" : "documents"
                  }
                />
              )}
            </div>

            {currentFolderId === "root" && (
              <QuickAccessSection
                documents={quickAccessDocuments}
                onDocumentClick={handleQuickAccessClick}
              />
            )}

            {/* Navigasi Tabs */}
            {currentFolderId === "root" && (
              <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                  {/* Tombol My Archives */}
                  <button
                    onClick={() => setPageView("archives")}
                    className={`flex items-center gap-2 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
                      pageView === "archives"
                        ? "border-demplon text-demplon"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <span>My Archives</span>
                  </button>

                  {/* Tombol Starred */}
                  <button
                    onClick={() => setPageView("starred")}
                    className={`flex items-center gap-2 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
                      pageView === "starred"
                        ? "border-demplon text-demplon"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <span>Starred</span>
                  </button>

                  {/* Tombol Sampah */}
                  <button
                    onClick={() => setPageView("trash")}
                    className={`flex items-center gap-2 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
                      pageView === "trash"
                        ? "border-demplon text-demplon"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    <span>Trash</span>
                  </button>
                </nav>
              </div>
            )}

            {currentFolderId === "root" ? (
              (() => {
                switch (pageView) {
                  case "starred":
                    return (
                      <StarredView
                        documents={starredDocuments}
                        selectedDocumentIds={selectedDocumentIds}
                        onDocumentSelect={handleDocumentSelect}
                        onEdit={handleOpenEditModal}
                        onMove={handleOpenMoveModal}
                        onDelete={handleDeleteDocument}
                        onToggleStar={handleToggleStar}
                      />
                    );
                  case "trash":
                    return (
                      <TrashView
                        documents={trashedDocuments}
                        onRestore={handleRestoreDocument}
                        onDeletePermanently={handleDeletePermanently}
                      />
                    );
                  case "archives":
                  default:
                    return (
                      <ArchiveView
                        archives={archives}
                        archiveDocCounts={archiveDocCounts}
                        onArchiveClick={setCurrentFolderId}
                      />
                    );
                }
              })()
            ) : (
              <DocumentView
                archives={subfolderArchives}
                paginatedDocuments={paginatedDocuments}
                visibleColumns={visibleColumns}
                sortColumn={sortColumn}
                sortOrder={sortOrder}
                selectedDocumentIds={selectedDocumentIds}
                filters={filters}
                expireFilterMethod={expireFilterMethod}
                pagination={pagination}
                isExporting={isExporting}
                viewMode={viewMode}
                allTableColumns={allTableColumns}
                archiveDocCounts={archiveDocCounts}
                onGoBack={handleGoBack}
                onSearchClick={() => setIsSearchPopupOpen(true)}
                setViewMode={setViewMode}
                onFilterChange={handleFilterChange}
                onCheckboxChange={handleCheckboxChange}
                onFilterReset={handleFilterReset}
                onPageChange={setDocumentCurrentPage}
                onRowsPerPageChange={handleRowsPerPageChange}
                setExpireFilterMethod={handleExpireMethodChange}
                onColumnToggle={handleColumnToggle}
                onArchiveCheckboxChange={handleArchiveCheckboxChange}
                onExport={handleExport}
                onSortChange={handleSort}
                onDocumentSelect={handleDocumentSelect}
                onMove={handleOpenMoveModal}
                onEdit={handleOpenEditModal}
                onManageContributors={handleOpenContributorsModal}
                onDelete={handleDeleteDocument}
                onToggleStar={handleToggleStar}
                currentFolderName={
                  archives.find((a) => a.id === currentFolderId)?.name
                }
                onArchiveClick={setCurrentFolderId}
              />
            )}
          </div>

          <div className="w-full lg:w-[250px] lg:flex-shrink-0">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
              Reminders
            </h3>
            <div className="space-y-2">
              {reminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="bg-[#EF4444] text-white rounded-lg p-3 w-full">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
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

      <InfoPanel
        selectedDocument={infoPanelDocument}
        onClose={handleCloseInfoPanel}
      />
      {isCreateModalOpen && (
        <CreateArchiveModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleSaveArchive}
          archives={archives}
          currentFolderId={currentFolderId}
        />
      )}
      {isAddModalOpen && (
        <AddDocumentModal
          onClose={closeModal}
          onSave={handleSaveDocument}
          newDocument={newDocument}
          setNewDocument={setNewDocument}
          archives={archives}
          editingDocId={editingDocId}
        />
      )}
      {isSearchPopupOpen && (
        <SearchPopup
          isOpen={isSearchPopupOpen}
          onClose={() => setIsSearchPopupOpen(false)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          documents={searchableDocuments}
          onDocumentSelect={handleSearchSelect}
        />
      )}
      {isMoveModalOpen && (
        <MoveToModal
          archives={archives}
          onClose={() => setIsMoveModalOpen(false)}
          onMove={handleConfirmMove}
        />
      )}

      {isContributorsModalOpen && (
        <ManageContributorsModal
          isOpen={isContributorsModalOpen}
          onClose={() => setIsContributorsModalOpen(false)}
          document={selectedDocForContributors}
          onSave={handleSaveContributors}
        />
      )}
    </>
  );
}
