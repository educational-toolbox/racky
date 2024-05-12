export abstract class CachingService {
  abstract get(key: string): Promise<string | null>;
  abstract set<T>(
    key: string,
    value: T,
    ttlInMilliseconds?: number,
  ): Promise<void>;
  abstract del(key: string): Promise<void>;
}
