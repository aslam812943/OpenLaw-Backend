export abstract class AppError extends Error {
    public abstract statusCode: number;
    public isOperational = true;

    constructor(message: string) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
    }
}