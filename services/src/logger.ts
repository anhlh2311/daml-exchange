import winston from 'winston';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

// Create logs directory first, before any logger initialization
const logsDir = join(process.cwd(), 'logs');
if (!existsSync(logsDir)) {
  mkdirSync(logsDir, { recursive: true });
}

// Import config after ensuring logs directory exists
import { config } from './config';

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let logMessage = `${timestamp} [${level.toUpperCase()}]: ${message}`;
    
    if (Object.keys(meta).length > 0) {
      logMessage += ` ${JSON.stringify(meta)}`;
    }
    
    if (stack) {
      logMessage += `\n${stack}`;
    }
    
    return logMessage;
  })
);

export const logger = winston.createLogger({
  level: config.service.logLevel,
  format: logFormat,
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
    }),
    new winston.transports.File({
      filename: join(logsDir, 'error.log'),
      level: 'error',
      handleExceptions: true,
    }),
    new winston.transports.File({
      filename: join(logsDir, 'combined.log'),
      handleExceptions: true,
    }),
  ],
  exitOnError: false,
});

// Log successful initialization
logger.info('Logger initialized successfully', { 
  logLevel: config.service.logLevel,
  logsDirectory: logsDir 
});

// Helper function to ensure logs are flushed before process exit
export const flushLogs = (): Promise<void> => {
  return new Promise((resolve) => {
    // Set a timeout to avoid hanging
    const timeout = setTimeout(() => {
      console.log('Log flush timeout, resolving anyway');
      resolve();
    }, 1000);
    
    logger.on('finish', () => {
      clearTimeout(timeout);
      resolve();
    });
    
    // Force flush all transports
    logger.transports.forEach(transport => {
      if (transport.end) {
        transport.end();
      }
    });
    
    logger.end();
  });
};

// Ensure logs are flushed on process exit
process.on('exit', () => {
  // Force synchronous flush on exit
  logger.transports.forEach(transport => {
    if (transport.close) {
      transport.close();
    }
  });
});

process.on('SIGINT', async () => {
  logger.info('Received SIGINT, flushing logs...');
  await flushLogs();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM, flushing logs...');
  await flushLogs();
  process.exit(0);
}); 