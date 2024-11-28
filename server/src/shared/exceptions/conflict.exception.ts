import { HttpException } from './http.exception';

export class ConflictException extends HttpException {
  constructor(message: string = 'Resource already exists') {
    super(message, 409);
  }
}
