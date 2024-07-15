import { NestFactory } from '@nestjs/core';
import { ParsersModule } from './parsers.module';

async function bootstrap() {
  const app = await NestFactory.create(ParsersModule);
  await app.listen(3001);
}
bootstrap();
