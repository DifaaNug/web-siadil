import { useMemo } from "react";
import { usePersistentDocuments } from "./usePersistentDocuments";
import { usePersistentArchives } from "./usePersistentArchives";
import { Archive } from "../types";

const getAllDescendantIds = (
  folderId: string,
  archives: Archive[]
): string[] => {
  const directChildren = archives
    .filter((archive) => archive.parentId === folderId)
    .map((archive) => archive.id);

  const allChildren = [...directChildren];
  directChildren.forEach((childId) => {
    allChildren.push(...getAllDescendantIds(childId, archives));
  });
  return allChildren;
};

export const useData = (currentFolderId: string) => {
  const [documents, setDocuments] = usePersistentDocuments();
  const [archives, setArchives] = usePersistentArchives();

  const activeDocuments = useMemo(() => {
    return documents.filter((doc) => doc.status !== "Trashed");
  }, [documents]);

  const searchableDocuments = useMemo(() => {
    if (currentFolderId === "root") {
      return activeDocuments;
    }
    const relevantFolderIds = [
      currentFolderId,
      ...getAllDescendantIds(currentFolderId, archives),
    ];
    return activeDocuments.filter((doc) =>
      relevantFolderIds.includes(doc.parentId)
    );
  }, [currentFolderId, activeDocuments, archives]);

  const documentsForFiltering = useMemo(() => {
    if (currentFolderId === "root") {
      return [];
    }
    return activeDocuments.filter((doc) => doc.parentId === currentFolderId);
  }, [currentFolderId, activeDocuments]);

  const breadcrumbItems = useMemo(() => {
    const path = [];
    let currentId = currentFolderId;
    while (currentId !== "root") {
      const folder = archives.find((a) => a.id === currentId);
      if (folder) {
        path.unshift({ label: folder.name, id: folder.id });
        currentId = folder.parentId;
      } else {
        break;
      }
    }
    path.unshift({ label: "Root", id: "root" });
    return path;
  }, [currentFolderId, archives]);

  const archiveDocCounts = useMemo(() => {
    return documents.reduce((acc, doc) => {
      const parentArchive = archives.find((a) => a.id === doc.parentId);
      if (parentArchive) {
        acc[parentArchive.code] = (acc[parentArchive.code] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
  }, [documents, archives]);

  const quickAccessDocuments = useMemo(() => {
    return [...activeDocuments]
      .filter((doc) => doc.lastAccessed)
      .sort(
        (a, b) =>
          new Date(b.lastAccessed!).getTime() -
          new Date(a.lastAccessed!).getTime()
      )
      .slice(0, 5);
  }, [activeDocuments]);

  const starredDocuments = useMemo(() => {
    return activeDocuments.filter((doc) => doc.isStarred);
  }, [activeDocuments]);

  const subfolderArchives = useMemo(() => {
    return archives.filter((archive) => archive.parentId === currentFolderId);
  }, [currentFolderId, archives]);

  const handleToggleStar = (docId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setDocuments((docs) =>
      docs.map((doc) =>
        doc.id === docId ? { ...doc, isStarred: !doc.isStarred } : doc
      )
    );
  };

  return {
    documents,
    setDocuments,
    archives,
    setArchives,
    searchableDocuments,
    documentsForFiltering,
    breadcrumbItems,
    archiveDocCounts,
    quickAccessDocuments,
    starredDocuments,
    subfolderArchives,
    handleToggleStar,
  };
};
