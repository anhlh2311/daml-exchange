import { ArrowsUpDownIcon } from "@heroicons/react/20/solid";
import MainLayout from "components/layout/main-layout";
import LoadingScreen from "components/loading/loading";
import { useSwapRequest } from "hooks/useCreateSwapRequest";
import { useTokenPair } from "hooks/useGetTokenPair";
import { SlippageTolerance } from "pages/owner/component/slippage-tolerance/slippage-tolerance";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./swap.css";
import { getBalanceToken } from "utils/helper";
import { useLedgerParty } from "context/ledger-context";

const Swap = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { loading, rate, rateLoading, tokens, tokenPairs } = useTokenPair();
  const { createSwapRequest, createSwapRequestSetup } = useSwapRequest();
  const defaultToken = location.state?.defaultToken;
  const { selectedParty } = useLedgerParty();

  const [fromToken, setFromToken] = useState<string>("");
  const [toToken, setToToken] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [slippage, setSlippage] = useState(1.2);

  const handleSwap = async () => {
    if (!fromToken || !toToken || !amount) {
      alert("Please fill all fields.");
      return;
    }

    if (!rate || !tokenPairs || tokenPairs.length === 0) {
      alert("Token pair not found.");
      return;
    }

    try {
      const tokenPair = tokenPairs[0];
      const tokenPairKey = {
        _1: tokenPair.payload.admin,
        _2: tokenPair.payload.baseTokenKey,
        _3: tokenPair.payload.quoteTokenKey,
      };

      const params = {
        swapper: selectedParty?.identifier ?? "",
        admin: tokenPair.payload.admin,
        liquidityProvider: tokenPair.payload.liquidityProvider,
        inputTokenLedgerKey: {
          _1:
            fromToken === "BTC"
              ? tokenPair.payload.baseTokenKey._1
              : tokenPair.payload.quoteTokenKey._1,
          _2: selectedParty?.identifier ?? "",
        },
        tokenPairKey: tokenPairKey,
        inputAmount: amount,
        expectedOutputAmount: receiveAmount,
        slippageTolerance: String(slippage / 100),
        registryKey: tokenPair.payload.registryKey,
      };

      const res = await createSwapRequestSetup(params);
      const setupContractId = res.contractId;

      const swapResult = await createSwapRequest(setupContractId);

      alert("Swap completed successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Swap failed");
    }
  };

  useEffect(() => {
    if (defaultToken) {
      setFromToken(defaultToken.symbol);
    }
  }, [defaultToken]);

  useEffect(() => {
    if (!rate || !fromToken || !toToken || !amount) {
      setReceiveAmount("");
      return;
    }

    const amountNumber = parseFloat(amount);
    const sellingPrice = parseFloat(rate.sellingPrice);
    const buyingPrice = parseFloat(rate.buyingPrice);

    let result = 0;

    if (fromToken === "BTC" && toToken === "USDC") {
      result = amountNumber * buyingPrice;
    } else if (fromToken === "USDC" && toToken === "BTC") {
      result = amountNumber / sellingPrice;
    } else {
      result = 0;
    }

    setReceiveAmount(result.toFixed(6));
  }, [fromToken, toToken, amount, rate]);

  if (loading || rateLoading) {
    return <LoadingScreen />;
  }

  return (
    <MainLayout>
      <div className="swap-wrapper">
        <h2 className="swap-title">Swap Tokens</h2>
        <div className="swap-form">
          <p>You Pay</p>
          <select
            value={fromToken}
            onChange={(e) => {
              setFromToken(e.target.value);
            }}
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
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
            }}
            placeholder="Enter amount"
          />
          {fromToken ? (
            <div className="balance-box">
              <span className="balance-text">
                Balance: {getBalanceToken(tokens, fromToken)}
              </span>
            </div>
          ) : null}

          <div
            className="token-card-symbol"
            style={{ padding: "15px", margin: "auto" }}
          >
            <ArrowsUpDownIcon color="#6366f1" />
          </div>
          <p>You Receive</p>
          <select
            value={toToken}
            onChange={(e) => {
              setToToken(e.target.value);
            }}
          >
            <option value="">-- Select Token --</option>
            {tokens
              .filter((t) => t.symbol !== fromToken)
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
            value={receiveAmount}
            placeholder="Receive amount"
          />
          {toToken ? (
            <div className="balance-box">
              <span className="balance-text">
                Balance: {getBalanceToken(tokens, toToken)}
              </span>
            </div>
          ) : null}
          <SlippageTolerance
            receiveAmount={receiveAmount}
            slippage={slippage}
            setSlippage={setSlippage}
          />

          <button className="swap-button2" onClick={handleSwap}>
            Swap
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Swap;
