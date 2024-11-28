import { AxiosError } from "axios";
import { deleteCookie } from "./delete-cookie";

export const handleError = (error: any, router?: any) => {
  if (error instanceof AxiosError) {
    if (error.status === 401) {
      deleteCookie('token')
      router && router.replace('/auth/login?from=/teams')
    }
  }
}