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
exports.clearCache = exports.cache = void 0;
const redis_1 = require("../../config/redis");
const defaultKeyGenerator = (req) => {
    return `${req.method}:${req.originalUrl}`;
};
const cache = (options = {}) => {
    const ttl = options.ttl || 300; // Default 5 minutes
    const keyGenerator = options.keyGenerator || defaultKeyGenerator;
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        if (req.method !== 'GET') {
            // Only cache GET requests
            next();
            return;
        }
        const key = keyGenerator(req);
        try {
            const cachedData = yield redis_1.redisClient.get(key);
            if (cachedData) {
                const data = JSON.parse(cachedData);
                res.json(data);
                return;
            }
            // Store original res.json method
            const originalJson = res.json.bind(res);
            // Override res.json method to cache the response
            res.json = ((data) => {
                // Restore original method
                res.json = originalJson;
                // Cache the data
                redis_1.redisClient.set(key, JSON.stringify(data), ttl);
                // Send the response
                return originalJson(data);
            });
            next();
        }
        catch (error) {
            console.error('Cache middleware error:', error);
            next();
        }
    });
};
exports.cache = cache;
const clearCache = (pattern) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const client = redis_1.redisClient.getClient();
            const keys = yield client.keys(pattern);
            if (keys.length > 0) {
                yield Promise.all(keys.map(key => client.del(key)));
            }
            next();
        }
        catch (error) {
            console.error('Clear cache error:', error);
            next();
        }
    });
};
exports.clearCache = clearCache;
