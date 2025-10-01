"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      closeButton={true}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-900 group-[.toaster]:border-gray-200 group-[.toaster]:shadow-lg dark:group-[.toaster]:bg-gray-800 dark:group-[.toaster]:text-gray-50 dark:group-[.toaster]:border-gray-700",

          description:
            "group-[.toast]:text-gray-500 dark:group-[.toast]:text-gray-400",

          actionButton:
            "group-[.toast]:bg-gray-900 group-[.toast]:text-gray-50 dark:group-[.toast]:bg-gray-50 dark:group-[.toast]:text-gray-900",
          cancelButton:
            "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-500 dark:group-[.toast]:bg-gray-700 dark:group-[.toast]:text-gray-400",
          closeButton:
            "group-[.toast]:absolute group-[.toast]:top-3 group-[.toast]:right-3 group-[.toast]:w-7 group-[.toast]:h-7 group-[.toast]:rounded-full group-[.toast]:bg-transparent group-[.toast]:text-gray-500 group-[.toast]:border-0 hover:group-[.toast]:bg-black/10 hover:group-[.toast]:text-gray-900 dark:hover:group-[.toast]:bg-white/10 dark:hover:group-[.toast]:text-gray-200 [&_svg]:group-[.toast]:w-5 [&_svg]:group-[.toast]:h-5 [&_svg]:group-[.toast]:stroke-2",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
