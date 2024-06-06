import { Controller, Get, Render, Res } from '@nestjs/common';
import { Response } from 'express';
import { getPort } from './main';
import { TrpcRouter } from './trpc/trpc.router';

@Controller('/api')
export class AppController {
  constructor(private readonly router: TrpcRouter) {}

  @Get()
  @Render('spec')
  specView() {
    
    return { port: getPort() };
  }

  @Get('/openapi.json')
  getOpenApiJsonFile(@Res() res: Response) {
    return res.json(this.router.openapiDoc);
  }
}
