import { SwapRequest } from "@daml.js/exchange-0.0.1/lib/Exchange/TokenSwap";
import { useLedger, useQuery, useReload } from "@daml/react";
import { ContractId } from "@daml/types";
import { useState } from "react";

export const useSwapRequestAction = () => {
  const { contracts, loading } = useQuery(SwapRequest);

  const ledger = useLedger();

  // const acceptSwap = async (
  //   contractId: string,
  //   outputTokenLedgerKey: { _1: string; _2: string }
  // ) => {
  //   return ledger.exercise(SwapRequest.AcceptSwap, contractId, {
  //     outputTokenLedgerKey: null,
  //   });
  // };

  const finalizeSwap = async (contractId: ContractId<SwapRequest>) => {
    return ledger.exercise(SwapRequest.FinalizeSwap, contractId, {});
  };

  // const cancelSwapRequest = async (contractId: string) => {
  //   return ledger.exercise(SwapRequest.CancelSwapRequest, contractId, {});
  // };

  // const rejectSwapRequest = async (contractId: string) => {
  //   return ledger.exercise(SwapRequest.RejectSwapRequest, contractId, {});
  // };

  return {
    // acceptSwap,
    // finalizeSwap,
    // cancelSwapRequest,
    // rejectSwapRequest,
    contracts,
    finalizeSwap,
    loading,
  };
};
