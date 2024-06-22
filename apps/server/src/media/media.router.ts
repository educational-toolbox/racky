import { TrpcService } from '@educational-toolbox/racky-api/trpc/trpc.service';
import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { TIME } from '../CONSTANTS';
import { MediaService } from './media.service';

@Injectable()
export class MediaRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly mediaService: MediaService,
  ) {}

  router = this.trpc.router({
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
    getImage: this.trpc.publicProcedure
      .meta({
        openapi: {
          method: 'GET',
          path: '/media',
          tags: ['Media'],
          summary: 'Get an image',
          description: 'Get an image from the server by id',
        },
        caching: { ttl: TIME.ONE_HOUR },
      })
      .input(z.object({ fileKey: z.string() }))
      .output(z.string())
      .query(async ({ input }) => {
        const image = await this.mediaService.get(input.fileKey);
        return image;
      }),
  });
}
