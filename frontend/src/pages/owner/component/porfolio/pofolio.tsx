import { useQuery } from "@daml/react";
import "./portfolio.css";
import { TokenLedger } from "@daml.js/exchange-0.0.1/lib/Currency/TokenLedger";
import { useLedgerParty } from "context/ledger-context";

export const TokenPortfolio = () => {
  const { selectedParty } = useLedgerParty();

  const { contracts: tokenLedgers, loading } = useQuery(
    TokenLedger,
    () => ({ holder: selectedParty?.identifier }),
    []
  );

  const tokenData = tokenLedgers.map((item) => ({
    name: item.payload.metadata.name,
    symbol: item.payload.symbol,
    balance: parseFloat(item.payload.amount),
    value: parseFloat(item.payload.amount),
  }));
  const totalValue = tokenData.reduce((acc, t) => acc + t.value, 0).toFixed(2);
  const tokenTypes = tokenData.length;

  return (
    <div className="portfolio-container">
      <div className="portfolio-summary">
        <div>
          <p>Total Value:</p>
          <h2>${totalValue}</h2>
        </div>
        <div style={{ textAlign: "center" }}>
          <p>Token Types:</p>
          <h2>{tokenTypes}</h2>
        </div>
      </div>

      <table className="portfolio-table">
        <thead>
          <tr>
            <th>Token</th>
            <th>Symbol</th>
            <th>Balance</th>
            {/* <th>Value (USD)</th> */}
          </tr>
        </thead>
        <tbody>
          {tokenData.map((token, idx) => (
            <tr key={idx}>
              <td>
                <div className="token-cell">
                  <div
                    className={`token-icon ${token.symbol.toLowerCase()}`}
                  ></div>
                  {token.name}
                </div>
              </td>
              <td>
                <strong>{token.symbol}</strong>
              </td>
              <td>{token.balance}</td>
              {/* <td>${token.value.toFixed(2)}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
