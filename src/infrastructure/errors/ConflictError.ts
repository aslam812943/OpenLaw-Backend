import { AppError } from "./AppError";
import { HttpStatusCode } from "../interface/enums/HttpStatusCode";

export class ConflictError extends AppError {
    public statusCode = HttpStatusCode.CONFLICT;

    constructor(message: string = "Conflict occurred") {
        super(message);
    }
}
