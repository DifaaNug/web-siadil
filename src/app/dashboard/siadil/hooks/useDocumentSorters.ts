import { useState, useMemo } from "react";
import { Document } from "../types";

export const useDocumentSorters = (
    documents: Document[]
) => {
    const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
    const [sortColumn, setSortColumn] = useState<keyof Document | null>(null);

    const handleSort = (columnId: keyof Document) => {
        if (sortColumn === columnId) {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
        setSortColumn(columnId);
        setSortOrder("asc");
        }
    };

    const sortedDocuments = useMemo(() => {
        return [...documents].sort((a, b) => {
            if (!sortColumn) return 0;
            const aValue = a[sortColumn];
            const bValue = b[sortColumn];
            if (aValue == null || bValue == null) return 0;
            let comparison = 0;
            if (sortColumn === "documentDate" || sortColumn === "updatedDate") {
              comparison =
                new Date(aValue as string).getTime() -
                new Date(bValue as string).getTime();
            } else {
              comparison = String(aValue).localeCompare(String(bValue), undefined, {
                numeric: true,
              });
            }
            return sortOrder === "asc" ? comparison : -comparison;
          });
    }, [documents, sortOrder, sortColumn]);

    return {
        sortOrder,
        sortColumn,
        handleSort,
        sortedDocuments
    }
}