import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { HttpException } from '../exceptions';

export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof HttpException) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      errors: err.errors,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
    return;
  }

  console.error('Error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    stack: process.env.NODE_ENV === 'development' ? err instanceof Error ? err.stack : undefined : undefined,
  });
};
