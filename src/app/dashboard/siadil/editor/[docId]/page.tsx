"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Document } from "../../types";

const SIADIL_DOCUMENTS_KEY = "siadil_documents_storage";

export default function EditorPage() {
  const router = useRouter();
  const params = useParams();
  const docId = params.docId as string;

  const [document, setDocument] = useState<Document | null>(null);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Ambil data dokumen dari localStorage
  useEffect(() => {
    if (docId) {
      try {
        const storedDocuments = localStorage.getItem(SIADIL_DOCUMENTS_KEY);
        if (storedDocuments) {
          const documents: Document[] = JSON.parse(storedDocuments);
          const docToEdit = documents.find((d) => d.id === docId);
          if (docToEdit) {
            setDocument(docToEdit);
            setContent(docToEdit.content || "");
          }
        }
      } catch (error) {
        console.error("Gagal memuat dokumen:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [docId]);

  const handleSave = () => {
    try {
      const storedDocuments = localStorage.getItem(SIADIL_DOCUMENTS_KEY);
      if (storedDocuments) {
        let documents: Document[] = JSON.parse(storedDocuments);
        documents = documents.map((doc) =>
          doc.id === docId
            ? { ...doc, content, updatedDate: new Date().toISOString() }
            : doc
        );
        localStorage.setItem(SIADIL_DOCUMENTS_KEY, JSON.stringify(documents));
        alert("Dokumen berhasil disimpan!");
        router.push("/dashboard/siadil");
      }
    } catch (error) {
      console.error("Gagal menyimpan dokumen:", error);
      alert("Gagal menyimpan dokumen.");
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading editor...</div>;
  }

  if (!document) {
    return <div className="p-6">Dokumen tidak ditemukan.</div>;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header Editor */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            {document.title}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Tipe: Dokumen Teks
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push("/dashboard/siadil")}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-600">
            Kembali
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-demplon border border-transparent rounded-md hover:bg-opacity-90">
            Simpan & Keluar
          </button>
        </div>
      </div>

      {/* Area Teks Editor */}
      <div className="flex-grow p-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Mulai menulis di sini..."
          className="w-full h-full p-4 border rounded-md resize-none focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>
    </div>
  );
}
