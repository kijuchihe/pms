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
exports.UserController = void 0;
const users_service_1 = require("./users.service");
const catch_async_1 = require("../../shared/utils/catch-async");
class UserController {
    constructor() {
        this.getUserTeams = (0, catch_async_1.catchAsync)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            const teams = yield this.userService.getUserTeams(userId, req.query);
            res.status(200).json({
                status: 'success',
                data: {
                    teams
                }
            });
        }));
        this.searchUsers = (0, catch_async_1.catchAsync)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { query } = req.params;
            const users = yield this.userService.searchUsers(query);
            res.status(200).json({
                status: 'success',
                data: {
                    users
                }
            });
        }));
        this.getUserProjects = (0, catch_async_1.catchAsync)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const projects = yield this.userService.getUserProjects(userId, req.query);
                res.status(200).json({
                    status: 'success',
                    message: 'User projects retrieved successfully',
                    data: {
                        projects
                    }
                });
            }
            catch (error) {
                next(error);
            }
        }));
        this.updateUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const user = yield this.userService.updateUser(userId, req.body);
                res.status(200).json({
                    status: 'success',
                    message: 'User updated successfully',
                    data: {
                        user
                    }
                });
            }
            catch (error) {
                next(error);
            }
        });
        // super(new UserService());
        // this.userService = new UserService();
        this.userService = new users_service_1.UserService();
    }
}
exports.UserController = UserController;
