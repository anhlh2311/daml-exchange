# Swap Request Creation Scripts

This folder contains scripts to simplify the process of creating swap requests using the Daml `createSwapScript` function from SwapUtils.

## Overview

The scripts provide both programmatic and command-line interfaces for creating swap requests in the token exchange system. They can either **execute Daml scripts directly** to create contracts on the ledger, or **generate commands** for manual execution.

## Scripts

### 1. `createSwapRequest.ts`

The main script that provides a `SwapRequestCreator` class for creating swap requests.

**Features:**
- **Direct Daml Script Execution**: Execute scripts directly from Node.js using child processes
- **Command Generation**: Generate Daml script commands for manual execution
- TypeScript interface with full type safety
- Automatic parameter validation
- Ledger connection management
- Development token generation
- Contract ID parsing from script output

**Usage as a module (Direct Execution):**
```typescript
import SwapRequestCreator, { SwapRequestParams } from './createSwapRequest';

const creator = new SwapRequestCreator();
await creator.connect('Alice');

const params: SwapRequestParams = {
  swapper: 'Alice',
  admin: 'Admin',
  liquidityProvider: 'LiquidityProvider',
  inputTokenOwner: 'UsdtOwner',
  inputTokenSymbol: 'USDT',
  outputTokenOwner: 'BtcOwner',
  outputTokenSymbol: 'BTC',
  inputAmount: 1095.12,
  expectedOutputAmount: 0.01,
  slippageTolerance: 0.05
};

// Execute directly (default)
const result = await creator.createSwapRequest(params);
// Result will contain the actual contract ID from the ledger

// Or generate command only
const commandResult = await creator.createSwapRequest(params, { executeDirectly: false });
// Result will contain the command to run manually
```

**Usage from command line (Direct Execution):**
```bash
# Execute directly on the ledger
npm run create-swap -- --swapper Alice --admin Admin --liquidity-provider LiquidityProvider --input-token-owner UsdtOwner --input-token-symbol USDT --output-token-owner BtcOwner --output-token-symbol BTC --input-amount 1095.12 --expected-output 0.01 --slippage 0.05

# Generate command only
npm run create-swap -- --generate-only --swapper Alice --admin Admin --liquidity-provider LiquidityProvider --input-token-owner UsdtOwner --input-token-symbol USDT --output-token-owner BtcOwner --output-token-symbol BTC --input-amount 1095.12 --expected-output 0.01 --slippage 0.05
```

### 2. `swap-examples.ts`

Provides pre-configured examples for common swap scenarios.

**Available Examples:**
- `usdtToBtc`: Alice swaps 1095.12 USDT for 0.01 BTC
- `btcToUsdt`: Bob swaps 0.005 BTC for 547.415 USDT

**Usage:**
```bash
# List all examples
npm run swap:list

# Execute examples directly on the ledger
npm run swap:usdt-btc
npm run swap:btc-usdt
npm run swap:run-all

# Generate commands only (for manual execution)
npm run swap:generate-usdt-btc
npm run swap:generate-btc-usdt
npm run swap:generate-all
```

## NPM Scripts

The following scripts are available in `package.json`:

| Script | Command | Description |
|--------|---------|-------------|
| `npm run create-swap` | Execute with custom parameters | Create swap request directly on ledger |
| `npm run create-swap:generate` | Generate command with custom parameters | Generate Daml script command only |
| `npm run swap-examples` | Run examples script | Interactive examples interface |
| `npm run swap:list` | List available examples | Show all pre-configured swap examples |
| `npm run swap:usdt-btc` | Run USDT→BTC example | Execute Alice's USDT→BTC swap on ledger |
| `npm run swap:btc-usdt` | Run BTC→USDT example | Execute Bob's BTC→USDT swap on ledger |
| `npm run swap:run-all` | Run all examples | Execute all swap examples on ledger |
| `npm run swap:generate-usdt-btc` | Generate USDT→BTC command | Generate command for Alice's swap |
| `npm run swap:generate-btc-usdt` | Generate BTC→USDT command | Generate command for Bob's swap |
| `npm run swap:generate-all` | Generate all commands | Generate commands for all examples |

## Parameters

### SwapRequestParams Interface

```typescript
interface SwapRequestParams {
  swapper: string;              // Party initiating the swap
  admin: string;                // Exchange admin party
  liquidityProvider: string;    // Liquidity provider party
  inputTokenOwner: string;      // Owner of the input token
  inputTokenSymbol: string;     // Symbol of the input token (e.g., USDT)
  outputTokenOwner: string;     // Owner of the output token
  outputTokenSymbol: string;    // Symbol of the output token (e.g., BTC)
  inputAmount: number;          // Amount of input token to swap
  expectedOutputAmount: number; // Expected minimum output amount
  slippageTolerance: number;    // Slippage tolerance (e.g., 0.05 for 5%)
  registryKey?: string;         // Registry key (optional, defaults to admin)
}
```

### Command Line Arguments

| Argument | Description | Required | Example |
|----------|-------------|----------|---------|
| `--swapper` | Party initiating the swap | Yes | `Alice` |
| `--admin` | Exchange admin party | Yes | `Admin` |
| `--liquidity-provider` | Liquidity provider party | Yes | `LiquidityProvider` |
| `--input-token-owner` | Owner of the input token | Yes | `UsdtOwner` |
| `--input-token-symbol` | Symbol of the input token | Yes | `USDT` |
| `--output-token-owner` | Owner of the output token | Yes | `BtcOwner` |
| `--output-token-symbol` | Symbol of the output token | Yes | `BTC` |
| `--input-amount` | Amount of input token to swap | Yes | `1095.12` |
| `--expected-output` | Expected minimum output amount | Yes | `0.01` |
| `--slippage` | Slippage tolerance | Yes | `0.05` |
| `--registry-key` | Registry key | No | `Admin` |

## Examples

### Example 1: USDT to BTC Swap

```bash
npm run create-swap -- \
  --swapper Alice \
  --admin Admin \
  --liquidity-provider LiquidityProvider \
  --input-token-owner UsdtOwner \
  --input-token-symbol USDT \
  --output-token-owner BtcOwner \
  --output-token-symbol BTC \
  --input-amount 1095.12 \
  --expected-output 0.01 \
  --slippage 0.05
```

### Example 2: BTC to USDT Swap

```bash
npm run create-swap -- \
  --swapper Bob \
  --admin Admin \
  --liquidity-provider LiquidityProvider \
  --input-token-owner BtcOwner \
  --input-token-symbol BTC \
  --output-token-owner UsdtOwner \
  --output-token-symbol USDT \
  --input-amount 0.005 \
  --expected-output 547.415 \
  --slippage 0.05
```

### Example 3: Using Pre-configured Examples

```bash
# List all examples
npm run swap:list

# Run USDT to BTC example
npm run swap:usdt-btc

# Run BTC to USDT example
npm run swap:btc-usdt

# Run all examples
npm run swap:run-all
```

## Output

### Direct Execution Mode (Default)

When executing directly, the scripts create actual contracts on the ledger and return the contract IDs:

```bash
✅ Example 'usdtToBtc' executed successfully on the ledger
📄 Contract ID: #123abc:0
📋 Script Output:
Swap request created successfully with contract ID: #123abc:0
```

### Command Generation Mode

When using `--generate-only`, the scripts output Daml commands for manual execution:

```bash
✅ Example 'usdtToBtc' command generated successfully
📄 Run the following command to create the swap request:

daml script --input-file=<(echo '{"swapper":"Alice","admin":"Admin",...}') --dar=.daml/dist/exchange-0.0.1.dar --script-name=Scripts.SwapUtils:createSwapWithTokenLocking --ledger-host=localhost --ledger-port=6865
```

## Configuration

The scripts use the configuration from `../src/config.ts` for ledger connection settings. Make sure the following environment variables are set:

- `LEDGER_HOST` (default: localhost)
- `LEDGER_PORT` (default: 6865) - gRPC port for Daml script execution
- `HTTP_JSON_PORT` (default: 7575) - HTTP JSON API port for service connections
- `LEDGER_USE_TLS` (default: false)

## Error Handling

The scripts include comprehensive error handling:

- Parameter validation
- Ledger connection errors
- Token type mismatches
- Invalid amounts or slippage values

## Integration with Daml Scripts

The generated commands can be executed directly using the Daml CLI:

```bash
# Copy the generated command and run it
daml script --input-file=<(echo '{"swapper":"Alice",...}') --dar=.daml/dist/exchange-0.0.1.dar --script-name=Scripts.SwapUtils:createSwapWithTokenLocking --ledger-host=localhost --ledger-port=6865
```

This will create the actual SwapRequest contract on the Daml ledger, which can then be processed by the Liquidity Provider Service.

## Development

To extend the scripts with new examples or functionality:

1. Add new examples to the `EXAMPLES` object in `swap-examples.ts`
2. Add new npm scripts to `package.json`
3. Update this README with the new functionality

## Troubleshooting

### Common Issues

1. **Connection Errors**: Ensure the Daml ledger is running and accessible
2. **Missing Parameters**: Use `--help` to see required parameters
3. **Invalid Token Symbols**: Ensure token symbols match those in the ledger
4. **Permission Errors**: Ensure the party has the necessary permissions

### Debug Mode

Enable debug logging by setting the log level:

```bash
LOG_LEVEL=debug npm run swap:usdt-btc
``` 