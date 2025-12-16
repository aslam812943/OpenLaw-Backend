import { AppError } from "./AppError";

export class NotFoundError extends AppError {
    statusCode = 404;
}
