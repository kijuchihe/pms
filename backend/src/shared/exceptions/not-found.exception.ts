import { HttpException } from './http.exception';

export class NotFoundException extends HttpException {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404);
  }
}
