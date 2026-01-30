
import { Response } from 'express';

interface IApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    errors?: unknown;
}

export class ApiResponse {
    static success<T>(res: Response, statusCode: number, message: string, data?: T) {
        const responsePayload: IApiResponse<T> = {
            success: true,
            message,
        };
        if (data !== undefined) {
            responsePayload.data = data;
        }
        return res.status(statusCode).json(responsePayload);
    }

    static error(res: Response, statusCode: number, message: string, errors?: unknown) {
        const responsePayload: IApiResponse<null> = {
            success: false,
            message,
        };
        if (errors !== undefined) {
            responsePayload.errors = errors;
        }
        return res.status(statusCode).json(responsePayload);
    }
}
