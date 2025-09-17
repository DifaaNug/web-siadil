import { forwardRef, ChangeEvent } from "react";
import { Filters, Archive } from "../types";
import { expireInOptions } from "../data";

type FilterPopoverProps = {
  filters: Filters;
  archives: Archive[];
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
      archives,
      onFilterChange,
      onCheckboxChange,
      onReset,
      onApply,
      expireFilterMethod,
      setExpireFilterMethod,
    },
    ref
  ) => {
    const activeTabClass =
      "text-gray-600 dark:text-gray-400 border-b-2 border-gray-600";
    const inactiveTabClass =
      "text-gray-500 dark:text-gray-400 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200";

    return (
      <div
        ref={ref}
        className="flex w-full max-w-md flex-col rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800 max-h-[70vh]">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Filter Dokumen
          </h3>
        </div>

        <div className="flex-grow overflow-y-auto p-5">
          <div className="space-y-8">
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="keyword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Pencarian Utama
                </label>
                <input
                  type="text"
                  id="keyword"
                  name="keyword"
                  value={filters.keyword}
                  onChange={onFilterChange}
                  placeholder="Cari berdasarkan nomor, judul..."
                  className="w-full text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md focus:ring-green-500 focus:border-green-500 text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 px-3 py-2"
                />
              </div>
              <div className="relative">
                <label
                  htmlFor="archive-filter"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Arsip
                </label>
                <select
                  id="archive-filter"
                  name="archive"
                  value={filters.archive}
                  onChange={onFilterChange}
                  className="w-full text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md focus:ring-green-500 focus:border-green-500 text-gray-900 dark:text-gray-200 appearance-none pr-8 px-3 py-2">
                  <option value="All">Semua Arsip</option>
                  {archives.map((a) => (
                    <option key={a.code} value={a.code}>
                      {a.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 top-7 flex items-center px-2 text-gray-700 dark:text-gray-400">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Tanggal Dokumen
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="date"
                    name="docDateStart"
                    value={filters.docDateStart}
                    onChange={onFilterChange}
                    className="w-full text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md focus:ring-gray-500 focus:border-gray-500 text-gray-900 dark:text-gray-200 px-3 py-2"
                  />
                  <span className="text-gray-500 text-sm">to</span>
                  <input
                    type="date"
                    name="docDateEnd"
                    value={filters.docDateEnd}
                    onChange={onFilterChange}
                    className="w-full text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md focus:ring-gray-500 focus:border-gray-500 text-gray-900 dark:text-gray-200 px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tanggal Kedaluwarsa
                </label>
                <div className="flex border-b border-gray-200 dark:border-gray-700 mb-3">
                  <button
                    onClick={() => setExpireFilterMethod("range")}
                    className={`w-1/2 pb-2 text-sm font-semibold transition-colors ${
                      expireFilterMethod === "range"
                        ? activeTabClass
                        : inactiveTabClass
                    }`}>
                    By Date Range
                  </button>
                  <button
                    onClick={() => setExpireFilterMethod("period")}
                    className={`w-1/2 pb-2 text-sm font-semibold transition-colors ${
                      expireFilterMethod === "period"
                        ? activeTabClass
                        : inactiveTabClass
                    }`}>
                    By Period
                  </button>
                </div>
                <div>
                  {expireFilterMethod === "range" && (
                    <div className="flex items-center gap-3">
                      <input
                        type="date"
                        name="expireDateStart"
                        value={filters.expireDateStart}
                        onChange={onFilterChange}
                        className="w-full text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md focus:ring-gray-500 focus:border-gray-500 text-gray-900 dark:text-gray-200 px-3 py-2"
                      />
                      <span className="text-gray-500 text-sm">to</span>
                      <input
                        type="date"
                        name="expireDateEnd"
                        value={filters.expireDateEnd}
                        onChange={onFilterChange}
                        className="w-full text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md focus:ring-gray-500 focus:border-gray-500 text-gray-900 dark:text-gray-200 px-3 py-2"
                      />
                    </div>
                  )}
                  {expireFilterMethod === "period" && (
                    <div className="space-y-2.5">
                      {expireInOptions.map((option) => (
                        <label
                          key={option.id}
                          className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            name="expireIn"
                            value={option.id}
                            checked={filters.expireIn.includes(option.id)}
                            onChange={onCheckboxChange}
                            className="rounded text-gray-600 focus:ring-gray-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-end items-center space-x-3">
          <button
            onClick={onReset}
            className="px-4 py-2 text-sm font-semibold border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            Reset
          </button>
          <button
            onClick={onApply}
            className="px-4 py-2 text-sm font-semibold rounded-lg text-white transition-colors bg-demplon hover:bg-gray-700">
            Apply Filters
          </button>
        </div>
      </div>
    );
  }
);
FilterPopover.displayName = "FilterPopover";
