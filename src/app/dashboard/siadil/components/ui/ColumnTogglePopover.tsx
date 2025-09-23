"use client";

import { forwardRef } from "react";

type Column = {
  id: string;
  label: string;
};

type ColumnTogglePopoverProps = {
  columns: Column[];
  visibleColumns: Set<string>;
  onColumnToggle: (columnId: string) => void;
};

export const ColumnTogglePopover = forwardRef<
  HTMLDivElement,
  ColumnTogglePopoverProps
>(({ columns, visibleColumns, onColumnToggle }, ref) => {
  return (
    <div
      ref={ref}
      className="w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
      <div className="p-3">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
          Toggle columns
        </h3>
        <div className="space-y-1">
          {columns.map((col) => (
            <button
              key={col.id}
              onClick={() => onColumnToggle(col.id)}
              className="w-full flex items-center space-x-2 cursor-pointer p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-left">
              <div className="w-4 h-4 flex items-center justify-center">
                {visibleColumns.has(col.id) && (
                  <svg
                    className="w-4 h-4 text-gray-800 dark:text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="3">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {col.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

ColumnTogglePopover.displayName = "ColumnTogglePopover";
