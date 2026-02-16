import { AppError } from "./AppError";
import { HttpStatusCode } from "../interface/enums/HttpStatusCode";

export class UnauthorizedError extends AppError {
    statusCode = HttpStatusCode.UNAUTHORIZED;
}
