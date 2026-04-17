import mongoose, { ClientSession } from "mongoose";
import { ISession } from "../../domain/interfaces/ISession";
import { IDatabaseSession, IDatabaseSessionFactory } from "../../domain/interfaces/IDatabaseSession";

export class MongooseSession implements ISession {
    constructor(public readonly nativeSession: ClientSession) { }
    get id() { return this.nativeSession.id?.toString() || 'mongoose-session'; }
}

class MongooseDatabaseSession implements IDatabaseSession {
    private readonly _session: MongooseSession;

    constructor(session: ClientSession) {
        this._session = new MongooseSession(session);
    }

    async startTransaction(): Promise<void> {
        this._session.nativeSession.startTransaction();
    }

    async commitTransaction(): Promise<void> {
        await this._session.nativeSession.commitTransaction();
    }

    async abortTransaction(): Promise<void> {
        await this._session.nativeSession.abortTransaction();
    }

    endSession(): void {
        this._session.nativeSession.endSession();
    }

    getSession(): ISession {
        return this._session;
    }
}

export class MongooseDatabaseSessionFactory implements IDatabaseSessionFactory {
    async createSession(): Promise<IDatabaseSession> {
        const session = await mongoose.startSession();
        return new MongooseDatabaseSession(session);
    }
}
