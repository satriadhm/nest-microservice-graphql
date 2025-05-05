// apps/parsers/src/controllers/file.upload.controller.ts
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParsersService } from '../parsers.service';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
import { Response } from 'express';

@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly parsersService: ParsersService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = join(__dirname, '../../uploads');
          // Create directory if it doesn't exist
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          // Generate unique filename with original extension
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const ext = extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    try {
      // Create a parser record in the database
      const parser = await this.parsersService.createParser(
        file.originalname,
        file.path,
      );

      // Parse the CSV file
      const parsedData = await this.parsersService.parseCsv(file.path);

      // Validate the data
      const isValid = this.parsersService.validateData(parsedData);

      if (isValid) {
        // Enrich the data
        const enrichedData = this.parsersService.enrichData(parsedData);

        // Save the original data
        await this.parsersService.saveParserResults(parser.id, parsedData);

        // Save the enriched data
        await this.parsersService.saveParserResults(
          parser.id,
          enrichedData,
          true,
        );

        // Update the parser status
        await this.parsersService.updateParserStatus(
          parser.id,
          true, // processed
          true, // valid
        );

        // Send a notification
        await this.parsersService.sendNotification(
          'admin@example.com',
          'File Processed Successfully',
          `The file ${file.originalname} has been successfully processed.`,
        );

        return {
          message: 'File uploaded and processed successfully',
          parserId: parser.id,
          fileName: file.originalname,
          isValid: true,
        };
      } else {
        // Update the parser status with validation error
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
          `The file ${file.originalname} failed validation.`,
        );

        return {
          message: 'File uploaded but validation failed',
          parserId: parser.id,
          fileName: file.originalname,
          isValid: false,
          error: 'Validation failed - data missing required fields',
        };
      }
    } catch (error) {
      // Create a parser record with error
      const parser = await this.parsersService.createParser(
        file.originalname,
        file.path,
      );

      // Update the parser status with error
      await this.parsersService.updateParserStatus(
        parser.id,
        false, // not processed
        false, // not valid
        `Processing error: ${error.message}`,
      );

      // Send a notification about the error
      await this.parsersService.sendNotification(
        'admin@example.com',
        'File Processing Error',
        `An error occurred while processing file ${file.originalname}: ${error.message}`,
      );

      throw new HttpException(
        `Error processing file: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('download/:id')
  async downloadProcessedFile(@Param('id') id: string, @Res() res: Response) {
    try {
      const parser = await this.parsersService.findParserById(id);

      if (!parser) {
        throw new HttpException('Parser not found', HttpStatus.NOT_FOUND);
      }

      if (!parser.processed || !parser.valid) {
        throw new HttpException(
          'File not processed or invalid',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Get the parser results
      const results = await this.parsersService.findParserResults(parser.id);

      // Get the enriched results
      const enrichedResults = results.filter((result) => result.enriched);

      if (enrichedResults.length === 0) {
        throw new HttpException(
          'No enriched data available',
          HttpStatus.NOT_FOUND,
        );
      }

      // Extract the data from the results
      const data = enrichedResults.map((result) => result.data);

      // Set the response headers
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="processed-${parser.fileName}"`,
      );
      res.setHeader('Content-Type', 'application/json');

      // Send the data as JSON
      return res.send(JSON.stringify(data, null, 2));
    } catch (error) {
      throw new HttpException(
        error.message || 'Error downloading file',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getParserDetails(@Param('id') id: string) {
    try {
      const parser = await this.parsersService.findParserById(id);

      if (!parser) {
        throw new HttpException('Parser not found', HttpStatus.NOT_FOUND);
      }

      // Get the parser results
      const results = await this.parsersService.findParserResults(parser.id);

      return {
        parser,
        resultsCount: results.length,
        enrichedCount: results.filter((result) => result.enriched).length,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error getting parser details',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
