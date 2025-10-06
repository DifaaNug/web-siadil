"use client";

import { Archive } from "../../types";
import { FolderTreeItem } from "../ui/FolderTreeItem";

type MoveArchiveModalProps = {
  archives: Archive[];
  currentArchiveId: string;
  onClose: () => void;
  onMove: (targetArchiveId: string) => void;
};

export const MoveArchiveModal = ({
  archives,
  currentArchiveId,
  onClose,
  onMove,
}: MoveArchiveModalProps) => {
  // Filter out current archive and its children
  const availableArchives = archives.filter(
    (archive) => archive.id !== currentArchiveId
  );
  const rootFolders = availableArchives.filter(
    (archive) => archive.parentId === "root"
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-xl dark:bg-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Pindahkan Item
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-500 dark:text-gray-700"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="max-h-72 overflow-y-auto p-2">
          <ul>
            {/* Root Option */}
            <li>
              <button
                onClick={() => onMove("root")}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <svg
                  className="h-5 w-5 text-teal-600"
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
                <span>Root</span>
              </button>
            </li>
            {rootFolders.map((archive) => (
              <FolderTreeItem
                key={archive.id}
                folder={archive}
                allFolders={availableArchives}
                onMove={onMove}
                level={0}
              />
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};
