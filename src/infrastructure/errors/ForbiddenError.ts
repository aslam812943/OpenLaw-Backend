import { AppError } from "./AppError";
import { HttpStatusCode } from "../interface/enums/HttpStatusCode";

export class ForbiddenError extends AppError {
    statusCode = HttpStatusCode.FORBIDDEN;
}
