"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-900 group-[.toaster]:border-gray-200 group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl group-[.toaster]:px-4 group-[.toaster]:py-3 group-[.toaster]:text-sm group-[.toaster]:font-medium",
          title: "group-[.toast]:text-gray-900 group-[.toast]:font-semibold group-[.toast]:text-sm",
          description: "group-[.toast]:text-gray-500 group-[.toast]:text-xs",
          actionButton:
            "group-[.toast]:bg-[#ef4a23] group-[.toast]:text-white group-[.toast]:rounded-lg group-[.toast]:text-xs group-[.toast]:font-semibold group-[.toast]:px-3 group-[.toast]:py-1.5",
          cancelButton:
            "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-600 group-[.toast]:rounded-lg group-[.toast]:text-xs group-[.toast]:font-medium",
          success:
            "group-[.toaster]:!bg-emerald-50 group-[.toaster]:!border-emerald-200 group-[.toaster]:!text-emerald-900 [&>[data-icon]]:!text-emerald-600",
          error:
            "group-[.toaster]:!bg-red-50 group-[.toaster]:!border-red-200 group-[.toaster]:!text-red-900 [&>[data-icon]]:!text-red-600",
          warning:
            "group-[.toaster]:!bg-amber-50 group-[.toaster]:!border-amber-200 group-[.toaster]:!text-amber-900 [&>[data-icon]]:!text-amber-600",
          info:
            "group-[.toaster]:!bg-blue-50 group-[.toaster]:!border-blue-200 group-[.toaster]:!text-blue-900 [&>[data-icon]]:!text-blue-600",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
