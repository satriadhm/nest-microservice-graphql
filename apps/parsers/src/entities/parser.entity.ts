import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Parser {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
