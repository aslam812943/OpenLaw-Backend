import { AppError } from "./AppError";
import { HttpStatusCode } from "../interface/enums/HttpStatusCode";
export class BadRequestError extends AppError {
    statusCode = HttpStatusCode.BAD_REQUEST;
}
