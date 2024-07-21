import { NestFactory } from '@nestjs/core';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';
import { AppModule } from './app.module';
// import { httpsOptions } from './config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // httpsOptions: httpsOptions
  });
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
  });
  const options = new DocumentBuilder()
    .setTitle('ALD training v0.0.1')
    .setDescription('API descriptions')
    .setVersion('0.0.1')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'accessToken'
    )
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'refreshToken'
    )
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 4001);
}
bootstrap();
