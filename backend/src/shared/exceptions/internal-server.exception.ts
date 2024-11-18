import { HttpException } from './http.exception';

export class InternalServerException extends HttpException {
  constructor(message: string = 'Internal server error') {
    super(message, 500);
  }
}
