"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const auth_service_1 = require("../../modules/auth/auth.service");
const exceptions_1 = require("../exceptions");
const authenticate = (req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new exceptions_1.UnauthorizedException('No token provided');
        }
        const token = authHeader.split(' ')[1];
        const authService = new auth_service_1.AuthService();
        const user = yield authService.verifyToken(token);
        // console.log("Verified user", user)
        req.user = user;
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.authenticate = authenticate;
const authorize = (...roles) => {
    return (req, _res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new exceptions_1.ForbiddenException('Not authorized to access this route');
        }
        next();
    };
};
exports.authorize = authorize;
