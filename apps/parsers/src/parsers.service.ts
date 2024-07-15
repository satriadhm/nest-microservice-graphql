import { Injectable } from '@nestjs/common';
import * as csv from 'csv-parser';
import * as fs from 'fs';
import * as nodemailer from 'nodemailer';

@Injectable()
export class ParsersService {
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

  async sendNotification(
    email: string,
    subject: string,
    text: string,
  ): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password',
      },
    });

    await transporter.sendMail({
      from: 'your-email@gmail.com',
      to: email,
      subject: subject,
      text: text,
    });
  }
}
