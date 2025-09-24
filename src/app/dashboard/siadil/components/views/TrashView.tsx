import React from "react";
import { Document } from "../../types";

interface TrashViewProps {
  documents: Document[];
  onRestore: (docId: string) => void;
  onDeletePermanently: (docId: string) => void;
}

const TrashView: React.FC<TrashViewProps> = ({
  documents,
  onRestore,
  onDeletePermanently,
}) => {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Trash
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Items here will be automatically deleted after 30 days.
      </p>

      {documents.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {documents.map((doc) => (
              <li
                key={doc.id}
                className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <div className="flex items-center gap-4">
                  <svg
                    className="w-6 h-6 text-gray-400 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {doc.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      ID: {doc.id} | Dihapus pada:{" "}
                      {new Date().toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onRestore(doc.id)}
                    className="px-3 py-1 text-sm font-semibold text-blue-600 hover:text-blue-800">
                    Restore
                  </button>
                  <button
                    onClick={() => onDeletePermanently(doc.id)}
                    className="px-3 py-1 text-sm font-semibold text-red-600 hover:text-red-800">
                    Delete Permanently
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true">
            <path
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h5l2 2h5a2 2 0 012 2v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
            Empty Trash Can
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            The documents you deleted will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default TrashView;
