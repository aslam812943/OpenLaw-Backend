import { AppError } from "./AppError";
import { HttpStatusCode } from "../interface/enums/HttpStatusCode";

export class InternalServerError extends AppError {
    public statusCode = HttpStatusCode.INTERNAL_SERVER_ERROR;

    constructor(message: string = "Internal Server Error") {
        super(message);
    }
}
