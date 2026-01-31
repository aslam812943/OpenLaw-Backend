
import { Request, Response, NextFunction } from "express";
import { AppError } from "../../infrastructure/errors/AppError";
import { ApiResponse } from "../../infrastructure/utils/ApiResponse";
import { HttpStatusCode } from "../../infrastructure/interface/enums/HttpStatusCode";
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    return ApiResponse.error(res, err.statusCode, err.message);
  }

  return ApiResponse.error(res, HttpStatusCode.INTERNAL_SERVER_ERROR, "Internal Server Error");
};