"use client";

import { useState, useEffect } from "react";
import { Archive } from "../../types";

type EditArchiveModalProps = {
  archive: Archive;
  onClose: () => void;
  onSave: (archiveId: string, newName: string) => void;
};

export const EditArchiveModal = ({
  archive,
  onClose,
  onSave,
}: EditArchiveModalProps) => {
  const [archiveName, setArchiveName] = useState(archive.name);

  useEffect(() => {
    setArchiveName(archive.name);
  }, [archive]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (archiveName.trim()) {
      onSave(archive.id, archiveName.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-2xl dark:bg-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Edit Archive
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
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

        {/* Subtitle */}
        <div className="px-6 pt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Update the archive name below.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Archive Name */}
            <div>
              <label
                htmlFor="archiveName"
                className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Archive Name
              </label>
              <input
                type="text"
                id="archiveName"
                value={archiveName}
                onChange={(e) => setArchiveName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-teal-400"
                placeholder="Enter archive name"
                required
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Nama folder/archive
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg bg-gradient-to-br from-teal-600 to-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:from-teal-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
