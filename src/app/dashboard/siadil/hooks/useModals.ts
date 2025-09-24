import { useState } from "react";
import { NewDocumentData, Document, Archive } from "../types";

export const useModals = (
  initialNewDocument: NewDocumentData,
  documents: Document[],
  archives: Archive[],
  currentFolderId: string,
  setDocuments: (updater: (docs: Document[]) => Document[]) => void
) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [isSearchPopupOpen, setIsSearchPopupOpen] = useState(false);

  const [newDocument, setNewDocument] =
    useState<NewDocumentData>(initialNewDocument);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [documentToMove, setDocumentToMove] = useState<string | null>(null);

  const updateLastAccessed = (docId: string) => {
    setDocuments((prevDocs) =>
      prevDocs.map((doc) =>
        doc.id === docId
          ? { ...doc, lastAccessed: new Date().toISOString() }
          : doc
      )
    );
  };

  const handleOpenEditModal = (docId: string) => {
    const docToEdit = documents.find((doc) => doc.id === docId);
    if (docToEdit) {
      updateLastAccessed(docId); // <-- 2. Sekarang fungsi ini sudah dikenali
      setEditingDocId(docId);
      setNewDocument({
        number: docToEdit.number,
        title: docToEdit.title,
        description: docToEdit.description,
        documentDate: docToEdit.documentDate,
        archive: docToEdit.archive,
        expireDate: docToEdit.expireDate,
        file: null,
      });
      setIsAddModalOpen(true);
    }
  };

  const handleOpenMoveModal = (docId: string) => {
    updateLastAccessed(docId);
    setDocumentToMove(docId);
    setIsMoveModalOpen(true);
  };

  const handleOpenAddModalInContext = () => {
    if (currentFolderId === "root") {
      alert(
        "Silakan masuk ke salah satu arsip terlebih dahulu untuk menambahkan dokumen."
      );
      return;
    }
    const currentArchive = archives.find((a) => a.id === currentFolderId);
    setNewDocument({
      ...initialNewDocument,
      archive: currentArchive ? currentArchive.code : "",
    });
    setIsAddModalOpen(true);
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setEditingDocId(null);
    setNewDocument(initialNewDocument);
  };

  return {
    isCreateModalOpen,
    setIsCreateModalOpen,
    isAddModalOpen,
    setIsAddModalOpen,
    isMoveModalOpen,
    setIsMoveModalOpen,
    isSearchPopupOpen,
    setIsSearchPopupOpen,
    newDocument,
    setNewDocument,
    editingDocId,
    setEditingDocId,
    documentToMove,
    setDocumentToMove,
    handleOpenEditModal,
    handleOpenMoveModal,
    handleOpenAddModalInContext,
    closeModal,
  };
};
