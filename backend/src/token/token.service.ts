import { Injectable, Logger } from '@nestjs/common';
import { DamlService } from '../daml/daml.service';

// Define the template IDs based on the DAML model
// Format should be: <package-id>:<module-name>:<entity-name>
const TOKEN_TEMPLATES = {
  // Using more specific template IDs with package ID
  TOKEN_LEDGER: 'daml-exchange-0.0.1:Main:TokenLedger',
  TOKEN_MASTER: 'daml-exchange-0.0.1:Main:TokenMaster',
  TOKEN_TRANSFER_LOCK: 'daml-exchange-0.0.1:Main:TokenTransferLock',
  TOKEN_SETUP: 'daml-exchange-0.0.1:Main:TokenSetup',
};

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);

  constructor(private readonly damlService: DamlService) {}

  async getTokenLedgers(token: string): Promise<any[]> {
    try {
      return await this.damlService.getActiveContracts(token, TOKEN_TEMPLATES.TOKEN_LEDGER);
    } catch (error) {
      this.logger.error('Error fetching token ledgers:', error.message);
      throw new Error('Failed to fetch token ledgers');
    }
  }

  async getTokenMasters(token: string): Promise<any[]> {
    try {
      return await this.damlService.getActiveContracts(token, TOKEN_TEMPLATES.TOKEN_MASTER);
    } catch (error) {
      this.logger.error('Error fetching token masters:', error.message);
      throw new Error('Failed to fetch token masters');
    }
  }

  async getTokenTransferLocks(token: string): Promise<any[]> {
    try {
      return await this.damlService.getActiveContracts(token, TOKEN_TEMPLATES.TOKEN_TRANSFER_LOCK);
    } catch (error) {
      this.logger.error('Error fetching token transfer locks:', error.message);
      throw new Error('Failed to fetch token transfer locks');
    }
  }

  async createTokenSetup(token: string, payload: any): Promise<any> {
    try {
      return await this.damlService.createContract(token, TOKEN_TEMPLATES.TOKEN_SETUP, payload);
    } catch (error) {
      this.logger.error('Error creating token setup:', error.message);
      throw new Error('Failed to create token setup');
    }
  }

  async initializeToken(token: string, setupContractId: string): Promise<any> {
    try {
      return await this.damlService.exerciseChoice(token, setupContractId, 'Initialize', {});
    } catch (error) {
      this.logger.error('Error initializing token:', error.message);
      throw new Error('Failed to initialize token');
    }
  }

  async mintTokens(token: string, masterContractId: string, amount: number): Promise<any> {
    try {
      return await this.damlService.exerciseChoice(token, masterContractId, 'Mint', { amount });
    } catch (error) {
      this.logger.error('Error minting tokens:', error.message);
      throw new Error('Failed to mint tokens');
    }
  }

  async lockTokensForTransfer(
    token: string, 
    ledgerContractId: string, 
    recipient: string, 
    transferAmount: number
  ): Promise<any> {
    try {
      return await this.damlService.exerciseChoice(
        token, 
        ledgerContractId, 
        'LockTokenForTransfer', 
        { recipient, transferAmount }
      );
    } catch (error) {
      this.logger.error('Error locking tokens for transfer:', error.message);
      throw new Error('Failed to lock tokens for transfer');
    }
  }

  async acceptTransfer(token: string, lockContractId: string): Promise<any> {
    try {
      return await this.damlService.exerciseChoice(token, lockContractId, 'Accept', {});
    } catch (error) {
      this.logger.error('Error accepting transfer:', error.message);
      throw new Error('Failed to accept transfer');
    }
  }

  async rejectTransfer(token: string, lockContractId: string): Promise<any> {
    try {
      return await this.damlService.exerciseChoice(token, lockContractId, 'Reject', {});
    } catch (error) {
      this.logger.error('Error rejecting transfer:', error.message);
      throw new Error('Failed to reject transfer');
    }
  }

  async cancelTransfer(token: string, lockContractId: string): Promise<any> {
    try {
      return await this.damlService.exerciseChoice(token, lockContractId, 'Cancel', {});
    } catch (error) {
      this.logger.error('Error canceling transfer:', error.message);
      throw new Error('Failed to cancel transfer');
    }
  }

  async burnTokens(token: string, masterContractId: string, tokenCid: string, amountToBurn?: number): Promise<any> {
    try {
      const payload = {
        tokenCid,
        amountToBurn: amountToBurn !== undefined ? { tag: 'Some', value: amountToBurn } : { tag: 'None' },
      };
      
      return await this.damlService.exerciseChoice(token, masterContractId, 'Burn', payload);
    } catch (error) {
      this.logger.error('Error burning tokens:', error.message);
      throw new Error('Failed to burn tokens');
    }
  }
}
