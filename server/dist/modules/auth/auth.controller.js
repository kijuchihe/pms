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
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
const catch_async_1 = require("../../shared/utils/catch-async");
const exceptions_1 = require("../../shared/exceptions");
class AuthController {
    constructor() {
        this.register = (0, catch_async_1.catchAsync)((req, res) => __awaiter(this, void 0, void 0, function* () {
            if (!req.body.email || !req.body.password) {
                throw new exceptions_1.BadRequestException('Email and password are required');
            }
            const { user, token } = yield this.authService.register(req.body);
            res.status(201).json({
                status: 'success',
                data: { user, token }
            });
        }));
        this.login = (0, catch_async_1.catchAsync)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            if (!email || !password) {
                throw new exceptions_1.BadRequestException('Email and password are required');
            }
            const { user, token } = yield this.authService.login(email, password);
            res.status(200).json({
                status: 'success',
                data: { user, token }
            });
        }));
        this.authService = new auth_service_1.AuthService();
    }
}
exports.AuthController = AuthController;
