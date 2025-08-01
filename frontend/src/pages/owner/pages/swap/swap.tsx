import { ArrowsUpDownIcon } from "@heroicons/react/20/solid";
import MainLayout from "components/layout/main-layout";
import LoadingScreen from "components/loading/loading";
import { useSwapRequest } from "hooks/useCreateSwapRequest";
import { useTokenPair } from "hooks/useGetTokenPair";
import { SlippageTolerance } from "pages/owner/component/slippage-tolerance/slippage-tolerance";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./swap.css";
import {
  buildTokenPairKey,
  calculateReceiveAmount,
  getBalanceToken,
} from "utils/helper";
import { useLedgerParty } from "context/ledger-context";
import { useToast } from "context/toastStore";
import SwapSubmitted from "pages/owner/component/swap-submitted/swap-submitted";

const Swap = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const { loading, rate, rateLoading, tokens, tokenPairs, loadingTokenLedger } =
    useTokenPair();
  const { createSwapRequest, createSwapRequestSetup } = useSwapRequest();
  const { selectedParty, isLoading, setIsLoading } = useLedgerParty();

  const defaultToken = location.state?.defaultToken;

  const [form, setForm] = useState({
    fromToken: "",
    toToken: "",
    amount: "",
    receiveAmount: "",
    slippage: 1.2,
  });

  const [submittedData, setSubmittedData] = useState<null | {
    fromToken: string;
    toToken: string;
    amount: string;
    receiveAmount: string;
  }>(null);

  useEffect(() => {
    if (defaultToken) {
      setForm((prev) => ({ ...prev, fromToken: defaultToken.symbol }));
    }
  }, [defaultToken]);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      receiveAmount: calculateReceiveAmount(
        rate,
        prev.fromToken,
        prev.toToken,
        prev.amount
      ),
    }));
  }, [form.fromToken, form.toToken, form.amount, rate]);

  const resetForm = () => {
    setForm({
      fromToken: "",
      toToken: "",
      amount: "",
      receiveAmount: "",
      slippage: 1.2,
    });
  };

  const handleSwap = async () => {
    const { fromToken, toToken, amount, receiveAmount, slippage } = form;

    if (!fromToken || !toToken || !amount) {
      toast.displayError("Please fill all fields");
      return;
    }

    if (!rate || !tokenPairs || tokenPairs.length === 0) {
      toast.displayError("Token pair not found.");
      return;
    }

    try {
      setIsLoading(true);

      const tokenPair = tokenPairs[0];
      const tokenPairKey = buildTokenPairKey(tokenPair);

      const inputTokenLedgerKey = {
        _1:
          fromToken === "BTC"
            ? tokenPair.payload.baseTokenKey._1
            : tokenPair.payload.quoteTokenKey._1,
        _2: selectedParty?.identifier ?? "",
        _3:
          fromToken === "BTC"
            ? tokenPair.payload.baseTokenKey._2
            : tokenPair.payload.quoteTokenKey._2,
      };

      const params = {
        swapper: selectedParty?.identifier ?? "",
        admin: tokenPair.payload.admin,
        liquidityProvider: tokenPair.payload.liquidityProvider,
        inputTokenLedgerKey,
        tokenPairKey,
        inputAmount: amount,
        expectedOutputAmount: receiveAmount,
        slippageTolerance: String(slippage / 100),
        registryKey: tokenPair.payload.registryKey,
      };

      const res = await createSwapRequestSetup(params);
      await createSwapRequest(res.contractId);

      toast.displaySuccess("Swap completed successfully!");
      setSubmittedData({
        fromToken: form.fromToken,
        toToken: form.toToken,
        amount: form.amount,
        receiveAmount: form.receiveAmount,
      });
      resetForm();
      setTimeout(() => setIsLoading(false), 1000);
    } catch (err) {
      console.error(err);
      toast.displayError("Swap failed");
      setIsLoading(false);
    }
  };

  if (
    loading ||
    rateLoading ||
    isLoading ||
    loadingTokenLedger ||
    tokens.length === 0
  ) {
    return <LoadingScreen />;
  }

  return (
    <MainLayout>
      <div className="swap-wrapper">
        <h2 className="swap-title">Swap Tokens</h2>
        <div className="swap-form">
          <p>You Pay</p>
          <select
            value={form.fromToken}
            onChange={(e) => setForm({ ...form, fromToken: e.target.value })}
          >
            <option value="">-- Select Token --</option>
            {tokens.map((token) => (
              <option key={token.symbol} value={token.symbol}>
                {token.name} ({token.symbol})
              </option>
            ))}
          </select>

          <input
            type="number"
            min="0"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            placeholder="Enter amount"
          />

          {form.fromToken && (
            <div className="balance-box">
              <span className="balance-text">
                Balance: {getBalanceToken(tokens, form.fromToken)}
              </span>
            </div>
          )}

          <div
            className="token-card-symbol"
            style={{ padding: "15px", margin: "auto" }}
          >
            <ArrowsUpDownIcon color="#6366f1" />
          </div>

          <p>You Receive</p>
          <select
            value={form.toToken}
            onChange={(e) => setForm({ ...form, toToken: e.target.value })}
          >
            <option value="">-- Select Token --</option>
            {tokens
              .filter((t) => t.symbol !== form.fromToken)
              .map((token) => (
                <option key={token.symbol} value={token.symbol}>
                  {token.name} ({token.symbol})
                </option>
              ))}
          </select>

          <input
            type="number"
            min="0"
            readOnly
            value={form.receiveAmount}
            placeholder="Receive amount"
          />

          {form.toToken && (
            <div className="balance-box">
              <span className="balance-text">
                Balance: {getBalanceToken(tokens, form.toToken)}
              </span>
            </div>
          )}

          <SlippageTolerance
            receiveAmount={form.receiveAmount}
            slippage={form.slippage}
            setSlippage={(val) => setForm({ ...form, slippage: val })}
          />

          <button className="swap-button2" onClick={handleSwap}>
            Swap
          </button>
        </div>

        {submittedData && submittedData.fromToken !== "" && (
          <SwapSubmitted
            inputAmount={submittedData.amount}
            inputToken={submittedData.fromToken}
            outputAmount={submittedData.receiveAmount}
            outputToken={submittedData.toToken}
            onGoDashboard={() => {
              setSubmittedData(null);
              navigate("/");
            }}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default Swap;
