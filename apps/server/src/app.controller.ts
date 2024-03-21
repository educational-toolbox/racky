import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { TrpcRouter } from './trpc/trpc.router';
import { AuthenticatedGuard } from './auth/authenticated.guard';

@UseGuards(AuthenticatedGuard)
@Controller('/api')
export class AppController {
  constructor(private readonly router: TrpcRouter) {}

  @Get('/openapi.json')
  getOpenApiJsonFile(@Res() res: Response) {
    return res.json(this.router.openapiDoc);
  }
}
