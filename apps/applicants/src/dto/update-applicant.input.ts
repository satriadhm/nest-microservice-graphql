import { CreateApplicantInput } from './create-applicant.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateApplicantInput extends PartialType(CreateApplicantInput) {
  @Field()
  id: string;
}
