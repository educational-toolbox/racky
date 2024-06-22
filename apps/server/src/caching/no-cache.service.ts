import { Injectable, Logger } from '@nestjs/common';
import { CachingService } from './caching.service';
import { TIME } from '../CONSTANTS';

function debounce<T extends (...arg: any[]) => any>(func: T, timeout = 300) {
  let timer: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

@Injectable()
export class FakeCachingService implements CachingService {
  private logger: Logger = new Logger(FakeCachingService.name);
  private cache = new Map<string, string>();

  constructor() {
    this.logger.log('FakeCache Client Connected');
  }

  get<T = any>(key: string): Promise<T | null> {
    const value = this.cache.get(key);
    if (value == null) {
      this.logger.warn(`Cache miss for key: ${key}`);
    } else {
      this.logger.log(`Cache hit for key: ${key}`);
    }
    return Promise.resolve(value ? (JSON.parse(value) as T) : null);
  }

  set<T = any>(
    key: string,
    value: T,
    ttlInMilliseconds = TIME.THIRTY_MINUTES,
  ): Promise<void> {
    this.logger.log(`Setting cache for key: ${key}`);
    try {
      this.cache.set(key, JSON.stringify(value));
      debounce(() => this.cache.delete(key), ttlInMilliseconds)();
    } catch (error) {
      this.logger.error('Error while setting item in cache', error);
    }
    return Promise.resolve();
  }

  del(key: string): Promise<void> {
    this.logger.log(`Deleting cache for key: ${key}`);
    this.cache.delete(key);
    return Promise.resolve();
  }
}
