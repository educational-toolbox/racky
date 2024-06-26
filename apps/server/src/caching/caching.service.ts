import type { Logger } from '@nestjs/common';

export abstract class CachingService {
  constructor(protected readonly logger: Logger) {}
  abstract get<T>(key: string): Promise<T | null>;
  abstract set<T>(
    key: string,
    value: T,
    ttlInMilliseconds?: number,
  ): Promise<void>;
  abstract del(key: string): Promise<void>;
  protected log(
    type: 'set' | 'get' | 'delete',
    key: string,
    valueExists?: boolean,
  ): void {
    switch (type) {
      case 'get':
        this.logger.log(`[GET]: ${valueExists ? 'HIT ' : 'MISS'} ${key}`);
        break;
      case 'set':
        this.logger.log(`[SET]: ${key}`);
        break;
      case 'delete':
        this.logger.log(`[DELETE]: ${key}`);
        break;
    }
  }
}
