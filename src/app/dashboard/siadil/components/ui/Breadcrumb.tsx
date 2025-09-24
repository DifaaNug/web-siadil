import React from "react";

type BreadcrumbItem = {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
};

// Pastikan tipe props ini didefinisikan dengan benar
type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

// Pastikan komponen menggunakan tipe props yang benar (BreadcrumbProps)
const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => {
          const isLastItem = index === items.length - 1;

          return (
            <li key={index} className="flex items-center space-x-2">
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
                <span
                  className="flex items-center space-x-1.5 text-sm font-semibold text-gray-800 dark:text-gray-200"
                  aria-current="page">
                  {item.icon && (
                    <span className="flex-shrink-0">{item.icon}</span>
                  )}
                  <span>{item.label}</span>
                </span>
              )}

              {!isLastItem && (
                <svg
                  className="h-3.5 w-3.5 flex-shrink-0 text-gray-400 dark:text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
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
