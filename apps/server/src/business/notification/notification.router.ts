import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { TrpcService } from '../../trpc/trpc.service';
import { openapi } from './notification.openapi';
import { notificationSchema } from './notification.schema';
import { NotificationService } from './notification.service';

@Injectable()
export class NotificationsRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly notificationService: NotificationService,
  ) {}

  router = this.trpc.router({
    getMy: this.trpc.protectedProcedure
      .meta({
        openapi: openapi()
          .segments('my')
          .summary('Get notifications for the current user')
          .protected()
          .description('Get all unread notifications for the current user')
          .build(),
      })
      .input(z.void())
      .output(z.array(notificationSchema))
      .query(({ ctx }) => this.notificationService.getForUser(ctx.user.id)),

    markAsRead: this.trpc.protectedProcedure
      .meta({
        openapi: openapi()
          .method('POST')
          .segments('mark-as-read')
          .protected()
          .summary('Mark a notification as read')
          .description('Mark a notification as read')
          .build(),
      })
      .input(z.object({ id: z.string() }))
      .output(z.void())
      .mutation(async ({ input }) => {
        await this.notificationService.markAsRead(input.id);
      }),
  });
}
