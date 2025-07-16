# Liquidity Provider Service

A Node.js backend service that connects to the Daml ledger and acts as a liquidity provider for token exchange operations. The service monitors `SwapRequest` contracts and can automatically or manually accept/reject swap requests based on configurable rules.

## Features

- **Automatic Ledger Connection**: Connects to Daml ledger using `@daml/ledger` and `@daml/types`
- **Real-time Monitoring**: Continuously monitors for new `SwapRequest` contracts
- **Intelligent Decision Making**: Evaluates swap requests based on:
  - Available token balances
  - Slippage tolerance
  - Minimum reserve requirements
- **Auto-Accept Mode**: Optionally accepts valid swaps automatically
- **Manual Control**: Provides APIs for manual swap acceptance/rejection
- **Comprehensive Logging**: Structured logging with configurable levels
- **Graceful Shutdown**: Handles shutdown signals properly

## Prerequisites

- Node.js 18+ and npm
- Running Daml ledger (sandbox or production)
- Generated JavaScript packages from Daml contracts (in `../daml.js/`)
- Properly registered parties on the ledger

## Installation

1. Navigate to the services directory:

   ```bash
   cd services
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the TypeScript code:

   ```bash
   npm run build
   ```

## Configuration

Copy the example environment file and customize it:

```bash
cp env.example .env
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `LEDGER_HOST` | Daml ledger hostname | `localhost` |
| `LEDGER_PORT` | Daml HTTP JSON API port | `7575` |
| `LEDGER_USE_TLS` | Use TLS connection | `false` |
| `LIQUIDITY_PROVIDER_PARTY` | Party name for the liquidity provider | `LiquidityProvider` |
| `ADMIN_PARTY` | Admin party name | `Admin` |
| `LOG_LEVEL` | Logging level (debug, info, warn, error) | `info` |
| `POLLING_INTERVAL_MS` | How often to check for new swaps (ms) | `5000` |
| `AUTO_ACCEPT_SWAPS` | Automatically accept valid swaps | `false` |
| `MAX_ACCEPTABLE_SLIPPAGE` | Maximum slippage tolerance (0-1) | `0.1` |
| `MIN_BTC_BALANCE` | Minimum BTC reserves to maintain | `1.0` |
| `MIN_USDT_BALANCE` | Minimum USDT reserves to maintain | `100000.0` |

## Usage

### Development Mode

Start the service in development mode with auto-restart:

```bash
npm run dev
```

### Production Mode

Build and start the service:

```bash
npm run build
npm start
```

### Using Nodemon

For development with file watching:

```bash
npm run start:watch
```

## How It Works

### Service Flow

1. **Initialization**
   - Validates configuration
   - Connects to Daml ledger
   - Sets up logging and monitoring

2. **Authentication & Connection**
   - Creates development JWT tokens for HTTP JSON API authentication
   - Works with `--allow-insecure-tokens` development setup
   - Connects to HTTP JSON API (port 7575) not Canton gRPC (port 6865)

3. **Monitoring Loop**
   - Queries for `SwapRequest` contracts every `POLLING_INTERVAL_MS`
   - Processes each swap request for the configured liquidity provider party

4. **Swap Processing Logic**
   - Filters for unprocessed `SwapRequest` contracts (where `outputTokenLockCid` is null)
   - Matches swap requests intended for this liquidity provider
   - Fetches `TokenTransferLock` contract to determine precise input token
   - Determines correct output token based on token pair configuration
   - Trusts Daml contract validation for all business logic (balances, slippage, etc.)

5. **Automatic Processing** (if enabled)
   - Attempts to accept swaps by exercising `AcceptSwap` choice
   - Logs contract validation results (success or specific error reasons)
   - Does not explicitly reject - lets contracts handle validation and rejection

### Manual Control

When `AUTO_ACCEPT_SWAPS=false`, the service will log recommendations but won't take action. You can implement manual controls using the exported service classes.

### Party Configuration

The service handles party identification correctly:

- **Configuration**: Use party display names (e.g., `LiquidityProvider`) in environment variables
- **Contract Matching**: Service automatically extracts display names from full party IDs in contracts
- **Example**: Contract shows `LiquidityProvider::1220abc...def` → Service matches with configured `LiquidityProvider`

This allows the service to work seamlessly with Daml contracts while using simple display names in configuration.

## Generated Daml Contracts

The service uses the following generated contracts from `@daml.js/exchange-0.0.1`:

- **SwapRequest**: Template for token swap requests
  - `AcceptSwap`: Choice to accept a swap request
  - `RejectSwapRequest`: Choice to reject a swap request
- **TokenLedger**: Template for token balances
- **TokenTransferLock**: Template for locked tokens during swaps
  - Used to determine precise input token information

## Logging

Logs are written to:

- Console (all levels)
- `logs/combined.log` (all levels)
- `logs/error.log` (errors only)

Log format includes timestamps, levels, and structured data for easy parsing.

## Error Handling

- **Connection Failures**: Service will log errors and attempt to reconnect
- **Invalid Contracts**: Malformed contracts are logged and skipped
- **Insufficient Balances**: Logged as rejection reasons
- **Unexpected Errors**: Logged with full stack traces

## Monitoring and Status

The service provides status information including:

- Current running state
- Party identity
- Auto-accept configuration
- Current token balances
- Number of pending swap requests

## Integration with Exchange System

This service is designed to work with the broader token exchange system:

- **Frontend**: Users create swap requests through the web interface
- **Backend API**: Provides contract templates and ledger interaction
- **Liquidity Provider**: This service (acts as counterparty for swaps)
- **Daml Ledger**: Stores all contracts and ensures consistency

## Development

### Project Structure

```
src/
├── config.ts          # Configuration management
├── logger.ts          # Winston logging setup
├── ledger.ts          # Daml ledger connection and queries
├── liquidityProvider.ts # Main service logic
└── index.ts           # Application entry point
```

### Adding New Features

1. **Custom Processing Logic**: Modify `tryAcceptSwap()` in `liquidityProvider.ts`
2. **Additional Monitoring**: Add new query methods to `ledger.ts`
3. **Configuration Options**: Update `config.ts` and `env.example`
4. **Contract Validation**: Implement business rules in Daml contracts, not in the service

## Troubleshooting

### Common Issues

1. **Cannot connect to ledger**
   - Check `LEDGER_HOST` and `LEDGER_PORT` settings (should be HTTP JSON API port 7575, not Canton gRPC port 6865)
   - Ensure Daml ledger is running and accessible
   - Verify TLS settings match ledger configuration

2. **Authentication errors (401 Unauthorized)**
   - Ensure HTTP JSON API was started with `--allow-insecure-tokens` for development
   - Service creates development JWT tokens automatically
   - For production, implement proper JWT token management

3. **Party not found**
   - Ensure `LIQUIDITY_PROVIDER_PARTY` exists on the ledger
   - Check party allocation in Daml scripts or navigator
   - Use party display name (e.g., `LiquidityProvider`) not full party ID

4. **No swap requests found**
   - Verify the party has observer rights on `SwapRequest` contracts
   - Check if contracts are being created by the frontend

5. **Insufficient balance errors**
   - Review token ledger allocations for the liquidity provider
   - Adjust minimum balance thresholds if needed

### Debug Mode

Set `LOG_LEVEL=debug` to see detailed information about:

- Contract queries and results
- Decision-making process
- Ledger interactions

## License

This service is part of the token exchange project and follows the same licensing terms.
