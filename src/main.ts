import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';
import { config } from 'dotenv';
import { CustomLogger } from './custom-logger/custom-logger.service';
import { myEmitter } from './custom-logger/logging-interceptor';
import { stat, rename } from 'fs/promises';
import { createWriteStream } from 'fs';

config();

const PORT = process.env.PORT || 4000;

myEmitter.on('unhandledRejection', async () => {
  const customLogger = new CustomLogger();
  const errorText = 'Caught unhandledRejection event';
  const fileName = '/src/custom-logger/logs/errors';
  const fileType = '.txt';
  try {
    const fileStat = await stat(fileName + fileType);
    if (fileStat.size > Number(process.env.MAX_LOG_FILE_SIZE)) {
      const date = Date.now();
      await rename(fileName + fileType, fileName + date.toString() + fileType);
    }
  } catch (e) {}
  const logStream = createWriteStream(fileName + fileType, {
    flags: 'a',
  });

  logStream.write(errorText);
  customLogger.error(errorText);
});

myEmitter.on('uncaughtException', async () => {
  const customLogger = new CustomLogger();
  const errorText = 'Caught uncaughtException event';
  const fileName = '/src/custom-logger/logs/errors';
  const fileType = '.txt';
  try {
    const fileStat = await stat(fileName + fileType);
    if (fileStat.size > Number(process.env.MAX_LOG_FILE_SIZE)) {
      const date = Date.now();
      await rename(fileName + fileType, fileName + date.toString() + fileType);
    }
  } catch (e) {}
  const logStream = createWriteStream(fileName + fileType, {
    flags: 'a',
  });

  logStream.write(errorText);
  customLogger.error(errorText);
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(new CustomLogger());

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Home Library Service')
    .setDescription('Home music library service')
    .setVersion('1.0')
    .addTag('library')
    .build();
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup(`api`, app, document);

  await app.listen(PORT);
}
bootstrap();
