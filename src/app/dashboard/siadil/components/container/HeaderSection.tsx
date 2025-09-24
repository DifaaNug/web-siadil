import React from "react";
import Breadcrumb from "../ui/Breadcrumb";
import { reminders } from "../../data";
import { FolderIcon } from "../ui/FolderIcon";

// Interface untuk props HeaderSection
interface BreadcrumbItem {
  label: string;
  id: string;
}

interface HeaderSectionProps {
  breadcrumbItems: BreadcrumbItem[];
  onBreadcrumbClick: (id: string) => void;
}

// Komponen baru untuk kartu di sebelah kanan
export const StatsAndReminders: React.FC<{ totalDocuments: number }> = ({
  totalDocuments,
}) => (
  <div className="flex flex-col space-y-4 w-[250px] shrink-0">
    <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0 rounded-md bg-demplon dark:bg-green-800 p-3">
            <svg
              className="h-6 w-6 text-white dark:text-green-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div className="ml-4 w-0 flex-1">
            <dl>
              <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Dokumen
              </dt>
              <dd>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalDocuments}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
    <div className="">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
        Reminders
      </h3>
      <div className="space-y-2">
        {reminders.map((reminder) => (
          <div
            key={reminder.id}
            className="bg-[#EF4444] text-white rounded-lg p-3 w-full">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-xs mb-1 text-white">
                  {reminder.title}
                </p>
                <p className="text-xs text-white leading-relaxed opacity-90">
                  {reminder.description}
                </p>
                <p className="text-xs text-white leading-relaxed opacity-90 mt-1">
                  {reminder.message}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Komponen HeaderSection sekarang hanya berisi bagian kiri
const HeaderSection: React.FC<HeaderSectionProps> = ({
  breadcrumbItems,
  onBreadcrumbClick,
}) => {
  const breadcrumbProps = breadcrumbItems.map((item) => ({
    label: item.label,
    icon: <FolderIcon />,
    onClick: () => onBreadcrumbClick(item.id),
  }));

  return (
    <div className="mb-6">
      {" "}
      {/* Mengurangi margin bawah */}
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        SIADIL
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Sistem Arsip Digital
      </p>
      <Breadcrumb items={breadcrumbProps} />
    </div>
  );
};

export default HeaderSection;
