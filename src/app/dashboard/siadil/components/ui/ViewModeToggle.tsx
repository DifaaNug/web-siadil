const ViewModeToggle = ({
  viewMode,
  setViewMode,
}: {
  viewMode: "list" | "grid";
  setViewMode: (mode: "list" | "grid") => void;
}) => {
  const CheckmarkIcon = () => (
    <svg
      className="w-4 h-4 mr-1 flex-shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );

  return (
    <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
      <button
        onClick={() => setViewMode("list")}
        className={`flex items-center justify-center px-3 py-1 text-sm rounded-md transition-colors ${
          viewMode === "list"
            ? "bg-white dark:bg-gray-900 shadow-sm text-gray-800 dark:text-white font-semibold"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
        }`}>
        {viewMode === "list" && <CheckmarkIcon />}
        <svg
          className="w-5 h-5 flex-shrink-0"
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
        className={`flex items-center justify-center px-3 py-1 text-sm rounded-md transition-colors ${
          viewMode === "grid"
            ? "bg-white dark:bg-gray-900 shadow-sm text-gray-800 dark:text-white font-semibold"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
        }`}>
        {viewMode === "grid" && <CheckmarkIcon />}
        <svg
          className="w-5 h-5 flex-shrink-0"
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
