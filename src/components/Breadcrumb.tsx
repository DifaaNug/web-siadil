// src/components/Breadcrumb.tsx

import React from "react";

// Mendefinisikan tipe untuk setiap item breadcrumb
type BreadcrumbItem = {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => {
          const isLastItem = index === items.length - 1;

          return (
            <li key={index} className="flex items-center space-x-2">
              {/* Tampilkan item sebagai tombol jika BUKAN item terakhir */}
              {!isLastItem ? (
                <button
                  onClick={item.onClick}
                  className="flex items-center space-x-1.5 rounded-md border border-gray-200 bg-white px-2 py-1 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                  {item.icon && (
                    <span className="flex-shrink-0">{item.icon}</span>
                  )}
                  <span>{item.label}</span>
                </button>
              ) : (
                // Tampilkan sebagai teks biasa jika INI item terakhir (halaman aktif)
                <span
                  className="flex items-center space-x-1.5 rounded-md border border-gray-300 bg-gray-100 px-2 py-1 text-sm font-semibold text-gray-800 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  aria-current="page">
                  {item.icon && (
                    <span className="flex-shrink-0">{item.icon}</span>
                  )}
                  <span>{item.label}</span>
                </span>
              )}

              {/* Tampilkan panah pemisah jika bukan item terakhir */}
              {!isLastItem && (
                <svg
                  className="h-3.5 w-3.5 flex-shrink-0 text-gray-400 dark:text-gray-500" // Ukuran diubah ke 16px
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2} // Ketebalan diubah ke 2
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
