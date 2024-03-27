import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { config } from 'dotenv';
import { Request, Response } from 'express';
import { createWriteStream } from 'node:fs';
import { rename, stat } from 'node:fs/promises';
import { CustomLogger } from 'src/custom-logger/custom-logger.service';

config();
const maxSize = Number(process.env.MAX_LOG_FILE_SIZE);
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private customLogger: CustomLogger) {}
  async catch(exception: HttpException, host: ArgumentsHost) {
    console.log(exception.name);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.message;
    const log = JSON.stringify({
      statusCode: status,
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
    const content = `ERROR: ${log}\n`;
    const fileName = '/src/custom-logger/logs/errors';
    const fileType = '.txt';
    try {
      const fileStat = await stat(fileName + fileType);
      if (fileStat.size > maxSize) {
        const date = Date.now();
        await rename(
          fileName + fileType,
          fileName + date.toString() + fileType,
        );
      }
    } catch (e) {}
    const logStream = createWriteStream(fileName + fileType, {
      flags: 'a',
    });

    logStream.write(content);
    this.customLogger.error(log);
    response.status(status).json({
      statusCode: status,
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
