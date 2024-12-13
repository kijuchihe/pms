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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const users_entity_1 = require("../users/users.entity");
const base_service_1 = require("../../shared/utils/base.service");
const exceptions_1 = require("../../shared/exceptions");
class AuthService extends base_service_1.BaseService {
    constructor() {
        super(users_entity_1.UserModel);
    }
    register(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield users_entity_1.UserModel.findOne({ email: userData.email });
            if (existingUser) {
                throw new exceptions_1.ConflictException('Email already exists');
            }
            const user = yield users_entity_1.UserModel.create(userData);
            const token = this.generateToken(user);
            // Convert to plain object and exclude password
            const _a = user.toObject(), { password } = _a, userResponse = __rest(_a, ["password"]);
            return { user: userResponse, token };
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_entity_1.UserModel.findOne({ email }).select('+password');
            if (!user) {
                throw new exceptions_1.UnauthorizedException('Invalid credentials');
            }
            const isPasswordValid = yield user.comparePassword(password);
            if (!isPasswordValid) {
                throw new exceptions_1.UnauthorizedException('Invalid credentials');
            }
            const token = this.generateToken(user);
            // Convert to plain object and exclude password
            const _a = user.toObject(), { password: _ } = _a, userResponse = __rest(_a, ["password"]);
            return { user: userResponse, token };
        });
    }
    generateToken(user) {
        try {
            return jsonwebtoken_1.default.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1d' });
        }
        catch (error) {
            throw new exceptions_1.InternalServerException('Error generating token');
        }
    }
    verifyToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your-secret-key');
                const user = yield users_entity_1.UserModel.findById(decoded.id).select('-password');
                if (!user) {
                    throw new exceptions_1.UnauthorizedException('Invalid token');
                }
                return user.toJSON();
            }
            catch (error) {
                throw new exceptions_1.UnauthorizedException('Invalid token');
            }
        });
    }
}
exports.AuthService = AuthService;
