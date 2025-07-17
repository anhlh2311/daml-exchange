import { ContractId, Party, Text } from '@daml/types';
import { SwapRequest } from '@daml.js/exchange-0.0.1/lib/Exchange/TokenSwap';
import { TokenLedger } from '@daml.js/exchange-0.0.1/lib/Currency/TokenLedger';
import { LedgerService } from './ledger';
import { config } from './config';
import { logger } from './logger';



export interface TokenBalance {
  symbol: string;
  amount: number;
  owner: Party;
  party: Party;
}

export class LiquidityProviderService {
  private ledgerService: LedgerService;
  private isRunning: boolean = false;
  private pollingInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.ledgerService = new LedgerService();
  }

  async start(): Promise<void> {
    try {
      logger.info('Starting Liquidity Provider Service', {
        party: config.parties.liquidityProvider,
        autoAccept: config.autoAccept.enabled,
        pollingInterval: config.service.pollingIntervalMs
      });

      // Connect to the ledger
      await this.ledgerService.connect();

      // Start monitoring
      this.isRunning = true;
      await this.startMonitoring();

      logger.info('Liquidity Provider Service started successfully');
    } catch (error) {
      logger.error('Failed to start Liquidity Provider Service', { error });
      throw error;
    }
  }

  async stop(): Promise<void> {
    logger.info('Stopping Liquidity Provider Service');
    
    this.isRunning = false;
    
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }

    await this.ledgerService.disconnect();
    
    logger.info('Liquidity Provider Service stopped');
  }

  private async startMonitoring(): Promise<void> {
    // Initial scan
    await this.monitorSwapRequests();

    // Set up polling
    this.pollingInterval = setInterval(async () => {
      if (this.isRunning) {
        await this.monitorSwapRequests();
      }
    }, config.service.pollingIntervalMs);
  }

  private async monitorSwapRequests(): Promise<void> {
    try {
      logger.debug('Monitoring for new swap requests');

      const swapRequests = await this.ledgerService.querySwapRequests();

      if (swapRequests.length === 0) {
        logger.debug('No swap requests found');
        return;
      }

      logger.info(`Found ${swapRequests.length} swap request(s) to process`);

      for (const swapRequest of swapRequests) {
        await this.processSwapRequest(swapRequest);
      }
    } catch (error) {
      logger.error('Error monitoring swap requests', { error });
    }
  }

  private async processSwapRequest(swapRequest: any): Promise<void> {
    const { contractId, payload } = swapRequest;

    try {
      logger.info('Processing swap request', {
        contractId,
        swapper: payload.swapper,
        inputAmount: payload.inputAmount,
        expectedOutputAmount: payload.expectedOutputAmount,
        slippageTolerance: payload.slippageTolerance
      });

      // Check if this LP is the intended recipient
      // Extract party display name from full party ID (format: "DisplayName::PartyId")
      const intendedLPDisplayName = this.extractPartyDisplayName(payload.liquidityProvider);
      const thisLPDisplayName = config.parties.liquidityProvider;

      if (intendedLPDisplayName !== thisLPDisplayName) {
        logger.debug('Swap request not intended for this liquidity provider', {
          contractId,
          intendedLP: payload.liquidityProvider,
          intendedLPDisplayName,
          thisLP: thisLPDisplayName
        });
        return;
      }

      logger.info('Swap request matched this liquidity provider', {
        contractId,
        intendedLP: payload.liquidityProvider,
        thisLP: thisLPDisplayName
      });

      if (config.autoAccept.enabled) {
        // Auto-accept mode: try to accept the swap and let the contract validate
        await this.tryAcceptSwap(contractId, payload);
      } else {
        logger.info('Auto-accept is disabled. Manual intervention required', {
          contractId,
          swapper: payload.swapper,
          inputAmount: payload.inputAmount,
          expectedOutputAmount: payload.expectedOutputAmount
        });
      }
    } catch (error) {
      logger.error('Error processing swap request', { error, contractId });
    }
  }

  private async tryAcceptSwap(contractId: ContractId<SwapRequest>, payload: any): Promise<void> {
    try {
      // Extract information from the swap request
      const { tokenPairKey, inputTokenLockCid, expectedOutputAmount } = payload;

      // Fetch the input token lock contract to get the actual token being locked
      const inputTokenLock = await this.ledgerService.fetchInputTokenLock(inputTokenLockCid);
      const inputTokenSymbol = inputTokenLock.symbol;
      const inputTokenOwner = inputTokenLock.owner;

      logger.debug('Fetched input token lock details', {
        contractId,
        inputTokenLockCid,
        inputTokenSymbol,
        inputTokenOwner,
        lockedAmount: inputTokenLock.amount
      });

      // Determine which token the LP needs to provide based on the actual input token
      let lpOutputTokenOwner: Party;
      let lpOutputTokenSymbol: string;

      // Compare input token with tokenPairKey tokens to determine output token
      if (inputTokenSymbol === tokenPairKey._2._2) {
        // Input token is the pair's base token, so LP provides the pair's quote token
        lpOutputTokenOwner = tokenPairKey._3._1;
        lpOutputTokenSymbol = tokenPairKey._3._2;
      } else if (inputTokenSymbol === tokenPairKey._3._2) {
        // Input token is the pair's quote token, so LP provides the pair's base token
        lpOutputTokenOwner = tokenPairKey._2._1;
        lpOutputTokenSymbol = tokenPairKey._2._2;
      } else {
        throw new Error(`Input token ${inputTokenSymbol} does not match any token in the pair`);
      }

      // Construct the output token ledger key for the LP
      // Use the full party ID from the payload, not the display name from config
      const outputTokenLedgerKey: [Party, Party, Text] = [lpOutputTokenOwner, payload.liquidityProvider, lpOutputTokenSymbol];

      logger.info('Attempting to accept swap request', {
        contractId,
        inputToken: `${inputTokenSymbol} (${inputTokenOwner})`,
        inputAmount: inputTokenLock.amount,
        lpWillProvide: `${lpOutputTokenSymbol} (${lpOutputTokenOwner})`,
        expectedOutputAmount,
        outputTokenLedgerKey
      });

      // Let the contract handle all validation - just exercise the choice
      await this.ledgerService.acceptSwapRequest(contractId, outputTokenLedgerKey);
      
    } catch (error) {
      // Contract validation failed - log the specific error from the contract
      logger.warn('Swap request contract validation failed', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        contractId 
      });
    }
  }

  private async getTokenBalances(): Promise<TokenBalance[]> {
    try {
      const tokenLedgers = await this.ledgerService.queryTokenLedgers();
      
      return tokenLedgers.map(ledger => ({
        symbol: ledger.payload.symbol,
        amount: Number(ledger.payload.amount),
        owner: ledger.payload.owner,
        party: ledger.payload.owner // Use owner as party since party property doesn't exist
      }));
    } catch (error) {
      logger.error('Error fetching token balances', { error });
      return [];
    }
  }

  // Manual control methods for when auto-accept is disabled
  async manualAcceptSwap(
    contractId: ContractId<SwapRequest>, 
    outputTokenLedgerKey: [Party, Party, Text]
  ): Promise<void> {
    try {
      logger.info('Manually accepting swap request', { contractId, outputTokenLedgerKey });
      
      const result = await this.ledgerService.acceptSwapRequest(contractId, outputTokenLedgerKey);
      
      logger.info('Manual swap request accepted successfully', {
        contractId,
        lpTokenLedger: result[0],
        acceptedSwapRequest: result[1]
      });
    } catch (error) {
      logger.error('Failed to manually accept swap request', { error, contractId });
      throw error;
    }
  }

  async manualRejectSwap(contractId: ContractId<SwapRequest>): Promise<void> {
    try {
      logger.info('Manually rejecting swap request', { contractId });
      
      const result = await this.ledgerService.rejectSwapRequest(contractId);
      
      logger.info('Manual swap request rejected successfully', {
        contractId,
        rejectedTokenLock: result
      });
    } catch (error) {
      logger.error('Failed to manually reject swap request', { error, contractId });
      throw error;
    }
  }

  async getStatus(): Promise<{
    isRunning: boolean;
    party: string;
    autoAccept: boolean;
    tokenBalances: TokenBalance[];
    pendingSwaps: number;
  }> {
    const tokenBalances = await this.getTokenBalances();
    const swapRequests = await this.ledgerService.querySwapRequests();
    
    return {
      isRunning: this.isRunning,
      party: config.parties.liquidityProvider,
      autoAccept: config.autoAccept.enabled,
      tokenBalances,
      pendingSwaps: swapRequests.length
    };
  }

  private extractPartyDisplayName(fullPartyId: string): string {
    // Extract display name from full party ID (format: "DisplayName::PartyId")
    const parts = fullPartyId.split('::');
    return parts.length > 1 ? parts[0] : fullPartyId;
  }
} 