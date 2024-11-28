"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictException = void 0;
const http_exception_1 = require("./http.exception");
class ConflictException extends http_exception_1.HttpException {
    constructor(message = 'Resource already exists') {
        super(message, 409);
    }
}
exports.ConflictException = ConflictException;
