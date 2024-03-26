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

config();

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  process.on('unhandledRejection', (reason: string, p: Promise<any>) => {
    console.error('Unhandled Rejection at:', p, 'reason:', reason);
  });
  process.on('uncaughtException', (error: Error) => {
    console.error(
      `Caught exception: ${error}\n` + `Exception origin: ${error.stack}`,
    );
  });
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
