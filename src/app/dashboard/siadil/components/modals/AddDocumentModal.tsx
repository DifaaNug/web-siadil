"use client";

import * as React from "react";
import { ChangeEvent, useEffect, useState, DragEvent } from "react";
import { NewDocumentData, Archive } from "../../types";
import { HierarchicalArchivePicker } from "./HierarchicalArchivePicker";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type AddDocumentModalProps = {
  onClose: () => void;
  onSave: () => void; // onSave akan menggunakan state 'newDocument' yang sudah terupdate
  newDocument: NewDocumentData;
  setNewDocument: (
    value: NewDocumentData | ((prevState: NewDocumentData) => NewDocumentData)
  ) => void;
  archives: Archive[];
  editingDocId: string | null;
  baseArchiveId?: string;
};

export const AddDocumentModal = ({
  onClose,
  onSave,
  newDocument,
  setNewDocument,
  archives,
  editingDocId,
  baseArchiveId = "root",
}: AddDocumentModalProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const isEditing = !!editingDocId;

  // State lokal untuk kalender, diinisialisasi dari props 'newDocument'
  // Ini penting agar saat mode 'edit', tanggal yang ada akan ditampilkan
  const [documentDate, setDocumentDate] = React.useState<Date | undefined>(
    newDocument.documentDate ? new Date(newDocument.documentDate) : undefined
  );
  const [expireDate, setExpireDate] = React.useState<Date | undefined>(
    newDocument.expireDate ? new Date(newDocument.expireDate) : undefined
  );
  // Popover open states for auto-close behavior
  const [openDocDate, setOpenDocDate] = React.useState(false);
  const [openExpireDate, setOpenExpireDate] = React.useState(false);

  // Gunakan useEffect untuk menyinkronkan state lokal kalender ke state utama 'newDocument'
  useEffect(() => {
    const formattedDate = documentDate
      ? format(documentDate, "yyyy-MM-dd")
      : "";
    if (formattedDate !== newDocument.documentDate) {
      setNewDocument((prev) => ({ ...prev, documentDate: formattedDate }));
    }
    // Jika expireDate tidak valid lagi (<= documentDate) maka reset
    if (documentDate && expireDate && expireDate <= documentDate) {
      setExpireDate(undefined);
    }
  }, [documentDate, newDocument.documentDate, setNewDocument, expireDate]);

  useEffect(() => {
    const formattedDate = expireDate ? format(expireDate, "yyyy-MM-dd") : "";
    if (formattedDate !== newDocument.expireDate) {
      setNewDocument((prev) => ({ ...prev, expireDate: formattedDate }));
    }
  }, [expireDate, newDocument.expireDate, setNewDocument]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (e.target.type === "file") {
      const files = (e.target as HTMLInputElement).files;
      setNewDocument((prevDoc) => ({
        ...prevDoc,
        file: files ? files[0] : null,
      }));
    } else {
      setNewDocument((prevDoc) => ({ ...prevDoc, [name]: value }));
    }
  };
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation(); // Ini penting untuk mencegah browser membuka file
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setNewDocument((prevDoc) => ({
        ...prevDoc,
        file: files[0], // Ambil file pertama yang di-drop
      }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 transition-opacity duration-300">
      <div className="flex w-full max-w-xl flex-col rounded-lg bg-white shadow-xl dark:bg-gray-800 max-h-[90vh]">
        {/* === HEADER === */}
        <div className="flex items-start justify-between rounded-t-lg border-b border-gray-200 p-5 dark:border-gray-700">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {isEditing ? "Edit Document" : "Add New Document"}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {isEditing
                ? "Update the document details below."
                : "Add new document here. Click save when you're done."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* === BODY === */}
        <div className="overflow-y-auto p-5">
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
            {/* --- Archive (Hierarchical Picker) --- */}
            <div className="md:col-span-2">
              <HierarchicalArchivePicker
                archives={archives}
                baseArchiveId={baseArchiveId}
                value={newDocument.archive}
                onChange={(code) =>
                  setNewDocument((prev) => ({ ...prev, archive: code }))
                }
                selectionKey="code"
                excludeBase={true}
                showRootOptionAtRoot={true}
                label="Archive"
                placeholder="Select Archive"
                showChildCount={true}
              />
            </div>

            {/* --- Number --- */}
            <div className="md:col-span-2">
              <label
                htmlFor="number"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Number
              </label>
              <input
                type="text"
                name="number"
                id="number"
                value={newDocument.number}
                onChange={handleInputChange}
                placeholder="Enter Number"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Seperti nomor Memo/PR/PO/dsb.
              </p>
            </div>

            {/* --- Title --- */}
            <div className="md:col-span-2">
              <label
                htmlFor="title"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={newDocument.title}
                onChange={handleInputChange}
                placeholder="Enter Title"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Judul dokumen
              </p>
            </div>

            {/* --- Description --- */}
            <div className="md:col-span-2">
              <label
                htmlFor="description"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows={3}
                value={newDocument.description}
                onChange={handleInputChange}
                placeholder="Enter Description"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Deskripsikan dokumen secara singkat
              </p>
            </div>
            {/* --- Document Date --- */}
            <div className="md:col-span-1">
              <label
                htmlFor="documentDate"
                className="block text-sm font-medium text-gray-700 mb-1">
                Document Date
              </label>
              <Popover open={openDocDate} onOpenChange={setOpenDocDate}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !documentDate && "text-muted-foreground"
                    )}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {documentDate ? (
                      format(documentDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={documentDate}
                    onSelect={(d) => {
                      setDocumentDate(d);
                      if (d) setOpenDocDate(false);
                    }}
                    initialFocus
                    captionLayout="dropdown"
                    fromYear={1980} // Atur tahun mulai
                    toYear={2040} // Atur tahun selesai
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* --- Expire Date --- */}
            <div className="md:col-span-1">
              <label
                htmlFor="expireDate"
                className="block text-sm font-medium text-gray-700 mb-1">
                Document Expire Date
              </label>
              <Popover open={openExpireDate} onOpenChange={setOpenExpireDate}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !expireDate && "text-muted-foreground",
                      !documentDate && "opacity-50 cursor-not-allowed"
                    )}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {expireDate ? (
                      format(expireDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={expireDate}
                    onSelect={(d) => {
                      if (documentDate && d && d <= documentDate) return; // block invalid
                      setExpireDate(d);
                      if (d) setOpenExpireDate(false);
                    }}
                    disabled={(d) =>
                      !documentDate || !!(documentDate && d <= documentDate)
                    }
                    initialFocus
                    captionLayout="dropdown"
                    fromYear={1980}
                    toYear={2040}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* --- File Input --- */}
            {!isEditing && (
              <div className="md:col-span-2">
                <label
                  htmlFor="file-upload"
                  className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  File
                </label>
                <div
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className={`mt-1 flex justify-center rounded-lg border-2 border-dashed px-6 pb-6 pt-5
        ${
          isDragging
            ? "border-green-500 bg-green-50 dark:bg-green-900/50" // Kelas saat dragging
            : "border-gray-300 dark:border-gray-600" // Kelas normal
        }`}
                >
                  <div className="text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400 pointer-events-none"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true">
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="mt-4 flex text-sm text-gray-600 dark:text-gray-400">
                      <label
                        htmlFor="file"
                        className="relative cursor-pointer rounded-md bg-white font-medium text-green-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-offset-2 hover:text-green-500 dark:bg-gray-800">
                        <span>Upload a file</span>
                        <input
                          id="file"
                          name="file"
                          type="file"
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1 pointer-events-none">
                        or drag and drop
                      </p>
                    </div>
                    {newDocument.file ? (
                      <p className="mt-2 text-sm font-semibold text-green-700 dark:text-green-400 pointer-events-none">
                        {newDocument.file.name}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500 pointer-events-none">
                        Semua jenis file hingga 10MB
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* === FOOTER === */}
        <div className="flex items-center justify-end space-x-2 rounded-b-lg border-t border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
            Cancel
          </button>
          <button
            onClick={onSave}
            className="flex items-center gap-2 rounded-lg bg-demplon px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V3"
              />
            </svg>
            {isEditing ? "Save Changes" : "Save Document"}
          </button>
        </div>
      </div>
    </div>
  );
};
