import { Global, Module } from '@nestjs/common';
import { CachingService } from './caching.service';
import { RedisCachingService } from './redis.service';

@Global()
@Module({
  providers: [
    {
      provide: CachingService,
      useClass: RedisCachingService,
    },
  ],
  exports: [CachingService],
})
export class CachingModule {}
