"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisCacheService = void 0;
const Redis_1 = __importDefault(require("../../../config/reddis/Redis"));
class RedisCacheService {
    async set(key, expiry, value) {
        await Redis_1.default.setex(key, expiry, value);
    }
    async get(key) {
        return await Redis_1.default.get(key);
    }
    async del(key) {
        await Redis_1.default.del(key);
    }
}
exports.RedisCacheService = RedisCacheService;
//# sourceMappingURL=RedisCacheService.js.map