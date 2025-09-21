// Tipe data (tidak ada perubahan)
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
  isStarred?: boolean;
};
export type Filters = {
  keyword: string;
  archive: string[];
  docDateStart: string;
  docDateEnd: string;
  expireDateStart: string;
  expireDateEnd: string;
  expireIn: Record<string, boolean>;
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
