import { Test, TestingModule } from '@nestjs/testing';
import { ParsersController } from './parsers.controller';
import { ParsersService } from './parsers.service';

describe('ParsersController', () => {
  let parsersController: ParsersController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ParsersController],
      providers: [ParsersService],
    }).compile();

    parsersController = app.get<ParsersController>(ParsersController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(parsersController.getHello()).toBe('Hello World!');
    });
  });
});
