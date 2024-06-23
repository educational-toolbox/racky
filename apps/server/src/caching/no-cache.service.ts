import { Injectable, Logger } from '@nestjs/common';
import { CachingService } from './caching.service';
import { TIME } from '~/CONSTANTS';

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
export class FakeCachingService extends CachingService {
  private cache = new Map<string, string>();

  constructor() {
    super(new Logger(FakeCachingService.name));
    this.logger.log('FakeCache Client Connected');
  }

  get<T = any>(key: string): Promise<T | null> {
    const value = this.cache.get(key);
    this.log('get', key, !!value);
    return Promise.resolve(value ? (JSON.parse(value) as T) : null);
  }

  set<T = any>(
    key: string,
    value: T,
    ttlInMilliseconds = TIME.THIRTY_MINUTES,
  ): Promise<void> {
    this.log('set', key);
    try {
      this.cache.set(key, JSON.stringify(value));
      debounce(() => this.cache.delete(key), ttlInMilliseconds)();
    } catch (error) {
      this.logger.error('[ERROR]', error);
    }
    return Promise.resolve();
  }

  del(key: string): Promise<void> {
    this.log('delete', key);
    this.cache.delete(key);
    return Promise.resolve();
  }
}
