import { AppError } from "./AppError";
import { HttpStatusCode } from "../interface/enums/HttpStatusCode";

export class ValidationError extends AppError {
    statusCode = HttpStatusCode.BAD_REQUEST;
    constructor(message: string) {
        super(message);
    }
}
