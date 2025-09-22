import { useState, useEffect } from "react";
import { Document } from "../types";
import { allDocuments } from "../data"; // Impor data awal sebagai fallback

const SIADIL_DOCUMENTS_KEY = "siadil_documents_storage";

export function usePersistentDocuments(): [
  Document[],
  React.Dispatch<React.SetStateAction<Document[]>>
] {
  const [documents, setDocuments] = useState<Document[]>(() => {
    // Coba ambil data dari localStorage saat pertama kali komponen dimuat
    try {
      if (typeof window !== "undefined") {
        const storedDocuments = localStorage.getItem(SIADIL_DOCUMENTS_KEY);
        if (storedDocuments) {
          return JSON.parse(storedDocuments);
        }
      }
    } catch (error) {
      console.error("Gagal mengambil data dari localStorage", error);
    }
    // Jika tidak ada di localStorage, gunakan data dummy awal
    return allDocuments;
  });

  // Gunakan useEffect untuk menyimpan perubahan ke localStorage setiap kali state 'documents' berubah
  useEffect(() => {
    try {
      localStorage.setItem(SIADIL_DOCUMENTS_KEY, JSON.stringify(documents));
    } catch (error) {
      console.error("Gagal menyimpan data ke localStorage", error);
    }
  }, [documents]);

  return [documents, setDocuments];
}
