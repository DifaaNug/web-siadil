import React from "react";
import { ActivityLog } from "../../types";

interface ActivityLogViewProps {
  logs: ActivityLog[];
}

const ActivityLogView: React.FC<ActivityLogViewProps> = ({ logs }) => {
  const getActionInfo = (action: ActivityLog["action"]) => {
    switch (action) {
      case "CREATE_DOCUMENT":
        return { text: "menambahkan dokumen baru", color: "text-green-500" };
      case "EDIT_DOCUMENT":
        return { text: "memperbarui dokumen", color: "text-blue-500" };
      case "MOVE_DOCUMENT":
        return { text: "memindahkan dokumen", color: "text-yellow-500" };
      case "TRASH_DOCUMENT":
        return {
          text: "memindahkan dokumen ke sampah",
          color: "text-orange-500",
        };
      case "DELETE_DOCUMENT":
        return { text: "menghapus dokumen permanen", color: "text-red-500" };
      case "RESTORE_DOCUMENT":
        return { text: "memulihkan dokumen", color: "text-purple-500" };
      case "CREATE_ARCHIVE":
        return { text: "membuat arsip baru", color: "text-indigo-500" };
      default:
        return { text: "melakukan aksi", color: "text-gray-500" };
    }
  };

  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Log Aktivitas
      </h2>
      {logs.length > 0 ? (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {logs.map((log) => {
              const actionInfo = getActionInfo(log.action);
              return (
                <li key={log.id} className="p-4 flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-gray-600 dark:text-gray-300">
                      {log.user.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      <span className="font-semibold">{log.user}</span>{" "}
                      <span className={actionInfo.color}>
                        {actionInfo.text}
                      </span>{" "}
                      <span className="font-semibold text-demplon">
                        `{log.documentTitle}`
                      </span>
                    </p>
                    {log.details && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {log.details}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {new Date(log.timestamp).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 py-10">
          Belum ada aktivitas yang tercatat.
        </p>
      )}
    </div>
  );
};

export default ActivityLogView;
