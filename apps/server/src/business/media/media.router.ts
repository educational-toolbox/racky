import { TrpcService } from '~/trpc/trpc.service';
import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { TIME } from '~/CONSTANTS';
import { MediaService } from './media.service';
import { openapi } from './media.openapi';

@Injectable()
export class MediaRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly mediaService: MediaService,
  ) {}

  router = this.trpc.router({
    uploadImage: this.trpc.protectedProcedure
      .meta({
        openapi: openapi().method('POST').summary('Upload an image').build(),
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
        openapi: openapi()
          .segments('{fileKey}')
          .summary('Get an image')
          .build(),
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
