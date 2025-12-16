"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictError = void 0;
const AppError_1 = require("./AppError");
class ConflictError extends AppError_1.AppError {
    constructor(message = "Conflict occurred") {
        super(message);
        this.statusCode = 409;
    }
}
exports.ConflictError = ConflictError;
//# sourceMappingURL=ConflictError.js.map