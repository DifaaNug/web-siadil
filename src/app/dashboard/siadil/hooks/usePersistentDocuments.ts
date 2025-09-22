// difaanug/web-siadil/web-siadil-feefdaefad62b0389061cbee5841f984748552df/src/app/dashboard/siadil/hooks/usePersistentDocuments.ts

import { useState, useEffect } from "react";
import { Document } from "../types";
import { allDocuments } from "../data";

const SIADIL_DOCUMENTS_KEY = "siadil_documents_storage";

export function usePersistentDocuments(): [
  Document[],
  React.Dispatch<React.SetStateAction<Document[]>>
] {
  const [documents, setDocuments] = useState<Document[]>(allDocuments);

  useEffect(() => {
    try {
      const storedDocuments = localStorage.getItem(SIADIL_DOCUMENTS_KEY);
      if (storedDocuments) {
        setDocuments(JSON.parse(storedDocuments));
      }
    } catch (error) {
      console.error("Gagal mengambil data dari localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      const storedDocuments = localStorage.getItem(SIADIL_DOCUMENTS_KEY);
      if (storedDocuments || documents !== allDocuments) {
        localStorage.setItem(SIADIL_DOCUMENTS_KEY, JSON.stringify(documents));
      }
    } catch (error) {
      console.error("Gagal menyimpan data ke localStorage", error);
    }
  }, [documents]);

  return [documents, setDocuments];
}
