import { HttpException } from './http.exception';

export class BadRequestException extends HttpException {
  constructor(message: string = 'Bad request', errors?: any[]) {
    super(message, 400, errors);
  }
}
