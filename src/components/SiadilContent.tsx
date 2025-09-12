"use client";

const SiadilContent = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="p-4 lg:p-8">
        <div className="flex flex-col xl:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                SIADIL
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                Sistem Arsip Digital
              </p>

              <nav className="flex items-center space-x-3 text-sm">
                <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-700 ">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-gray-500">
                    <path
                      d="M3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V9C21 7.89543 20.1046 7 19 7H9L7 5H5C3.89543 5 3 5.89543 3 7Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
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
                <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-700 ">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-gray-500">
                    <path
                      d="M3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V9C21 7.89543 20.1046 7 19 7H9L7 5H5C3.89543 5 3 5.89543 3 7Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300 font-normal">
                    Root
                  </span>
                </div>
              </nav>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full xl:w-64 xl:flex-shrink-0">
            <div className="flex flex-col space-y-4">
              {/* Profile Card */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-white">DF</span>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  {/* Baris pertama: Ikon + Teks "Personal" */}
                  <div className="flex items-center space-x-2">
                    {/* SVG Lock Icon */}
                    <svg
                      className="h-4 w-4 text-gray-900 dark:text-gray-400"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" />
                      <rect x="5" y="11" width="14" height="10" rx="2" />
                      <circle cx="12" cy="16" r="1" />
                      <path d="M8 11v-4a4 4 0 0 1 8 0v4" />
                    </svg>

                    {/* Teks "Personal" */}
                    <p className="font-semibold text-gray-900 dark:text-white text-base">
                      Personal
                    </p>
                  </div>

                  {/* Baris kedua: Teks ID */}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    1990123
                  </p>
                </div>
              </div>

              {/* Reminders Section */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                  Reminders
                </h3>
                <div className="space-y-3">
                  {/* SSL Reminder */}
                  <div className="bg-red-700 text-white rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <div className="flex-shrink-0 mt-0.5">
                        <div className="w-5 h-5 bg-red-800 rounded-full flex items-center justify-center">
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
                      <div>
                        <p className="font-semibold text-xs mb-1 text-white">
                          SSL
                        </p>
                        <p className="text-xs text-white leading-relaxed opacity-90">
                          ssl.kampus-kujang.co.id (Non GCP)
                        </p>
                        <p className="text-xs text-white leading-relaxed opacity-90 mt-1">
                          This document is expired 2 months 1 days
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiadilContent;
