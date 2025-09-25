export type Contributor = { name: string; role: string };
export type Archive = {
  id: string;
  name: string;
  code: string;
  parentId: string;
};
export type Document = {
  id: string;
  number: string;
  title: string;
  description: string;
  documentDate: string;
  contributors: Contributor[];
  archive: string;
  expireDate: string;
  status: string;
  updatedBy: string;
  createdBy: string;
  createdDate: string;
  updatedDate: string;
  parentId: string;
  fileType?: string;
  isStarred?: boolean;
  lastAccessed?: string;
  content?: string;
};
export type Filters = {
  keyword: string;
  archive: string[];
  docDateStart: string;
  docDateEnd: string;
  expireDateStart: string;
  expireDateEnd: string;
  expireIn: Record<string, boolean>;
  fileType: string;
};

export type NewDocumentData = {
  number: string;
  title: string;
  description: string;
  documentDate: string;
  archive: string;
  expireDate: string;
  file: File | null;
};

export type Pagination = {
  totalRows: number;
  rowsPerPage: number;
  currentPage: number;
};

export type TableColumn = {
  id: string;
  label: string;
};

export type ActivityLog = {
  id: string;
  action:
    | "CREATE_DOCUMENT"
    | "EDIT_DOCUMENT"
    | "MOVE_DOCUMENT"
    | "TRASH_DOCUMENT"
    | "DELETE_DOCUMENT"
    | "RESTORE_DOCUMENT"
    | "CREATE_ARCHIVE";
  documentTitle: string;
  documentId?: string;
  timestamp: string;
  user: string;
  details?: string;
};
