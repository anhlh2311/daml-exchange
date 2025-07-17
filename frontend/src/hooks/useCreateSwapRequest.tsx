import { SwapRequestSetup } from "@daml.js/exchange-0.0.1/lib/Exchange/TokenSwap";
import { useLedger } from "@daml/react";

export const useSwapRequest = () => {
  const ledger = useLedger();

  const createSwapRequestSetup = async (params: {
    swapper: string;
    admin: string;
    liquidityProvider: string;
    inputTokenLedgerKey: { _1: string; _2: string };
    tokenPairKey: {
      _1: string;
      _2: { _1: string; _2: string };
      _3: { _1: string; _2: string };
    };
    inputAmount: string;
    expectedOutputAmount: string;
    slippageTolerance: string;
    registryKey: string;
  }) => {
    return ledger.create(SwapRequestSetup, params);
  };

  const createSwapRequest = async (contractId: any) => {
    return ledger.exercise(SwapRequestSetup.CreateSwapRequest, contractId, {});
  };

  return {
    createSwapRequestSetup,
    createSwapRequest,
  };
};
