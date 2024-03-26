import {
  ConsoleLogger,
  Injectable,
  LoggerService,
  NestMiddleware,
  Scope,
} from '@nestjs/common';
import { config } from 'dotenv';
import { NextFunction } from 'express';
import { Request } from 'express';
config();
const loggingLevel = Number(process.env.LOGGING_LEVEL);
@Injectable({ scope: Scope.TRANSIENT })
export class CustomLogger implements LoggerService {
  log(message: any, ...optionalParams: any[]) {
    if (loggingLevel > 0) console.log(`LOG: ${message}`);
  }

  fatal(message: any, ...optionalParams: any[]) {
    return;
  }

  error(message: any, ...optionalParams: any[]) {
    console.error(`ERROR: ${message}`);
  }

  warn(message: any, ...optionalParams: any[]) {
    return;
  }

  debug?(message: any, ...optionalParams: any[]) {
    return;
  }

  verbose?(message: any, ...optionalParams: any[]) {
    if (loggingLevel > 1) console.log(`VERBOSE: ${message}`);
  }
}
