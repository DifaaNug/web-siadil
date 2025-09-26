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
    className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl bg-gradient-to-br from-demplon to-teal-600 p-5 text-white shadow-lg transition-all duration-300 ease-in-out  hover:shadow-xl">
    <div className="absolute top-0 left-0 h-full w-full opacity-10">
      <svg
        className="h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 800 800">
        <g fill="none" stroke="#FFF" strokeWidth="0.5">
          <path d="M-200,300 Q-100,250 0,300 t200,0 t200,0 t200,0 t200,0 t200,0" />
          <path d="M-200,350 Q-100,300 0,350 t200,0 t200,0 t200,0 t200,0 t200,0" />
        </g>
      </svg>
    </div>

    <div className="relative z-10 flex flex-grow flex-col">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm ring-2 ring-white/50">
          <span className="text-xl font-bold tracking-wide text-white">DF</span>
        </div>
        <div className="min-w-0">
          <h3 className="text-base font-bold text-white" title={archive.name}>
            {archive.name}
          </h3>
          <p className="mt-1 text-sm font-medium text-green-100">10122059</p>
        </div>
      </div>
      <div className="mt-4 flex-grow"></div>
      <span className="mt-2 self-start rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
        Personal
      </span>
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
    className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-5 shadow-sm transition-all duration-300 ease-in-out  hover:border-green-400 hover:shadow-lg dark:border-gray-700 dark:from-gray-800 dark:to-gray-700/50 dark:hover:border-green-600">
    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-50 to-green-100  dark:from-green-900/50 dark:to-green-800/50 dark:ring-gray-800">
      <svg
        className="h-7 w-7 text-demplon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
      </svg>
    </div>

    <div className="flex-grow">
      <h3
        className="text-base font-bold text-gray-800 dark:text-white"
        title={archive.name}>
        {archive.name}
      </h3>
    </div>

    <div className="mt-4">
      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {docCount} item{docCount !== 1 ? "s" : ""}
      </span>
    </div>

    <div className="absolute bottom-4 right-4 text-gray-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:text-gray-600">
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 8l4 4m0 0l-4 4m4-4H3"
        />
      </svg>
    </div>
  </div>
);

export { ArchiveCard, PersonalArchiveCard };
