#!/bin/bash

set -e

echo "🚀 Setting up Liquidity Provider Service"
echo "========================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm $(npm -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "⚙️  Creating .env file from template..."
    cp env.example .env
    echo "📝 Please edit .env file to configure your settings:"
    echo "   - Set your LIQUIDITY_PROVIDER_PARTY name"
    echo "   - Configure ledger connection (host, port, TLS)"
    echo "   - Adjust balance thresholds and auto-accept settings"
fi

# Create logs directory
echo "📁 Creating logs directory..."
mkdir -p logs

# Build the project
echo "🔨 Building TypeScript code..."
npm run build

echo ""
echo "✅ Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your configuration"
echo "2. Ensure your Daml ledger is running"
echo "3. Start the service with: npm run dev"
echo ""
echo "For more information, see README.md" 