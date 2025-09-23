import React, { useState, useMemo } from "react";
import { Archive } from "../../types";
import { ArchiveCard, PersonalArchiveCard } from "../ui/ArchiveCards";

interface ArchiveViewProps {
  archives: Archive[];
  archiveDocCounts: Record<string, number>;
  onArchiveClick: (id: string) => void;
}

const ITEMS_PER_PAGE = 8;

const ArchiveView: React.FC<ArchiveViewProps> = ({
  archives,
  archiveDocCounts,
  onArchiveClick,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredArchives = useMemo(() => {
    const archivesInCurrentFolder = archives.filter(
      (a) => a.parentId === "root"
    );
    if (!searchQuery) {
      return archivesInCurrentFolder;
    }
    return archivesInCurrentFolder.filter((archive) =>
      archive.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, archives]);

  const paginatedArchives = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredArchives.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredArchives, currentPage]);

  const totalPages = Math.ceil(filteredArchives.length / ITEMS_PER_PAGE);

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Archives
        </h2>
        <div className="relative max-w-xs">
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
              setCurrentPage(1);
            }}
            className="w-full rounded-md border border-gray-300 bg-white py-1.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 focus:border-green-500 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
          />
        </div>
      </div>

      {paginatedArchives.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6">
          {paginatedArchives.map((archive) =>
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
              />
            )
          )}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
            Previous
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ArchiveView;
