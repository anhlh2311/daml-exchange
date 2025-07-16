// Mock TokenSwap contract for testing
export interface SwapRequest {
  swapper: string;
  admin: string;
  liquidityProvider: string;
  tokenPairKey: [string, [string, string], [string, string]];
  inputAmount: string;
  expectedOutputAmount: string;
  inputTokenLockCid: string;
  outputTokenLockCid: string | null;
  slippageTolerance: string;
  registryKey: string;
}

export const SwapRequest = {
  templateId: 'Exchange.TokenSwap:SwapRequest',
  AcceptSwap: 'AcceptSwap',
  FinalizeSwap: 'FinalizeSwap',
  CancelSwapRequest: 'CancelSwapRequest',
  RejectSwapRequest: 'RejectSwapRequest'
}; 