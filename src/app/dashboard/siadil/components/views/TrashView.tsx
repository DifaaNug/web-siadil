import React from "react";
import { Document, Archive } from "../../types";

interface TrashViewProps {
  documents: Document[];
  archives: Archive[];
  trashedArchives: Archive[];
  onRestore: (docId: string) => void;
  onDeletePermanently: (docId: string) => void;
  onRestoreArchive: (archiveId: string) => void;
  onDeleteArchivePermanently: (archiveId: string) => void;
}

const TrashView: React.FC<TrashViewProps> = ({
  documents,
  archives,
  trashedArchives,
  onRestore,
  onDeletePermanently,
  onRestoreArchive,
  onDeleteArchivePermanently,
}) => {
  const [filter, setFilter] = React.useState<"all" | "documents" | "folders">(
    "all"
  );

  const getParentArchiveName = (parentId: string) => {
    const parent = archives.find((a) => a.id === parentId);
    return parent ? parent.name : "Unknown Archive";
  };

  const filteredDocuments = filter === "folders" ? [] : documents;
  const filteredArchives = filter === "documents" ? [] : trashedArchives;

  const handleEmptyTrash = () => {
    alert("Fungsi 'Empty Trash' perlu diimplementasikan di halaman utama.");
  };

  return (
    <div className="mb-10">
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            filter === "all"
              ? "border-teal-600 text-teal-600"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
          }`}
        >
          All ({documents.length + trashedArchives.length})
        </button>
        <button
          onClick={() => setFilter("documents")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            filter === "documents"
              ? "border-teal-600 text-teal-600"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
          }`}
        >
          Documents ({documents.length})
        </button>
        <button
          onClick={() => setFilter("folders")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            filter === "folders"
              ? "border-teal-600 text-teal-600"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
          }`}
        >
          Folders ({trashedArchives.length})
        </button>
      </div>

      {/* Keterangan di bawah judul, bisa kita gabungkan atau modifikasi di page.tsx jika perlu */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Items here will be automatically deleted after 30 days.
        </p>
        {(documents.length > 0 || trashedArchives.length > 0) && (
          <button
            onClick={handleEmptyTrash}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800 dark:hover:bg-red-900"
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
              <path d="M3 6h18" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
            <span>Empty Trash</span>
          </button>
        )}
      </div>

      {filteredDocuments.length > 0 || filteredArchives.length > 0 ? (
        <div className="space-y-3">
          {/* Render Folders */}
          {filteredArchives.map((archive) => (
            <div
              key={archive.id}
              className="flex items-center justify-between p-4 rounded-lg border bg-white hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {archive.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    ID: {archive.id} | Folder | Dihapus pada:{" "}
                    {new Date().toLocaleDateString("id-ID")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => onRestoreArchive(archive.id)}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  Restore
                </button>
                <button
                  onClick={() => onDeleteArchivePermanently(archive.id)}
                  className="p-1.5 text-gray-500 rounded-md hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 dark:hover:text-red-400"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
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
                </button>
              </div>
            </div>
          ))}

          {/* Render Documents */}
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-4 rounded-lg border bg-white hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600"
            >
              <div className="flex items-center gap-4">
                <svg
                  className="w-8 h-8 text-gray-400 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {doc.title} ({getParentArchiveName(doc.parentId)})
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    ID: {doc.id} | Dihapus pada:{" "}
                    {new Date().toLocaleDateString("id-ID")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => onRestore(doc.id)}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  Restore
                </button>
                <button
                  onClick={() => onDeletePermanently(doc.id)}
                  className="p-1.5 text-gray-500 rounded-md hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 dark:hover:text-red-400"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
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
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h5l2 2h5a2 2 0 012 2v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
            Trash is Empty
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {filter === "documents"
              ? "Deleted documents will appear here."
              : filter === "folders"
              ? "Deleted folders will appear here."
              : "Deleted items will appear here."}
          </p>
        </div>
      )}
    </div>
  );
};

export default TrashView;
