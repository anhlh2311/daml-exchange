import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Ledger } from '@daml/ledger';
import * as damlTypes from '@daml/types';

@Injectable()
export class DamlService implements OnModuleInit {
  private readonly logger = new Logger(DamlService.name);
  private ledgerClient: Ledger | null = null;
  private readonly httpBaseUrl: string;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('daml.ledger.host');
    const httpPort = this.configService.get<number>('daml.ledger.httpPort');
    this.httpBaseUrl = `http://${host}:${httpPort}`;
    this.logger.log(`DAML HTTP JSON API URL: ${this.httpBaseUrl}`);
  }

  async onModuleInit() {
    try {
      await this.checkLedgerConnection();
      this.logger.log('Successfully connected to DAML ledger');
    } catch (error) {
      this.logger.error('Failed to connect to DAML ledger', error);
    }
  }

  async checkLedgerConnection(): Promise<boolean> {
    try {
      // Use a hardcoded DAML token for the ledger connection check
      const damlToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2RhbWwuY29tL2xlZGdlci1hcGkiOnsibGVkZ2VySWQiOiJzYW5kYm94IiwiYXBwbGljYXRpb25JZCI6ImRhbWwtZXhjaGFuZ2UtYmFja2VuZCIsImFjdEFzIjpbIkFsaWNlIl19fQ.Cj0dGxR0gZpwW5yR7jHNvqOzjEKjC5Mwvtk_6iNO-GQ';
      
      const response = await axios.get(
        `${this.httpBaseUrl}/v1/query`,
        { headers: { Authorization: `Bearer ${damlToken}` } }
      );
      return response.status === 200;
    } catch (error) {
      this.logger.error('Error connecting to DAML ledger:', error.message);
      return false;
    }
  }

  async getLedgerId(): Promise<string> {
    try {
      // Use a hardcoded DAML token for getting the ledger ID
      const damlToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2RhbWwuY29tL2xlZGdlci1hcGkiOnsibGVkZ2VySWQiOiJzYW5kYm94IiwiYXBwbGljYXRpb25JZCI6ImRhbWwtZXhjaGFuZ2UtYmFja2VuZCIsImFjdEFzIjpbIkFsaWNlIl19fQ.Cj0dGxR0gZpwW5yR7jHNvqOzjEKjC5Mwvtk_6iNO-GQ';
      
      const response = await axios.get(
        `${this.httpBaseUrl}/v1/query`,
        { headers: { Authorization: `Bearer ${damlToken}` } }
      );
      return response.data.ledgerId || 'Unknown';
    } catch (error) {
      this.logger.error('Error getting ledger ID:', error.message);
      throw new Error('Failed to get ledger ID');
    }
  }
  
  async verifyConnection(token: string): Promise<any> {
    try {
      // Simple method to verify connection to DAML ledger
      // Just get the parties visible to the token
      const response = await axios.get(
        `${this.httpBaseUrl}/v1/parties`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return {
        success: true,
        ledgerId: response.data.ledgerId || 'Unknown',
        parties: response.data.result || [],
        status: 'Connected to DAML ledger successfully'
      };
    } catch (error) {
      this.logger.error('Error verifying DAML connection:', error.message);
      return {
        success: false,
        error: error.message,
        status: 'Failed to connect to DAML ledger'
      };
    }
  }

  async createLedgerClient(token: string): Promise<Ledger> {
    if (!this.ledgerClient) {
      const host = this.configService.get<string>('daml.ledger.host');
      const port = this.configService.get<number>('daml.ledger.httpPort');
      
      this.ledgerClient = new Ledger({ 
        token, 
        httpBaseUrl: `http://${host}:${port}` 
      });
    }
    return this.ledgerClient;
  }

  async getActiveContracts(token: string, templateId: string): Promise<any[]> {
    try {
      // Use the JSON API directly since we don't have the template companion objects
      const response = await axios.post(
        `${this.httpBaseUrl}/v1/query`,
        { templateIds: [templateId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data?.result || [];
    } catch (error) {
      this.logger.error(`Error fetching active contracts for template ${templateId}:`, error.message);
      throw new Error(`Failed to fetch active contracts for template ${templateId}`);
    }
  }

  async createContract(token: string, templateId: string, payload: any): Promise<any> {
    try {
      // Use the JSON API directly since we don't have the template companion objects
      const response = await axios.post(
        `${this.httpBaseUrl}/v1/create`,
        {
          templateId,
          payload
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Error creating contract for template ${templateId}:`, error.message);
      throw new Error(`Failed to create contract for template ${templateId}`);
    }
  }

  async exerciseChoice(token: string, contractId: string, choice: string, argument: any): Promise<any> {
    try {
      // Use the JSON API directly since we don't have the template companion objects
      const response = await axios.post(
        `${this.httpBaseUrl}/v1/exercise`,
        {
          contractId,
          choice,
          argument
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Error exercising choice ${choice} on contract ${contractId}:`, error.message);
      throw new Error(`Failed to exercise choice ${choice} on contract ${contractId}`);
    }
  }

  async archiveContract(token: string, templateId: string, contractId: string): Promise<any> {
    try {
      // Use the JSON API directly since we don't have the template companion objects
      const response = await axios.post(
        `${this.httpBaseUrl}/v1/exercise`,
        {
          templateId,
          contractId,
          choice: 'Archive',
          argument: {}
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Error archiving contract ${contractId}:`, error.message);
      throw new Error(`Failed to archive contract ${contractId}`);
    }
  }
}
