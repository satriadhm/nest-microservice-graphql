import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Parser } from './parser.entity';

@ObjectType()
@Entity()
export class ParserResult {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => ID)
  @Column()
  parserId: string;

  @ManyToOne(() => Parser, { onDelete: 'CASCADE' })
  parser: Parser;

  @Field()
  @Column('jsonb')
  data: Record<string, any>;

  @Field(() => Boolean)
  @Column({ default: false })
  enriched: boolean;

  @Field(() => Date)
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
