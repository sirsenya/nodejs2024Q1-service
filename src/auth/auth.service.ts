import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/database/prisma.service';
import { LogInDto } from './dto/log-in.dto';
import { User } from '@prisma/client';
import { ConfigType } from '@nestjs/config';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Pick } from '@prisma/client/runtime/library';
import { CustomLogger } from 'src/custom-logger/custom-logger.service';
import { Request } from 'express';
import jwtConfig from './config/jwt.config';
import { HashingService } from './hashing/hashing.service';
import { ActiveUserData } from './interfaces/active-user-data.interface';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService,
    private jwtService: JwtService,
    private hashingService: HashingService,
    private readonly logger: CustomLogger,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async signUp(signUpDto: SignUpDto, request: Request) {
    this.logger.log(request.url);
    this.logger.log(request.query);
    this.logger.log(request.body);
    this.logger.log(request.res.statusCode);
    try {
      const password = await this.hashingService.hash(signUpDto.password);
      const user = await this.userService.create({
        login: signUpDto.login,
        password,
      });
      return user.hidePassword();
    } catch (e) {
      throw new BadRequestException('User with such login already exists');
    }
  }

  async logIn(logInDto: LogInDto) {
    const { login, password } = logInDto;

    const user: User = await this.prismaService.user.findFirst({
      where: {
        login,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User with this login not found');
    }

    const isEqual: boolean = await this.hashingService.compare(
      password,
      user.password,
    );

    if (!isEqual) {
      throw new UnauthorizedException('Wrong password');
    }
    return await this.generateTokens(user);
  }

  async generateTokens(user: {
    id: string;
    login: string;
    version: number;
    createdAt: bigint;
    updatedAt: bigint;
    password: string;
  }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserData>>(
        user.id,
        this.jwtConfiguration.accessTokernTtl,
        { login: user.login },
      ),
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl, {
        login: user.login,
      }),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { userId } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, 'userId'>
      >(refreshTokenDto.refreshToken, {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
      });
      const user = await this.prismaService.user.findUniqueOrThrow({
        where: {
          id: userId,
        },
      });
      const generateTokens = await this.generateTokens(user);

      return generateTokens;
    } catch (e) {
      throw new ForbiddenException();
    }
  }

  private async signToken<T>(userId: string, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn: expiresIn,
      },
    );
  }
}
