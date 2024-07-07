import { ObjectType, Field, Int, ID } from '@nestjs/graphql';

@ObjectType()
export class Applicant {
  @Field(() => ID)
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
