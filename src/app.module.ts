import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ArtistModule } from './artist/artist.module';
import { AlbumModule } from './album/album.module';
import { TrackModule } from './track/track.module';
import { FavsModule } from './favs/favs.module';
import { AuthModule } from './auth/auth.module';
//import { IamModule } from './iam/iam.module';
import { ConfigModule } from '@nestjs/config';
import { CustomLoggerModule } from './custom-logger/custom-logger.module';
import { CustomLogger } from './custom-logger/custom-logger.service';
import { request } from 'http';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './custom-logger/logging-interceptor';
import { ArtistController } from './artist/artist.controller';
import { ArtistService } from './artist/artist.service';
import { PrismaModule } from './database/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    ArtistModule,
    AlbumModule,
    TrackModule,
    FavsModule,
    AuthModule,
    CustomLoggerModule,
    PrismaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
