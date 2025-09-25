// src/app/dashboard/siadil/components/ui/UserInfoCard.tsx

import React from "react";

export const UserInfoCard = () => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center">
        {/* Ikon Pengguna */}
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
          <svg
            className="h-7 w-7 text-green-700 dark:text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        {/* Detail Info */}
        <div className="ml-4 flex-grow">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-gray-900 dark:text-white">
              Personal
            </h4>
            <span className="flex items-center gap-1 rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-demplon dark:bg-green-900/50 dark:text-green-300">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 1a1.5 1.5 0 00-1.5 1.5v2h3v-2A1.5 1.5 0 0010 1zm-3 4.5a1.5 1.5 0 00-1.5 1.5v9A1.5 1.5 0 007 17.5h6a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0013 5.5H7z" />
              </svg>
              Personal
            </span>
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>ID: 1990123</span>
            <span>Dept: —</span>
          </div>
        </div>
      </div>
    </div>
  );
};
