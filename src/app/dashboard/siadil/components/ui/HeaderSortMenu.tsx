import ReactDOM from "react-dom";

type HeaderSortMenuProps = {
  onClose: () => void;
  onSortAsc: () => void;
  onSortDesc: () => void;
  onHide: () => void;
  buttonEl: HTMLButtonElement;
};

export const HeaderSortMenu = ({
  onClose,
  onSortAsc,
  onSortDesc,
  onHide,
  buttonEl,
}: HeaderSortMenuProps) => {
  if (!buttonEl) return null;

  const rect = buttonEl.getBoundingClientRect();
  const style = {
    top: `${rect.bottom + 4}px`,
    left: `${rect.left}px`,
  };

  return ReactDOM.createPortal(
    <>
      <div onClick={onClose} className="fixed inset-0 z-40" />
      <div
        style={style}
        className="fixed z-50 w-36 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg p-1">
        <button
          onClick={onSortAsc}
          className="w-full text-left px-2 py-1.5 text-sm rounded-md flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4h13M3 8h9m-9 4h6m4-4l4 4m0 0l4-4m-4 4v12"
            />
          </svg>
          <span>Asc</span>
        </button>
        <button
          onClick={onSortDesc}
          className="w-full text-left px-2 py-1.5 text-sm rounded-md flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4h13M3 8h9m-9 4h9m-9 4h13M17 20l4-4m0 0l-4-4m4 4H3"
            />
          </svg>
          <span>Desc</span>
        </button>
        <div className="border-t border-gray-200 dark:border-gray-600 my-1" />
        <button
          onClick={onHide}
          className="w-full text-left px-2 py-1.5 text-sm rounded-md flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59"
            />
          </svg>
          <span>Hide</span>
        </button>
      </div>
    </>,
    document.body
  );
};
