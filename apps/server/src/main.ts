import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TrpcRouter } from '@educational-toolbox/racky-api/trpc/trpc.router';

const getPort = () => {
  const url = process.env.NEXT_PUBLIC_NESTJS_SERVER;
  if (!url) {
    return 4000;
  }
  const port = new URL(url).port;
  return port ? parseInt(port, 10) : 4000;
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const trpc = app.get(TrpcRouter);
  trpc.applyTRPCHandler(app);
  await app.listen(getPort());
}

bootstrap();
