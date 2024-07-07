import { NestFactory } from '@nestjs/core';
import { ApplicantsModule } from './applicants.module';

async function bootstrap() {
  const app = await NestFactory.create(ApplicantsModule);
  await app.listen(3000);
}
bootstrap();
