import { TokenLedger } from "@daml.js/exchange-0.0.1/lib/Currency/TokenLedger";

import { useParty, useQuery } from "@daml/react";
import LoadingScreen from "components/loading/loading";
import { useLedgerParty } from "../context/ledger-context";
import TokenCard from "components/token-card/token-card";
import "./ledger-assets.css";
import Empty from "components/empty/empty";
import { useNavigate } from "react-router-dom";
import Header from "components/header/header";

const LedgerAssets = () => {
  const { selectedParty } = useLedgerParty();
  const party = useParty();
  const navigate = useNavigate();
  const { contracts: tokenLedgers, loading } = useQuery(
    TokenLedger,
    () => ({ holder: selectedParty?.identifier }),
    [party]
  );

  const handleSwapClick = () => {
    navigate("/swap");
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (tokenLedgers.length === 0) {
    return (
      <>
        <div className="header">
          <Header />
        </div>
        <Empty />
      </>
    );
  }

  if (!selectedParty) {
    return null;
  }

  return (
    <div className="assets-wrapper">
      <div className="assets-header">
        <h2 className="assets-title">Assets of {selectedParty.displayName}</h2>
        <div className="group-btn">
          <button className="swap-button" onClick={handleSwapClick}>
            🔁 Swap
          </button>
          <Header />
        </div>
      </div>
      <div className="token-grid">
        {tokenLedgers.map((token) => (
          <TokenCard key={token.contractId} token={token} />
        ))}
      </div>
    </div>
  );
};

export default LedgerAssets;
