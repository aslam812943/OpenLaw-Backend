"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
    constructor(message) {
        super(message);
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
//# sourceMappingURL=AppError.js.map