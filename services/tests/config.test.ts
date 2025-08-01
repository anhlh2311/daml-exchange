import { config } from '../src/config';

describe('Configuration', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe('Configuration Structure', () => {
    it('should have all required configuration sections', () => {
      expect(config).toHaveProperty('parties');
      expect(config).toHaveProperty('ledger');
      expect(config).toHaveProperty('autoAccept');
      expect(config).toHaveProperty('service');
      expect(config).toHaveProperty('balanceThresholds');
    });
  });

  describe('Basic Configuration Tests', () => {
    it('should have proper types for all config values', () => {
      expect(typeof config.parties.liquidityProvider).toBe('string');
      expect(typeof config.ledger.host).toBe('string');
      expect(typeof config.ledger.port).toBe('number');
      expect(typeof config.ledger.httpJsonPort).toBe('number');
      expect(typeof config.ledger.useTls).toBe('boolean');
      expect(typeof config.autoAccept.enabled).toBe('boolean');
      expect(typeof config.service.pollingIntervalMs).toBe('number');
      expect(typeof config.service.logLevel).toBe('string');
    });

    it('should have sensible default values', () => {
      expect(config.parties.liquidityProvider).toBe('TestLiquidityProvider'); // From test setup
      expect(config.ledger.host).toBe('localhost');
      expect(config.ledger.port).toBe(6865); // gRPC port
      expect(config.ledger.httpJsonPort).toBe(7575); // HTTP JSON API port
      expect(config.ledger.useTls).toBe(false);
      expect(config.service.pollingIntervalMs).toBeGreaterThan(0);
      expect(['error', 'warn', 'info', 'debug'].includes(config.service.logLevel)).toBe(true);
    });

    it('should have balance thresholds configured', () => {
      expect(config.balanceThresholds.minBtcBalance).toBeGreaterThan(0);
      expect(config.balanceThresholds.minUsdtBalance).toBeGreaterThan(0);
      expect(config.autoAccept.maxAcceptableSlippage).toBeGreaterThan(0);
      expect(config.autoAccept.maxAcceptableSlippage).toBeLessThanOrEqual(1);
    });
  });
}); 