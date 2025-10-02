import { forwardRef, ChangeEvent, useState } from "react";
import { Filters } from "../../types";
import { expireInOptions } from "../../data";
import { Calendar as CalendarIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

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
    // Controlled popover open states for auto close
    const [openDocStart, setOpenDocStart] = useState(false);
    const [openDocEnd, setOpenDocEnd] = useState(false);
    const [openExpStart, setOpenExpStart] = useState(false);
    const [openExpEnd, setOpenExpEnd] = useState(false);

    return (
      <div
        ref={ref}
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg w-full flex flex-col h-full">
        <div className="p-4 border-b border-gray-200 dark:border-gray-600">
          <h3 className="font-semibold text-gray-800 dark:text-white">
            Date Filter
          </h3>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {/* Tanggal Dokumen (Start & End) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Document Date
            </label>
            <div className="flex items-center space-x-2">
              {/* Start Date */}
              <Popover open={openDocStart} onOpenChange={setOpenDocStart}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal text-sm",
                      !filters.docDateStart && "text-muted-foreground"
                    )}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.docDateStart ? (
                      format(parseISO(filters.docDateStart), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  data-filter-date-popover
                  className="w-auto p-0"
                  align="start">
                  <Calendar
                    mode="single"
                    selected={
                      filters.docDateStart
                        ? parseISO(filters.docDateStart)
                        : undefined
                    }
                    onSelect={(d) => {
                      const val = d ? format(d, "yyyy-MM-dd") : "";
                      const syntheticEvent = {
                        target: { name: "docDateStart", value: val },
                      } as unknown as ChangeEvent<HTMLInputElement>;
                      onFilterChange(syntheticEvent);
                      // Jika end sebelum start, reset end
                      if (
                        filters.docDateEnd &&
                        d &&
                        parseISO(filters.docDateEnd) < d
                      ) {
                        const ev2 = {
                          target: { name: "docDateEnd", value: "" },
                        } as unknown as ChangeEvent<HTMLInputElement>;
                        onFilterChange(ev2);
                      }
                      if (d) setOpenDocStart(false);
                    }}
                    captionLayout="dropdown"
                    fromYear={1980}
                    toYear={2040}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <span className="text-gray-700 dark:text-gray-400">to</span>
              {/* End Date */}
              <Popover open={openDocEnd} onOpenChange={setOpenDocEnd}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal text-sm",
                      !filters.docDateEnd && "text-muted-foreground"
                    )}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.docDateEnd ? (
                      format(parseISO(filters.docDateEnd), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  data-filter-date-popover
                  className="w-auto p-0"
                  align="start">
                  <Calendar
                    mode="single"
                    selected={
                      filters.docDateEnd
                        ? parseISO(filters.docDateEnd)
                        : undefined
                    }
                    onSelect={(d) => {
                      if (
                        d &&
                        filters.docDateStart &&
                        d < parseISO(filters.docDateStart)
                      )
                        return; // block invalid
                      const val = d ? format(d, "yyyy-MM-dd") : "";
                      const syntheticEvent = {
                        target: { name: "docDateEnd", value: val },
                      } as unknown as ChangeEvent<HTMLInputElement>;
                      onFilterChange(syntheticEvent);
                      if (d) setOpenDocEnd(false);
                    }}
                    disabled={(d) => {
                      return !!(
                        filters.docDateStart &&
                        d < parseISO(filters.docDateStart)
                      );
                    }}
                    captionLayout="dropdown"
                    fromYear={1980}
                    toYear={2040}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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
                }`}>
                By Date Range
              </button>
              <button
                onClick={() => setExpireFilterMethod("period")}
                className={`w-1/2 px-3 py-1 text-sm rounded-r-md transition-colors ${
                  expireFilterMethod === "period"
                    ? "bg-demplon text-white"
                    : "bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-300"
                }`}>
                By Period
              </button>
            </div>

            {expireFilterMethod === "range" && (
              <div className="flex items-center space-x-2 mt-2">
                {/* Expire Start */}
                <Popover open={openExpStart} onOpenChange={setOpenExpStart}>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal text-sm",
                        !filters.expireDateStart && "text-muted-foreground"
                      )}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.expireDateStart ? (
                        format(parseISO(filters.expireDateStart), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    data-filter-date-popover
                    className="w-auto p-0"
                    align="start">
                    <Calendar
                      mode="single"
                      selected={
                        filters.expireDateStart
                          ? parseISO(filters.expireDateStart)
                          : undefined
                      }
                      onSelect={(d) => {
                        const val = d ? format(d, "yyyy-MM-dd") : "";
                        const syntheticEvent = {
                          target: { name: "expireDateStart", value: val },
                        } as unknown as ChangeEvent<HTMLInputElement>;
                        onFilterChange(syntheticEvent);
                        // reset end if invalid
                        if (
                          filters.expireDateEnd &&
                          d &&
                          parseISO(filters.expireDateEnd) < d
                        ) {
                          const ev2 = {
                            target: { name: "expireDateEnd", value: "" },
                          } as unknown as ChangeEvent<HTMLInputElement>;
                          onFilterChange(ev2);
                        }
                        if (d) setOpenExpStart(false);
                      }}
                      captionLayout="dropdown"
                      fromYear={1980}
                      toYear={2040}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <span className="text-gray-700 dark:text-gray-400">to</span>
                {/* Expire End */}
                <Popover open={openExpEnd} onOpenChange={setOpenExpEnd}>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal text-sm",
                        !filters.expireDateEnd && "text-muted-foreground"
                      )}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.expireDateEnd ? (
                        format(parseISO(filters.expireDateEnd), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    data-filter-date-popover
                    className="w-auto p-0"
                    align="start">
                    <Calendar
                      mode="single"
                      selected={
                        filters.expireDateEnd
                          ? parseISO(filters.expireDateEnd)
                          : undefined
                      }
                      onSelect={(d) => {
                        if (
                          d &&
                          filters.expireDateStart &&
                          d < parseISO(filters.expireDateStart)
                        )
                          return;
                        const val = d ? format(d, "yyyy-MM-dd") : "";
                        const syntheticEvent = {
                          target: { name: "expireDateEnd", value: val },
                        } as unknown as ChangeEvent<HTMLInputElement>;
                        onFilterChange(syntheticEvent);
                        if (d) setOpenExpEnd(false);
                      }}
                      disabled={(d) =>
                        !!(
                          filters.expireDateStart &&
                          d < parseISO(filters.expireDateStart)
                        )
                      }
                      captionLayout="dropdown"
                      fromYear={1980}
                      toYear={2040}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {expireFilterMethod === "period" && (
              <div className="mt-3 space-y-2">
                {expireInOptions.map((option) => (
                  <label
                    key={option.id}
                    className="flex items-center space-x-2 text-sm cursor-pointer">
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
          <div>
            <label
              htmlFor="fileType"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              File Type (e.g., pdf, docx)
            </label>
            <input
              type="text"
              name="fileType"
              id="fileType"
              value={filters.fileType || ""}
              onChange={onFilterChange}
              className="w-full text-sm text-gray-900 border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              placeholder="pdf"
            />
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-600 flex justify-end space-x-2 bg-gray-50 dark:bg-gray-800/50">
          <button
            onClick={onReset}
            className="px-4 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-600">
            Reset
          </button>
          <button
            onClick={onApply}
            className="px-4 py-1.5 text-sm font-medium text-white bg-demplon border border-transparent rounded-md hover:bg-opacity-90">
            Apply Filters
          </button>
        </div>
      </div>
    );
  }
);

FilterPopover.displayName = "FilterPopover";
