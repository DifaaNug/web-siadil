import React from "react";
import { Document } from "../../types";
import { DocumentGrid } from "../ui/DocumentGrid";

interface StarredViewProps {
  documents: Document[];
  selectedDocumentIds: Set<string>;
  onDocumentSelect: (docId: string, event?: React.MouseEvent) => void;
  onEdit: (docId: string) => void;
  onMove: (docId: string) => void;
  onDelete: (docId: string) => void;
  onToggleStar: (docId: string, event: React.MouseEvent) => void;
  onManageContributors: (docId: string) => void; // <-- Tambahkan baris ini
}

const StarredView: React.FC<StarredViewProps> = (props) => {
  const {
    documents,
    selectedDocumentIds,
    onDocumentSelect,
    onEdit,
    onMove,
    onDelete,
    onToggleStar,
    onManageContributors, // <-- Tambahkan ini di destrukturisasi
  } = props;

  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Starred Documents
      </h2>
      {documents.length > 0 ? (
        <DocumentGrid
          documents={documents}
          selectedDocumentIds={selectedDocumentIds}
          onDocumentSelect={onDocumentSelect}
          onEdit={onEdit}
          onMove={onMove}
          onDelete={onDelete}
          onToggleStar={onToggleStar}
          onManageContributors={onManageContributors} // <-- Teruskan prop ke DocumentGrid
        />
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 py-10">
          No starred documents.
        </p>
      )}
    </div>
  );
};

export default StarredView;
