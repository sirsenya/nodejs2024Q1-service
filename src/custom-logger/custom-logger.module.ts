import { Global, Module } from '@nestjs/common';
import { CustomLogger } from './custom-logger.service';
import { LoggingInterceptor } from './logging-interceptor';

@Global()
@Module({
  providers: [CustomLogger, LoggingInterceptor],
  exports: [CustomLogger],
})
export class CustomLoggerModule {}
