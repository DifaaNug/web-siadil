// src/components/CreateArchiveModal.tsx

import { useState } from "react";

// Tipe data ini bisa diimpor dari file utama atau didefinisikan ulang
type Archive = {
  id: string;
  name: string;
  code: string;
  parentId: string;
};

type CreateArchiveModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (archiveData: { name: string; parentId: string }) => void;
  archives: Archive[]; // Diperlukan untuk memilih parent
  currentFolderId: string;
};

const CreateArchiveModal = ({
  isOpen,
  onClose,
  onSave,
  archives,
  currentFolderId,
}: CreateArchiveModalProps) => {
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState(currentFolderId);

  // Jika modal tidak terbuka, jangan render apa-apa
  if (!isOpen) return null;

  const handleSave = () => {
    if (name.trim()) {
      onSave({ name, parentId });
      setName(""); // Reset form setelah save
      onClose();
    } else {
      alert("Nama arsip tidak boleh kosong!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 transition-opacity duration-300">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-xl dark:bg-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between rounded-t-lg border-b border-gray-200 p-5 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Create New Archive
          </h3>
          <button
            onClick={onClose}
            className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"></path>
            </svg>
          </button>
        </div>

        {/* Body / Form */}
        <div className="space-y-6 p-5">
          <div>
            <label
              htmlFor="archiveName"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nama Arsip
            </label>
            <input
              type="text"
              id="archiveName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Laporan Keuangan 2025"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
              autoFocus
            />
          </div>
          <div>
            <label
              htmlFor="parentId"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Simpan di dalam
            </label>
            <select
              id="parentId"
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200">
              <option value="root">Root</option>
              {archives.map((archive) => (
                <option key={archive.id} value={archive.id}>
                  {archive.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-2 rounded-b-lg border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">
            Save Archive
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateArchiveModal;
