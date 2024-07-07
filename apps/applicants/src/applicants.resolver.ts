import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ApplicantsService } from './applicants.service';
import { Applicant } from './entities/applicant.entity';
import { CreateApplicantInput } from './dto/create-applicant.input';
import { UpdateApplicantInput } from './dto/update-applicant.input';

@Resolver(() => Applicant)
export class ApplicantsResolver {
  constructor(private readonly applicantsService: ApplicantsService) {}

  @Mutation(() => Applicant)
  createApplicant(
    @Args('createApplicantInput') createApplicantInput: CreateApplicantInput,
  ) {
    return this.applicantsService.create(createApplicantInput);
  }

  @Query(() => [Applicant], { name: 'applicants' })
  findAll() {
    return this.applicantsService.findAll();
  }

  @Query(() => Applicant, { name: 'applicant' })
  findOne(@Args('id') id: string) {
    return this.applicantsService.findOne(id);
  }

  @Mutation(() => Applicant)
  updateApplicant(
    @Args('updateApplicantInput') updateApplicantInput: UpdateApplicantInput,
  ) {
    return this.applicantsService.update(
      updateApplicantInput.id,
      updateApplicantInput,
    );
  }

  @Mutation(() => Applicant)
  removeApplicant(@Args('id') id: string) {
    return this.applicantsService.remove(id);
  }
}
