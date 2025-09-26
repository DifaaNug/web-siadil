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
    className="group relative flex cursor-pointer items-center overflow-hidden rounded-lg border-2 border-green-600 bg-gradient-to-br from-green-50/80 via-white/80 to-green-100/60 backdrop-blur-lg p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-lg dark:bg-gray-700/60 dark:hover:bg-gray-700 truncate">
    <div className="flex w-full items-center gap-4">
      <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
        <span className="text-white font-bold text-2xl tracking-wide">DF</span>
      </div>
      <div className="min-w-0 flex-grow">
        <h3
          className="font-bold text-lg text-green-900 dark:text-white truncate"
          title={archive.name}>
          {archive.name}
        </h3>
        <p className="text-sm text-green-700 dark:text-green-300 font-semibold mt-1">
          10122059
        </p>
      </div>
    </div>
    {/* Badge utama */}
    <span className="absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 shadow">
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
    className="group relative flex flex-col cursor-pointer overflow-hidden rounded-lg border bg-gradient-to-br from-white/80 via-gray-50/80 to-green-50/60 backdrop-blur-lg p-6  transition-all duration-300 min-h-[170px] hover:-translate-y-1 hover:scale-[1.02] hover:shadow-md hover:border-green-600 dark:hover:border-green-400">
    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-700 shadow-md">
      <svg
        className="h-7 w-7 text-white"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
      </svg>
    </div>
    <div className="mt-4 flex-grow">
      <h3
        className="text-base font-bold text-gray-800 dark:text-white truncate"
        title={archive.name}>
        {archive.name}
      </h3>
    </div>
    <div className="mt-2">
      <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
        <svg
          className="w-4 h-4 text-green-700"
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
