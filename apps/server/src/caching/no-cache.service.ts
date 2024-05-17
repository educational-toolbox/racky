import { Injectable, Logger } from '@nestjs/common';
import { CachingService } from './caching.service';

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
  private cache: Map<string, string> = new Map();

  constructor() {
    this.logger.log('FakeCache Client Connected');
  }

  async get(key: string): Promise<string | null> {
    const value = this.cache.get(key);
    if (value == null) {
      this.logger.warn(`Cache miss for key: ${key}`);
    } else {
      this.logger.log(`Cache hit for key: ${key}`);
    }
    return value ? JSON.parse(value) : null;
  }

  async set<T = any>(
    key: string,
    value: T,
    ttlInMilliseconds = 5000,
  ): Promise<void> {
    this.logger.log(`Setting cache for key: ${key}`);
    try {
      this.cache.set(key, JSON.stringify(value));
      debounce(() => this.cache.delete(key), ttlInMilliseconds)();
    } catch (error) {
      this.logger.error('Error while setting item in cache', error);
    }
  }

  async del(key: string): Promise<void> {
    this.logger.log(`Deleting cache for key: ${key}`);
    this.cache.delete(key);
  }
}