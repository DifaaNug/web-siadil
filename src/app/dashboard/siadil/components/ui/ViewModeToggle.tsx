const ViewModeToggle = ({
  viewMode,
  setViewMode,
}: {
  viewMode: "list" | "grid";
  setViewMode: (mode: "list" | "grid") => void;
}) => {
  const CheckmarkIcon = () => (
    <svg
      className="w-5 h-5 mr-1.5 flex-shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );

  return (
    <div
      className="group flex items-center rounded-xl p-1 bg-gray-100/90 dark:bg-gray-700/90 transition-all duration-200 shadow-sm hover:shadow-md hover:ring-1 hover:ring-gray-300 dark:hover:ring-gray-600 cursor-pointer"
      role="group"
      aria-label="Toggle view mode">
      <button
        onClick={() => setViewMode("list")}
        className={`flex items-center justify-center px-3.5 py-2 text-[13px] rounded-md transition-colors ${
          viewMode === "list"
            ? "bg-white dark:bg-gray-900 shadow text-gray-800 dark:text-white font-semibold"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
        }`}>
        {viewMode === "list" && <CheckmarkIcon />}
        <svg
          className="w-6 h-6 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 10h16M4 14h16M4 18h16"
          />
        </svg>
      </button>
      <button
        onClick={() => setViewMode("grid")}
        className={`flex items-center justify-center px-3.5 py-2 text-[13px] rounded-md transition-colors ${
          viewMode === "grid"
            ? "bg-white dark:bg-gray-900 shadow text-gray-800 dark:text-white font-semibold"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
        }`}>
        {viewMode === "grid" && <CheckmarkIcon />}
        <svg
          className="w-6 h-6 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      </button>
    </div>
  );
};

export default ViewModeToggle;
