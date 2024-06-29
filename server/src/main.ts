import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new ConfigService();
  app.enableCors({
    origin: [config.get('CLIENT_URL'), '*'],
    credentials: true,
    exposedHeaders: 'set-cookie',
  });
  app.use(cookieParser());
  await app.listen(3001);
}
bootstrap();
