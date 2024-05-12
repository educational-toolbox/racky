import { Global, Module } from '@nestjs/common';
import { CachingService } from './caching.service';
import { RedisCachingService } from './redis.service';
import { env } from '../server-env';
import { FakeCachingService } from './no-cache.service';

@Global()
@Module({
  providers: [
    {
      provide: CachingService,
      useFactory: () => {
        if (env.REDIS_URL) {
          return new RedisCachingService();
        } else {
          return new FakeCachingService();
        }
      },
    },
  ],
  exports: [CachingService],
})
export class CachingModule {}
