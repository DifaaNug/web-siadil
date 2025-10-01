import { useState, useEffect, useRef } from "react";
import { Document, Contributor } from "../../types";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  document: Document | null;
  onSave: (docId: string, contributors: Contributor[]) => void;
};

const ManageContributorsModal = ({
  isOpen,
  onClose,
  document,
  onSave,
}: Props) => {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("Penulis");

  const modalRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(modalRef, onClose);

  useEffect(() => {
    if (document) {
      setContributors(document.contributors);
    }
  }, [document]);

  if (!isOpen || !document) return null;

  const handleAddContributor = () => {
    if (newName.trim() === "") {
      alert("Nama kontributor tidak boleh kosong.");
      return;
    }
    const newContributor: Contributor = { name: newName.trim(), role: newRole };
    setContributors([...contributors, newContributor]);
    setNewName("");
  };

  const handleRemoveContributor = (indexToRemove: number) => {
    setContributors(contributors.filter((_, index) => index !== indexToRemove));
  };

  const handleSaveChanges = () => {
    onSave(document.id, contributors);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div
        ref={modalRef}
        className="w-full max-w-lg rounded-lg bg-white shadow-xl dark:bg-gray-800 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4 dark:border-gray-700 flex-shrink-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Manage Contributors for {document.title}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
            <svg
              className="h-6 w-6 text-gray-500 dark:text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Daftar Kontributor */}
        <div className="p-6 space-y-3 overflow-y-auto">
          {contributors.map((c, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md">
              <div>
                <p className="font-medium text-sm text-gray-800 dark:text-gray-200">
                  {c.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {c.role}
                </p>
              </div>
              <button
                onClick={() => handleRemoveContributor(index)}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500 p-1 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            </div>
          ))}
          {contributors.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              No contributors yet.
            </p>
          )}
        </div>

        {/* Form Tambah */}
        <div className="p-6 border-t dark:border-gray-700 space-y-4 flex-shrink-0">
          <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200">
            Add New Contributor
          </h4>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Contributor's Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:ring-demplon focus:border-demplon dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
            />
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:ring-demplon focus:border-demplon dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
              <option>Penulis</option>
              <option>Reviewer</option>
              <option>Uploader</option>
            </select>
          </div>
          <button
            onClick={handleAddContributor}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-demplon rounded-md hover:bg-green-700 transition-colors">
            Add Contributor
          </button>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 bg-gray-50 dark:bg-gray-800/50 border-t dark:border-gray-600 rounded-b-lg flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 mr-2 text-sm font-semibold text-gray-800 rounded-md border bg-white hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:border-gray-600">
            Cancel
          </button>
          <button
            onClick={handleSaveChanges}
            className="px-4 py-2 text-sm font-semibold text-white bg-demplon rounded-md hover:bg-green-700">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageContributorsModal;
