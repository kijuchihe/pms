"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestException = void 0;
const http_exception_1 = require("./http.exception");
class BadRequestException extends http_exception_1.HttpException {
    constructor(message = 'Bad request', errors) {
        super(message, 400, errors);
    }
}
exports.BadRequestException = BadRequestException;
