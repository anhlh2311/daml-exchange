import { Ledger } from '@daml/ledger';
import { Party, Text, ContractId } from '@daml/types';
import { SwapRequest } from '@daml.js/exchange-0.0.1/lib/Exchange/TokenSwap';
import { TokenLedger, TokenTransferLock } from '@daml.js/exchange-0.0.1/lib/Currency/TokenLedger';
import { config } from './config';
import { logger } from './logger';

export interface LedgerConnection {
  client: Ledger;
  party: Party;
}

export class LedgerService {
  private connection: LedgerConnection | null = null;

  async connect(): Promise<LedgerConnection> {
    try {
      const ledgerUrl = config.ledger.useTls 
        ? `https://${config.ledger.host}:${config.ledger.httpJsonPort}/`
        : `http://${config.ledger.host}:${config.ledger.httpJsonPort}/`;

      logger.info('Connecting to Daml HTTP JSON API', { 
        url: ledgerUrl, 
        party: config.parties.liquidityProvider 
      });

      const party = config.parties.liquidityProvider as Party;
      
      // For development with --allow-insecure-tokens
      // Create a simple JWT token with the party information
      const developmentToken = this.createDevelopmentToken(party);

      const client = new Ledger({
        token: developmentToken,
        httpBaseUrl: ledgerUrl,
        wsBaseUrl: ledgerUrl.replace(/^http/, 'ws'),
      });

      this.connection = { client, party };

      logger.info('Successfully connected to Daml ledger', { party });
      
      return this.connection;
    } catch (error) {
      logger.error('Failed to connect to Daml ledger', { error: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  }

  getConnection(): LedgerConnection {
    if (!this.connection) {
      throw new Error('Not connected to ledger. Call connect() first.');
    }
    return this.connection;
  }

  async querySwapRequests(): Promise<any[]> {
    const { client, party } = this.getConnection();
    
    try {
      logger.debug('Querying SwapRequest contracts', { party });
      
      // const swapRequests = await client.query(SwapRequest);
      const swapRequests = await client.query(SwapRequest, { outputTokenLockCid: null });
      
      logger.info('Found SwapRequest contracts', { 
        count: swapRequests.length,
        party 
      });
      
      return swapRequests;
    } catch (error) {
      logger.error('Failed to query SwapRequest contracts', { error, party });
      throw error;
    }
  }

  async queryTokenLedgers(): Promise<any[]> {
    const { client, party } = this.getConnection();
    
    try {
      logger.debug('Querying TokenLedger contracts for liquidity provider', { party });
      
      const tokenLedgers = await client.query(TokenLedger);
      
      logger.info('Found TokenLedger contracts', { 
        count: tokenLedgers.length,
        party 
      });
      
      return tokenLedgers;
    } catch (error) {
      logger.error('Failed to query TokenLedger contracts', { error, party });
      throw error;
    }
  }

  async fetchInputTokenLock(contractId: ContractId<TokenTransferLock>): Promise<any> {
    const { client, party } = this.getConnection();
    console.log("Fetch input token lock is called")
    
    try {
      logger.debug('Fetching TokenTransferLock contract', { contractId, party });
      
      const tokenLock = await client.fetch(TokenTransferLock, contractId);
      
      if (!tokenLock) {
        throw new Error(`TokenTransferLock contract not found: ${contractId}`);
      }

      logger.debug('Successfully fetched TokenTransferLock', { 
        contractId,
        symbol: tokenLock.payload.symbol,
        amount: tokenLock.payload.amount,
        party 
      });
      
      return tokenLock.payload;
    } catch (error) {
      logger.error('Failed to fetch TokenTransferLock contract', { error, contractId, party });
      throw error;
    }
  }

  async acceptSwapRequest(
    contractId: ContractId<SwapRequest>, 
    outputTokenLedgerKey: [Party, Party, Text]
  ): Promise<[any, any]> {
    const { client, party } = this.getConnection();
    
    try {
      logger.info('Accepting swap request', { 
        contractId, 
        outputTokenLedgerKey, 
        party 
      });
      
      // Convert JavaScript array to Daml Tuple2
      const tuple3Key = { _1: outputTokenLedgerKey[0], _2: outputTokenLedgerKey[1], _3: outputTokenLedgerKey[2] };
      
      const result = await client.exercise(
        SwapRequest.AcceptSwap,
        contractId,
        { outputTokenLedgerKey: tuple3Key }
      );
      
      logger.info('Successfully accepted swap request', { 
        contractId,
        lpTokenLedger: result[0],
        acceptedSwapRequest: result[1],
        party 
      });
      
      return result as [any, any];
    } catch (error) {
      logger.error('Failed to accept swap request', { 
        error, 
        contractId, 
        party 
      });
      throw error;
    }
  }

  async rejectSwapRequest(
    contractId: ContractId<SwapRequest>
  ): Promise<any> {
    const { client, party } = this.getConnection();
    
    try {
      logger.info('Rejecting swap request', { contractId, party });
      
      const result = await client.exercise(
        SwapRequest.RejectSwapRequest,
        contractId,
        {}
      );
      
      logger.info('Successfully rejected swap request', { 
        contractId,
        result,
        party 
      });
      
      return result[0]; // Extract the return value from the tuple
    } catch (error) {
      logger.error('Failed to reject swap request', { 
        error, 
        contractId, 
        party 
      });
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      try {
        // Note: DamlLedgerClient doesn't have an explicit disconnect method
        // but we can clean up our reference
        this.connection = null;
        logger.info('Disconnected from Daml ledger');
      } catch (error) {
        logger.error('Error during disconnect', { error });
      }
    }
  }

  private createDevelopmentToken(party: Party): string {
    // For development with --allow-insecure-tokens
    // Create a simple token that includes the party information
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };
    
    const payload = {
      iss: 'development',
      sub: party,
      aud: 'daml-ledger-api',
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // 24 hours
      iat: Math.floor(Date.now() / 1000),
      act: party,
      scope: 'daml_ledger_api'
    };

    // For development only - create a simple base64 encoded token
    // This works with --allow-insecure-tokens
    const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = 'development-signature'; // Dummy signature for insecure tokens
    
    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }
} 