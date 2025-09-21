"use client";

import { useState, useMemo, ChangeEvent, useRef } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import CreateArchiveModal from "@/components/CreateArchiveModal";
import { Filters, NewDocumentData, Document } from "./types";
import { allArchives, allDocuments, reminders } from "./data";
import { AddDocumentModal } from "./components/AddDocumentModal";
import { DocumentsContainer } from "./components/DocumentsContainer";
import { DocumentTable } from "./components/DocumentTable";
import { DocumentGrid } from "./components/DocumentGrid";
import { ArchiveCard, PersonalArchiveCard } from "./components/ArchiveCards";
import ViewModeToggle from "./components/ViewModeToggle";
import { SearchPopup } from "./components/SearchPopup";
import { FolderIcon } from "./components/FolderIcon";
import { Dropzone } from "./components/DropZone";
import { AddNewMenu } from "./components/AddNewMenu";
import { InfoPanel } from "./components/InfoPanel";
import { MoveToModal } from "./components/MoveToModal";

const allTableColumns = [
  { id: "numberAndTitle", label: "Number & Title" },
  { id: "description", label: "Description" },
  { id: "documentDate", label: "Document Date" },
  { id: "contributors", label: "Contributors" },
  { id: "archive", label: "Archive" },
  { id: "updatedAndCreatedBy", label: "Update & Create By" },
  { id: "actions", label: "Actions" },
];

export default function SiadilPage() {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [sortColumn, setSortColumn] = useState<keyof Document | null>(null);
  const [isSearchPopupOpen, setIsSearchPopupOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [currentFolderId, setCurrentFolderId] = useState("root");
  const [isAddNewMenuOpen, setIsAddNewMenuOpen] = useState(false);
  const addNewButtonRef = useRef<HTMLButtonElement>(null);
  const [expireFilterMethod, setExpireFilterMethod] = useState<
    "range" | "period"
  >("range");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [archiveCurrentPage, setArchiveCurrentPage] = useState(1);
  const [documentCurrentPage, setDocumentCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;
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
    archive: [],
    docDateStart: "",
    docDateEnd: "",
    expireDateStart: "",
    expireDateEnd: "",
    expireIn: {},
  };
  const [filters, setFilters] = useState(initialFilters);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(allTableColumns.map((c) => c.id))
  );
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<Set<string>>(
    new Set()
  );
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [documentToMove, setDocumentToMove] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Document[]>(allDocuments);

  const [pageView, setPageView] = useState<"archives" | "starred">("archives");

  const handleToggleStar = (docId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setDocuments((docs) =>
      docs.map((doc) =>
        doc.id === docId ? { ...doc, isStarred: !doc.isStarred } : doc
      )
    );
  };

  const handleFilterReset = () => {
    setFilters(initialFilters);
    setDocumentCurrentPage(1);
  };
  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value);
    setDocumentCurrentPage(1);
  };

  const handleSort = (columnId: keyof Document) => {
    if (sortColumn === columnId) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnId);
      setSortOrder("asc");
    }
  };

  const handleArchiveCheckboxChange = (
    archiveCode: string,
    isChecked: boolean
  ) => {
    setFilters((prev) => {
      const currentArchives = prev.archive || [];
      if (isChecked) {
        return { ...prev, archive: [...currentArchives, archiveCode] };
      } else {
        return {
          ...prev,
          archive: currentArchives.filter((code) => code !== archiveCode),
        };
      }
    });
    setDocumentCurrentPage(1);
  };

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

  const documentsInCurrentFolder = useMemo(() => {
    if (currentFolderId === "root") {
      return []; // Dokumen tidak ada di root, hanya arsip
    }
    return documents.filter((d) => d.parentId === currentFolderId);
  }, [currentFolderId, documents]);

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

  const handleFilterChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setDocumentCurrentPage(1);
  };
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFilters((prev) => {
      const newExpireIn = { ...prev.expireIn };
      if (checked) {
        newExpireIn[value] = true;
      } else {
        delete newExpireIn[value];
      }
      return { ...prev, expireIn: newExpireIn };
    });
    setDocumentCurrentPage(1);
  };

  const handleExpireMethodChange = (method: "range" | "period") => {
    setExpireFilterMethod(method);
    if (method === "range") {
      setFilters((prev) => ({ ...prev, expireIn: {} }));
    } else {
      setFilters((prev) => ({
        ...prev,
        expireDateStart: "",
        expireDateEnd: "",
      }));
    }
  };

  const filteredDocuments = useMemo(() => {
    return [...documentsInCurrentFolder]
      .filter((doc) => {
        // ... (logika filter Anda tetap sama)
        const keywordMatch =
          filters.keyword.toLowerCase() === "" ||
          doc.number.toLowerCase().includes(filters.keyword.toLowerCase()) ||
          doc.title.toLowerCase().includes(filters.keyword.toLowerCase());
        const archiveMatch =
          filters.archive.length === 0 || filters.archive.includes(doc.archive);
        const docDateStartMatch =
          filters.docDateStart === "" ||
          doc.documentDate >= filters.docDateStart;
        const docDateEndMatch =
          filters.docDateEnd === "" || doc.documentDate <= filters.docDateEnd;
        let finalExpireMatch = true;
        if (expireFilterMethod === "range") {
          const expireDateStartMatch =
            filters.expireDateStart === "" ||
            doc.expireDate >= filters.expireDateStart;
          const expireDateEndMatch =
            filters.expireDateEnd === "" ||
            doc.expireDate <= filters.expireDateEnd;
          finalExpireMatch = expireDateStartMatch && expireDateEndMatch;
        } else {
          const activeExpireInPeriods = Object.keys(filters.expireIn);
          if (activeExpireInPeriods.length > 0) {
            finalExpireMatch = activeExpireInPeriods.some((period) => {
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
          }
        }
        return (
          keywordMatch &&
          archiveMatch &&
          docDateStartMatch &&
          docDateEndMatch &&
          finalExpireMatch
        );
      })
      .sort((a, b) => {
        if (!sortColumn) return 0;
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];
        if (aValue == null || bValue == null) return 0;
        let comparison = 0;
        if (sortColumn === "documentDate" || sortColumn === "updatedDate") {
          comparison =
            new Date(aValue as string).getTime() -
            new Date(bValue as string).getTime();
        } else {
          comparison = String(aValue).localeCompare(String(bValue), undefined, {
            numeric: true,
          });
        }
        return sortOrder === "asc" ? comparison : -comparison;
      });
  }, [
    documentsInCurrentFolder,
    filters,
    sortOrder,
    sortColumn,
    expireFilterMethod,
  ]);

  const paginatedDocuments = useMemo(() => {
    const startIndex = (documentCurrentPage - 1) * rowsPerPage;
    return filteredDocuments.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredDocuments, documentCurrentPage, rowsPerPage]);

  const hasDocuments = paginatedDocuments.length > 0;

  const pagination = {
    totalRows: filteredDocuments.length,
    rowsPerPage,
    currentPage: documentCurrentPage,
  };

  const archiveDocCounts = useMemo(() => {
    return allDocuments.reduce((acc, doc) => {
      const archiveCode = doc.archive;
      acc[archiveCode] = (acc[archiveCode] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, []);

  const filteredArchives = useMemo(() => {
    const archivesInCurrentFolder = allArchives.filter(
      (a) => a.parentId === currentFolderId
    );
    if (!searchQuery) {
      return archivesInCurrentFolder;
    }
    return archivesInCurrentFolder.filter((archive) =>
      archive.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [currentFolderId, searchQuery]);

  const paginatedArchives = useMemo(() => {
    const startIndex = (archiveCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredArchives.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredArchives, archiveCurrentPage]);

  const totalPages = Math.ceil(filteredArchives.length / ITEMS_PER_PAGE);

  const handleSaveArchive = (archiveData: {
    name: string;
    parentId: string;
  }) => {
    console.log("Saving new archive:", archiveData);
    alert(`Arsip "${archiveData.name}" berhasil disimpan!`);
  };

  const handleSaveDocument = () => {
    console.log("Saving new document:", newDocument);
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

  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    console.log("Tombol export diklik, simulasi dimulai...");
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert("Fitur export belum diimplementasikan.");
      console.log("Simulasi selesai.");
    }, 2000);
  };

  const handleFilesAdded = (files: File[]) => {
    if (files.length === 0) return;
    if (currentFolderId === "root") {
      alert(
        "Silakan masuk ke salah satu arsip terlebih dahulu untuk menambahkan dokumen."
      );
      return;
    }
    const file = files[0];
    const currentArchive = allArchives.find((a) => a.id === currentFolderId);
    setNewDocument((prev) => ({
      ...prev,
      file: file,
      title: file.name.split(".").slice(0, -1).join("."),
      archive: currentArchive ? currentArchive.code : "",
    }));
    setIsAddModalOpen(true);
  };

  const handleDocumentSelect = (docId: string, event?: React.MouseEvent) => {
    const newSelection = new Set(selectedDocumentIds);
    if (event?.ctrlKey || event?.metaKey) {
      if (newSelection.has(docId)) {
        newSelection.delete(docId);
      } else {
        newSelection.add(docId);
      }
    } else if (event?.shiftKey && paginatedDocuments.length > 0) {
      const lastSelected = Array.from(selectedDocumentIds).pop();
      if (lastSelected) {
        const lastIndex = paginatedDocuments.findIndex(
          (d) => d.id === lastSelected
        );
        const currentIndex = paginatedDocuments.findIndex(
          (d) => d.id === docId
        );
        const start = Math.min(lastIndex, currentIndex);
        const end = Math.max(lastIndex, currentIndex);
        for (let i = start; i <= end; i++) {
          newSelection.add(paginatedDocuments[i].id);
        }
      } else {
        newSelection.add(docId);
      }
    } else {
      if (newSelection.has(docId) && newSelection.size === 1) {
        newSelection.clear();
      } else {
        newSelection.clear();
        newSelection.add(docId);
      }
    }
    setSelectedDocumentIds(newSelection);
  };

  const selectedDocument = useMemo(() => {
    if (selectedDocumentIds.size === 1) {
      const lastSelectedId = Array.from(selectedDocumentIds)[0];
      return allDocuments.find((doc) => doc.id === lastSelectedId) || null;
    }
    return null;
  }, [selectedDocumentIds]);

  const handleCloseInfoPanel = () => {
    setSelectedDocumentIds(new Set());
  };

  const handleOpenMoveModal = (docId: string) => {
    setDocumentToMove(docId);
    setIsMoveModalOpen(true);
  };

  const handleConfirmMove = (targetArchiveId: string) => {
    alert(
      `Pindahkan dokumen ID: ${documentToMove} ke arsip ID: ${targetArchiveId}`
    );
    setIsMoveModalOpen(false);
    setDocumentToMove(null);
  };

  const handleOpenAddModalInContext = () => {
    if (currentFolderId === "root") {
      alert(
        "Silakan masuk ke salah satu arsip terlebih dahulu untuk menambahkan dokumen."
      );
      return;
    }
    const currentArchive = allArchives.find((a) => a.id === currentFolderId);
    setNewDocument({
      number: "",
      title: "",
      description: "",
      documentDate: "",
      archive: currentArchive ? currentArchive.code : "",
      expireDate: "",
      file: null,
    });
    setIsAddModalOpen(true);
  };

  const quickAccessDocuments = useMemo(() => {
    return [...allDocuments]
      .sort(
        (a, b) =>
          new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime()
      )
      .slice(0, 5);
  }, []);

  const starredDocuments = useMemo(() => {
    return documents.filter((doc) => doc.isStarred);
  }, [documents]);

  // ▼▼▼ FUNGSI BARU UNTUK NAVIGASI DAN PEMILIHAN ▼▼▼
  const handleQuickAccessClick = (doc: Document) => {
    // 1. Dapatkan daftar dokumen yang akan ada di folder tujuan
    const docsInTargetFolder = documents
      .filter((d) => d.parentId === doc.parentId)
      .sort((a, b) => {
        // Pastikan urutannya sama dengan yang akan ditampilkan
        if (!sortColumn) return 0;
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];
        if (aValue == null || bValue == null) return 0;
        let comparison = 0;
        if (sortColumn === "documentDate" || sortColumn === "updatedDate") {
          comparison =
            new Date(aValue as string).getTime() -
            new Date(bValue as string).getTime();
        } else {
          comparison = String(aValue).localeCompare(String(bValue), undefined, {
            numeric: true,
          });
        }
        return sortOrder === "asc" ? comparison : -comparison;
      });

    // 2. Cari posisi/index dari dokumen yang diklik
    const docIndex = docsInTargetFolder.findIndex((d) => d.id === doc.id);

    // 3. Hitung halaman yang benar
    const targetPage = Math.floor(docIndex / rowsPerPage) + 1;

    // 4. Jalankan semua pembaruan state
    setCurrentFolderId(doc.parentId);
    setDocumentCurrentPage(targetPage);
    setSelectedDocumentIds(new Set([doc.id]));
  };

  return (
    <>
      <div className="mb-10">
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
          <div className="flex flex-col space-y-4 ml-6 w-[250px]">
            <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="p-5">
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
                  <div className="ml-4 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                        Total Dokumen
                      </dt>
                      <dd>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {allDocuments.length}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="">
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
        <div className="relative mt-6">
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
              context={currentFolderId === "root" ? "archives" : "documents"}
            />
          )}
        </div>
      </div>

      {currentFolderId === "root" && (
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Quick Access
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  lg:grid-cols-5 gap-5">
            {quickAccessDocuments.map((doc) => (
              <div
                key={doc.id}
                // ▼▼▼ GUNAKAN FUNGSI HANDLER BARU ▼▼▼
                onClick={() => handleQuickAccessClick(doc)}
                className="group relative rounded-lg border p-4 transition-all cursor-pointer border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-8 h-8 text-gray-400 dark:text-gray-500"
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
                  <div className="ml-3 min-w-0">
                    <h4
                      className="text-sm font-bold text-gray-900 dark:text-white truncate"
                      title={doc.title}>
                      {doc.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Diubah:{" "}
                      {new Date(doc.updatedDate).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {currentFolderId === "root" && (
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            <button
              onClick={() => setPageView("archives")}
              className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
                pageView === "archives"
                  ? "border-demplon text-demplon"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}>
              My Archives
            </button>
            <button
              onClick={() => setPageView("starred")}
              className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
                pageView === "starred"
                  ? "border-demplon text-demplon"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}>
              Starred
            </button>
          </nav>
        </div>
      )}

      {pageView === "starred" && currentFolderId === "root" ? (
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Starred Documents
          </h2>
          {starredDocuments.length > 0 ? (
            <DocumentGrid
              documents={starredDocuments}
              selectedDocumentIds={selectedDocumentIds}
              onDocumentSelect={handleDocumentSelect}
              onMove={handleOpenMoveModal}
              onToggleStar={handleToggleStar}
            />
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-10">
              No starred documents.
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="mb-10">
            {currentFolderId === "root" ? (
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Archives
                </h2>
                <div className="flex items-center gap-4">
                  <div className="relative w-full max-w-xs">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
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
                      placeholder="Search Archive"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setArchiveCurrentPage(1);
                      }}
                      className="w-full rounded-md border border-gray-300 bg-white py-1.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 focus:border-green-500 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCurrentFolderId("root")}
                    className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Kembali ke Root">
                    <svg
                      className="w-6 h-6 text-gray-600 dark:text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                  </button>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {allArchives.find((a) => a.id === currentFolderId)?.name ||
                      "Arsip"}
                  </h2>
                </div>
              </div>
            )}
            <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6">
              {paginatedArchives.map((archive) =>
                archive.code === "PERSONAL" ? (
                  <PersonalArchiveCard
                    key={archive.id}
                    archive={archive}
                    onClick={() => setCurrentFolderId(archive.id)}
                  />
                ) : (
                  <ArchiveCard
                    key={archive.id}
                    archive={archive}
                    docCount={archiveDocCounts[archive.code] || 0}
                    onClick={() => setCurrentFolderId(archive.id)}
                  />
                )
              )}
            </div>
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center space-x-2">
                <button
                  onClick={() =>
                    setArchiveCurrentPage((p) => Math.max(1, p - 1))
                  }
                  disabled={archiveCurrentPage === 1}
                  className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                  Previous
                </button>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Page {archiveCurrentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setArchiveCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={archiveCurrentPage === totalPages}
                  className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                  Next
                </button>
              </div>
            )}
          </div>

          {currentFolderId !== "root" && (
            <div className="relative">
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
                  <ViewModeToggle
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                  />
                </div>
              </div>

              {hasDocuments ? (
                <div className="mt-6">
                  <DocumentsContainer
                    archives={allArchives}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onCheckboxChange={handleCheckboxChange}
                    onFilterReset={handleFilterReset}
                    pagination={pagination}
                    onPageChange={setDocumentCurrentPage}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    expireFilterMethod={expireFilterMethod}
                    setExpireFilterMethod={handleExpireMethodChange}
                    allTableColumns={allTableColumns}
                    visibleColumns={visibleColumns}
                    onColumnToggle={handleColumnToggle}
                    isExporting={isExporting}
                    onArchiveCheckboxChange={handleArchiveCheckboxChange}
                    onExport={handleExport}>
                    {viewMode === "list" ? (
                      <DocumentTable
                        documents={paginatedDocuments}
                        visibleColumns={visibleColumns}
                        onSortChange={handleSort}
                        sortColumn={sortColumn}
                        sortOrder={sortOrder}
                        onColumnToggle={handleColumnToggle}
                        selectedDocumentIds={selectedDocumentIds}
                        onDocumentSelect={handleDocumentSelect}
                        onMove={handleOpenMoveModal}
                      />
                    ) : (
                      <DocumentGrid
                        documents={paginatedDocuments}
                        selectedDocumentIds={selectedDocumentIds}
                        onDocumentSelect={handleDocumentSelect}
                        onMove={handleOpenMoveModal}
                        onToggleStar={handleToggleStar}
                      />
                    )}
                  </DocumentsContainer>
                </div>
              ) : (
                <Dropzone onFilesAdded={handleFilesAdded} />
              )}

              <InfoPanel
                selectedDocument={selectedDocument}
                onClose={handleCloseInfoPanel}
              />
            </div>
          )}
        </>
      )}

      {isCreateModalOpen && (
        <CreateArchiveModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleSaveArchive}
          archives={allArchives}
          currentFolderId={currentFolderId}
        />
      )}
      {isAddModalOpen && (
        <AddDocumentModal
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleSaveDocument}
          newDocument={newDocument}
          setNewDocument={setNewDocument}
          archives={allArchives}
        />
      )}
      {isSearchPopupOpen && (
        <SearchPopup
          isOpen={isSearchPopupOpen}
          onClose={() => setIsSearchPopupOpen(false)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          documents={allDocuments}
        />
      )}
      {isMoveModalOpen && (
        <MoveToModal
          archives={allArchives}
          onClose={() => setIsMoveModalOpen(false)}
          onMove={handleConfirmMove}
        />
      )}
    </>
  );
}
