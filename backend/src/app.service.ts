import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getAppInfo() {
    return {
      name: 'DAML Token Exchange API',
      version: '1.0.0',
      description: 'NestJS backend for DAML Token Exchange',
      damlLedger: {
        host: this.configService.get<string>('daml.ledger.host'),
        port: this.configService.get<number>('daml.ledger.port'),
        httpPort: this.configService.get<number>('daml.ledger.httpPort'),
      },
    };
  }

  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: this.configService.get<string>('NODE_ENV') || 'development',
    };
  }
}
