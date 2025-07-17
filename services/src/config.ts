import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export interface ServiceConfig {
  ledger: {
    host: string;
    port: number; // gRPC ledger port for Daml scripts
    httpJsonPort: number; // HTTP JSON API port
    useTls: boolean;
  };
  parties: {
    liquidityProvider: string;
    admin: string;
  };
  service: {
    logLevel: string;
    pollingIntervalMs: number;
  };
  autoAccept: {
    enabled: boolean;
    maxAcceptableSlippage: number;
  };
  balanceThresholds: {
    minBtcBalance: number;
    minUsdtBalance: number;
  };
}

export const config: ServiceConfig = {
  ledger: {
    host: process.env.LEDGER_HOST || 'localhost',
    port: parseInt(process.env.LEDGER_PORT || '6865', 10), // Default to gRPC ledger port
    httpJsonPort: parseInt(process.env.HTTP_JSON_PORT || '7575', 10), // Default to HTTP JSON API port
    useTls: process.env.LEDGER_USE_TLS === 'true',
  },
  parties: {
    liquidityProvider: process.env.LIQUIDITY_PROVIDER_PARTY || 'LiquidityProvider',
    admin: process.env.ADMIN_PARTY || 'Admin',
  },
  service: {
    logLevel: process.env.LOG_LEVEL || 'info',
    pollingIntervalMs: parseInt(process.env.POLLING_INTERVAL_MS || '5000', 10),
  },
  autoAccept: {
    enabled: process.env.AUTO_ACCEPT_SWAPS === 'true',
    maxAcceptableSlippage: parseFloat(process.env.MAX_ACCEPTABLE_SLIPPAGE || '0.1'),
  },
  balanceThresholds: {
    minBtcBalance: parseFloat(process.env.MIN_BTC_BALANCE || '1.0'),
    minUsdtBalance: parseFloat(process.env.MIN_USDT_BALANCE || '100000.0'),
  },
};

export function validateConfig(): void {
  const errors: string[] = [];

  if (!config.parties.liquidityProvider) {
    errors.push('LIQUIDITY_PROVIDER_PARTY is required');
  }

  if (!config.parties.admin) {
    errors.push('ADMIN_PARTY is required');
  }

  if (config.ledger.port <= 0 || config.ledger.port > 65535) {
    errors.push('LEDGER_PORT must be a valid port number');
  }

  if (config.ledger.httpJsonPort <= 0 || config.ledger.httpJsonPort > 65535) {
    errors.push('HTTP_JSON_PORT must be a valid port number');
  }

  if (config.service.pollingIntervalMs <= 0) {
    errors.push('POLLING_INTERVAL_MS must be positive');
  }

  if (config.autoAccept.maxAcceptableSlippage < 0 || config.autoAccept.maxAcceptableSlippage > 1) {
    errors.push('MAX_ACCEPTABLE_SLIPPAGE must be between 0 and 1');
  }

  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n${errors.join('\n')}`);
  }
} 