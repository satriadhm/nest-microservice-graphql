import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateApplicantInput {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field(() => Int)
  age: number;

  @Field()
  address: string;

  @Field()
  country: string;

  @Field()
  city: string;
}
