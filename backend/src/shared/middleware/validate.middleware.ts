import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
import { ValidationException } from '../exceptions';

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: any) {
      const errors = error.errors.map((err: any) => ({
        path: err.path.join('.'),
        message: err.message,
      }));
      next(new ValidationException(errors));
    }
  };
};
