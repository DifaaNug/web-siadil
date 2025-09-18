// src/app/dashboard/siadil/components/ArchiveFilterPopover.tsx

import { forwardRef, useState } from "react";
import { Archive } from "../types";

type Props = {
  allArchives: Archive[];
  selectedArchives: string[];
  onArchiveChange: (archiveCode: string, isChecked: boolean) => void;
};

export const ArchiveFilterPopover = forwardRef<HTMLDivElement, Props>(
  ({ allArchives, selectedArchives, onArchiveChange }, ref) => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredArchives = allArchives.filter((archive) =>
      archive.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div
        ref={ref}
        className="w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg flex flex-col">
        {/* Header dan Search Input */}
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
            Archive Filter
          </h3>
          <input
            type="text"
            placeholder="Search Archive"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white py-1.5 px-3 text-sm text-gray-900 placeholder-gray-500 focus:border-green-500 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
          />
        </div>

        {/* Daftar Checkbox */}
        <div className="p-3 space-y-2 overflow-y-auto max-h-60">
          {filteredArchives.length > 0 ? (
            filteredArchives.map((archive) => (
              <label
                key={archive.id}
                className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded text-demplon focus:ring-demplon/50 h-4 w-4"
                  checked={selectedArchives.includes(archive.code)}
                  onChange={(e) =>
                    onArchiveChange(archive.code, e.target.checked)
                  }
                />
                <span className="text-sm text-gray-800 dark:text-gray-300">
                  {archive.name}
                </span>
              </label>
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              Arsip tidak ditemukan.
            </p>
          )}
        </div>
      </div>
    );
  }
);

ArchiveFilterPopover.displayName = "ArchiveFilterPopover";
