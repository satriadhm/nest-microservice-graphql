import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { IntrospectAndCompose } from '@apollo/gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      useFactory: (configService: ConfigService) => {
        const applicantsUrl = configService.get('APPLICANTS_SERVICE_URL') || 'http://localhost:3001/graphql';
        const parsersUrl = configService.get('PARSERS_SERVICE_URL') || 'http://localhost:3002/graphql';
        
        return {
          server: {},
          gateway: {
            supergraphSdl: new IntrospectAndCompose({
              subgraphs: [
                {
                  name: 'applicants',
                  url: applicantsUrl,
                },
                {
                  name: 'parsers',
                  url: parsersUrl,
                },
              ],
            }),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}