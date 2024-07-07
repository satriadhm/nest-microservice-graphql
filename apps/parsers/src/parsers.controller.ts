import { Controller, Get } from '@nestjs/common';
import { ParsersService } from './parsers.service';

@Controller()
export class ParsersController {
  constructor(private readonly parsersService: ParsersService) {}

  @Get()
  getHello(): string {
    return this.parsersService.getHello();
  }
}
