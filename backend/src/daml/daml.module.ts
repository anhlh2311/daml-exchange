import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DamlService } from './daml.service';
import { DamlController } from './daml.controller';

@Module({
  imports: [ConfigModule],
  providers: [DamlService],
  controllers: [DamlController],
  exports: [DamlService],
})
export class DamlModule {}
