import { ChangeEvent } from "react";
import { NewDocumentData, Archive } from "../../types";

type AddDocumentModalProps = {
  onClose: () => void;
  onSave: () => void;
  newDocument: NewDocumentData;
  setNewDocument: (
    value: NewDocumentData | ((prevState: NewDocumentData) => NewDocumentData)
  ) => void;
  archives: Archive[];
  editingDocId: string | null;
};

export const AddDocumentModal = ({
  onClose,
  onSave,
  newDocument,
  setNewDocument,
  archives,
  editingDocId,
}: AddDocumentModalProps) => {
  const isEditing = !!editingDocId;
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (e.target.type === "file") {
      const files = (e.target as HTMLInputElement).files;
      setNewDocument((prevDoc) => ({
        ...prevDoc,
        file: files ? files[0] : null,
      }));
    } else {
      setNewDocument((prevDoc) => ({ ...prevDoc, [name]: value }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 transition-opacity duration-300">
      <div className="flex w-full max-w-xl flex-col rounded-lg bg-white shadow-xl dark:bg-gray-800 max-h-[90vh]">
        {/* === HEADER === */}
        <div className="flex items-start justify-between rounded-t-lg border-b border-gray-200 p-5 dark:border-gray-700">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {isEditing ? "Edit Document" : "Add New Document"}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {isEditing
                ? "Update the document details below."
                : "Add new document here. Click save when you're done."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* === BODY === */}
        <div className="overflow-y-auto p-5">
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
            {/* --- Archive --- */}
            <div className="relative md:col-span-2">
              <label
                htmlFor="archive"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Archive
              </label>
              <select
                name="archive"
                id="archive"
                value={newDocument.archive}
                onChange={handleInputChange}
                className="w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200">
                <option value="" disabled>
                  Select Archive
                </option>
                {archives.map((a) => (
                  <option key={a.id} value={a.code}>
                    {a.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 top-7 flex items-center px-2 text-gray-700 dark:text-gray-400">
                <svg
                  className="h-4 w-4 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>

            {/* --- Number --- */}
            <div className="md:col-span-2">
              <label
                htmlFor="number"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Number
              </label>
              <input
                type="text"
                name="number"
                id="number"
                value={newDocument.number}
                onChange={handleInputChange}
                placeholder="Enter Number"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Seperti nomor Memo/PR/PO/dsb.
              </p>
            </div>

            {/* --- Title --- */}
            <div className="md:col-span-2">
              <label
                htmlFor="title"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={newDocument.title}
                onChange={handleInputChange}
                placeholder="Enter Title"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Judul dokumen
              </p>
            </div>

            {/* --- Description --- */}
            <div className="md:col-span-2">
              <label
                htmlFor="description"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows={3}
                value={newDocument.description}
                onChange={handleInputChange}
                placeholder="Enter Description"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Deskripsikan dokumen secara singkat
              </p>
            </div>

            {/* --- Document Date --- */}
            <div>
              <label
                htmlFor="documentDate"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Document Date
              </label>
              <input
                type="date"
                name="documentDate"
                id="documentDate"
                value={newDocument.documentDate}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Tanggal dokumen
              </p>
            </div>

            {/* --- Expire Date --- */}
            <div>
              <label
                htmlFor="expireDate"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Document Expire Date
              </label>
              <input
                type="date"
                name="expireDate"
                id="expireDate"
                value={newDocument.expireDate}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Tanggal akhir dokumen berlaku
              </p>
            </div>

            {/* --- File Input --- */}
            {!isEditing && (
              <div className="md:col-span-2">
                <label
                  htmlFor="file-upload"
                  className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  File
                </label>
                <div className="mt-1 flex justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 pb-6 pt-5 dark:border-gray-600">
                  <div className="text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true">
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="mt-4 flex text-sm text-gray-600 dark:text-gray-400">
                      <label
                        htmlFor="file"
                        className="relative cursor-pointer rounded-md bg-white font-medium text-green-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-offset-2 hover:text-green-500 dark:bg-gray-800">
                        <span>Upload a file</span>
                        <input
                          id="file"
                          name="file"
                          type="file"
                          onChange={handleInputChange}
                          className="sr-only"
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    {newDocument.file ? (
                      <p className="mt-2 text-sm font-semibold text-green-700 dark:text-green-400">
                        {newDocument.file.name}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500">
                        PDF, DOC, XLS, PPT up to 10MB
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* === FOOTER === */}
        <div className="flex items-center justify-end space-x-2 rounded-b-lg border-t border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
            Cancel
          </button>
          <button
            onClick={onSave}
            className="flex items-center gap-2 rounded-lg bg-demplon px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V3"
              />
            </svg>
            {isEditing ? "Save Changes" : "Save Document"}
          </button>
        </div>
      </div>
    </div>
  );
};
