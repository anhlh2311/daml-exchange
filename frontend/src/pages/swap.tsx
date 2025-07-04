import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./swap.css";

const allTokens = [
  { symbol: "USDC", name: "USD Coin" },
  { symbol: "BTC", name: "Bitcoin" },
];

const Swap = () => {
  const location = useLocation();
  const navigate = useNavigate();

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
    // Thực hiện gọi ledger ở đây
  };

  return (
    <div className="swap-wrapper">
      <button className="back-button" onClick={() => navigate(-1)}>
        Back
      </button>
      <h2 className="swap-title">Swap Tokens</h2>

      <div className="swap-form">
        <label>
          From Token:
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
        </label>

        <label>
          To Token:
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
        </label>

        <label>
          Amount:
          <input
            type="number"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
          />
        </label>

        <button className="swap-button2" onClick={handleSwap}>
          🔁 Swap
        </button>
      </div>
    </div>
  );
};

export default Swap;
