import { useState, useMemo } from "react";
import { Document } from "../types";

export const useDocumentPagination = (
  documents: Document[],
  documentCurrentPage: number, // Terima state dari luar
  setDocumentCurrentPage: (page: number) => void // Terima setter dari luar
) => {
  // Hapus useState untuk documentCurrentPage dari sini
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value);
    setDocumentCurrentPage(1);
  };

  const paginatedDocuments = useMemo(() => {
    const startIndex = (documentCurrentPage - 1) * rowsPerPage;
    return documents.slice(startIndex, startIndex + rowsPerPage);
  }, [documents, documentCurrentPage, rowsPerPage]);

  const pagination = {
    totalRows: documents.length,
    rowsPerPage,
    currentPage: documentCurrentPage,
  };

  // Hapus documentCurrentPage dan setDocumentCurrentPage dari return
  return {
    rowsPerPage,
    handleRowsPerPageChange,
    paginatedDocuments,
    pagination,
  };
};
