export interface ICacheService {
    set(key: string, expiry: number, value: string): Promise<void>;
    get(key: string): Promise<string | null>;
    del(key: string): Promise<void>;
}
