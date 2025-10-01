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

import { useData } from "./hooks/useData";
import { useDocumentSorters } from "./hooks/useDocumentSorters";
import { useDocumentPagination } from "./hooks/useDocumentPagination";
import { useDocumentFilters } from "./hooks/useDocumentFilters";
import { useSelection } from "./hooks/useSelection";
import { useModals } from "./hooks/useModals";
import TrashView from "./components/views/TrashView";
import ManageContributorsModal from "./components/modals/ManageContributorsModal";

import HeaderSection from "./components/container/HeaderSection";

import QuickAccessSection from "./components/views/QuickAccessSection";
import { ViewAllQuickAccessModal } from "./components/modals/ViewAllQuickAccessModal";
import ArchiveView from "./components/views/ArchiveView";
import DocumentView from "./components/views/DocumentView";
import StarredView from "./components/views/StarredView";
import { InfoPanel } from "./components/container/InfoPanel";
import CreateArchiveModal from "./components/modals/CreateArchiveModal";
import { AddDocumentModal } from "./components/modals/AddDocumentModal";
import { SearchPopup } from "./components/modals/SearchPopup";
import { MoveToModal } from "./components/modals/MoveToModal";

import { AllRemindersModal } from "./components/modals/AllRemindersModal";
import { reminders } from "./data";
import { toast } from "sonner";
import { ConfirmationModal } from "./components/modals/ConfirmationModal";
import DashboardHeader from "./components/container/DashboardHeader";
import { AllHistoryModal } from "./components/modals/AllHistoryModal";

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
  const userData = {
    name: "Someone",
    id: "1990123",
  };
  const [isAddNewMenuOpen, setIsAddNewMenuOpen] = useState(false);
  const addNewButtonRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRemindersModalOpen, setIsRemindersModalOpen] = useState(false);

  const [isContributorsModalOpen, setIsContributorsModalOpen] = useState(false);
  const [selectedDocForContributors, setSelectedDocForContributors] =
    useState<Document | null>(null);

  const [documentCurrentPage, setDocumentCurrentPage] = useState(1);
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(allTableColumns.map((c) => c.id))
  );

  const [archiveSearchQuery, setArchiveSearchQuery] = useState("");
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false); // State untuk modal riwayat

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

  const [confirmationAction, setConfirmationAction] = useState<{
    action: "trash" | "delete" | "restore";
    docId: string;
    docTitle: string;
  } | null>(null);

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
    quickAccessAllDocuments,
    starredDocuments,
    subfolderArchives,
    handleToggleStar,
  } = useData(currentFolderId);

  // Memo untuk semua dokumen riwayat
  const allHistoryDocuments = useMemo(() => {
    return [...documents]
      .filter((doc) => doc.lastAccessed)
      .sort(
        (a, b) =>
          new Date(b.lastAccessed!).getTime() -
          new Date(a.lastAccessed!).getTime()
      );
  }, [documents]);

  const trashedDocuments = useMemo(() => {
    return documents.filter((doc) => doc.status === "Trashed");
  }, [documents]);

  const pageTitle = useMemo(() => {
    if (currentFolderId !== "root") {
      return archives.find((a) => a.id === currentFolderId)?.name || "Arsip";
    }
    switch (pageView) {
      case "starred":
        return "Starred Documents";
      case "trash":
        return "Trash";
      case "archives":
      default:
        return "Archives";
    }
  }, [pageView, currentFolderId, archives]);

  const handleOpenContributorsModal = (docId: string) => {
    const doc = documents.find((d) => d.id === docId);
    if (doc) {
      setSelectedDocForContributors(doc);
      setIsContributorsModalOpen(true);
    }
  };

  const [isViewAllQAOpen, setIsViewAllQAOpen] = useState(false);

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
  } = useModals(initialNewDocument, documents, archives, currentFolderId);

  const handleGoBack = () => {
    const currentFolder = archives.find((a) => a.id === currentFolderId);
    if (currentFolder && currentFolder.parentId) {
      setCurrentFolderId(currentFolder.parentId);
    } else {
      setCurrentFolderId("root");
    }
    setArchiveSearchQuery("");
  };

  const handleDeleteDocument = (docId: string) => {
    const docToTrash = documents.find((doc) => doc.id === docId);
    if (docToTrash) {
      setConfirmationAction({
        action: "trash",
        docId,
        docTitle: docToTrash.title,
      });
    }
  };

  const handleRestoreDocument = (docId: string) => {
    const docToRestore = documents.find((doc) => doc.id === docId);
    if (docToRestore) {
      setConfirmationAction({
        action: "restore",
        docId,
        docTitle: docToRestore.title,
      });
    }
  };

  const handleDeletePermanently = (docId: string) => {
    const docToDelete = documents.find((doc) => doc.id === docId);
    if (docToDelete) {
      setConfirmationAction({
        action: "delete",
        docId,
        docTitle: docToDelete.title,
      });
    }
  };

  const handleConfirmAction = () => {
    if (!confirmationAction) return;

    const { action, docId, docTitle } = confirmationAction;

    if (action === "trash") {
      setDocuments((currentDocs) =>
        currentDocs.map((doc) =>
          doc.id === docId ? { ...doc, status: "Trashed" } : doc
        )
      );
      if (infoPanelDocument?.id === docId) setInfoPanelDocument(null);
      setSelectedDocumentIds(new Set());
      toast.success("Document Moved to Trash", {
        description: `Document "${docTitle}" has been successfully transferred.`,
      });
    } else if (action === "restore") {
      setDocuments((currentDocs) =>
        currentDocs.map((doc) =>
          doc.id === docId ? { ...doc, status: "Active" } : doc
        )
      );
      toast.success("Documents Successfully Recovered", {
        description: `Document "${docTitle}" has been returned from the trash.`,
      });
    } else if (action === "delete") {
      setDocuments((currentDocs) =>
        currentDocs.filter((doc) => doc.id !== docId)
      );
      toast.error("Document Permanently Deleted", {
        description: `Document "${docTitle}" has been successfully deleted permanently.`,
      });
    }
    setConfirmationAction(null);
  };

  const handleSaveArchive = (archiveData: {
    name: string;
    parentId: string;
  }) => {
    const { name, parentId } = archiveData;
    const newArchive: Archive = {
      id: `${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
      code: name.toUpperCase().replace(/\s+/g, ""),
      name: name,
      parentId: parentId,
    };
    setArchives((currentArchives) => [...currentArchives, newArchive]);
    toast.success("Archive Created Successfully", {
      description: `Archive "${name}" created successfully!`,
    });
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
      toast.success("Document Updated Successfully", {
        description: `Changes to ID documents: ${editingDocId} has been saved.`,
      });
    } else {
      if (!newDocument.file) {
        toast.error("File Not Selected", {
          description: "Please select a file to upload.",
        });
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

      const fileName = newDocument.file.name;
      const fileExtension = fileName.split(".").pop()?.toLowerCase();

      const newDoc: Document = {
        id: getNextId(),
        parentId: currentFolderId,
        title: newDocument.title || newDocument.file.name,
        fileType: fileExtension,
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

      toast.success("Document Uploaded Successfully", {
        description: `Document "${newDoc.title}" has been added with ID: ${newDoc.id}.`,
      });
    }
    closeModal();
  };

  const handleExport = () => {
    if (filteredDocuments.length === 0) {
      toast.warning("No Data to Export", {
        description: "There is no data to export in the current view.",
      });
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

    const docDetails = documents.find((doc) => doc.id === documentToMove);
    const targetArchive = archives.find((a) => a.id === targetArchiveId);

    setDocuments((currentDocs) =>
      currentDocs.map((doc) =>
        doc.id === documentToMove ? { ...doc, parentId: targetArchiveId } : doc
      )
    );

    toast.success("Documents Successfully Moved", {
      description: `Document "${
        docDetails?.title || `ID: ${documentToMove}`
      }" successfully moved to archive "${
        targetArchive?.name || "objective"
      }".`,
    });

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

  const confirmationModalData = useMemo(() => {
    if (!confirmationAction) return null;
    switch (confirmationAction.action) {
      case "trash":
        return {
          title: "Move to Trash?",
          body: `Are you sure you want to move the "${confirmationAction.docTitle}" document to the trash?`,
          confirmText: "Yes, Move to Trash",
          variant: "destructive" as const,
        };
      case "delete":
        return {
          title: "Permanently delete?",
          body: `"${confirmationAction.docTitle}" documents will be permanently deleted and cannot be recovered. Are you sure?`,
          confirmText: "Yes, Permanent Delete",
          variant: "destructive" as const,
        };
      case "restore":
        return {
          title: "Recover Documents?",
          body: `Are you sure you want to recover the "${confirmationAction.docTitle}" document from the trash?`,
          confirmText: "Yes, Recover",
          variant: "default" as const,
        };
      default:
        return null;
    }
  }, [confirmationAction]);

  const { expiredCount, expiringSoonCount } = useMemo(() => {
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    const expired = documents.filter(
      (doc) => new Date(doc.expireDate) < now && doc.status !== "Trashed"
    ).length;

    const expiringSoon = documents.filter((doc) => {
      const expireDate = new Date(doc.expireDate);
      return (
        expireDate >= now &&
        expireDate <= thirtyDaysFromNow &&
        doc.status !== "Trashed"
      );
    }).length;

    return { expiredCount: expired, expiringSoonCount: expiringSoon };
  }, [documents]);

  return (
    <>
      <div
        className={`transition-all duration-300 ease-in-out ${
          isInfoPanelOpen ? "mr-80" : "mr-0"
        }`}
      >
        <DashboardHeader
          userName={userData.name}
          breadcrumbItems={breadcrumbItems}
          onBreadcrumbClick={setCurrentFolderId}
        />
        <HeaderSection
          totalDocuments={documents.length}
          expiredCount={expiredCount}
          expiringSoonCount={expiringSoonCount}
          onViewAllReminders={() => setIsRemindersModalOpen(true)}
          addNewButtonRef={addNewButtonRef}
          isAddNewMenuOpen={isAddNewMenuOpen}
          onToggleAddNewMenu={() => setIsAddNewMenuOpen(!isAddNewMenuOpen)}
          onCloseAddNewMenu={() => setIsAddNewMenuOpen(false)}
          onNewFolder={() => setIsCreateModalOpen(true)}
          onFileUpload={handleOpenAddModalInContext}
          currentFolderId={currentFolderId}
        />
        <AllRemindersModal
          isOpen={isRemindersModalOpen}
          onClose={() => setIsRemindersModalOpen(false)}
          reminders={reminders}
        />

        {currentFolderId === "root" && (
          <QuickAccessSection
            documents={quickAccessDocuments}
            onDocumentClick={handleQuickAccessClick}
            isInfoPanelOpen={isInfoPanelOpen}
            onViewAll={() => setIsViewAllQAOpen(true)}
          />
        )}

        {currentFolderId === "root" && (
          <>
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white shrink-0">
                {pageTitle}
              </h2>

              <div
                className={`relative w-full sm:max-w-xs ${
                  pageView === "archives" ? "visible" : "invisible"
                }`}
              >
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search Archive..."
                  value={archiveSearchQuery}
                  onChange={(e) => setArchiveSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-200  py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 transition-colors duration-200 focus:border-demplon focus:bg-white focus:ring-2 focus:ring-demplon/30 dark:border-gray-700 dark:bg-gray-900/50 dark:text-gray-200 dark:placeholder-gray-400 dark:focus:bg-gray-800"
                />
              </div>
            </div>
          </>
        )}

        {currentFolderId === "root" && (
          <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
              <button
                onClick={() => setPageView("archives")}
                className={`flex items-center gap-2 whitespace-nowrap py-3 px-1 border-b-2 text-sm font-semibold transition-colors ${
                  pageView === "archives"
                    ? "border-demplon text-demplon"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
                <span>Archives</span>
              </button>

              <button
                onClick={() => setPageView("starred")}
                className={`flex items-center gap-2 whitespace-nowrap py-3 px-1 border-b-2 text-sm font-semibold transition-colors ${
                  pageView === "starred"
                    ? "border-demplon text-demplon"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <span>Starred</span>
              </button>

              <button
                onClick={() => setPageView("trash")}
                className={`flex items-center gap-2 whitespace-nowrap py-3 px-1 border-b-2 text-sm font-semibold transition-colors ${
                  pageView === "trash"
                    ? "border-demplon text-demplon"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
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
                    archives={archives}
                    selectedDocumentIds={selectedDocumentIds}
                    onDocumentSelect={handleDocumentSelect}
                    onEdit={handleOpenEditModal}
                    onMove={handleOpenMoveModal}
                    onDelete={handleDeleteDocument}
                    onToggleStar={handleToggleStar}
                    onManageContributors={handleOpenContributorsModal}
                    isInfoPanelOpen={isInfoPanelOpen}
                  />
                );
              case "trash":
                return (
                  <TrashView
                    documents={trashedDocuments}
                    archives={archives}
                    onRestore={handleRestoreDocument}
                    onDeletePermanently={handleDeletePermanently}
                  />
                );
              case "archives":
              default:
                return (
                  <ArchiveView
                    archives={archives.filter((a) => a.parentId === "root")}
                    archiveDocCounts={archiveDocCounts}
                    onArchiveClick={setCurrentFolderId}
                    searchQuery={archiveSearchQuery}
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
            setViewMode={setViewMode}
            onFilterChange={handleFilterChange}
            onCheckboxChange={handleCheckboxChange}
            onFilterReset={handleFilterReset}
            onPageChange={setDocumentCurrentPage}
            onRowsPerPageChange={handleRowsPerPageChange}
            setExpireFilterMethod={handleExpireMethodChange}
            onColumnToggle={handleColumnToggle}
            isInfoPanelOpen={isInfoPanelOpen}
            onArchiveCheckboxChange={handleArchiveCheckboxChange}
            onExport={handleExport}
            onManageContributors={handleOpenContributorsModal}
            onSortChange={handleSort}
            onDocumentSelect={handleDocumentSelect}
            onMove={handleOpenMoveModal}
            onEdit={handleOpenEditModal}
            onDelete={handleDeleteDocument}
            onToggleStar={handleToggleStar}
            currentFolderName={pageTitle}
            onArchiveClick={setCurrentFolderId}
          />
        )}
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
      {isViewAllQAOpen && (
        <ViewAllQuickAccessModal
          isOpen={isViewAllQAOpen}
          onClose={() => setIsViewAllQAOpen(false)}
          documents={quickAccessAllDocuments}
          onOpenArchive={(doc) => {
            handleQuickAccessClick(doc);
          }}
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
      {confirmationModalData && (
        <ConfirmationModal
          isOpen={!!confirmationAction}
          onClose={() => setConfirmationAction(null)}
          onConfirm={handleConfirmAction}
          title={confirmationModalData.title}
          confirmText={confirmationModalData.confirmText}
          variant={confirmationModalData.variant}
        >
          <p>{confirmationModalData.body}</p>
        </ConfirmationModal>
      )}
      <AllHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        documents={allHistoryDocuments}
        onDocumentClick={(doc) => {
          handleQuickAccessClick(doc);
          setIsHistoryModalOpen(false);
        }}
      />
    </>
  );
}
