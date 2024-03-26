import { ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { tap } from 'rxjs';
import { CustomLogger } from './custom-logger.service';
import { Request } from 'express';
import { createWriteStream } from 'node:fs';

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
    const log = `ip: ${
      req.ip
    } date: ${new Date()} method: ${method} url: ${url} protocol: ${
      req.protocol
    } status code: ${
      res.statusCode
    } query params: ${queryParams} body: ${body} delay: ${delay}ms`;
    const content = `${log}\n`;
    const file = '/src/custom-logger/logs.txt';
    const logStream = createWriteStream(file, {
      flags: 'a',
    });
    logStream.write(content);

    return next.handle().pipe(
      tap(() => {
        this.customLogger.log(log);
      }),
    );
  }
}
