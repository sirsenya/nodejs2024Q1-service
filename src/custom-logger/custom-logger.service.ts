import { Injectable, LoggerService, Scope } from '@nestjs/common';
import { config } from 'dotenv';
config();
const loggingLevel = Number(process.env.LOGGING_LEVEL);
@Injectable({ scope: Scope.TRANSIENT })
export class CustomLogger implements LoggerService {
  log(message: any) {
    if (loggingLevel > 0) console.log(`LOG: ${message}`);
  }

  fatal() {
    return;
  }

  error(message: any) {
    console.error(`ERROR: ${message}`);
  }

  warn() {
    return;
  }

  debug?() {
    return;
  }

  verbose?(message: any) {
    if (loggingLevel > 1) console.log(`VERBOSE: ${message}`);
  }
}
