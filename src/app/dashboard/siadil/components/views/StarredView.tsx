import React from "react";
import { Document, Archive } from "../../types";
import { DocumentGrid } from "../ui/DocumentGrid";

interface StarredViewProps {
  documents: Document[];
  archives: Archive[];
  selectedDocumentIds: Set<string>;
  onDocumentSelect: (docId: string, event?: React.MouseEvent) => void;
  onEdit: (docId: string) => void;
  onMove: (docId: string) => void;
  onDelete: (docId: string) => void;
  onToggleStar: (docId: string, event: React.MouseEvent) => void;
  onManageContributors: (docId: string) => void;
}

const StarredView: React.FC<StarredViewProps> = (props) => {
  const {
    documents,
    archives,
    selectedDocumentIds,
    onDocumentSelect,
    onEdit,
    onMove,
    onDelete,
    onToggleStar,
    onManageContributors,
  } = props;

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Starred Documents
      </h2>
      {documents.length > 0 ? (
        <DocumentGrid
          documents={documents}
          archives={archives}
          selectedDocumentIds={selectedDocumentIds}
          onDocumentSelect={onDocumentSelect}
          onEdit={onEdit}
          onMove={onMove}
          onDelete={onDelete}
          onToggleStar={onToggleStar}
          onManageContributors={onManageContributors}
        />
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true">
            <path
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
            No starred documents
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Click the star icon on a document to add it here.
          </p>
        </div>
      )}
    </div>
  );
};

export default StarredView;
