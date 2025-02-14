import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerGlobal } from './middlewares/logger.middleware';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    exceptionFactory: (errors) => {
      const cleanErrors = errors.map((error) => {
        return { property: error.property, constraints: error.constraints }
      })
      return new BadRequestException({
        alert:
          'Errores detectados: ',
        errors: cleanErrors
      })
    }
  }))
  app.use(loggerGlobal)
  app.enableCors()
  const swaggerConfig = new DocumentBuilder()
    .setTitle('VetsForPets-API DOCS')
    .setDescription('Api creada y documentada para ser usada en el PF')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
