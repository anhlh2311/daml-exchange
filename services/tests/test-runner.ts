#!/usr/bin/env ts-node

/**
 * Test Runner Utility
 * 
 * This script provides convenient ways to run different test suites
 * and generate reports for the liquidity provider service.
 */

import { spawn } from 'child_process';
import * as path from 'path';

interface TestOptions {
  watch?: boolean;
  coverage?: boolean;
  verbose?: boolean;
  suite?: string;
  updateSnapshots?: boolean;
}

class TestRunner {
  private rootDir: string;

  constructor() {
    this.rootDir = path.resolve(__dirname, '..');
  }

  async runTests(options: TestOptions = {}): Promise<void> {
    const args = ['jest'];

    if (options.coverage) {
      args.push('--coverage');
    }

    if (options.watch) {
      args.push('--watch');
    }

    if (options.verbose) {
      args.push('--verbose');
    }

    if (options.updateSnapshots) {
      args.push('--updateSnapshot');
    }

    if (options.suite) {
      args.push('--testNamePattern', options.suite);
    }

    console.log(`\n🧪 Running tests with: npx ${args.join(' ')}\n`);

    return new Promise((resolve, reject) => {
      const child = spawn('npx', args, {
        cwd: this.rootDir,
        stdio: 'inherit',
        shell: true
      });

      child.on('close', (code) => {
        if (code === 0) {
          console.log('\n✅ Tests completed successfully!');
          resolve();
        } else {
          console.log(`\n❌ Tests failed with exit code ${code}`);
          reject(new Error(`Tests failed with exit code ${code}`));
        }
      });

      child.on('error', (error) => {
        console.error('\n❌ Failed to start test runner:', error);
        reject(error);
      });
    });
  }

  async runUnitTests(): Promise<void> {
    console.log('🔬 Running Unit Tests...');
    await this.runTests({ 
      suite: '^(?!.*Integration).*',
      verbose: true 
    });
  }

  async runIntegrationTests(): Promise<void> {
    console.log('🔗 Running Integration Tests...');
    await this.runTests({ 
      suite: 'Integration',
      verbose: true 
    });
  }

  async runWithCoverage(): Promise<void> {
    console.log('📊 Running Tests with Coverage...');
    await this.runTests({ 
      coverage: true,
      verbose: true 
    });
  }

  async runWatchMode(): Promise<void> {
    console.log('👀 Running Tests in Watch Mode...');
    await this.runTests({ 
      watch: true 
    });
  }

  printHelp(): void {
    console.log(`
🧪 Liquidity Provider Service Test Runner

Usage: ts-node tests/test-runner.ts [command]

Commands:
  unit          Run only unit tests
  integration   Run only integration tests
  coverage      Run all tests with coverage report
  watch         Run tests in watch mode
  help          Show this help message

Examples:
  ts-node tests/test-runner.ts unit
  ts-node tests/test-runner.ts coverage
  ts-node tests/test-runner.ts watch
`);
  }
}

async function main(): Promise<void> {
  const runner = new TestRunner();
  const command = process.argv[2];

  try {
    switch (command) {
      case 'unit':
        await runner.runUnitTests();
        break;
      case 'integration':
        await runner.runIntegrationTests();
        break;
      case 'coverage':
        await runner.runWithCoverage();
        break;
      case 'watch':
        await runner.runWatchMode();
        break;
      case 'help':
      case '--help':
      case '-h':
        runner.printHelp();
        break;
      default:
        console.log('🧪 Running all tests...');
        await runner.runTests({ verbose: true });
        break;
    }
  } catch (error) {
    console.error('Test runner failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
} 