import { AppError } from "./AppError";

export class ConflictError extends AppError {
    public statusCode = 409;

    constructor(message: string = "Conflict occurred") {
        super(message);
    }
}
