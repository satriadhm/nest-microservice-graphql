import { Module } from '@nestjs/common';
import { ParsersController } from './parsers.controller';
import { ParsersService } from './parsers.service';

@Module({
  imports: [],
  controllers: [ParsersController],
  providers: [ParsersService],
})
export class ParsersModule {}
