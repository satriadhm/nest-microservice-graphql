import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import { FileUpload } from 'graphql-upload/Upload.mjs';
import { ParsersService } from './parsers.service';
import { createWriteStream } from 'fs';
import { join } from 'path';
import * as tmp from 'tmp';
import * as fs from 'fs';

@Resolver()
export class ParsersResolver {
  constructor(private readonly parsersService: ParsersService) {}

  @Mutation(() => Boolean)
  async uploadAndParseFile(
    @Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload,
  ): Promise<boolean> {
    const { createReadStream, filename } = file;
    const filePath = join(__dirname, '..', 'uploads', filename);

    return new Promise(async (resolve, reject) => {
      createReadStream()
        .pipe(createWriteStream(filePath))
        .on('finish', async () => {
          try {
            const parsedData = await this.parsersService.parseCsv(filePath);
            const isValid = this.parsersService.validateData(parsedData);
            if (isValid) {
              const enrichedData = this.parsersService.enrichData(parsedData);

              const tmpFile = tmp.fileSync();
              fs.writeFileSync(tmpFile.name, JSON.stringify(enrichedData));

              await this.parsersService.sendNotification(
                'admin@example.com',
                'File Processed',
                'The file has been successfully processed.',
              );
              resolve(true);
            } else {
              await this.parsersService.sendNotification(
                'admin@example.com',
                'File Validation Failed',
                'The file validation has failed.',
              );
              resolve(false);
            }
          } catch (error) {
            await this.parsersService.sendNotification(
              'admin@example.com',
              'File Processing Error',
              `An error occurred: ${error.message}`,
            );
            reject(false);
          }
        })
        .on('error', async (error) => {
          await this.parsersService.sendNotification(
            'admin@example.com',
            'File Upload Error',
            `An error occurred: ${error.message}`,
          );
          reject(false);
        });
    });
  }

  @Query(() => String)
  test(): string {
    return 'Parsers service is working!';
  }
}
