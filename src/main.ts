import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FormatResponseInterceptor } from './format-response.interceptor.js';
import { InvokeRecordInterceptor } from './invoke-record.interceptor.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new FormatResponseInterceptor());
  app.useGlobalInterceptors(new InvokeRecordInterceptor());

  const configService = app.get(ConfigService);
  await app.listen(process.env.PORT ?? configService.get('nest_server_port') ?? 3000);
}
await bootstrap();
