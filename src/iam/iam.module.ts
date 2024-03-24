// import { Module } from '@nestjs/common';
// import { HashingService } from './hashing/hashing.service';
// import { BcryptService } from './hashing/bcrypt.service';
// import { PrismaModule } from 'src/database/prisma.module';
// import { JwtModule } from '@nestjs/jwt';
// import jwtConfig from './config/jwt.config';
// import { ConfigModule } from '@nestjs/config';
// import { APP_GUARD } from '@nestjs/core';
// import { AccessTokenGuard } from './auth/guards/access-token.guard';
// import { AuthService } from 'src/auth/auth.service';
// import { UserModule } from 'src/user/user.module';
// import { UserService } from 'src/user/user.service';

// @Module({
//   imports: [
//     PrismaModule,
//     UserModule,
//     JwtModule.registerAsync(jwtConfig.asProvider()),
//     ConfigModule.forFeature(jwtConfig),
//   ],
//   providers: [
//     {
//       provide: HashingService,
//       useClass: BcryptService,
//     },
//   ],
// })
// export class IamModule {}
