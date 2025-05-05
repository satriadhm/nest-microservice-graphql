import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Parser {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  fileName: string;

  @Field()
  @Column()
  filePath: string;

  @Field(() => Boolean)
  @Column({ default: false })
  processed: boolean;

  @Field(() => Boolean)
  @Column({ default: false })
  valid: boolean;

  @Field(() => Date)
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  uploadedAt: Date;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  processedAt: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  processingError: string;
}
