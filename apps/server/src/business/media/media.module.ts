import { Module } from '@nestjs/common';
import { MediaRouter } from './media.router';
import { MediaService } from './media.service';
import { S3MediaService } from './s3.service';

@Module({
  imports: [],
  providers: [{ provide: MediaService, useClass: S3MediaService }, MediaRouter],
  exports: [MediaService, MediaRouter],
})
export class MediaModule {}
