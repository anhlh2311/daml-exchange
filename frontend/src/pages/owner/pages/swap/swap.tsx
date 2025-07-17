import MainLayout from "components/layout/main-layout";
import LoadingScreen from "components/loading/loading";
import { useTokenPair } from "hooks/useGetTokenPair";
import { SlippageTolerance } from "pages/owner/component/slippage-tolerance/slippage-tolerance";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./swap.css";
import { ArrowsUpDownIcon } from "@heroicons/react/20/solid";

const allTokens = [
  { symbol: "USDC", name: "USD Coin" },
  { symbol: "BTC", name: "Bitcoin" },
];

const Swap = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { loading, rate, rateLoading, tokenPairs } = useTokenPair();
  console.log({ tokenPairs });

  const defaultToken = location.state?.defaultToken;

  const [fromToken, setFromToken] = useState("");
  const [toToken, setToToken] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (defaultToken) {
      setFromToken(defaultToken.symbol);
    }
  }, [defaultToken]);

  const handleSwap = () => {
    if (!fromToken || !toToken || !amount) {
      alert("Please fill all fields.");
      return;
    }
    alert(`Swapping ${amount} ${fromToken} → ${toToken}`);
  };
  if (loading) {
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
            onChange={(e) => setFromToken(e.target.value)}
          >
            <option value="">-- Select Token --</option>
            {allTokens.map((token) => (
              <option key={token.symbol} value={token.symbol}>
                {token.name} ({token.symbol})
              </option>
            ))}
          </select>

          <input
            type="number"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
          />
          <div
            className="token-card-symbol"
            style={{ padding: "15px", margin: "auto" }}
          >
            <ArrowsUpDownIcon color="#6366f1" />
          </div>
          <p>You Receive</p>
          <select value={toToken} onChange={(e) => setToToken(e.target.value)}>
            <option value="">-- Select Token --</option>
            {allTokens
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
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
          />
          <SlippageTolerance />

          <button className="swap-button2" onClick={handleSwap}>
            Swap
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Swap;
