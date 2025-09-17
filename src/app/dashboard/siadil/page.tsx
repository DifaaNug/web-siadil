"use client";

import { useState, useMemo, ChangeEvent } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import CreateArchiveModal from "@/components/CreateArchiveModal";

import { Filters, NewDocumentData } from "./types";
import { allArchives, allDocuments, reminders } from "./data";

import { AddDocumentModal } from "./components/AddDocumentModal";
import { DocumentsContainer } from "./components/DocumentsContainer";
import { DocumentTable } from "./components/DocumentTable";
import { DocumentGrid } from "./components/DocumentGrid";
import { ArchiveCard, PersonalArchiveCard } from "./components/ArchiveCards";
import ViewModeToggle from "./components/ViewModeToggle";
import { SearchPopup } from "./components/SearchPopup";
import { FolderIcon } from "./components/FolderIcon";

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
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isSearchPopupOpen, setIsSearchPopupOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [currentFolderId, setCurrentFolderId] = useState("root");
  const [expireFilterMethod, setExpireFilterMethod] = useState<
    "range" | "period"
  >("range");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

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
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(allTableColumns.map((c) => c.id))
  );

  const handleFilterReset = () => {
    setFilters(initialFilters);
    setCurrentPage(1);
  };

  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value);
    setCurrentPage(1);
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
    const filtered = documentsInCurrentFolder.filter((doc) => {
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
    // Sort by document number (default), ascending/descending
    return filtered.sort((a, b) => {
      if (sortOrder === "asc") {
        return a.number.localeCompare(b.number, undefined, { numeric: true });
      } else {
        return b.number.localeCompare(a.number, undefined, { numeric: true });
      }
    });
  }, [documentsInCurrentFolder, filters, sortOrder]);

  const paginatedDocuments = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredDocuments.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredDocuments, currentPage, rowsPerPage]);

  const pagination = {
    totalRows: filteredDocuments.length,
    rowsPerPage,
    currentPage,
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
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredArchives.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredArchives, currentPage]);

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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Archives
          </h2>

          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="relative w-full max-w-xs hidden sm:block">
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
                placeholder="Cari arsip..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-md border border-gray-300 bg-white py-1.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 focus:border-green-500 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
              />
            </div>

            {/* Tombol Create New Archive */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              // DISAMAKAN: padding, ukuran teks, dan tinggi
              className="text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center space-x-1.5 transition-colors bg-demplon hover:bg-green-700 flex-shrink-0">
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
        </div>

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
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              // TAMBAHKAN: class dark mode untuk background, border, dan teks
              className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
              Previous
            </button>

            {/* TAMBAHKAN: class dark mode untuk teks */}
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              // TAMBAHKAN: class dark mode untuk background, border, dan teks
              className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
              Next
            </button>
          </div>
        )}
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
            {/* PERBAIKAN 3: Mengganti inline style dengan Tailwind class */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center space-x-1.5 transition-colors bg-demplon hover:bg-green-700">
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
          onFilterReset={handleFilterReset}
          pagination={pagination}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          expireFilterMethod={expireFilterMethod}
          setExpireFilterMethod={setExpireFilterMethod}
          allTableColumns={allTableColumns}
          visibleColumns={visibleColumns}
          onColumnToggle={handleColumnToggle}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}>
          {viewMode === "list" ? (
            <DocumentTable
              documents={paginatedDocuments}
              visibleColumns={visibleColumns}
            />
          ) : (
            <DocumentGrid documents={paginatedDocuments} />
          )}
        </DocumentsContainer>
      </div>

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
    </>
  );
}
