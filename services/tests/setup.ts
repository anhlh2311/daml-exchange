// Global test setup

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.LIQUIDITY_PROVIDER_PARTY = 'TestLiquidityProvider';
process.env.LEDGER_HOST = 'localhost';
process.env.LEDGER_PORT = '7575';
process.env.LEDGER_USE_TLS = 'false';
process.env.AUTO_ACCEPT_SWAPS = 'true';
process.env.LOG_LEVEL = 'error'; // Reduce log noise during tests

// Mock winston logger for tests
jest.mock('../src/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
  }
}));

// Mock process.exit to prevent tests from terminating
const mockExit = jest.spyOn(process, 'exit').mockImplementation((code?: number) => {
  throw new Error(`process.exit(${code}) called`);
});

// Mock setTimeout/setInterval for tests that need to control timing
jest.useFakeTimers();

// Cleanup after each test
afterEach(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
});

// Cleanup after all tests
afterAll(() => {
  mockExit.mockRestore();
  jest.useRealTimers();
}); 