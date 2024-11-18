import { HttpException } from './http.exception';

export class ValidationException extends HttpException {
  constructor(errors: any[]) {
    super('Validation failed', 422, errors);
  }
}
