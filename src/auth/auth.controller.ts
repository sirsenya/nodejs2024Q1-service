import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { LogInDto } from './dto/log-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Auth(AuthType.None)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUp(@Body() signUpDto: SignUpDto, @Req() request) {
    return this.authService.signUp(signUpDto, request);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  logIn(@Body() logInDto: LogInDto) {
    return this.authService.logIn(logInDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    if (!refreshTokenDto.refreshToken) {
      throw new UnauthorizedException();
    }
    return this.authService.refreshTokens(refreshTokenDto);
  }
}
