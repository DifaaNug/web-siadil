import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useState } from "react";
import { Document } from "../types";

export const useSelection = (
  setDocuments: (updater: (docs: Document[]) => Document[]) => void,
  paginatedDocuments: Document[],
  documents: Document[],
  router: AppRouterInstance
) => {
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<Set<string>>(
    new Set()
  );
  const [infoPanelDocument, setInfoPanelDocument] = useState<Document | null>(
    null
  );

  const handleDocumentSelect = (docId: string, event?: React.MouseEvent) => {
    const docToShow = documents.find((d) => d.id === docId) || null;

    if (docToShow && docToShow.docType === "text") {
      router.push(`/dashboard/siadil/editor/${docId}`);
      return;
    }

    setDocuments((prevDocs) =>
      prevDocs.map((doc) =>
        doc.id === docId
          ? { ...doc, lastAccessed: new Date().toISOString() }
          : doc
      )
    );

    const newSelection = new Set(selectedDocumentIds);
    const isRightClick = event?.type === "contextmenu";

    if (!isRightClick && (event?.ctrlKey || event?.metaKey)) {
      if (newSelection.has(docId)) {
        newSelection.delete(docId);
      } else {
        newSelection.add(docId);
      }
      setInfoPanelDocument(null);
    } else if (
      !isRightClick &&
      event?.shiftKey &&
      paginatedDocuments.length > 0
    ) {
      const lastSelected = Array.from(selectedDocumentIds).pop();
      if (lastSelected) {
        const lastIndex = paginatedDocuments.findIndex(
          (d) => d.id === lastSelected
        );
        const currentIndex = paginatedDocuments.findIndex(
          (d) => d.id === docId
        );
        const start = Math.min(lastIndex, currentIndex);
        const end = Math.max(lastIndex, currentIndex);
        for (let i = start; i <= end; i++) {
          newSelection.add(paginatedDocuments[i].id);
        }
      } else {
        newSelection.add(docId);
      }
      setInfoPanelDocument(null);
    } else {
      if (newSelection.has(docId) && newSelection.size === 1 && !isRightClick) {
        newSelection.clear();
        setInfoPanelDocument(null);
      } else {
        newSelection.clear();
        newSelection.add(docId);
        if (!isRightClick) {
          const docToShow = documents.find((d) => d.id === docId) || null;
          setInfoPanelDocument(docToShow);
        } else {
          setInfoPanelDocument(null);
        }
      }
    }
    setSelectedDocumentIds(newSelection);
  };

  const handleCloseInfoPanel = () => {
    setInfoPanelDocument(null);
    setSelectedDocumentIds(new Set());
  };

  return {
    selectedDocumentIds,
    setSelectedDocumentIds,
    infoPanelDocument,
    setInfoPanelDocument,
    handleDocumentSelect,
    handleCloseInfoPanel,
  };
};
