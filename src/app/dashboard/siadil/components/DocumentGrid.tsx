import { Document } from "../types";

export const DocumentGrid = ({ documents }: { documents: Document[] }) => (
  <div className="p-5 grid grid-cols-4  gap-5">
    {documents.map((doc) => (
      <div
        key={doc.id}
        className="group relative rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:bg-gray-50 hover:border-brand dark:hover:border-brand transition-all cursor-pointer">
        <div className="flex items-start mb-3">
          <div className="flex-shrink-0">
            <svg
              className="w-8 h-8 text-gray-400 dark:text-gray-500 transition-colors group-hover:text-brand"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div className="ml-3 min-w-0">
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
              {doc.number}
            </p>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white mt-1">
              {doc.title}
            </h4>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Updated: {new Date(doc.updatedDate).toLocaleDateString("id-ID")}
        </p>
      </div>
    ))}
  </div>
);
