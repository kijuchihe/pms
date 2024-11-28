"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerException = void 0;
const http_exception_1 = require("./http.exception");
class InternalServerException extends http_exception_1.HttpException {
    constructor(message = 'Internal server error') {
        super(message, 500);
    }
}
exports.InternalServerException = InternalServerException;
