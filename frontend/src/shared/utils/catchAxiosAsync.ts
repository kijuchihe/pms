import { handleError } from "./handleError"

export const catchAsync = (fn: (...data: any) => Promise<any>, finallyFn: () => void) => {
  try {
    fn()
  } catch (error: any) {
    handleError(error)
  } {
    finallyFn()
  }
}