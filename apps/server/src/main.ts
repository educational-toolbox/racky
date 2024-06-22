import { TrpcRouter } from '@educational-toolbox/racky-api/trpc/trpc.router';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { env } from './server-env';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppService } from './app.service';

export const getPort = () => {
  const url = env.NEXT_PUBLIC_NESTJS_SERVER;
  if (!url) {
    return 4000;
  }
  const port = new URL(url).port;
  return port ? parseInt(port, 10) : 4000;
};

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.use(cookieParser());
  const trpc = app.get(TrpcRouter);
  const appService = app.get(AppService);
  await appService.ensureDefaultOrgCreated();
  trpc.applyOpenAPIMiddleware(app);
  trpc.applyTRPCHandler(app);
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  await app.listen(getPort());
}

bootstrap();
