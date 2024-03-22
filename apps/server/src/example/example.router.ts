import { TrpcService } from '@educational-toolbox/racky-api/trpc/trpc.service';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { z } from 'zod';
import { LogEntryEvent } from '../events/log-entry.event';

@Injectable()
export class ExampleRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly eventEmmitter: EventEmitter2,
  ) {}

  exampleRouter = this.trpc.router({
    hello: this.trpc.procedure
      .meta({ openapi: { method: 'GET', path: '/say-hello' } })
      .input(z.object({ name: z.string().optional() }))
      .output(z.string())
      .query(async ({ input }) => {
        return `Hello ${input.name ? input.name : `Bilbo`}`;
      }),
    setHello: this.trpc.procedure
      .meta({ openapi: { method: 'POST', path: '/say-hello' } })
      .input(z.object({ name: z.string() }))
      .output(z.string())
      .mutation(({ input }) => {
        this.eventEmmitter.emit(
          LogEntryEvent.eventName,
          new LogEntryEvent(input.name),
        );
        return input.name;
      }),
    getLogs: this.trpc.procedure
      .meta({
        openapi: { method: 'GET', path: '/query-logs' },
      })
      .input(z.void())
      .output(
        z.array(
          z.object({
            id: z.number(),
            type: z.string(),
            text: z.string(),
            date: z.date(),
          }),
        ),
      )
      .query(async ({ ctx }) => {
        const logs = await ctx.db.log.findMany({ orderBy: { date: 'desc' } });
        return logs;
      }),
  });
}
