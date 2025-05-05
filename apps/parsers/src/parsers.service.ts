import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as csv from 'csv-parser';
import * as fs from 'fs';
import * as nodemailer from 'nodemailer';
import { Parser } from './entities/parser.entity';
import { ParserResult } from './entities/parser-result.entity';

@Injectable()
export class ParsersService {
  constructor(
    @InjectRepository(Parser)
    private readonly parserRepository: Repository<Parser>,
    @InjectRepository(ParserResult)
    private readonly parserResultRepository: Repository<ParserResult>,
  ) {}

  async createParser(fileName: string, filePath: string): Promise<Parser> {
    const parser = this.parserRepository.create({
      fileName,
      filePath,
      uploadedAt: new Date(),
    });
    return this.parserRepository.save(parser);
  }

  async updateParserStatus(
    id: string,
    processed: boolean,
    valid: boolean,
    error?: string,
  ): Promise<Parser> {
    await this.parserRepository.update(id, {
      processed,
      valid,
      processedAt: new Date(),
      processingError: error,
    });
    return this.parserRepository.findOneBy({ id });
  }

  async parseCsv(filePath: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const results = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (error) => reject(error));
    });
  }

  validateData(parsedData: any[]): boolean {
    return parsedData.every((item) => item.name && item.email);
  }

  enrichData(parsedData: any[]): any[] {
    return parsedData.map((item) => ({ ...item, enriched: true }));
  }

  async saveParserResults(
    parserId: string,
    data: any[],
    enriched: boolean = false,
  ): Promise<ParserResult[]> {
    const results = data.map((item) =>
      this.parserResultRepository.create({
        parserId,
        data: item,
        enriched,
        createdAt: new Date(),
      }),
    );
    return this.parserResultRepository.save(results);
  }

  async sendNotification(
    email: string,
    subject: string,
    text: string,
  ): Promise<void> {
    // Using environment variables would be better in a real application
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-email-password',
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: email,
      subject: subject,
      text: text,
    });
  }

  async findAllParsers(): Promise<Parser[]> {
    return this.parserRepository.find({
      order: { uploadedAt: 'DESC' },
    });
  }

  async findParserById(id: string): Promise<Parser> {
    return this.parserRepository.findOneBy({ id });
  }

  async findParserResults(parserId: string): Promise<ParserResult[]> {
    return this.parserResultRepository.find({
      where: { parserId },
      order: { createdAt: 'DESC' },
    });
  }
}

