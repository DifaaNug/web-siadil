import { forwardRef, ChangeEvent } from "react";
import { Filters } from "../../types";
import { expireInOptions } from "../../data";

type FilterPopoverProps = {
  filters: Filters;
  onFilterChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onCheckboxChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  onApply: () => void;
  expireFilterMethod: "range" | "period";
  setExpireFilterMethod: (method: "range" | "period") => void;
};

export const FilterPopover = forwardRef<HTMLDivElement, FilterPopoverProps>(
  (
    {
      filters,
      onFilterChange,
      onCheckboxChange,
      onReset,
      onApply,
      expireFilterMethod,
      setExpireFilterMethod,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg w-full flex flex-col h-full"
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-600">
          <h3 className="font-semibold text-gray-800 dark:text-white">
            Date Filter
          </h3>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {/* Tanggal Dokumen */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Document Date
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="date"
                name="docDateStart"
                value={filters.docDateStart}
                onChange={onFilterChange}
                className="w-full text-sm text-gray-900 border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              />
              <span className="text-gray-700 dark:text-gray-400">to</span>
              <input
                type="date"
                name="docDateEnd"
                value={filters.docDateEnd}
                onChange={onFilterChange}
                className="w-full text-sm text-gray-900 border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              />
            </div>
          </div>

          {/* Tanggal Kedaluwarsa */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Document Expire Date
            </label>
            <div className="flex border border-gray-300 dark:border-gray-600 rounded-md">
              <button
                onClick={() => setExpireFilterMethod("range")}
                className={`w-1/2 px-3 py-1 text-sm rounded-l-md transition-colors ${
                  expireFilterMethod === "range"
                    ? "bg-demplon text-white"
                    : "bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-300"
                }`}
              >
                By Date Range
              </button>
              <button
                onClick={() => setExpireFilterMethod("period")}
                className={`w-1/2 px-3 py-1 text-sm rounded-r-md transition-colors ${
                  expireFilterMethod === "period"
                    ? "bg-demplon text-white"
                    : "bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-300"
                }`}
              >
                By Period
              </button>
            </div>

            {expireFilterMethod === "range" && (
              <div className="flex items-center space-x-2 mt-2">
                <input
                  type="date"
                  name="expireDateStart"
                  value={filters.expireDateStart}
                  onChange={onFilterChange}
                  className="w-full text-sm text-gray-900 border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                />
                <span className="text-gray-700 dark:text-gray-400">to</span>
                <input
                  type="date"
                  name="expireDateEnd"
                  value={filters.expireDateEnd}
                  onChange={onFilterChange}
                  className="w-full text-sm text-gray-900 border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                />
              </div>
            )}

            {expireFilterMethod === "period" && (
              <div className="mt-3 space-y-2">
                {expireInOptions.map((option) => (
                  <label
                    key={option.id}
                    className="flex items-center space-x-2 text-sm cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={option.id}
                      checked={filters.expireIn[option.id] || false}
                      onChange={onCheckboxChange}
                      className="rounded text-demplon focus:ring-demplon/50 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <span className="text-gray-800 dark:text-gray-300">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
          {/* TAMBAHKAN FILTER TIPE FILE DI SINI */}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-600 flex justify-end space-x-2 bg-gray-50 dark:bg-gray-800/50">
          <button
            onClick={onReset}
            className="px-4 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-600"
          >
            Reset
          </button>
          <button
            onClick={onApply}
            className="px-4 py-1.5 text-sm font-medium text-white bg-demplon border border-transparent rounded-md hover:bg-opacity-90"
          >
            Apply Filters
          </button>
        </div>
      </div>
    );
  }
);

FilterPopover.displayName = "FilterPopover";
