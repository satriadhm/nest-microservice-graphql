import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Applicant {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  email: string;

  @Field()
  @Column()
  name: string;

  @Field(() => Int)
  @Column()
  age: number;

  @Field()
  @Column()
  address: string;

  @Field()
  @Column()
  country: string;

  @Field()
  @Column()
  city: string;

  @Field(() => Date, { nullable: true })
  @Column({ nullable: true })
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  @Column({ nullable: true })
  updatedAt: Date;
}
