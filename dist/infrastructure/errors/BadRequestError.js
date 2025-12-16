"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestError = void 0;
const AppError_1 = require("./AppError");
class BadRequestError extends AppError_1.AppError {
    constructor() {
        super(...arguments);
        this.statusCode = 400;
    }
}
exports.BadRequestError = BadRequestError;
//# sourceMappingURL=BadRequestError.js.map