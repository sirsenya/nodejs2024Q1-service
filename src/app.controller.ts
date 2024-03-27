import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { myEmitter } from './custom-logger/logging-interceptor';
import { Auth } from './auth/decorators/auth.decorator';
import { AuthType } from './auth/enums/auth-type.enum';

@Auth(AuthType.None)
@Controller()
export class AppController {
  @Get()
  async unhandledRejection() {
    myEmitter.emit('unhandledRejection');
  }

  @Get('/doc')
  async uncaughtException() {
    myEmitter.emit('uncaughtException');
  }
}
