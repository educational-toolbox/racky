import { TrpcService } from '@educational-toolbox/racky-api/trpc/trpc.service';
import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { CachingService } from '../caching/caching.service';
import { MediaService } from './media.service';
import { TIME } from '../CONSTANTS';

@Injectable()
export class MediaRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly mediaService: MediaService,
    private readonly cacheService: CachingService,
  ) {}

  mediaRouter = this.trpc.router({
    uploadImage: this.trpc.protectedProcedure
      .meta({
        openapi: {
          method: 'POST',
          path: '/media/upload',
          tags: ['Media'],
          summary: 'Upload an image',
          description: 'Upload an image to the server',
        },
      })
      .input(
        z.object({
          fileId: z.string(),
        }),
      )
      .output(
        z.object({
          url: z.string(),
          key: z.string(),
        }),
      )
      .mutation(({ input }) => this.mediaService.upload(input.fileId)),
    getImage: this.trpc.procedure
      .meta({
        openapi: {
          method: 'GET',
          path: '/media',
          tags: ['Media'],
          summary: 'Get an image',
          description: 'Get an image from the server by id',
        },
      })
      .input(z.object({ fileKey: z.string() }))
      .output(z.string())
      .query(async ({ input, ctx }) => {
        const cached = await this.cacheService.get(input.fileKey);
        if (cached != null) return cached;
        const image = await this.mediaService.get(input.fileKey);
        await this.cacheService.set(ctx.key, image, TIME.THIRTY_MINUTES);
        return image;
      }),
  });
}
