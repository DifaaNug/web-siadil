import { Archive } from "../types";

const PersonalArchiveCard = ({
  archive,
  onClick,
}: {
  archive: Archive;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    className="relative overflow-hidden rounded-lg border dark:border-gray-700 p-5 transition-all duration-200 ease-in-out hover:bg-gray-50 cursor-pointer flex items-center min-h-[110px] bg-gradient-to-br dark:from-gray-800 dark:to-gray-800 border-l-4 border-demplon">
    <div className="flex items-center space-x-3 min-w-0">
      <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-white font-semibold text-sm">DF</span>
      </div>
      <div className="min-w-0">
        <h3 className="flex items-center gap-1.5 font-semibold text-gray-900 dark:text-white text-sm truncate">
          <svg
            className="h-3.5 w-3.5 text-gray-900 dark:text-gray-400 flex-shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <span>{archive.name}</span>
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          10122059
        </p>
      </div>
    </div>
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
    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 transition-all duration-200 ease-in-out hover:bg-gray-50 cursor-pointer flex items-center min-h-[110px] overflow-hidden
    ">
    <div className="flex items-center space-x-4 min-w-0">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-demplon flex-shrink-0">
        <svg
          className="w-5 h-5 text-white"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none">
          <path
            d="M3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V9C21 7.89543 20.1046 7 19 7H9L7 5H5C3.89543 5 3 5.89543 3 7Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="min-w-0">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
          {archive.name}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {docCount} items
        </p>
      </div>
    </div>
  </div>
);

export { ArchiveCard, PersonalArchiveCard };
