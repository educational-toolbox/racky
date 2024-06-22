export abstract class CachingService {
  abstract get<T>(key: string): Promise<T | null>;
  abstract set<T>(
    key: string,
    value: T,
    ttlInMilliseconds?: number,
  ): Promise<void>;
  abstract del(key: string): Promise<void>;
}
