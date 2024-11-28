"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationException = void 0;
const http_exception_1 = require("./http.exception");
class ValidationException extends http_exception_1.HttpException {
    constructor(errors) {
        super('Validation failed', 422, errors);
    }
}
exports.ValidationException = ValidationException;
