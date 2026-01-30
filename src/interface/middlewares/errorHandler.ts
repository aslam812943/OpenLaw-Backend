
import { Request, Response, NextFunction } from "express";
import { AppError } from "../../infrastructure/errors/AppError";
import { ApiResponse } from "../../infrastructure/utils/ApiResponse";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    return ApiResponse.error(res, err.statusCode, err.message);
  }

  return ApiResponse.error(res, 500, "Internal Server Error");
};