#!/usr/bin/env node

import { Ledger } from '@daml/ledger';
import { Party, ContractId } from '@daml/types';
import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { config } from '../src/config';
import { logger } from '../src/logger';

// Define interfaces for the script parameters
export interface SwapRequestParams {
  swapper: string;
  admin: string;
  liquidityProvider: string;
  inputTokenOwner: string;
  inputTokenSymbol: string;
  outputTokenOwner: string;
  outputTokenSymbol: string;
  inputAmount: number;
  expectedOutputAmount: number;
  slippageTolerance: number;
  registryKey?: string;
}

export interface SwapRequestOptions {
  executeDirectly?: boolean; // If true, execute the script directly, if false, just return the command
}

export interface CreateSwapResult {
  success: boolean;
  contractId?: string;
  error?: string;
  scriptOutput?: string;
}

interface DamlScriptResult {
  success: boolean;
  output: string;
  error?: string;
}

export class SwapRequestCreator {
  private ledger: Ledger | null = null;
  private party: Party | null = null;

  async connect(partyName: string): Promise<void> {
    try {
      const ledgerUrl = config.ledger.useTls 
        ? `https://${config.ledger.host}:${config.ledger.httpJsonPort}/`
        : `http://${config.ledger.host}:${config.ledger.httpJsonPort}/`;

      logger.info('Connecting to Daml HTTP JSON API', { url: ledgerUrl, party: partyName });

      this.party = partyName as Party;
      
      // Create development token for the party
      const developmentToken = this.createDevelopmentToken(this.party);

      this.ledger = new Ledger({
        token: developmentToken,
        httpBaseUrl: ledgerUrl,
        wsBaseUrl: ledgerUrl.replace(/^http/, 'ws'),
      });

      logger.info('Successfully connected to Daml HTTP JSON API', { party: partyName });
    } catch (error) {
      logger.error('Failed to connect to Daml HTTP JSON API', { error });
      throw error;
    }
  }

  async createSwapRequest(params: SwapRequestParams, options: SwapRequestOptions = { executeDirectly: true }): Promise<CreateSwapResult> {
    if (!this.ledger || !this.party) {
      throw new Error('Not connected to ledger. Call connect() first.');
    }

    try {
      logger.info('Creating swap request with parameters', params);

      // Resolve party display names to full Party IDs
      logger.info('Resolving party display names to full Party IDs...');
      const resolvedParties = await this.resolveParties([
        params.swapper,
        params.admin, 
        params.liquidityProvider,
        params.inputTokenOwner,
        params.outputTokenOwner
      ]);

      logger.debug('Resolved parties', resolvedParties);

      // Prepare the script parameters in the format expected by createSwapScript (SwapParams record)
      // Note: TokenPair key should always be ordered as (admin, (BTCOwner, "BTC"), (USDCOwner, "USDC"))
      // regardless of swap direction
      const isBtcInput = params.inputTokenSymbol.toLowerCase() === 'btc';
      const isUsdcInput = params.inputTokenSymbol.toLowerCase() === 'usdc';
      
      let btcOwner: string, usdcOwner: string;
      if (isBtcInput) {
        btcOwner = resolvedParties[params.inputTokenOwner];
        usdcOwner = resolvedParties[params.outputTokenOwner];
      } else if (isUsdcInput) {
        btcOwner = resolvedParties[params.outputTokenOwner];
        usdcOwner = resolvedParties[params.inputTokenOwner];
      } else {
        throw new Error(`Unsupported token pair: ${params.inputTokenSymbol}/${params.outputTokenSymbol}. Only BTC/USDC pairs are supported.`);
      }

      const scriptParams = {
        swapper: resolvedParties[params.swapper],
        admin: resolvedParties[params.admin],
        liquidityProvider: resolvedParties[params.liquidityProvider],
        inputTokenLedgerKey: [resolvedParties[params.inputTokenOwner], resolvedParties[params.swapper]],
        tokenPairKey: [
          resolvedParties[params.admin],
          [btcOwner, "BTC"],
          [usdcOwner, "USDC"]
        ],
        inputAmount: params.inputAmount.toString(),
        expectedOutputAmount: params.expectedOutputAmount.toString(),
        slippageTolerance: params.slippageTolerance.toString(),
        registryKey: resolvedParties[params.registryKey || params.admin]
      };

      logger.debug('Prepared script parameters with resolved parties', scriptParams);

      if (options.executeDirectly) {
        // Execute the Daml script directly
        logger.info('Executing Daml script to create swap request...');
        
        const scriptResult = await this.executeDamlScript(
          'Scripts.SwapUtils:createSwapScript',
          scriptParams
        );

        if (scriptResult.success) {
          // Parse the contract ID from the script output
          const contractId = this.parseContractIdFromOutput(scriptResult.output);
          
          logger.info('Swap request created successfully', { contractId });
          
          return {
            success: true,
            contractId: contractId,
            scriptOutput: scriptResult.output
          };
        } else {
          logger.error('Daml script execution failed', { error: scriptResult.error });
          return {
            success: false,
            error: scriptResult.error || 'Script execution failed',
            scriptOutput: scriptResult.output
          };
        }
      } else {
        // Generate command for manual execution
        logger.info('Generating Daml script command for manual execution...');
        
        const scriptCommand = this.generateScriptCommand(params);
        
        logger.info('To create the swap request, run the following command:', { command: scriptCommand });

        return {
          success: true,
          contractId: 'command-generated',
          scriptOutput: scriptCommand
        };
      }

    } catch (error) {
      logger.error('Failed to create swap request', { error, params });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async executeDamlScript(scriptName: string, params: any): Promise<DamlScriptResult> {
    try {
      // Create a temporary input file with the parameters
      const inputFileName = `swap-params-${Date.now()}.json`;
      const inputFilePath = path.join(process.cwd(), inputFileName);
      
      // Write parameters to temporary file
      fs.writeFileSync(inputFilePath, JSON.stringify(params, null, 2));
      
      logger.debug('Created temporary input file', { inputFilePath, params });

      // Prepare the daml script command arguments
      const args = [
        'script',
        '--dar', '../.daml/dist/exchange-0.0.1.dar',
        '--script-name', scriptName,
        '--input-file', inputFileName,
        '--ledger-host', config.ledger.host,
        '--ledger-port', config.ledger.port.toString() // Use gRPC port for Daml scripts
      ];

      logger.debug('Executing daml script', { args });

      // Execute the daml script command
      const result = await this.spawnDamlCommand(args);

      // Clean up temporary file
      try {
        fs.unlinkSync(inputFilePath);
        logger.debug('Cleaned up temporary input file', { inputFilePath });
      } catch (cleanupError) {
        logger.warn('Failed to clean up temporary file', { inputFilePath, error: cleanupError });
      }

      return result;

    } catch (error) {
      logger.error('Error executing Daml script', { error, scriptName });
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private spawnDamlCommand(args: string[]): Promise<DamlScriptResult> {
    return new Promise((resolve) => {
      let stdout = '';
      let stderr = '';

      logger.debug('Spawning daml command', { command: 'daml', args });

      const child = spawn('daml', args, {
        cwd: process.cwd(),
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: false
      });

      child.stdout?.on('data', (data) => {
        const output = data.toString();
        stdout += output;
        logger.debug('Script stdout:', output.trim());
      });

      child.stderr?.on('data', (data) => {
        const output = data.toString();
        stderr += output;
        logger.debug('Script stderr:', output.trim());
      });

      child.on('close', (code) => {
        logger.debug('Daml script process closed', { code, stdout: stdout.trim(), stderr: stderr.trim() });
        
        if (code === 0) {
          resolve({
            success: true,
            output: stdout.trim()
          });
        } else {
          resolve({
            success: false,
            output: stdout.trim(),
            error: stderr.trim() || `Process exited with code ${code}`
          });
        }
      });

      child.on('error', (error) => {
        logger.error('Failed to start daml command', { error });
        resolve({
          success: false,
          output: '',
          error: `Failed to start daml command: ${error.message}`
        });
      });
    });
  }

  private parseContractIdFromOutput(output: string): string {
    try {
      // The Daml script output typically contains the contract ID
      // Look for patterns like: #<contractId> or "contractId"
      
      // Try to find a pattern like #123:0 or similar contract ID format
      const contractIdMatch = output.match(/#[a-f0-9]+:[0-9]+/i);
      if (contractIdMatch) {
        return contractIdMatch[0];
      }

      // Try to find JSON-like output with contractId field
      const jsonMatch = output.match(/"?contractId"?\s*[:=]\s*"([^"]+)"/i);
      if (jsonMatch) {
        return jsonMatch[1];
      }

      // Try to extract from the last line (common pattern)
      const lines = output.split('\n').filter(line => line.trim());
      const lastLine = lines[lines.length - 1];
      
      // Look for contract ID pattern in the last line
      const lastLineMatch = lastLine.match(/#[a-f0-9]+:[0-9]+/i);
      if (lastLineMatch) {
        return lastLineMatch[0];
      }

      // If no specific pattern found, return the last non-empty line
      return lastLine.trim() || 'unknown-contract-id';
      
    } catch (error) {
      logger.warn('Failed to parse contract ID from output', { error, output });
      return 'parse-error-contract-id';
    }
  }

  private generateScriptCommand(params: SwapRequestParams): string {
    // Generate a daml script command that can be run to create the swap request
    // Determine BTC and USDC owners for correct TokenPair key ordering
    const isBtcInput = params.inputTokenSymbol.toLowerCase() === 'btc';
    const btcOwner = isBtcInput ? params.inputTokenOwner : params.outputTokenOwner;
    const usdcOwner = isBtcInput ? params.outputTokenOwner : params.inputTokenOwner;
    
    const scriptArgs = [
      `--input-file=<(echo '{"swapper":"${params.swapper}","admin":"${params.admin}","liquidityProvider":"${params.liquidityProvider}","inputTokenLedgerKey":["${params.inputTokenOwner}","${params.swapper}"],"tokenPairKey":["${params.admin}",["${btcOwner}","BTC"],["${usdcOwner}","USDC"]],"inputAmount":"${params.inputAmount}","expectedOutputAmount":"${params.expectedOutputAmount}","slippageTolerance":"${params.slippageTolerance}","registryKey":"${params.registryKey || params.admin}"}')`,
      `--dar=.daml/dist/exchange-0.0.1.dar`,
      `--script-name=Scripts.SwapUtils:createSwapScript`,
      `--ledger-host=${config.ledger.host}`,
      `--ledger-port=${config.ledger.port}` // Use gRPC port for Daml scripts
    ];

    return `daml script ${scriptArgs.join(' ')}`;
  }

  async generateSwapRequestCommand(params: SwapRequestParams): Promise<CreateSwapResult> {
    return this.createSwapRequest(params, { executeDirectly: false });
  }

  async disconnect(): Promise<void> {
    if (this.ledger) {
      this.ledger = null;
      this.party = null;
      logger.info('Disconnected from Daml HTTP JSON API');
    }
  }

  private createDevelopmentToken(party: Party): string {
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };
    
    const payload = {
      iss: 'development',
      sub: party,
      aud: 'daml-ledger-api',
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
      iat: Math.floor(Date.now() / 1000),
      act: party,
      scope: 'daml_ledger_api'
    };

    const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = 'development-signature';
    
    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  private async resolveParties(partyNames: string[]): Promise<{ [key: string]: string }> {
    const resolvedParties: { [key: string]: string } = {};
    
    logger.warn('Party resolution not yet implemented. Using provided party names as-is.');
    logger.warn('For production use, ensure party names include full Party IDs (format: "DisplayName::PartyId")');
    
    // For now, use party names as-is
    // TODO: Implement proper party resolution using ledger's listKnownParties API
    for (const partyName of partyNames) {
      resolvedParties[partyName] = partyName;
    }
    
    return resolvedParties;
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help')) {
    console.log(`
Usage: node createSwapRequest.js [options]

Options:
  --swapper <party>              Party initiating the swap
  --admin <party>                Exchange admin party
  --liquidity-provider <party>   Liquidity provider party
  --input-token-owner <party>    Owner of the input token
  --input-token-symbol <symbol>  Symbol of the input token (e.g., USDC)
  --output-token-owner <party>   Owner of the output token
  --output-token-symbol <symbol> Symbol of the output token (e.g., BTC)
  --input-amount <amount>        Amount of input token to swap
  --expected-output <amount>     Expected minimum output amount
  --slippage <percentage>        Slippage tolerance (e.g., 0.05 for 5%)
  --registry-key <party>         Registry key (optional, defaults to admin)
  --generate-only                Generate command only (don't execute)
  --help                         Show this help message

Example (direct execution):
  node createSwapRequest.js \\
    --swapper Alice \\
    --admin Admin \\
    --liquidity-provider LP \\
    --input-token-owner UsdcOwner \\
    --input-token-symbol USDC \\
    --output-token-owner BtcOwner \\
    --output-token-symbol BTC \\
    --input-amount 1095.12 \\
    --expected-output 0.01 \\
    --slippage 0.05

Example (generate command only):
  node createSwapRequest.js \\
    --generate-only \\
    --swapper Alice \\
    ... [other options]
    `);
    process.exit(0);
  }

  // Parse command line arguments
  const params: Partial<SwapRequestParams> = {};
  const options: SwapRequestOptions = { executeDirectly: true };
  
  for (let i = 0; i < args.length; i++) {
    const key = args[i];
    
    if (key === '--generate-only') {
      options.executeDirectly = false;
      continue;
    }
    
    const value = args[i + 1];
    
    switch (key) {
      case '--swapper':
        params.swapper = value;
        i++; // Skip the value in next iteration
        break;
      case '--admin':
        params.admin = value;
        i++;
        break;
      case '--liquidity-provider':
        params.liquidityProvider = value;
        i++;
        break;
      case '--input-token-owner':
        params.inputTokenOwner = value;
        i++;
        break;
      case '--input-token-symbol':
        params.inputTokenSymbol = value;
        i++;
        break;
      case '--output-token-owner':
        params.outputTokenOwner = value;
        i++;
        break;
      case '--output-token-symbol':
        params.outputTokenSymbol = value;
        i++;
        break;
      case '--input-amount':
        params.inputAmount = parseFloat(value);
        i++;
        break;
      case '--expected-output':
        params.expectedOutputAmount = parseFloat(value);
        i++;
        break;
      case '--slippage':
        params.slippageTolerance = parseFloat(value);
        i++;
        break;
      case '--registry-key':
        params.registryKey = value;
        i++;
        break;
    }
  }

  // Validate required parameters
  const required = [
    'swapper', 'admin', 'liquidityProvider', 'inputTokenOwner', 
    'inputTokenSymbol', 'outputTokenOwner', 'outputTokenSymbol',
    'inputAmount', 'expectedOutputAmount', 'slippageTolerance'
  ];

  const missing = required.filter(key => !(key in params));
  if (missing.length > 0) {
    console.error(`Missing required parameters: ${missing.join(', ')}`);
    process.exit(1);
  }

  try {
    const creator = new SwapRequestCreator();
    await creator.connect(params.swapper!);
    
    const result = await creator.createSwapRequest(params as SwapRequestParams, options);
    
    if (result.success) {
      if (options.executeDirectly) {
        console.log('✅ Swap request created successfully on the ledger');
        if (result.contractId && result.contractId !== 'command-generated') {
          console.log(`📄 Contract ID: ${result.contractId}`);
        }
        if (result.scriptOutput) {
          console.log('📋 Script Output:');
          console.log(result.scriptOutput);
        }
      } else {
        console.log('✅ Command generated successfully');
        console.log('📄 Run the following command to create the swap request:');
        console.log('');
        console.log(result.scriptOutput);
        console.log('');
      }
    } else {
      console.error(`❌ Failed to create swap request: ${result.error}`);
      if (result.scriptOutput) {
        console.error('Script output:', result.scriptOutput);
      }
      process.exit(1);
    }
    
    await creator.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run CLI if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

export default SwapRequestCreator; 