import { Document } from "../types";

export const DocumentTable = ({ documents }: { documents: Document[] }) => {
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "numeric",
      year: "numeric",
    });

  return (
    <table className="w-full">
      <thead className="bg-gray-50 dark:bg-gray-700">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            ID
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Number & Title
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Description
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Document Date
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Contributors
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Archive
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Update & Create By
          </th>
          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        {documents.map((doc) => (
          <tr
            key={doc.id}
            className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              {doc.id}
            </td>
            <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
              <div className="font-medium">{doc.number}</div>
              <div className="text-gray-500 dark:text-gray-400">
                {doc.title}
              </div>
            </td>
            <td
              className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate"
              title={doc.description}>
              {doc.description}
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              {formatDate(doc.documentDate)}
            </td>
            <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
              <div className="flex -space-x-2">
                {doc.contributors.slice(0, 3).map((c, i) => (
                  <div
                    key={i}
                    title={c.name}
                    className="w-7 h-7 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300 ring-2 ring-white dark:ring-gray-800">
                    {c.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                ))}
                {doc.contributors.length > 3 && (
                  <div className="w-7 h-7 bg-gray-300 dark:bg-gray-500 rounded-full flex items-center justify-center text-xs font-medium text-gray-700 dark:text-gray-200 ring-2 ring-white dark:ring-gray-800">
                    +{doc.contributors.length - 3}
                  </div>
                )}
              </div>
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm">
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                {doc.archive}
              </span>
            </td>
            <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
              <div>
                <div className="font-semibold">
                  Updated: {formatDate(doc.updatedDate)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  by {doc.updatedBy}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Created by: {doc.createdBy}
                </div>
              </div>
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button className="text-gray-500 hover:text-gray-900 dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
