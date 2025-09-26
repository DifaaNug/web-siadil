import { Archive } from "../../types";

const PersonalArchiveCard = ({
  archive,
  onClick,
}: {
  archive: Archive;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    className="group relative flex cursor-pointer items-center overflow-hidden rounded-lg border border-green-600 bg-gradient-to-br  backdrop-blur-lg p-4 shadow-md transition-all duration-300 hover:shadow-lg dark:bg-gray-700/60 dark:hover:bg-gray-700">
    <div className="flex w-full items-center gap-4">
      <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
        <span className="text-white font-bold text-lg tracking-wide">DF</span>
      </div>
      <div className="min-w-0 flex-grow">
        <h3
          className="font-bold text-base text-green-900 dark:text-white"
          title={archive.name}>
          {archive.name}
        </h3>
        <p className="text-sm text-green-700 dark:text-green-300 font-semibold mt-1">
          10122059
        </p>
      </div>
    </div>
    <span className="absolute top-2 right-2 px-2.5 py-0.5 text-xs font-semibold rounded-md bg-white text-gray-800 shadow">
      Personal
    </span>
  </div>
);

const ArchiveCard = ({
  archive,
  docCount,
  onClick,
}: {
  archive: Archive;
  docCount: number;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    className="group relative flex flex-col cursor-pointer overflow-hidden rounded-lg border bg-gradient-to-br  backdrop-blur-lg p-4 transition-all duration-300 hover:shadow-md hover:border-green-500 dark:bg-gray-800 dark:from-gray-800 dark:to-gray-700/50 dark:hover:border-green-500">
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-700 shadow-md">
      <svg
        className="h-6 w-6 text-white"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
      </svg>
    </div>
    <div className="mt-3 flex-grow">
      <h3
        className="text-sm font-bold text-gray-800 dark:text-white"
        title={archive.name}>
        {archive.name}
      </h3>
    </div>
    <div className="mt-2">
      <span className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 border dark:border-gray-600 dark:bg-gray-700 px-2 py-0.5 rounded-lg">
        <svg
          className="w-3 h-3 text-green-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 17l4-4 4 4m0 0V7m0 10l-4-4-4 4"
          />
        </svg>
        {docCount} items
      </span>
    </div>
  </div>
);

export { ArchiveCard, PersonalArchiveCard };
