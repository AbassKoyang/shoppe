import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const toastStyles = {
  error: {
      position: "top-right" as const,
      autoClose: false as const,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light" as const,
      style: {
          background: '#ffffff',
          color: '#dc2626',
          border: '2px solid #dc2626',
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: '500',
          minWidth: '300px'
      }
  },
  errorSimple: {
      position: "top-right" as const,
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light" as const,
      style: {
          background: '#ffffff',
          color: '#dc2626',
          border: '2px solid #dc2626',
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: '500'
      }
  }
};