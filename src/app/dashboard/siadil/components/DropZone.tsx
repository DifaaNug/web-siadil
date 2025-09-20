// src/app/dashboard/siadil/components/Dropzone.tsx
"use client";

import { useState, useCallback, useRef } from "react";

type DropzoneProps = {
  onFilesAdded: (files: File[]) => void;
};

export const Dropzone = ({ onFilesAdded }: DropzoneProps) => {
  const [isDragActive, setIsDragActive] = useState(false);
  // Ref untuk input file yang tersembunyi
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        onFilesAdded(Array.from(e.dataTransfer.files));
        e.dataTransfer.clearData();
      }
    },
    [onFilesAdded]
  );

  // Fungsi untuk menangani file yang dipilih dari klik
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      onFilesAdded(Array.from(e.target.files));
    }
  };

  // Fungsi untuk memicu klik pada input file
  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div
      onClick={onButtonClick} // Tambahkan onClick handler
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`mt-6 border-2 border-dashed rounded-lg p-12 text-center transition-colors duration-200 cursor-pointer ${
        isDragActive
          ? "border-green-600 bg-green-50 dark:bg-green-900/50"
          : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
      }`}>
      {/* Input file yang sebenarnya, tapi disembunyikan */}
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        multiple // Izinkan memilih banyak file
        onChange={handleChange}
        // Batasi tipe file yang bisa dipilih
        accept="application/pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation"
      />

      <div className="flex flex-col items-center pointer-events-none">
        <svg
          className={`w-12 h-12 mb-4 ${
            isDragActive ? "text-green-600" : "text-gray-400"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          <span className="font-semibold text-green-600">
            Seret dan lepas file di sini
          </span>{" "}
          atau klik untuk memilih file
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          Hanya file dokumen (PDF, Word, Excel, dll.) yang diperbolehkan
        </p>
      </div>
    </div>
  );
};
