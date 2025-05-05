// apps/parsers/src/parsers.resolver.ts
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import { FileUpload } from 'graphql-upload/Upload.mjs';
import { ParsersService } from './parsers.service';
import { createWriteStream } from 'fs';
import { join } from 'path';
import * as fs from 'fs';
import { Parser } from './entities/parser.entity';
import { ParserResult } from './entities/parser-result.entity';

@Resolver(() => Parser)
export class ParsersResolver {
  constructor(private readonly parsersService: ParsersService) {}

  @Query(() => [Parser])
  async parsers(): Promise<Parser[]> {
    return this.parsersService.findAllParsers();
  }

  @Query(() => Parser, { nullable: true })
  async parser(@Args('id', { type: () => ID }) id: string): Promise<Parser> {
    return this.parsersService.findParserById(id);
  }

  @Query(() => [ParserResult])
  async parserResults(
    @Args('parserId', { type: () => ID }) parserId: string,
  ): Promise<ParserResult[]> {
    return this.parsersService.findParserResults(parserId);
  }

  @Mutation(() => Parser)
  async uploadAndParseFile(
    @Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload,
  ): Promise<Parser> {
    const { createReadStream, filename } = file;

    // Create directory if it doesn't exist
    const uploadDir = join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uniqueFilename = `${Date.now()}-${filename}`;
    const filePath = join(uploadDir, uniqueFilename);

    // Create a parser record in the database
    const parser = await this.parsersService.createParser(filename, filePath);

    return new Promise(async (resolve, reject) => {
      createReadStream()
        .pipe(createWriteStream(filePath))
        .on('finish', async () => {
          try {
            // Parse the CSV file
            const parsedData = await this.parsersService.parseCsv(filePath);

            // Validate the data
            const isValid = this.parsersService.validateData(parsedData);

            if (isValid) {
              // Enrich the data
              const enrichedData = this.parsersService.enrichData(parsedData);

              // Save the original data
              await this.parsersService.saveParserResults(
                parser.id,
                parsedData,
              );

              // Save the enriched data
              await this.parsersService.saveParserResults(
                parser.id,
                enrichedData,
                true,
              );

              // Update the parser status
              const updatedParser =
                await this.parsersService.updateParserStatus(
                  parser.id,
                  true, // processed
                  true, // valid
                );

              // Send a notification
              await this.parsersService.sendNotification(
                'admin@example.com',
                'File Processed Successfully',
                `The file ${filename} has been successfully processed.`,
              );

              resolve(updatedParser);
            } else {
              // Update the parser status with validation error
              const updatedParser =
                await this.parsersService.updateParserStatus(
                  parser.id,
                  true, // processed
                  false, // not valid
                  'Validation failed - data missing required fields',
                );

              // Send a notification about validation failure
              await this.parsersService.sendNotification(
                'admin@example.com',
                'File Validation Failed',
                `The file ${filename} failed validation.`,
              );

              resolve(updatedParser);
            }
          } catch (error) {
            // Update the parser status with error
            const updatedParser = await this.parsersService.updateParserStatus(
              parser.id,
              true, // processed
              false, // not valid
              `Processing error: ${error.message}`,
            );

            // Send a notification about the error
            await this.parsersService.sendNotification(
              'admin@example.com',
              'File Processing Error',
              `An error occurred while processing file ${filename}: ${error.message}`,
            );

            resolve(updatedParser);
          }
        })
        .on('error', async (error) => {
          // Update the parser status with error
          const updatedParser = await this.parsersService.updateParserStatus(
            parser.id,
            false, // not processed
            false, // not valid
            `Upload error: ${error.message}`,
          );

          // Send a notification about the error
          await this.parsersService.sendNotification(
            'admin@example.com',
            'File Upload Error',
            `An error occurred while uploading file ${filename}: ${error.message}`,
          );

          resolve(updatedParser);
        });
    });
  }
}
