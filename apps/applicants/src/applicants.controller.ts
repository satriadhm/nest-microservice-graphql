import { Controller } from '@nestjs/common';
import { ApplicantsService } from './applicants.service';

@Controller()
export class ApplicantsController {
  constructor(private readonly applicantsService: ApplicantsService) {}
}
