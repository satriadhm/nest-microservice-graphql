import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateParserInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
