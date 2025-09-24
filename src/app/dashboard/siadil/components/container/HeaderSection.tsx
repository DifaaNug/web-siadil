import React from "react";
import Breadcrumb from "../ui/Breadcrumb";
import { FolderIcon } from "../ui/FolderIcon";

interface BreadcrumbItem {
  label: string;
  id: string;
}

// Hapus 'totalDocuments' dari props
interface HeaderSectionProps {
  breadcrumbItems: BreadcrumbItem[];
  onBreadcrumbClick: (id: string) => void;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
  breadcrumbItems,
  onBreadcrumbClick,
}) => {
  const breadcrumbProps = breadcrumbItems.map((item) => ({
    label: item.label,
    icon: <FolderIcon />,
    onClick: () => onBreadcrumbClick(item.id),
  }));

  // Hapus seluruh struktur flexbox dan kolom kanan
  return (
    <div className="mb-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          SIADIL
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Sistem Arsip Digital
        </p>
        <Breadcrumb items={breadcrumbProps} />
      </div>
    </div>
  );
};

export default HeaderSection;
