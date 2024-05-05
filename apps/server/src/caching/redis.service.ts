import { Injectable, Logger } from '@nestjs/common';
import { CachingService } from './caching.service';
import { createClient } from 'redis';
import { env } from '../server-env';

@Injectable()
export class RedisCachingService implements CachingService {
  private client = createClient({
    url: env.REDIS_URL,
  });

  private logger: Logger = new Logger(RedisCachingService.name);

  constructor() {
    this.client.on('error', (err) =>
      this.logger.error('Redis Client Error', err),
    );
    this.client.connect().then(() => this.logger.log('Redis Client Connected'));
  }

  async get(key: string): Promise<string | null> {
    const value = await this.client.get(key);
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
      await this.client.set(key, JSON.stringify(value));
      await this.client.expire(key, ttlInMilliseconds / 1000);
    } catch (error) {
      this.logger.error('Error while setting item in cache', error);
    }
  }

  async del(key: string): Promise<void> {
    this.logger.log(`Deleting cache for key: ${key}`);
    await this.client.del(key);
  }
}
