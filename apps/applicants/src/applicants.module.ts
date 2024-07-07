import { Module } from '@nestjs/common';
import { ApplicantsService } from './applicants.service';
import { ApplicantsResolver } from './applicants.resolver';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
    }),
  ],
  providers: [ApplicantsResolver, ApplicantsService],
})
export class ApplicantsModule {}
