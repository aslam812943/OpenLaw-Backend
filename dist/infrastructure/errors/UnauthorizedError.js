"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedError = void 0;
const AppError_1 = require("./AppError");
class UnauthorizedError extends AppError_1.AppError {
    constructor() {
        super(...arguments);
        this.statusCode = 401;
    }
}
exports.UnauthorizedError = UnauthorizedError;
//# sourceMappingURL=UnauthorizedError.js.map