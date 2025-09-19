"use client";

import { useState, useMemo, ChangeEvent, useRef } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import CreateArchiveModal from "@/components/CreateArchiveModal";
import { Filters, NewDocumentData, Document } from "./types"; // Pastikan Document diimpor
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
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [currentFolderId, setCurrentFolderId] = useState("root");
  const [isAddNewMenuOpen, setIsAddNewMenuOpen] = useState(false); // State untuk menu baru
  const addNewButtonRef = useRef<HTMLButtonElement>(null);
  const [expireFilterMethod, setExpireFilterMethod] = useState<
    "range" | "period"
  >("range");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [archiveCurrentPage, setArchiveCurrentPage] = useState(1);
  const [documentCurrentPage, setDocumentCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 4;
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
      const currentArchives = prev.archive || []; // Pastikan array tidak null
      if (isChecked) {
        // Tambahkan kode arsip ke array jika dicentang
        return { ...prev, archive: [...currentArchives, archiveCode] };
      } else {
        // Hapus kode arsip dari array jika tidak dicentang
        return {
          ...prev,
          archive: currentArchives.filter((code) => code !== archiveCode),
        };
      }
    });
    setDocumentCurrentPage(1); // Reset ke halaman pertama setelah filter berubah
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
      return allDocuments;
    }
    return allDocuments.filter((d) => d.parentId === currentFolderId);
  }, [currentFolderId]);

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
      const newExpireIn = { ...prev.expireIn }; // Salin objek expireIn

      if (checked) {
        newExpireIn[value] = true; // Tambahkan key dan set nilainya true
      } else {
        delete newExpireIn[value]; // Hapus key dari objek jika tidak dicentang
      }

      return { ...prev, expireIn: newExpireIn };
    });
    setDocumentCurrentPage(1);
  };

  const handleExpireMethodChange = (method: "range" | "period") => {
    setExpireFilterMethod(method);
    // Bersihkan state filter yang tidak aktif
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
        const keywordMatch =
          filters.keyword.toLowerCase() === "" ||
          doc.number.toLowerCase().includes(filters.keyword.toLowerCase()) ||
          doc.title.toLowerCase().includes(filters.keyword.toLowerCase());

        const archiveMatch =
          filters.archive.length === 0 || // Jika array kosong, tampilkan semua (logika untuk "Semua Arsip")
          filters.archive.includes(doc.archive);

        // PERBAIKAN: Membandingkan tanggal sebagai string untuk akurasi
        const docDateStartMatch =
          filters.docDateStart === "" ||
          doc.documentDate >= filters.docDateStart;

        const docDateEndMatch =
          filters.docDateEnd === "" || doc.documentDate <= filters.docDateEnd;

        let finalExpireMatch = true;

        if (expireFilterMethod === "range") {
          // PERBAIKAN: Membandingkan tanggal sebagai string untuk akurasi
          const expireDateStartMatch =
            filters.expireDateStart === "" ||
            doc.expireDate >= filters.expireDateStart;
          const expireDateEndMatch =
            filters.expireDateEnd === "" ||
            doc.expireDate <= filters.expireDateEnd;
          finalExpireMatch = expireDateStartMatch && expireDateEndMatch;
        } else {
          // 'period'
          const activeExpireInPeriods = Object.keys(filters.expireIn);
          if (activeExpireInPeriods.length > 0) {
            finalExpireMatch = activeExpireInPeriods.some((period) => {
              const now = new Date();
              // Untuk perbandingan periode, new Date() masih diperlukan
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

  // Fungsi untuk menyimpan arsip baru
  const handleSaveArchive = (archiveData: {
    name: string;
    parentId: string;
  }) => {
    console.log("Saving new archive:", archiveData);
    alert(`Arsip "${archiveData.name}" berhasil disimpan!`);
  };

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

  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    console.log("Tombol export diklik, simulasi dimulai...");
    setIsExporting(true); // Tampilkan loading

    // Simulasi proses ekspor selama 2 detik
    setTimeout(() => {
      setIsExporting(false); // Sembunyikan loading
      alert("Fitur export belum diimplementasikan."); // Beri notifikasi
      console.log("Simulasi selesai.");
    }, 2000); // 2000 ms = 2 detik
  };

  const [droppedFiles, setDroppedFiles] = useState<File[]>([]);

  // TAMBAHKAN FUNGSI HANDLER BARU INI
  const handleFilesAdded = (files: File[]) => {
    setDroppedFiles(files);
    // Di sini Anda bisa memicu modal unggah atau langsung mengunggah
    console.log("File yang akan diunggah:", files);
    alert(`${files.length} file siap untuk diunggah!`);
  };

  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
    null
  );

  // Cari data dokumen yang dipilih berdasarkan ID-nya
  const selectedDocument = useMemo(
    () => allDocuments.find((doc) => doc.id === selectedDocumentId) || null,
    [selectedDocumentId]
  );

  // Fungsi untuk menutup panel
  const handleCloseInfoPanel = () => {
    setSelectedDocumentId(null);
  };

  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [documentToMove, setDocumentToMove] = useState<string | null>(null);

  // TAMBAHKAN FUNGSI HANDLER BARU INI
  const handleOpenMoveModal = (docId: string) => {
    setDocumentToMove(docId);
    setIsMoveModalOpen(true);
  };

  const handleConfirmMove = (targetArchiveId: string) => {
    alert(
      `Pindahkan dokumen ID: ${documentToMove} ke arsip ID: ${targetArchiveId}`
    );
    // Di sini nantinya akan ada logika untuk memindahkan data
    setIsMoveModalOpen(false);
    setDocumentToMove(null);
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
                  {/* PERUBAHAN: Ikon sekarang memiliki background */}
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
      </div>
      <div className="mb-10">
        {/* Ganti header lama dengan semua kode di bawah ini */}
        {currentFolderId === "root" ? (
          // Tampilan jika di folder root (seperti yang sekarang)
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
              <div className="relative">
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
                    onFileUpload={() => setIsAddModalOpen(true)}
                  />
                )}
              </div>
            </div>
          </div>
        ) : (
          // Tampilan jika di dalam sebuah folder
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
              <div className="relative">
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
                    onFileUpload={() => setIsAddModalOpen(true)}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Grid Arsip */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6">
          {paginatedArchives.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                {searchQuery
                  ? "Arsip tidak ditemukan."
                  : "Folder arsip ini kosong."}
              </p>
            </div>
          ) : (
            // MODIFIKASI LOGIKA MAPPING INI
            paginatedArchives.map((archive) =>
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
            )
          )}
        </div>

        {/* Komponen Paginasi */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center space-x-2">
            <button
              onClick={() => setArchiveCurrentPage((p) => Math.max(1, p - 1))}
              disabled={archiveCurrentPage === 1}
              // TAMBAHKAN: class dark mode untuk background, border, dan teks
              className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
              Previous
            </button>

            {/* TAMBAHKAN: class dark mode untuk teks */}
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
      <div className="mb-10">
        <Dropzone onFilesAdded={handleFilesAdded} />
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

            <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
          </div>
        </div>
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
              // 2. Teruskan state dan fungsi ke DocumentTable
              selectedDocumentId={selectedDocumentId}
              onDocumentSelect={setSelectedDocumentId}
              onMove={handleOpenMoveModal}
            />
          ) : (
            <DocumentGrid
              documents={paginatedDocuments}
              // 3. Teruskan state dan fungsi ke DocumentGrid
              selectedDocumentId={selectedDocumentId}
              onDocumentSelect={setSelectedDocumentId}
              onMove={handleOpenMoveModal}
            />
          )}
        </DocumentsContainer>
      </div>
      <InfoPanel
        selectedDocument={selectedDocument}
        onClose={handleCloseInfoPanel}
      />

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
