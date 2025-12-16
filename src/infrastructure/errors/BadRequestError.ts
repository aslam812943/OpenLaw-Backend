import { AppError } from "./AppError";

export class BadRequestError extends AppError {
    statusCode = 400;
}
