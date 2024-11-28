"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const exceptions_1 = require("../exceptions");
const errorHandler = (err, _req, res, _next) => {
    if (err instanceof exceptions_1.HttpException) {
        res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
            errors: err.errors,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        });
        return;
    }
    console.error('Error:', err);
    res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        stack: process.env.NODE_ENV === 'development' ? err instanceof Error ? err.stack : undefined : undefined,
    });
};
exports.errorHandler = errorHandler;
