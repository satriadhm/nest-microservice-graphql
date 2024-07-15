import { CreateParserInput } from './create-parser.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateParserInput extends PartialType(CreateParserInput) {
  @Field(() => Int)
  id: number;
}
