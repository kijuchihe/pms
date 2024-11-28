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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const exceptions_1 = require("../shared/exceptions");
class RedisClient {
    constructor() {
        this.client = new ioredis_1.default({
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379'),
            password: process.env.REDIS_PASSWORD,
            retryStrategy: (times) => {
                // Maximum retry delay is 3000ms
                return Math.min(times * 50, 3000);
            },
        });
        this.client.on('error', (err) => {
            console.error('Redis Client Error:', err);
            throw new exceptions_1.InternalServerException('Redis connection error');
        });
        this.client.on('connect', () => {
            console.log('Redis Client Connected');
        });
    }
    static getInstance() {
        if (!RedisClient.instance) {
            RedisClient.instance = new RedisClient();
        }
        return RedisClient.instance;
    }
    getClient() {
        return this.client;
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.client.get(key);
        });
    }
    set(key, value, ttl) {
        return __awaiter(this, void 0, void 0, function* () {
            if (ttl) {
                return this.client.set(key, value, 'EX', ttl);
            }
            return this.client.set(key, value);
        });
    }
    del(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.client.del(key);
        });
    }
    flushAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.client.flushall();
        });
    }
}
exports.redisClient = RedisClient.getInstance();
