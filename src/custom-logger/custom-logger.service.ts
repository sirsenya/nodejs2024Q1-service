import {
  ConsoleLogger,
  Injectable,
  NestMiddleware,
  Scope,
} from '@nestjs/common';
import { NextFunction } from 'express';
import { Request } from 'express';

@Injectable({ scope: Scope.TRANSIENT })
export class CustomLogger extends ConsoleLogger {
  customLog() {
    'LOOOL';
  }
  error;
}
