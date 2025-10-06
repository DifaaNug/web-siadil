import React from "react";

interface EmptyTrashModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  filterType: "all" | "documents" | "folders";
  documentsCount: number;
  foldersCount: number;
}

const EmptyTrashModal: React.FC<EmptyTrashModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  filterType,
  documentsCount,
  foldersCount,
}) => {
  if (!isOpen) return null;

  const getTitle = () => {
    switch (filterType) {
      case "documents":
        return "Empty Documents from Trash?";
      case "folders":
        return "Empty Folders from Trash?";
      default:
        return "Empty Trash?";
    }
  };

  const getMessage = () => {
    switch (filterType) {
      case "documents":
        return `Are you sure you want to permanently delete ${documentsCount} document${
          documentsCount !== 1 ? "s" : ""
        }? This action cannot be undone.`;
      case "folders":
        return `Are you sure you want to permanently delete ${foldersCount} folder${
          foldersCount !== 1 ? "s" : ""
        }? This action cannot be undone.`;
      default:
        return `Are you sure you want to permanently delete all ${
          documentsCount + foldersCount
        } items (${documentsCount} document${
          documentsCount !== 1 ? "s" : ""
        } and ${foldersCount} folder${
          foldersCount !== 1 ? "s" : ""
        })? This action cannot be undone.`;
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Icon */}
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-red-600 dark:text-red-400"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {getTitle()}
            </h3>
          </div>
        </div>

        {/* Message */}
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          {getMessage()}
        </p>

        {/* Warning Box */}
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <div className="flex items-start gap-2">
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
              className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="text-xs text-red-800 dark:text-red-300 font-medium">
              Warning: This action is permanent and cannot be undone. All items
              will be permanently deleted.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 border border-red-700 rounded-lg hover:bg-red-700 hover:shadow-lg dark:bg-red-600 dark:border-red-700 dark:hover:bg-red-700 transition-all"
          >
            Delete Permanently
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmptyTrashModal;
