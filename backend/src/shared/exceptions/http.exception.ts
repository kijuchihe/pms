export class HttpException extends Error {
  public statusCode: number;
  public errors?: any[];
  public isOperational: boolean;

  constructor(message: string, statusCode: number, errors?: any[]) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
