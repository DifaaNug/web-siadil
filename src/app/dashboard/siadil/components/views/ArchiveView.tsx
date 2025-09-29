import React, { useState, useMemo } from "react";
import { Archive } from "../../types";
import { ArchiveCard, PersonalArchiveCard } from "../ui/ArchiveCards";

interface ArchiveViewProps {
  archives: Archive[];
  archiveDocCounts: Record<string, number>;
  onArchiveClick: (id: string) => void;
  searchQuery: string;
}

const ITEMS_PER_PAGE = 8;

const ArchiveView: React.FC<ArchiveViewProps> = ({
  archives,
  archiveDocCounts,
  onArchiveClick,
  searchQuery,
}) => {
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

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
            currentPage === i
              ? "bg-demplon text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}>
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="mb-10">
      {paginatedArchives.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6">
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
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <p className="text-gray-500">No archives found.</p>
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

          {renderPageNumbers()}

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
