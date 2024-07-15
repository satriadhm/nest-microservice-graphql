import { Module } from '@nestjs/common';
import { ParsersService } from './parsers.service';
import { ParsersResolver } from './parsers.resolver';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
    }),
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [],
  providers: [ParsersResolver, ParsersService],
})
export class ParsersModule {}
