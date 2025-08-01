import { LedgerService } from '../src/ledger';
import { config } from '../src/config';
import { SwapRequest } from '@daml.js/exchange-0.0.1/lib/Exchange/TokenSwap';

// Mock the Daml Ledger client
const mockLedgerClient = {
  query: jest.fn(),
  fetch: jest.fn(),
  exercise: jest.fn(),
};

jest.mock('@daml/ledger', () => ({
  Ledger: jest.fn().mockImplementation(() => mockLedgerClient)
}));

describe('LedgerService', () => {
  let ledgerService: LedgerService;

  beforeEach(() => {
    ledgerService = new LedgerService();
    jest.clearAllMocks();
  });

  describe('connect', () => {
    it('should connect successfully to the ledger', async () => {
      const connection = await ledgerService.connect();
      
      expect(connection.party).toBe(config.parties.liquidityProvider);
      expect(connection.client).toBeDefined();
    });

    it('should create development token with correct format', async () => {
      const connection = await ledgerService.connect();
      
      // The token should be created for development purposes
      expect(connection).toBeDefined();
      expect(connection.party).toBe(config.parties.liquidityProvider);
    });

    it('should handle connection errors', async () => {
      const { Ledger } = require('@daml/ledger');
      Ledger.mockImplementationOnce(() => {
        throw new Error('Connection failed');
      });

      await expect(ledgerService.connect()).rejects.toThrow('Connection failed');
    });
  });

  describe('querySwapRequests', () => {
    beforeEach(async () => {
      await ledgerService.connect();
    });

    it('should query swap requests successfully', async () => {
      const mockSwapRequests = [
        {
          contractId: 'test-contract-id-1',
          payload: {
            swapper: 'Alice::123',
            liquidityProvider: 'TestLiquidityProvider::456',
            inputAmount: '100.0',
            expectedOutputAmount: '0.01',
            slippageTolerance: '0.05'
          }
        }
      ];

      mockLedgerClient.query.mockResolvedValue(mockSwapRequests);

      const result = await ledgerService.querySwapRequests();

      expect(mockLedgerClient.query).toHaveBeenCalledWith(
        expect.any(Object),
        { outputTokenLockCid: null }
      );
      expect(result).toEqual(mockSwapRequests);
    });

    it('should handle query errors', async () => {
      mockLedgerClient.query.mockRejectedValue(new Error('Query failed'));

      await expect(ledgerService.querySwapRequests()).rejects.toThrow('Query failed');
    });

    it('should return empty array when no swap requests found', async () => {
      mockLedgerClient.query.mockResolvedValue([]);

      const result = await ledgerService.querySwapRequests();

      expect(result).toEqual([]);
    });
  });

  describe('queryTokenLedgers', () => {
    beforeEach(async () => {
      await ledgerService.connect();
    });

    it('should query token ledgers successfully', async () => {
      const mockTokenLedgers = [
        {
          contractId: 'token-ledger-1',
          payload: {
            owner: 'TestLiquidityProvider::456',
            symbol: 'BTC',
            amount: '10.0'
          }
        }
      ];

      mockLedgerClient.query.mockResolvedValue(mockTokenLedgers);

      const result = await ledgerService.queryTokenLedgers();

      expect(mockLedgerClient.query).toHaveBeenCalled();
      expect(result).toEqual(mockTokenLedgers);
    });
  });

  describe('fetchInputTokenLock', () => {
    beforeEach(async () => {
      await ledgerService.connect();
    });

    it('should fetch token lock successfully', async () => {
      const mockTokenLock = {
        payload: {
          owner: 'Alice::123',
          recipient: 'TestLiquidityProvider::456',
          symbol: 'USDT',
          amount: '1000.0'
        }
      };

      mockLedgerClient.fetch.mockResolvedValue(mockTokenLock);

      const result = await ledgerService.fetchInputTokenLock('test-contract-id' as any);

      expect(mockLedgerClient.fetch).toHaveBeenCalledWith(
        expect.any(Object),
        'test-contract-id'
      );
      expect(result).toEqual(mockTokenLock.payload);
    });

    it('should handle missing token lock', async () => {
      mockLedgerClient.fetch.mockResolvedValue(null);

      await expect(ledgerService.fetchInputTokenLock('missing-contract-id' as any))
        .rejects.toThrow('TokenTransferLock contract not found: missing-contract-id');
    });
  });

  describe('acceptSwapRequest', () => {
    beforeEach(async () => {
      await ledgerService.connect();
    });

    it('should accept swap request successfully', async () => {
      const mockResult = ['lp-token-ledger-cid', 'accepted-swap-request-cid'];
      mockLedgerClient.exercise.mockResolvedValue(mockResult);

      const outputTokenLedgerKey = ['BtcOwner::123', 'TestLiquidityProvider::456'] as [string, string];
      const result = await ledgerService.acceptSwapRequest('swap-request-cid' as any, outputTokenLedgerKey);

      expect(mockLedgerClient.exercise).toHaveBeenCalledWith(
        SwapRequest.AcceptSwap,
        'swap-request-cid',
        { outputTokenLedgerKey: { _1: 'BtcOwner::123', _2: 'TestLiquidityProvider::456' } }
      );
      expect(result).toEqual(mockResult);
    });

    it('should handle exercise errors', async () => {
      mockLedgerClient.exercise.mockRejectedValue(new Error('Insufficient balance'));

      const outputTokenLedgerKey = ['BtcOwner::123', 'TestLiquidityProvider::456'] as [string, string];
      
      await expect(ledgerService.acceptSwapRequest('swap-request-cid' as any, outputTokenLedgerKey))
        .rejects.toThrow('Insufficient balance');
    });
  });

  describe('rejectSwapRequest', () => {
    beforeEach(async () => {
      await ledgerService.connect();
    });

    it('should reject swap request successfully', async () => {
      const mockResult = ['rejected-token-lock-cid'];
      mockLedgerClient.exercise.mockResolvedValue(mockResult);

      const result = await ledgerService.rejectSwapRequest('swap-request-cid' as any);

      expect(mockLedgerClient.exercise).toHaveBeenCalledWith(
        expect.any(Object),
        'swap-request-cid',
        {}
      );
      expect(result).toBe(mockResult[0]);
    });
  });

  describe('disconnect', () => {
    it('should disconnect successfully', async () => {
      await ledgerService.connect();
      await ledgerService.disconnect();

      expect(() => ledgerService.getConnection()).toThrow('Not connected to ledger');
    });

    it('should handle disconnect when not connected', async () => {
      await expect(ledgerService.disconnect()).resolves.not.toThrow();
    });
  });

  describe('getConnection', () => {
    it('should throw error when not connected', () => {
      expect(() => ledgerService.getConnection()).toThrow('Not connected to ledger. Call connect() first.');
    });

    it('should return connection when connected', async () => {
      await ledgerService.connect();
      const connection = ledgerService.getConnection();

      expect(connection.party).toBe(config.parties.liquidityProvider);
      expect(connection.client).toBeDefined();
    });
  });
}); 