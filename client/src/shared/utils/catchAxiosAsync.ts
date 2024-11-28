import { handleError } from "./handleError"

export const catchAsync = (fn: (...data: string[] | number[] | object[]) => Promise<void>, finallyFn: () => void) => {
  try {
    fn()
  } catch (error) {
    handleError(error)
  } {
    finallyFn()
  }
}