"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenError = void 0;
const AppError_1 = require("./AppError");
class ForbiddenError extends AppError_1.AppError {
    constructor() {
        super(...arguments);
        this.statusCode = 403;
    }
}
exports.ForbiddenError = ForbiddenError;
//# sourceMappingURL=ForbiddenError.js.map