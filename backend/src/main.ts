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
      '- `/api/tokens/test-template/{templateId}`: Test fetching contracts of any template ID\n' +
      '- `/api/templates`: Get all DAML templates using GraphQL API\n' +
      '- `/api/contracts`: Get all active DAML contracts using GraphQL API\n\n' +
      '### Templates API\n' +
      'The `/api/templates` endpoint provides access to all DAML templates available on the ledger. ' +
      'This implementation uses GraphQL to query the DAML ledger and returns template metadata including:\n' +
      '- Template IDs and package information\n' +
      '- Module and entity names\n' +
      '- Contract counts\n' +
      '- Available choices\n\n' +
      'The response includes both template data and metadata about the query. ' +
      'For examples of how to use this API, see the `requests.js` utility script in the project root.\n\n' +
      '### Contracts API\n' +
      'The `/api/contracts` endpoint provides access to all active DAML contracts on the ledger. ' +
      'This implementation uses GraphQL to query the DAML ledger and returns contract data including:\n' +
      '- Contract IDs and template information\n' +
      '- Contract arguments (payload)\n' +
      '- Creation timestamps\n' +
      '- Available choices\n\n' +
      'The response includes both contract data and metadata about the query, such as counts by template type. ' +
      'This endpoint uses the same authentication mechanism as the Templates API.\n\n' +
      '### Note\n' +
      'Some endpoints have been temporarily hidden from Swagger as they are being updated to work with the correct DAML token authentication.'
    )
    .setVersion('1.0')
    .addTag('templates', 'Operations related to DAML templates')
    .addTag('contracts', 'Operations related to DAML contracts')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  // Start the server
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`Swagger documentation available at: http://localhost:${port}/api/docs`);
}

bootstrap();
