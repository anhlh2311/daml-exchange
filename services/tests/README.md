# Liquidity Provider Service Test Suite

This directory contains comprehensive tests for the Liquidity Provider Service, covering unit tests, integration tests, and configuration validation.

## Test Structure

```bash
    tests/
    ├── setup.ts                    # Global test setup and mocks
    ├── config.test.ts              # Configuration validation tests
    ├── ledger.test.ts              # LedgerService unit tests
    ├── liquidityProvider.test.ts   # LiquidityProviderService unit tests
    ├── integration.test.ts         # End-to-end integration tests
    ├── test-runner.ts              # Custom test runner utility
    ├── README.md                   # This documentation
    └── __mocks__/                  # Mock implementations
        └── daml.js/
            └── exchange-0.0.1/
                └── lib/
                    ├── Exchange/
                    │   └── TokenSwap.ts
                    └── Currency/
                        └── TokenLedger.ts
```

## Running Tests

### Using npm scripts

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Using the custom test runner

```bash
# Run all tests
ts-node tests/test-runner.ts

# Run only unit tests
ts-node tests/test-runner.ts unit

# Run only integration tests
ts-node tests/test-runner.ts integration

# Run with coverage
ts-node tests/test-runner.ts coverage

# Run in watch mode
ts-node tests/test-runner.ts watch

# Show help
ts-node tests/test-runner.ts help
```

## Test Categories

### 1. Configuration Tests (`config.test.ts`)

Tests the configuration system including:

- Default configuration values
- Environment variable overrides
- Boolean parsing from env vars
- Numeric parsing from env vars
- Invalid input handling
- Production vs development configs

**Key scenarios:**

- ✅ Default values when no env vars set
- ✅ Environment variable overrides
- ✅ Boolean value parsing (true/false/yes/no/1/0)
- ✅ Numeric value parsing with fallbacks
- ✅ Production security settings

### 2. LedgerService Tests (`ledger.test.ts`)

Tests the Daml ledger interaction layer including:

- Connection establishment
- JWT token creation for development
- SwapRequest queries with filtering
- TokenLedger queries
- Contract fetching (TokenTransferLock)
- Contract exercise operations
- Error handling

**Key scenarios:**

- ✅ Successful ledger connection
- ✅ Development token generation
- ✅ Query swap requests with filters
- ✅ Fetch token transfer locks
- ✅ Accept swap requests
- ✅ Reject swap requests
- ✅ Connection error handling
- ✅ Query error handling
- ✅ Contract not found scenarios

### 3. LiquidityProviderService Tests (`liquidityProvider.test.ts`)

Tests the main service logic including:

- Service lifecycle (start/stop)
- Swap request monitoring
- Party matching logic
- Token pair logic
- Auto-accept functionality
- Manual operations
- Error resilience

**Key scenarios:**

- ✅ Service start/stop lifecycle
- ✅ Swap request processing
- ✅ Party display name extraction
- ✅ Token symbol matching to determine output
- ✅ Auto-accept vs manual mode
- ✅ Error handling for invalid tokens
- ✅ Contract validation failures
- ✅ Status reporting

### 4. Integration Tests (`integration.test.ts`)

Tests complete end-to-end scenarios including:

- Full USDT→BTC swap flow
- Full BTC→USDT swap flow
- Multiple concurrent swaps with mixed liquidity providers
- Error scenarios and recovery
- Party filtering (processing only swaps intended for this LP)
- Token pair logic
- Service resilience

**Key scenarios:**

- ✅ Complete USDT to BTC swap
- ✅ Complete BTC to USDT swap
- ✅ Multiple concurrent swaps with proper filtering
- ✅ Contract validation failures
- ✅ Missing contracts handling
- ✅ Network connectivity issues
- ✅ Party matching and filtering (processes own LP requests, ignores others)
- ✅ Invalid token handling
- ✅ Service lifecycle management

## Mock Strategy

### Daml Contract Mocks

The test suite uses comprehensive mocks for Daml contracts:

- **SwapRequest**: Mocked with all required fields and choices
- **TokenLedger**: Mocked for balance queries
- **TokenTransferLock**: Mocked for token locking operations

### Ledger Client Mock

The `@daml/ledger` client is mocked to simulate:

- Query operations with configurable responses
- Fetch operations for contract retrieval
- Exercise operations for choice execution
- Error conditions and network failures

### Logger Mock

Winston logger is mocked to prevent log noise during tests while still allowing verification of log calls.

## Test Data Patterns

### Party IDs

Tests use realistic party ID formats:

```typescript
// Full party IDs (as seen in actual system)
'LiquidityProvider::1220ee3baf69e5b46e6c401756667db4c21d4ef24de8981a81b2d4f311b4e9ed5d47'

// Display names (as configured)
'LiquidityProvider'
```

### Token Pair Keys

Tests use the actual token pair key structure:

```typescript
[
  'Admin::fedcba0987654321',           // Admin party
  ['BtcOwner::111111111111', 'BTC'],   // Base token (owner, symbol)
  ['UsdtOwner::222222222222', 'USDT']  // Quote token (owner, symbol)
]
```

### Swap Scenarios

Tests cover realistic swap scenarios:

- USDT→BTC: 1086.08 USDT → 0.01 BTC
- BTC→USDT: 0.005 BTC → 547.415 USDT
- Various slippage tolerances (0.01 to 0.05)
- Mixed liquidity provider scenarios (some for this LP, some for others)

## Coverage Goals

The test suite aims for:

- **90%+ line coverage** across all source files
- **100% function coverage** for public APIs
- **100% branch coverage** for critical decision points

### Current Coverage Areas

- ✅ Configuration parsing and validation
- ✅ Ledger connection and operations
- ✅ Service lifecycle management
- ✅ Swap request processing logic
- ✅ Error handling and resilience
- ✅ Party and token matching
- ✅ Manual operation interfaces

## Continuous Integration

The test suite is designed for CI/CD environments:

- Fast execution (using fake timers)
- No external dependencies
- Comprehensive mocking
- Clear error reporting
- Coverage reporting in multiple formats

## Testing Best Practices

### 1. Test Isolation

Each test is fully isolated with:

- Fresh mock instances
- Cleared timers
- Reset environment variables

### 2. Realistic Test Data

Tests use data patterns matching real system behavior:

- Actual party ID formats
- Realistic token amounts
- Proper contract structures

### 3. Error Scenarios

Comprehensive error testing including:

- Network failures
- Contract validation errors
- Missing contracts
- Invalid configurations

### 4. Async Handling

Proper async/await patterns with:

- Timer advancement for polling
- Promise resolution waiting
- Background process cleanup

## Debugging Tests

### Running Single Tests

```bash
# Run specific test file
npm test config.test.ts

# Run specific test suite
npm test -- --testNamePattern="LedgerService"

# Run specific test case
npm test -- --testNamePattern="should connect successfully"
```

### Verbose Output

```bash
# Enable verbose output
npm test -- --verbose

# Show detailed error information
npm test -- --verbose --no-coverage
```

### Watch Mode

```bash
# Watch for changes and re-run tests
npm run test:watch

# Watch specific files
npm test -- --watch --testPathPattern=ledger
```

## Troubleshooting

### Common Issues

1. **Timer-related tests failing**
   - Ensure `jest.useFakeTimers()` is called
   - Use `jest.advanceTimersByTime()` instead of real delays

2. **Mock not working**
   - Check mock is defined before import
   - Verify `jest.clearAllMocks()` in beforeEach

3. **Async tests hanging**
   - Ensure all promises are awaited
   - Check for proper cleanup in afterEach

4. **Type errors in tests**
   - Use `as any` for mock contract IDs
   - Ensure mock interfaces match actual types

### Debug Configuration

Add to `jest.config.js` for debugging:

```javascript
module.exports = {
  // ... existing config
  verbose: true,
  collectCoverage: false, // Disable during debugging
  testTimeout: 30000,     // Increase timeout
};
```
