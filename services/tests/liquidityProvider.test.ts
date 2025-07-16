import { LiquidityProviderService } from '../src/liquidityProvider';
import { config } from '../src/config';
import { LedgerService } from '../src/ledger';

// Mock the LedgerService
const mockLedgerService = {
  connect: jest.fn(),
  disconnect: jest.fn(),
  querySwapRequests: jest.fn(),
  queryTokenLedgers: jest.fn(),
  fetchInputTokenLock: jest.fn(),
  acceptSwapRequest: jest.fn(),
  rejectSwapRequest: jest.fn(),
};

jest.mock('../src/ledger', () => ({
  LedgerService: jest.fn().mockImplementation(() => mockLedgerService)
}));

describe('LiquidityProviderService', () => {
  let liquidityProviderService: LiquidityProviderService;

  beforeEach(() => {
    liquidityProviderService = new LiquidityProviderService();
    jest.clearAllMocks();
    jest.clearAllTimers();
    
    // Mock config values for tests
    Object.defineProperty(config.parties, 'liquidityProvider', {
      value: 'TestLiquidityProvider',
      writable: true
    });
    Object.defineProperty(config.autoAccept, 'enabled', {
      value: true,
      writable: true
    });
  });

  describe('start', () => {
    it('should start successfully', async () => {
      mockLedgerService.connect.mockResolvedValue({});
      mockLedgerService.querySwapRequests.mockResolvedValue([]);

      await liquidityProviderService.start();

      expect(mockLedgerService.connect).toHaveBeenCalled();
      expect(liquidityProviderService['isRunning']).toBe(true);
    });

    it('should handle start errors', async () => {
      mockLedgerService.connect.mockRejectedValue(new Error('Connection failed'));

      await expect(liquidityProviderService.start()).rejects.toThrow('Connection failed');
    });

    it('should start monitoring after connection', async () => {
      mockLedgerService.connect.mockResolvedValue({});
      mockLedgerService.querySwapRequests.mockResolvedValue([]);

      await liquidityProviderService.start();

      // Fast-forward timers to trigger polling
      jest.advanceTimersByTime(config.service.pollingIntervalMs);

      expect(mockLedgerService.querySwapRequests).toHaveBeenCalledTimes(2); // Initial + one poll
    });
  });

  describe('stop', () => {
    it('should stop successfully', async () => {
      mockLedgerService.connect.mockResolvedValue({});
      mockLedgerService.querySwapRequests.mockResolvedValue([]);

      await liquidityProviderService.start();
      await liquidityProviderService.stop();

      expect(liquidityProviderService['isRunning']).toBe(false);
      expect(mockLedgerService.disconnect).toHaveBeenCalled();
    });

    it('should stop when not running', async () => {
      await expect(liquidityProviderService.stop()).resolves.not.toThrow();
    });
  });

  describe('monitorSwapRequests', () => {
    beforeEach(async () => {
      mockLedgerService.connect.mockResolvedValue({});
    });

    it('should handle empty swap requests', async () => {
      mockLedgerService.querySwapRequests.mockResolvedValue([]);

      await liquidityProviderService['monitorSwapRequests']();

      expect(mockLedgerService.querySwapRequests).toHaveBeenCalled();
    });

    it('should process multiple swap requests', async () => {
      const mockSwapRequests = [
        {
          contractId: 'swap-1',
          payload: {
            swapper: 'Alice::123',
            liquidityProvider: 'TestLiquidityProvider::456',
            inputAmount: '100.0',
            expectedOutputAmount: '0.01',
            slippageTolerance: '0.05',
            tokenPairKey: ['Admin::789', ['BtcOwner::111', 'BTC'], ['UsdtOwner::222', 'USDT']],
            inputTokenLockCid: 'lock-1'
          }
        },
        {
          contractId: 'swap-2',
          payload: {
            swapper: 'Bob::124',
            liquidityProvider: 'TestLiquidityProvider::456',
            inputAmount: '200.0',
            expectedOutputAmount: '0.02',
            slippageTolerance: '0.03',
            tokenPairKey: ['Admin::789', ['BtcOwner::111', 'BTC'], ['UsdtOwner::222', 'USDT']],
            inputTokenLockCid: 'lock-2'
          }
        }
      ];

      mockLedgerService.querySwapRequests.mockResolvedValue(mockSwapRequests);
      mockLedgerService.fetchInputTokenLock.mockResolvedValue({
        symbol: 'USDT',
        owner: 'UsdtOwner::222',
        amount: '100.0'
      });
      mockLedgerService.acceptSwapRequest.mockResolvedValue(['lp-ledger', 'accepted-swap']);

      await liquidityProviderService['monitorSwapRequests']();

      expect(mockLedgerService.querySwapRequests).toHaveBeenCalled();
      expect(mockLedgerService.fetchInputTokenLock).toHaveBeenCalledTimes(2);
    });

    it('should handle query errors', async () => {
      mockLedgerService.querySwapRequests.mockRejectedValue(new Error('Query failed'));

      await expect(liquidityProviderService['monitorSwapRequests']()).resolves.not.toThrow();
    });
  });

  describe('processSwapRequest', () => {
    const mockSwapRequest = {
      contractId: 'swap-1',
      payload: {
        swapper: 'Alice::123',
        liquidityProvider: 'TestLiquidityProvider::456',
        inputAmount: '100.0',
        expectedOutputAmount: '0.01',
        slippageTolerance: '0.05',
        tokenPairKey: {
          _1: 'Admin::789',
          _2: { _1: 'BtcOwner::111', _2: 'BTC' },
          _3: { _1: 'UsdtOwner::222', _2: 'USDT' }
        },
        inputTokenLockCid: 'lock-1'
      }
    };

    it('should process swap request for correct LP', async () => {
      mockLedgerService.fetchInputTokenLock.mockResolvedValue({
        symbol: 'USDT',
        owner: 'UsdtOwner::222',
        amount: '100.0'
      });
      mockLedgerService.acceptSwapRequest.mockResolvedValue(['lp-ledger', 'accepted-swap']);

      await liquidityProviderService['processSwapRequest'](mockSwapRequest);

      expect(mockLedgerService.fetchInputTokenLock).toHaveBeenCalledWith('lock-1');
      expect(mockLedgerService.acceptSwapRequest).toHaveBeenCalled();
    });

    it('should skip swap request for different LP', async () => {
      const swapRequestForDifferentLP = {
        ...mockSwapRequest,
        payload: {
          ...mockSwapRequest.payload,
          liquidityProvider: 'DifferentLP::789'
        }
      };

      await liquidityProviderService['processSwapRequest'](swapRequestForDifferentLP);

      expect(mockLedgerService.fetchInputTokenLock).not.toHaveBeenCalled();
      expect(mockLedgerService.acceptSwapRequest).not.toHaveBeenCalled();
    });

    it('should handle auto-accept disabled', async () => {
      // Temporarily disable auto-accept
      const originalAutoAccept = config.autoAccept.enabled;
      (config.autoAccept.enabled as any) = false;

      try {
        await liquidityProviderService['processSwapRequest'](mockSwapRequest);

        expect(mockLedgerService.fetchInputTokenLock).not.toHaveBeenCalled();
        expect(mockLedgerService.acceptSwapRequest).not.toHaveBeenCalled();
      } finally {
        (config.autoAccept.enabled as any) = originalAutoAccept;
      }
    });

    it('should handle processing errors', async () => {
      mockLedgerService.fetchInputTokenLock.mockRejectedValue(new Error('Fetch failed'));

      await expect(liquidityProviderService['processSwapRequest'](mockSwapRequest))
        .resolves.not.toThrow();
    });
  });

  describe('tryAcceptSwap', () => {
    const mockSwapRequest = {
      tokenPairKey: {
        _1: 'Admin::789',
        _2: { _1: 'BtcOwner::111', _2: 'BTC' },
        _3: { _1: 'UsdtOwner::222', _2: 'USDT' }
      },
      inputTokenLockCid: 'lock-1',
      expectedOutputAmount: '0.01',
      liquidityProvider: 'TestLiquidityProvider::456'
    };

    it('should accept swap with USDT input (base token)', async () => {
      mockLedgerService.fetchInputTokenLock.mockResolvedValue({
        symbol: 'USDT',
        owner: 'UsdtOwner::222',
        amount: '100.0'
      });
      mockLedgerService.acceptSwapRequest.mockResolvedValue(['lp-ledger', 'accepted-swap']);

      await liquidityProviderService['tryAcceptSwap']('contract-id' as any, mockSwapRequest);

      expect(mockLedgerService.acceptSwapRequest).toHaveBeenCalledWith(
        'contract-id',
        ['BtcOwner::111', 'TestLiquidityProvider::456']
      );
    });

    it('should accept swap with BTC input (quote token)', async () => {
      mockLedgerService.fetchInputTokenLock.mockResolvedValue({
        symbol: 'BTC',
        owner: 'BtcOwner::111',
        amount: '0.01'
      });
      mockLedgerService.acceptSwapRequest.mockResolvedValue(['lp-ledger', 'accepted-swap']);

      await liquidityProviderService['tryAcceptSwap']('contract-id' as any, mockSwapRequest);

      expect(mockLedgerService.acceptSwapRequest).toHaveBeenCalledWith(
        'contract-id',
        ['UsdtOwner::222', 'TestLiquidityProvider::456']
      );
    });

    it('should handle invalid input token', async () => {
      mockLedgerService.fetchInputTokenLock.mockResolvedValue({
        symbol: 'ETH', // Not in the token pair
        owner: 'EthOwner::333',
        amount: '1.0'
      });

      await expect(liquidityProviderService['tryAcceptSwap']('contract-id' as any, mockSwapRequest))
        .resolves.not.toThrow();
    });

    it('should handle contract validation errors', async () => {
      mockLedgerService.fetchInputTokenLock.mockResolvedValue({
        symbol: 'USDT',
        owner: 'UsdtOwner::222',
        amount: '100.0'
      });
      mockLedgerService.acceptSwapRequest.mockRejectedValue(new Error('Insufficient balance'));

      await expect(liquidityProviderService['tryAcceptSwap']('contract-id' as any, mockSwapRequest))
        .resolves.not.toThrow();
    });
  });

  describe('extractPartyDisplayName', () => {
    it('should extract display name from full party ID', () => {
      const fullPartyId = 'LiquidityProvider::1220ee3baf69e5b46e6c401756667db4c21d4ef24de8981a81b2d4f311b4e9ed5d47';
      const result = liquidityProviderService['extractPartyDisplayName'](fullPartyId);
      expect(result).toBe('LiquidityProvider');
    });

    it('should return original string if no delimiter found', () => {
      const simplePartyId = 'LiquidityProvider';
      const result = liquidityProviderService['extractPartyDisplayName'](simplePartyId);
      expect(result).toBe('LiquidityProvider');
    });

    it('should handle empty string', () => {
      const result = liquidityProviderService['extractPartyDisplayName']('');
      expect(result).toBe('');
    });
  });

  describe('manualAcceptSwap', () => {
    it('should manually accept swap successfully', async () => {
      mockLedgerService.acceptSwapRequest.mockResolvedValue(['lp-ledger', 'accepted-swap']);

      const outputTokenLedgerKey = ['BtcOwner::111', 'TestLiquidityProvider::456'] as [string, string];
      await liquidityProviderService.manualAcceptSwap('contract-id' as any, outputTokenLedgerKey);

      expect(mockLedgerService.acceptSwapRequest).toHaveBeenCalledWith('contract-id', outputTokenLedgerKey);
    });

    it('should handle manual accept errors', async () => {
      mockLedgerService.acceptSwapRequest.mockRejectedValue(new Error('Manual accept failed'));

      const outputTokenLedgerKey = ['BtcOwner::111', 'TestLiquidityProvider::456'] as [string, string];
      
      await expect(liquidityProviderService.manualAcceptSwap('contract-id' as any, outputTokenLedgerKey))
        .rejects.toThrow('Manual accept failed');
    });
  });

  describe('manualRejectSwap', () => {
    it('should manually reject swap successfully', async () => {
      mockLedgerService.rejectSwapRequest.mockResolvedValue('rejected-token-lock');

      await liquidityProviderService.manualRejectSwap('contract-id' as any);

      expect(mockLedgerService.rejectSwapRequest).toHaveBeenCalledWith('contract-id');
    });

    it('should handle manual reject errors', async () => {
      mockLedgerService.rejectSwapRequest.mockRejectedValue(new Error('Manual reject failed'));

      await expect(liquidityProviderService.manualRejectSwap('contract-id' as any))
        .rejects.toThrow('Manual reject failed');
    });
  });

  describe('getStatus', () => {
    it('should return service status', async () => {
      mockLedgerService.connect.mockResolvedValue({});
      mockLedgerService.queryTokenLedgers.mockResolvedValue([
        {
          payload: {
            symbol: 'BTC',
            amount: '10.0',
            owner: 'TestLiquidityProvider::456'
          }
        }
      ]);
      mockLedgerService.querySwapRequests.mockResolvedValue([{ contractId: 'swap-1' }]);

      await liquidityProviderService.start();
      const status = await liquidityProviderService.getStatus();

      expect(status).toEqual({
        isRunning: true,
        party: config.parties.liquidityProvider,
        autoAccept: config.autoAccept.enabled,
        tokenBalances: [{
          symbol: 'BTC',
          amount: 10.0,
          owner: 'TestLiquidityProvider::456',
          party: 'TestLiquidityProvider::456'
        }],
        pendingSwaps: 1
      });
    });

    it('should handle status errors gracefully', async () => {
      mockLedgerService.queryTokenLedgers.mockRejectedValue(new Error('Query failed'));
      mockLedgerService.querySwapRequests.mockResolvedValue([]);

      const status = await liquidityProviderService.getStatus();

      expect(status.tokenBalances).toEqual([]);
    });
  });
}); 