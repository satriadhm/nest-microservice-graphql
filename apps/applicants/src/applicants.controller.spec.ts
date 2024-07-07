import { Test, TestingModule } from '@nestjs/testing';
import { ApplicantsController } from './applicants.controller';
import { ApplicantsService } from './applicants.service';

describe('ApplicantsController', () => {
  let applicantsController: ApplicantsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ApplicantsController],
      providers: [ApplicantsService],
    }).compile();

    applicantsController = app.get<ApplicantsController>(ApplicantsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(applicantsController.getHello()).toBe('Hello World!');
    });
  });
});
