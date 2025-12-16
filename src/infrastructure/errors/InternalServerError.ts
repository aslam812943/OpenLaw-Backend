import { AppError } from "./AppError";

export class InternalServerError extends AppError {
    public statusCode = 500;

    constructor(message: string = "Internal Server Error") {
        super(message);
    }
}
