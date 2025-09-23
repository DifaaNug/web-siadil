"use client";

import { Archive } from "../types";
import { FolderTreeItem } from "./FolderTreeItem";

type MoveToModalProps = {
  archives: Archive[];
  onClose: () => void;
  onMove: (targetArchiveId: string) => void;
};

export const MoveToModal = ({
  archives,
  onClose,
  onMove,
}: MoveToModalProps) => {
  const rootFolders = archives.filter((archive) => archive.parentId === "root");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-xl dark:bg-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Pindahkan Item
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-400 dark:text-gray-700">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-2 max-h-72 overflow-y-auto">
          <ul>
            {rootFolders.map((archive) => (
              <FolderTreeItem
                key={archive.id}
                folder={archive}
                allFolders={archives}
                onMove={onMove}
                level={0}
              />
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};
