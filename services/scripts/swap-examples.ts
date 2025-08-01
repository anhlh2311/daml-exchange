#!/usr/bin/env node

import SwapRequestCreator, { SwapRequestParams, SwapRequestOptions } from './createSwapRequest';
import { logger } from '../src/logger';

// Example swap scenarios
const EXAMPLES = {
  // USDC to BTC swap
  usdcToBtc: {
    swapper: 'Alice::1220ae713f2b4aa28614e2ef3b7f4cdda3273ef76acb60eac3cc8c37975faa159b94',
    admin: 'Admin::1220ae713f2b4aa28614e2ef3b7f4cdda3273ef76acb60eac3cc8c37975faa159b94',
    liquidityProvider: 'LiquidityProvider::1220ae713f2b4aa28614e2ef3b7f4cdda3273ef76acb60eac3cc8c37975faa159b94',
    inputTokenOwner: 'USDCOwner::1220ae713f2b4aa28614e2ef3b7f4cdda3273ef76acb60eac3cc8c37975faa159b94',
    inputTokenSymbol: 'USDC',
    outputTokenOwner: 'BTCOwner::1220ae713f2b4aa28614e2ef3b7f4cdda3273ef76acb60eac3cc8c37975faa159b94',
    outputTokenSymbol: 'BTC',
    inputAmount: 1086.08,
    expectedOutputAmount: 0.01,
    slippageTolerance: 0.05,
    registryKey: 'Admin::1220ae713f2b4aa28614e2ef3b7f4cdda3273ef76acb60eac3cc8c37975faa159b94'
  } as SwapRequestParams,

  // BTC to USDC swap
  btcToUsdc: {
    swapper: 'Alice::1220ae713f2b4aa28614e2ef3b7f4cdda3273ef76acb60eac3cc8c37975faa159b94',
    admin: 'Admin::1220ae713f2b4aa28614e2ef3b7f4cdda3273ef76acb60eac3cc8c37975faa159b94',
    liquidityProvider: 'LiquidityProvider::1220ae713f2b4aa28614e2ef3b7f4cdda3273ef76acb60eac3cc8c37975faa159b94',
    inputTokenOwner: 'BTCOwner::1220ae713f2b4aa28614e2ef3b7f4cdda3273ef76acb60eac3cc8c37975faa159b94',
    inputTokenSymbol: 'BTC',
    outputTokenOwner: 'USDCOwner::1220ae713f2b4aa28614e2ef3b7f4cdda3273ef76acb60eac3cc8c37975faa159b94',
    outputTokenSymbol: 'USDC',
    inputAmount: 0.005,
    expectedOutputAmount: 542.945,
    slippageTolerance: 0.05,
    registryKey: 'Admin::1220ae713f2b4aa28614e2ef3b7f4cdda3273ef76acb60eac3cc8c37975faa159b94'
  } as SwapRequestParams
};

export class SwapExamples {
  private creator: SwapRequestCreator;

  constructor() {
    this.creator = new SwapRequestCreator();
  }

  async runExample(exampleName: keyof typeof EXAMPLES, options: SwapRequestOptions = { executeDirectly: true }): Promise<void> {
    const params = EXAMPLES[exampleName];
    if (!params) {
      throw new Error(`Unknown example: ${exampleName}`);
    }

    try {
      logger.info(`Running example: ${exampleName}`, { params, options });
      
      await this.creator.connect(params.swapper);
      const result = await this.creator.createSwapRequest(params, options);
      
      if (result.success) {
        if (options.executeDirectly) {
          console.log(`✅ Example '${exampleName}' executed successfully on the ledger`);
          if (result.contractId && result.contractId !== 'command-generated') {
            console.log(`📄 Contract ID: ${result.contractId}`);
          }
          if (result.scriptOutput) {
            console.log('📋 Script Output:');
            console.log(result.scriptOutput);
          }
        } else {
          console.log(`✅ Example '${exampleName}' command generated successfully`);
          console.log(`📄 Run the following command to create the swap request:`);
          console.log('');
          console.log(result.scriptOutput);
          console.log('');
        }
      } else {
        console.error(`❌ Example '${exampleName}' failed: ${result.error}`);
        if (result.scriptOutput) {
          console.error('Script output:', result.scriptOutput);
        }
      }
      
      await this.creator.disconnect();
    } catch (error) {
      logger.error(`Failed to run example '${exampleName}'`, { error });
      throw error;
    }
  }

  async runAllExamples(options: SwapRequestOptions = { executeDirectly: true }): Promise<void> {
    const exampleNames = Object.keys(EXAMPLES) as (keyof typeof EXAMPLES)[];
    
    for (const exampleName of exampleNames) {
      try {
        await this.runExample(exampleName, options);
        console.log(''); // Add spacing between examples
      } catch (error) {
        logger.error(`Failed to run example '${exampleName}'`, { error });
      }
    }
  }

  listExamples(): void {
    console.log('Available examples:');
    Object.keys(EXAMPLES).forEach((name, index) => {
      const example = EXAMPLES[name as keyof typeof EXAMPLES];
      console.log(`  ${index + 1}. ${name}: ${example.swapper} swaps ${example.inputAmount} ${example.inputTokenSymbol} for ${example.expectedOutputAmount} ${example.outputTokenSymbol}`);
    });
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const examples = new SwapExamples();

  if (args.length === 0 || args.includes('--help')) {
    console.log(`
Usage: node swap-examples.js [command] [options]

Commands:
  list                    List all available examples
  run <example-name>      Run a specific example (usdcToBtc, btcToUsdc)
  run-all                 Run all examples
  --help                  Show this help message

Options:
  --generate-only         Generate commands only (don't execute)

Examples:
  node swap-examples.js list
  node swap-examples.js run usdcToBtc
  node swap-examples.js run btcToUsdc
  node swap-examples.js run-all
  node swap-examples.js --generate-only run usdcToBtc
  node swap-examples.js --generate-only run-all
    `);
    process.exit(0);
  }

  // Parse options
  const options: SwapRequestOptions = { executeDirectly: true };
  let commandIndex = 0;
  
  if (args[0] === '--generate-only') {
    options.executeDirectly = false;
    commandIndex = 1;
  }
  
  const command = args[commandIndex];

  try {
    switch (command) {
      case 'list':
        examples.listExamples();
        break;
        
      case 'run':
        const exampleName = args[commandIndex + 1];
        if (!exampleName) {
          console.error('Please specify an example name. Use "list" to see available examples.');
          process.exit(1);
        }
        await examples.runExample(exampleName as keyof typeof EXAMPLES, options);
        break;
        
      case 'run-all':
        await examples.runAllExamples(options);
        break;
        
      default:
        console.error(`Unknown command: ${command}`);
        console.error('Use --help to see available commands.');
        process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run CLI if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

export default SwapExamples; 