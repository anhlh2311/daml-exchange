// Mock TokenLedger contract for testing
export interface TokenLedger {
  owner: string;
  symbol: string;
  amount: string;
  observers: string[];
}

export interface TokenTransferLock {
  owner: string;
  recipient: string;
  symbol: string;
  amount: string;
  observers: string[];
}

export const TokenLedger = {
  templateId: 'Currency.TokenLedger:TokenLedger',
  LockTokenForTransfer: 'LockTokenForTransfer'
};

export const TokenTransferLock = {
  templateId: 'Currency.TokenLedger:TokenTransferLock',
  Accept: 'Accept',
  Cancel: 'Cancel',
  Reject: 'Reject'
}; 