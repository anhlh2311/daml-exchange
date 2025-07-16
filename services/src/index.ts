import { LiquidityProviderService } from './liquidityProvider';
import { config, validateConfig } from './config';
import { logger, flushLogs } from './logger';

class Application {
  private liquidityProvider: LiquidityProviderService;

  constructor() {
    this.liquidityProvider = new LiquidityProviderService();
  }

  async start(): Promise<void> {
    try {
      // Validate configuration
      validateConfig();
      logger.info('Configuration validated successfully');

      // Start the liquidity provider service
      await this.liquidityProvider.start();

      // Set up graceful shutdown handlers
      this.setupGracefulShutdown();

      logger.info('Application started successfully', {
        party: config.parties.liquidityProvider,
        ledgerHost: config.ledger.host,
        ledgerPort: config.ledger.port,
        autoAccept: config.autoAccept.enabled
      });

    } catch (error) {
      logger.error('Failed to start application', { error });
      // Give winston time to flush logs before exiting
      await new Promise(resolve => setTimeout(resolve, 100));
      await flushLogs();
      process.exit(1);
    }
  }

  async stop(): Promise<void> {
    try {
      logger.info('Stopping application...');
      await this.liquidityProvider.stop();
      logger.info('Application stopped successfully');
    } catch (error) {
      logger.error('Error during application shutdown', { error });
    }
  }

  private setupGracefulShutdown(): void {
    const shutdownHandler = async (signal: string) => {
      logger.info(`Received ${signal}, initiating graceful shutdown...`);
      await this.stop();
      process.exit(0);
    };

    // Handle different shutdown signals
    process.on('SIGTERM', () => shutdownHandler('SIGTERM'));
    process.on('SIGINT', () => shutdownHandler('SIGINT'));
    process.on('SIGUSR2', () => shutdownHandler('SIGUSR2')); // Nodemon restart signal

    // Handle uncaught exceptions
    process.on('uncaughtException', async (error) => {
      logger.error('Uncaught exception', { error });
      await this.stop();
      await flushLogs();
      process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', async (reason, promise) => {
      logger.error('Unhandled promise rejection', { reason, promise });
      await this.stop();
      await flushLogs();
      process.exit(1);
    });
  }
}

// Create and start the application
const app = new Application();
app.start().catch(async (error) => {
  logger.error('Fatal error during application startup', { error });
  await flushLogs();
  process.exit(1);
});

// Export for potential testing or external use
export { Application };
export { LiquidityProviderService } from './liquidityProvider';
export { LedgerService } from './ledger';
export { config } from './config'; 