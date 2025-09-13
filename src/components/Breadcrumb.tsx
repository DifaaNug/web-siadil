interface BreadcrumbItem {
  label?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-3 text-sm">
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-700">
            {item.icon && <div className="text-gray-500">{item.icon}</div>}
            {item.label && (
              <span className="text-gray-700 dark:text-gray-300 font-normal">
                {item.label}
              </span>
            )}
          </div>
          {index < items.length - 1 && (
            <svg
              className="w-3 h-3 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
        </div>
      ))}
    </nav>
  );
}
