import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors();
  
  // Get configuration
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3002;
  
  // Setup Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('DAML Token Exchange API')
    .setDescription(
      'API for interacting with DAML Token Exchange contracts\n\n' +
      '### Testing DAML Connection\n' +
      'Use the `/api/daml/verify-connection` endpoint to verify your connection to the DAML ledger.\n\n' +
      '### Authentication\n' +
      'All endpoints use a hardcoded DAML token with ledger ID "sandbox" for testing purposes.\n\n' +
      '### Working Endpoints\n' +
      '- `/api/daml/verify-connection`: Test DAML ledger connection with hardcoded token\n' +
      '- `/api/daml/health`: Check if DAML ledger is accessible\n' +
      '- `/api/daml/ledger-id`: Get the DAML ledger ID\n' +
      '- `/api/tokens/test-template/{templateId}`: Test fetching contracts of any template ID\n\n' +
      '### Note\n' +
      'Other endpoints have been temporarily hidden from Swagger as they are being updated to work with the correct DAML token authentication.'
    )
    .setVersion('1.0')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  // Start the server
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`Swagger documentation available at: http://localhost:${port}/api/docs`);
}

bootstrap();
