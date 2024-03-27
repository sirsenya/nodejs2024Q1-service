import { ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { tap } from 'rxjs';
import { CustomLogger } from './custom-logger.service';
import { Request } from 'express';
import { createWriteStream } from 'node:fs';
import { stat, rename } from 'node:fs/promises';
import { config } from 'dotenv';

import { EventEmitter } from 'node:events';
export const myEmitter = new EventEmitter();

config();
const maxSize = Number(process.env.MAX_LOG_FILE_SIZE);
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private customLogger: CustomLogger) {}

  async intercept(context: ExecutionContext, next) {
    const now = Date.now();
    const req: Request = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.url;
    const queryParams = JSON.stringify(req.params);
    const body = JSON.stringify(req.body);
    const res = context.switchToHttp().getResponse();
    const delay = Date.now() - now;
    let log = '';
    if (Number(process.env.LOGGING_LEVEL) === 1) {
      log = `url: ${url} query params: ${queryParams} body: ${body}`;
    }
    if (Number(process.env.LOGGING_LEVEL) === 2) {
      log = `ip: ${req.ip} date: ${new Date()} method: ${method}  protocol: ${
        req.protocol
      } status code: ${res.statusCode}  delay: ${delay}ms`;
    }
    const content = `${log}\n`;
    const fileName = '/src/custom-logger/logs/logs';
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

    if (Number(process.env.LOGGING_LEVEL) > 0) {
      const logStream = createWriteStream(fileName + fileType, {
        flags: 'a',
      });
      logStream.write(content);
    }

    myEmitter.on('unhandledRejection', () => {
      const errorText = 'Caught unhandledRejection event';
      const logStream = createWriteStream(fileName + fileType, {
        flags: 'a',
      });
      logStream.write(errorText);
      this.customLogger.error(errorText);
    });

    myEmitter.on('uncaughtException', () => {
      const errorText = 'Caught uncaughtException event';
      const logStream = createWriteStream(fileName + fileType, {
        flags: 'a',
      });
      logStream.write(errorText);
      this.customLogger.error(errorText);
    });

    return next.handle().pipe(
      tap(() => {
        if (Number(process.env.LOGGING_LEVEL) > 0) this.customLogger.log(log);
        if (Number(process.env.LOGGING_LEVEL) > 1) {
          this.customLogger.verbose(log);
        }
      }),
    );
  }
}
