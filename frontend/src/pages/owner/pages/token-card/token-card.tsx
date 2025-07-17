import { useParty, useQuery } from "@daml/react";
import MainLayout from "components/layout/main-layout";
import TokenCard from "components/token-card/token-card";
import { TokenLedger } from "@daml.js/exchange-0.0.1/lib/Currency/TokenLedger";
import { useLedgerParty } from "context/ledger-context";
import "./token-card.css";

const TokenCardPage = () => {
  const { selectedParty } = useLedgerParty();
  const party = useParty();

  const { contracts: tokenLedgers, loading } = useQuery(
    TokenLedger,
    () => ({ holder: selectedParty?.identifier }),
    [party]
  );

  return (
    <MainLayout>
      <div className="token-container">
        <div className="token-box">
          <div className="token-header">
            <h3 className="token-title">Your Tokens</h3>
            <p className="token-subtitle">Token balances and operations.</p>
          </div>
          <div className="token-body">
            <div className="token-grid">
              {tokenLedgers.length > 0 ? (
                tokenLedgers.map((item) => (
                  <TokenCard data={item} key={item.contractId} />
                ))
              ) : (
                <TokenCard isEmpty />
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TokenCardPage;
