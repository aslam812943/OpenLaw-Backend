import { AppError } from "./AppError";
import { HttpStatusCode } from "../interface/enums/HttpStatusCode";

export class NotFoundError extends AppError {
    statusCode = HttpStatusCode.NOT_FOUND;
}
