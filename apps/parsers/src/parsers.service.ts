import { Injectable } from '@nestjs/common';

@Injectable()
export class ParsersService {
  getHello(): string {
    return 'Hello World!';
  }
}
