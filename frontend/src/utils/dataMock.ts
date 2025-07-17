import { TokenCardProps } from "./model";

export const dataMock: Record<string, TokenCardProps> = {
  "USD Token": {
    payload: {
      owner: "Alice <alice@example.com>",
      holder: "Alice",
      amount: "123456789",
      symbol: "$",
      registryKey: "usd-token-123",
      metadata: {
        name: "USD Token",
        symbol: "$",
        description: "United States Dollar Token backed by real fiat reserve.",
        issuedDate: "2025-01-15T00:00:00Z",
        decimals: "2",
        version: "1.0.0",
      },
    },
    contractId: "contract-xyz-001",
    templateId: "Template:Token:USD",
    signatories: ["Alice"],
    observers: ["USDC Owner", "Bob"],
  },
  "GBP Token": {
    payload: {
      owner: "Bob <bob@example.com>",
      holder: "Bob",
      amount: "123456789",
      symbol: "£",
      registryKey: "gdp-token-123",
      metadata: {
        name: "GBP Token",
        symbol: "$",
        description: "United States Dollar Token backed by real fiat reserve.",
        issuedDate: "2025-01-15T00:00:00Z",
        decimals: "2",
        version: "1.0.0",
      },
    },
    contractId: "contract-xyz-001",
    templateId: "Template:Token:USD",
    signatories: ["Bob"],
    observers: ["Alice", "USDC Owner"],
  },
  "EUR Token": {
    payload: {
      owner: "Alice <alice@example.com>",
      holder: "Alice",
      amount: "123456789",
      symbol: "$",
      registryKey: "eur-token-123",
      metadata: {
        name: "EUR Token",
        symbol: "€",
        description: "United States Dollar Token backed by real fiat reserve.",
        issuedDate: "2025-01-15T00:00:00Z",
        decimals: "2",
        version: "1.0.0",
      },
    },
    contractId: "contract-xyz-001",
    templateId: "Template:Token:USD",
    signatories: ["Alice"],
    observers: ["Bob", "BTC Owner"],
  },
};

export const dataTokenAndActivity = [
  [
    "Swap Request",
    "Charlie → LP",
    "USDT → BTC",
    "1,000 USDT",
    "Active",
    "5 min ago",
  ],
  ["Token Listing", "Admin", "SOL", "-", "Approved", "10 min ago"],
  ["Rate Update", "Admin", "BTC/USDT", "109,512", "Updated", "15 min ago"],
  ["Party Registration", "Admin", "New User", "-", "Registered", "20 min ago"],
];
export const dataTokens = [
  ["Ethereum", "Ethereum Foundation", "ETH", 18],
  ["Solana", "Solana Foundation", "SOL", 9],
  ["Binance Coin", "Binance", "BNB", 8],
];

export const metricsAdmin = [
  { value: 15, label: "Registered Parties" },
  { value: 8, label: "Active Tokens" },
  { value: 12, label: "Trading Pairs" },
  { value: 156, label: "Total Swaps" },
];

export const metrics = [
  { value: 3, label: "My Tokens" },
  { value: "1,250,000", label: "Total Supply" },
  { value: 2, label: "Listed Tokens" },
  { value: 12, label: "Pending Requests" },
];

export const metricsProvider = [
  { value: 123, label: "Pending Swaps" },
  { value: 156, label: "Completed Swaps" },
  { value: 5, label: "Active Trading Pairs" },
  { value: "$2,340", label: "Total Volume" },
];

export const dataTokenTransfer = [
  {
    type: "Incoming",
    token: "USDT",
    amount: 1000,
    counterparty: "Alice",
    message: "Payment for services",
    status: "Pending",
  },
  {
    type: "Incoming",
    token: "BTC",
    amount: 0.1,
    counterparty: "Bob",
    message: "-",
    status: "Pending",
  },
  {
    type: "Outgoing",
    token: "BTC",
    amount: 0.5,
    counterparty: "Charlie",
    message: "Investment",
    status: "Pending",
  },
  {
    type: "Outgoing",
    token: "ETH",
    amount: 2,
    counterparty: "David",
    message: "Payment",
    status: "Completed",
  },
  {
    type: "Incoming",
    token: "SOL",
    amount: 10,
    counterparty: "Eve",
    message: "Reward",
    status: "Completed",
  },
  {
    type: "Outgoing",
    token: "USDT",
    amount: 500,
    counterparty: "Frank",
    message: "Service fee",
    status: "Rejected",
  },
  {
    type: "Outgoing",
    token: "BNB",
    amount: 1.5,
    counterparty: "Grace",
    message: "Gift",
    status: "Cancelled",
  },
];

export const pendingData = [
  {
    swapper: "Charlie",
    pair: "BTC/USDT",
    input: "1000 USDT",
    output: "0.0091 BTC",
    rate: "109,512",
  },
  {
    swapper: "David",
    pair: "ETH/USDT",
    input: "500 USDT",
    output: "0.18 ETH",
    rate: "2,777",
  },
  {
    swapper: "Eve",
    pair: "SOL/USDT",
    input: "750 USDT",
    output: "2.7 SOL",
    rate: "277",
  },
];
export const historyData = [
  {
    date: "2024-01-15",
    swapper: "Alice",
    pair: "BTC/USDT",
    input: "2000 USDT",
    output: "0.0182 BTC",
    rate: "109,512",
    status: "Completed",
  },
  {
    date: "2024-01-14",
    swapper: "Bob",
    pair: "ETH/USDT",
    input: "1000 USDT",
    output: "0.36 ETH",
    rate: "2,777",
    status: "Completed",
  },
  {
    date: "2024-01-13",
    swapper: "Charlie",
    pair: "SOL/USDT",
    input: "500 USDT",
    output: "1.8 SOL",
    rate: "277",
    status: "Rejected",
  },
  {
    date: "2024-01-12",
    swapper: "Frank",
    pair: "BNB/USDT",
    input: "300 USDT",
    output: "0.11 BNB",
    rate: "2,727",
    status: "Completed",
  },
  {
    date: "2024-01-11",
    swapper: "Grace",
    pair: "ADA/USDT",
    input: "1500 USDT",
    output: "1500 ADA",
    rate: "1.0",
    status: "Completed",
  },
];
