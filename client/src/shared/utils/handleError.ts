import { AxiosError } from "axios";
import { deleteCookie } from "./delete-cookie";

import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
type RouterType = AppRouterInstance
export const handleError = (error: unknown, router?: RouterType, setError?: (error: string) => void) => {
  if (error instanceof AxiosError) {
    setError?.(error.response?.data?.message || 'An error occurred');
    if (error.status === 401) {
      deleteCookie('token')
      router?.replace('/auth/login?from=dashboard')
    }
  } else if (error instanceof Error) {
    setError?.(error.message || 'An unexpected error occurred');
  } else {
    setError?.('An unexpected error occurred');
  }
}