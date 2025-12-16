"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = void 0;
const AppError_1 = require("./AppError");
class InternalServerError extends AppError_1.AppError {
    constructor(message = "Internal Server Error") {
        super(message);
        this.statusCode = 500;
    }
}
exports.InternalServerError = InternalServerError;
//# sourceMappingURL=InternalServerError.js.map