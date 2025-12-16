import { AppError } from "./AppError";

export class UnauthorizedError extends AppError {
    statusCode = 401;
}
