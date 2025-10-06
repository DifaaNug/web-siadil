"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import * as XLSX from "xlsx";

import {
  Document,
  Archive,
  NewDocumentData,
  TableColumn,
  Contributor,
  Reminder,
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
import { GlobalSearch } from "./components/ui/GlobalSearch";
import { ArchiveContextMenu } from "./components/ui/ArchiveContextMenu";
import { EditArchiveModal } from "./components/modals/EditArchiveModal";
import { DeleteArchiveModal } from "./components/modals/DeleteArchiveModal";
import { MoveArchiveModal } from "./components/modals/MoveArchiveModal";
import EmptyTrashModal from "./components/modals/EmptyTrashModal";

import { AllRemindersModal } from "./components/modals/AllRemindersModal";
// import { reminders } from "./data";
import { toast } from "sonner";
import { ConfirmationModal } from "./components/modals/ConfirmationModal";
import DashboardHeader from "./components/container/DashboardHeader";
import { AllHistoryModal } from "./components/modals/AllHistoryModal";

type ReminderTab = "all" | "error" | "warning";

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

  const [initialReminderTab, setInitialReminderTab] =
    useState<ReminderTab>("all");

  const [isContributorsModalOpen, setIsContributorsModalOpen] = useState(false);
  const [selectedDocForContributors, setSelectedDocForContributors] =
    useState<Document | null>(null);

  const [documentCurrentPage, setDocumentCurrentPage] = useState(1);
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(allTableColumns.map((c) => c.id))
  );

  const [archiveSearchQuery, setArchiveSearchQuery] = useState("");
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false); // State untuk modal riwayat

  // Trash filter state
  const [trashFilter, setTrashFilter] = useState<"all" | "documents" | "folders">("all");
  const [isEmptyTrashModalOpen, setIsEmptyTrashModalOpen] = useState(false);

  // Archive context menu state
  const [archiveContextMenu, setArchiveContextMenu] = useState<{
    x: number;
    y: number;
    archiveId: string;
  } | null>(null);

  // Archive modal states
  const [editArchiveId, setEditArchiveId] = useState<string | null>(null);
  const [deleteArchiveId, setDeleteArchiveId] = useState<string | null>(null);
  const [moveArchiveId, setMoveArchiveId] = useState<string | null>(null);

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

  // Total document count logic (root = all active docs, subfolder = active docs in subtree)
  const totalDocumentsDisplayed = useMemo(() => {
    const activeDocuments = documents.filter((d) => d.status !== "Trashed");
    if (currentFolderId === "root") return activeDocuments.length;
    // searchableDocuments already scoped to current folder + descendants & excludes trashed
    return searchableDocuments.length;
  }, [documents, currentFolderId, searchableDocuments]);

  const { dynamicReminders, expiredCount, expiringSoonCount } = useMemo(() => {
    // Gunakan dokumen sesuai scope folder untuk reminder DAN count
    const baseDocs =
      currentFolderId === "root" ? documents : searchableDocuments;

    const reminders: Reminder[] = [];
    let expired = 0;
    let expiringSoon = 0;
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    baseDocs.forEach((doc) => {
      if (!doc.expireDate || doc.status === "Trashed") return;
      const expireDate = new Date(doc.expireDate);
      const diffTime = expireDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (expireDate < now) {
        expired++;
        reminders.push({
          id: doc.id,
          documentId: doc.id,
          title: doc.title,
          description: `Dokumen di arsip ${doc.archive}`,
          message: `Telah kedaluwarsa ${Math.abs(diffDays)} hari yang lalu.`,
          type: "error",
          expireDate: doc.expireDate,
        });
      } else if (expireDate <= thirtyDaysFromNow) {
        expiringSoon++;
        reminders.push({
          id: doc.id,
          documentId: doc.id,
          title: doc.title,
          description: `Dokumen di arsip ${doc.archive}`,
          message: `Akan kedaluwarsa dalam ${diffDays} hari.`,
          type: "warning",
          expireDate: doc.expireDate,
        });
      }
    });

    return {
      dynamicReminders: reminders,
      expiredCount: expired,
      expiringSoonCount: expiringSoon,
    };
  }, [documents, searchableDocuments, currentFolderId]);

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

  const trashedArchives = useMemo(() => {
    return archives.filter((a) => a.status === "Trashed");
  }, [archives]);

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

  // Archive context menu handlers
  const handleArchiveMenuClick = (e: React.MouseEvent, archiveId: string) => {
    const archive = archives.find((a) => a.id === archiveId);
    if (!archive) return;

    setArchiveContextMenu({
      x: e.clientX,
      y: e.clientY,
      archiveId: archive.id,
    });
  };

  const handleEditArchive = (archiveId: string) => {
    setEditArchiveId(archiveId);
  };

  const handleSaveArchiveEdit = (archiveId: string, newName: string) => {
    setArchives((currentArchives) =>
      currentArchives.map((arc) =>
        arc.id === archiveId ? { ...arc, name: newName } : arc
      )
    );
    toast.success("Archive Updated Successfully", {
      description: `Archive has been successfully updated.`,
    });
    setEditArchiveId(null);
  };

  const handleMoveArchive = (archiveId: string) => {
    setMoveArchiveId(archiveId);
  };

  const handleConfirmMoveArchive = (targetArchiveId: string) => {
    if (!moveArchiveId) return;

    setArchives((currentArchives) =>
      currentArchives.map((arc) =>
        arc.id === moveArchiveId ? { ...arc, parentId: targetArchiveId } : arc
      )
    );

    const archive = archives.find((a) => a.id === moveArchiveId);
    toast.success("Archive Moved Successfully", {
      description: `Archive "${archive?.name || "Unknown"}" has been moved.`,
    });
    setMoveArchiveId(null);
  };

  const handleDeleteArchive = (archiveId: string) => {
    setDeleteArchiveId(archiveId);
  };

  const handleConfirmDeleteArchive = () => {
    if (!deleteArchiveId) return;

    // Move archive to trash by updating its status
    const archive = archives.find((a) => a.id === deleteArchiveId);
    setArchives((currentArchives) =>
      currentArchives.map((arc) =>
        arc.id === deleteArchiveId ? { ...arc, status: "Trashed" } : arc
      )
    );
    toast.success("Archive Moved to Trash", {
      description: `Archive "${
        archive?.name || "Unknown"
      }" has been successfully moved to trash.`,
    });
    setDeleteArchiveId(null);
  };

  const handleManageContributors = (archiveId: string) => {
    // TODO: Implement manage contributors for archive
    toast.info("Manage Contributors", {
      description: "This feature is coming soon.",
    });
    console.log("Manage contributors for archive:", archiveId);
  };

  const handleManageFiles = (archiveId: string) => {
    // Navigate to documents view for this archive
    setCurrentFolderId(archiveId);
    setPageView("archives");
    toast.info("Manage Files", {
      description: "Opening archive files...",
    });
  };

  const handleRestoreArchive = (archiveId: string) => {
    const archive = archives.find((a) => a.id === archiveId);
    setArchives((currentArchives) =>
      currentArchives.map((arc) =>
        arc.id === archiveId ? { ...arc, status: undefined } : arc
      )
    );
    toast.success("Archive Restored Successfully", {
      description: `Archive "${archive?.name || "Unknown"}" has been restored.`,
    });
  };

  const handleDeleteArchivePermanently = (archiveId: string) => {
    const archive = archives.find((a) => a.id === archiveId);
    if (
      window.confirm(
        `Are you sure you want to permanently delete "${archive?.name}"? This action cannot be undone.`
      )
    ) {
      setArchives((currentArchives) =>
        currentArchives.filter((arc) => arc.id !== archiveId)
      );
      toast.error("Archive Permanently Deleted", {
        description: `Archive "${
          archive?.name || "Unknown"
        }" has been permanently deleted.`,
      });
    }
  };

  const handleEmptyTrash = () => {
    let deletedCount = 0;
    
    if (trashFilter === "all") {
      // Delete all documents and folders
      deletedCount = trashedDocuments.length + trashedArchives.length;
      setDocuments((currentDocs) =>
        currentDocs.filter((doc) => doc.status !== "Trashed")
      );
      setArchives((currentArchives) =>
        currentArchives.filter((arc) => arc.status !== "Trashed")
      );
      toast.error("Trash Emptied", {
        description: `${deletedCount} items permanently deleted.`,
      });
    } else if (trashFilter === "documents") {
      // Delete only documents
      deletedCount = trashedDocuments.length;
      setDocuments((currentDocs) =>
        currentDocs.filter((doc) => doc.status !== "Trashed")
      );
      toast.error("Documents Emptied", {
        description: `${deletedCount} documents permanently deleted.`,
      });
    } else if (trashFilter === "folders") {
      // Delete only folders
      deletedCount = trashedArchives.length;
      setArchives((currentArchives) =>
        currentArchives.filter((arc) => arc.status !== "Trashed")
      );
      toast.error("Folders Emptied", {
        description: `${deletedCount} folders permanently deleted.`,
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

  const handleReminderClick = (documentId: string) => {
    const doc = documents.find((d) => d.id === documentId);
    if (doc) {
      handleQuickAccessClick(doc);
    }
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

  const handleOpenReminders = (tab: ReminderTab) => {
    setInitialReminderTab(tab);
    setIsRemindersModalOpen(true);
  };

  return (
    <>
      <div className={"relative"}>
        {/* Wrapper that adds smooth reserved space on xl screens while panel open */}
        <div
          className={`transition-[padding] duration-300 ease-[cubic-bezier(.4,0,.2,1)]
            xl:pr-0 ${isInfoPanelOpen ? "xl:pr-80" : "xl:pr-0"}`}
        >
          <DashboardHeader
            userName={userData.name}
            breadcrumbItems={breadcrumbItems}
            onBreadcrumbClick={setCurrentFolderId}
          />
          <HeaderSection
            totalDocuments={totalDocumentsDisplayed}
            expiredCount={expiredCount}
            expiringSoonCount={expiringSoonCount}
            onViewAllReminders={() => setIsRemindersModalOpen(true)}
            onExpiredCardClick={() => handleOpenReminders("error")}
            onExpiringSoonCardClick={() => handleOpenReminders("warning")}
            addNewButtonRef={addNewButtonRef}
            isAddNewMenuOpen={isAddNewMenuOpen}
            onToggleAddNewMenu={() => setIsAddNewMenuOpen(!isAddNewMenuOpen)}
            onCloseAddNewMenu={() => setIsAddNewMenuOpen(false)}
            onNewFolder={() => setIsCreateModalOpen(true)}
            onFileUpload={handleOpenAddModalInContext}
            currentFolderId={currentFolderId}
            reminders={dynamicReminders}
            onReminderClick={handleReminderClick}
          />
          <AllRemindersModal
            isOpen={isRemindersModalOpen}
            onClose={() => setIsRemindersModalOpen(false)}
            reminders={dynamicReminders}
            initialTab={initialReminderTab}
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
            <div className="mb-8">
              {/* Header dengan Icon sejajar dengan Search */}
              {/* Header Section - Consistent height and spacing */}
              <div className="flex items-center justify-between gap-4 mb-6 min-h-[48px]">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-lg shadow-md transition-all duration-300 ${
                      pageView === "archives"
                        ? "bg-gradient-to-br from-demplon to-teal-600"
                        : pageView === "starred"
                        ? "bg-gradient-to-br from-yellow-500 to-amber-600"
                        : "bg-gradient-to-br from-red-500 to-rose-600"
                    }`}
                  >
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      {pageView === "archives" ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                        />
                      ) : pageView === "starred" ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      )}
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                    {pageView === "archives"
                      ? "Archives"
                      : pageView === "starred"
                      ? "Starred Documents"
                      : "Trash"}
                  </h2>
                </div>

                {/* Global Search - visible only on archives view */}
                {pageView === "archives" && (
                  <div className="w-full sm:max-w-xs">
                    <GlobalSearch
                      documents={documents}
                      archives={archives}
                      onDocumentClick={handleQuickAccessClick}
                      onArchiveClick={(archiveId) => {
                        setCurrentFolderId(archiveId);
                        setArchiveSearchQuery("");
                      }}
                      placeholder="Search folders and documents..."
                      onSearchChange={setArchiveSearchQuery}
                    />
                  </div>
                )}
              </div>

              {/* Tabs Navigation - Consistent spacing */}
              <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
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
                        ? "border-yellow-500 text-yellow-600 dark:text-yellow-500"
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
                        ? "border-red-500 text-red-600 dark:text-red-500"
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

                  {/* Trash Filter Tabs - Only show when in trash view */}
                  {pageView === "trash" && (
                    <div className="flex items-center gap-2 ml-4 border-l border-gray-300 dark:border-gray-600 pl-4">
                      <button
                        onClick={() => setTrashFilter("all")}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                          trashFilter === "all"
                            ? "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400"
                            : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                        }`}
                      >
                        All ({trashedDocuments.length + trashedArchives.length})
                      </button>
                      <button
                        onClick={() => setTrashFilter("documents")}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                          trashFilter === "documents"
                            ? "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400"
                            : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                        }`}
                      >
                        Documents ({trashedDocuments.length})
                      </button>
                      <button
                        onClick={() => setTrashFilter("folders")}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                          trashFilter === "folders"
                            ? "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400"
                            : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                        }`}
                      >
                        Folders ({trashedArchives.length})
                      </button>
                    </div>
                  )}
                </nav>
              </div>
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
                      trashedArchives={trashedArchives}
                      filter={trashFilter}
                      onRestore={handleRestoreDocument}
                      onDeletePermanently={handleDeletePermanently}
                      onRestoreArchive={handleRestoreArchive}
                      onDeleteArchivePermanently={
                        handleDeleteArchivePermanently
                      }
                      onEmptyTrash={() => setIsEmptyTrashModalOpen(true)}
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
                      onArchiveMenuClick={handleArchiveMenuClick}
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
              onArchiveMenuClick={handleArchiveMenuClick}
            />
          )}
        </div>
      </div>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] transition-opacity duration-300 ${
          isInfoPanelOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleCloseInfoPanel}
        aria-hidden={true}
      />
      <InfoPanel
        selectedDocument={infoPanelDocument}
        onClose={handleCloseInfoPanel}
        isOpen={isInfoPanelOpen}
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
          baseArchiveId={currentFolderId}
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

      {/* Archive Context Menu */}
      {archiveContextMenu && (
        <ArchiveContextMenu
          x={archiveContextMenu.x}
          y={archiveContextMenu.y}
          archiveId={archiveContextMenu.archiveId}
          onClose={() => setArchiveContextMenu(null)}
          onEdit={handleEditArchive}
          onMove={handleMoveArchive}
          onDelete={handleDeleteArchive}
          onManageContributors={handleManageContributors}
          onManageFiles={handleManageFiles}
        />
      )}

      {/* Edit Archive Modal */}
      {editArchiveId && (
        <EditArchiveModal
          archive={archives.find((a) => a.id === editArchiveId)!}
          onClose={() => setEditArchiveId(null)}
          onSave={handleSaveArchiveEdit}
        />
      )}

      {/* Move Archive Modal */}
      {moveArchiveId && (
        <MoveArchiveModal
          archives={archives}
          currentArchiveId={moveArchiveId}
          onClose={() => setMoveArchiveId(null)}
          onMove={handleConfirmMoveArchive}
        />
      )}

      {/* Delete Archive Modal */}
      {deleteArchiveId && (
        <DeleteArchiveModal
          archiveName={
            archives.find((a) => a.id === deleteArchiveId)?.name || "Unknown"
          }
          onClose={() => setDeleteArchiveId(null)}
          onConfirm={handleConfirmDeleteArchive}
        />
      )}

      {/* Empty Trash Modal */}
      <EmptyTrashModal
        isOpen={isEmptyTrashModalOpen}
        onClose={() => setIsEmptyTrashModalOpen(false)}
        onConfirm={handleEmptyTrash}
        filterType={trashFilter}
        documentsCount={trashedDocuments.length}
        foldersCount={trashedArchives.length}
      />
    </>
  );
}
