import { AppError } from "./AppError";

export class ForbiddenError extends AppError {
    statusCode = 403;
}
