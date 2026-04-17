import { ISession } from "./ISession";

export interface IDatabaseSession {
    startTransaction(): Promise<void>;
    commitTransaction(): Promise<void>;
    abortTransaction(): Promise<void>;
    endSession(): void;
    getSession(): ISession;
}

export interface IDatabaseSessionFactory {
    createSession(): Promise<IDatabaseSession>;
}
