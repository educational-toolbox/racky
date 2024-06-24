import { Injectable, Logger } from '@nestjs/common';
import { CachingService } from './caching.service';
import { createClient } from 'redis';
import { env } from '../server-env';
import { TIME } from '../CONSTANTS';

@Injectable()
export class RedisCachingService extends CachingService {
  private client = createClient({
    url: env.REDIS_URL,
  });

  constructor() {
    super(new Logger(RedisCachingService.name));
    this.client.on('error', (err) =>
      this.logger.error('Redis Client Error', err),
    );
    this.client
      .connect()
      .then(() => this.logger.log('Redis Client Connected'))
      .catch((err) => this.logger.error('Error connecting to Redis', err));
  }

  async get<T = any>(key: string): Promise<T | null> {
    const value = await this.client.get(key);
    this.log('get', key, !!value);
    return value ? (JSON.parse(value) as T) : null;
  }

  async set<T = any>(
    key: string,
    value: T,
    ttlInMilliseconds = TIME.THIRTY_MINUTES,
  ): Promise<void> {
    this.log('set', key);
    try {
      await this.client.set(key, JSON.stringify(value));
      await this.client.expire(key, ttlInMilliseconds / 1000);
    } catch (error) {
      this.logger.error('Error while setting item in cache', error);
    }
  }

  async del(key: string): Promise<void> {
    this.log('delete', key);
    await this.client.del(key);
  }
}
