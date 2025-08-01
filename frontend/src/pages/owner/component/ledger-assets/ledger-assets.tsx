import { TokenLedger } from "@daml.js/exchange-0.0.1/lib/Currency/TokenLedger";

import { useParty, useQuery } from "@daml/react";
import Empty from "components/empty/empty";
import LoadingScreen from "components/loading/loading";
import { useLedgerParty } from "../../../../context/ledger-context";
import "./ledger-assets.css";
import { useAuthStore } from "stores/authStore";
import MainLayout from "components/layout/main-layout";
import BoxSystemOverView from "components/box-overview/box-system-overview";
import { metrics, metricsProvider } from "utils/dataMock";
import QuickAction from "../quick-action/quick-action";
import { TokenTransfersTable } from "../token-transfer/token-transfers";
import PendingSwap from "../pending-swap/pending-swap";
import SwapHistory from "../swap-history/swap-history";
import RecentActivity from "components/recent-activity/recent-activity";
import { Link } from "react-router-dom";

const LedgerAssets = () => {
  const { selectedParty } = useLedgerParty();
  const { role } = useAuthStore();
  const isProvider = role === "liquidity";
  const party = useParty();
  const { contracts: tokenLedgers, loading } = useQuery(
    TokenLedger,
    () => ({ holder: selectedParty?.identifier }),
    [party]
  );

  if (loading) {
    return <LoadingScreen />;
  }

  if (!selectedParty) {
    return null;
  }

  return (
    <MainLayout>
      <div className="dashboard-container">
        <div className="overview-container-owner">
          <div className={`overview-left ${isProvider ? "provider-full" : ""}`}>
            <BoxSystemOverView
              data={isProvider ? metricsProvider : metrics}
              title={isProvider ? "Swap Response Overview" : "Token Management"}
            />
          </div>
          <div className={`overview-right ${isProvider ? "hidden" : ""}`}>
            <QuickAction />
          </div>
        </div>

        {role === "liquidity" ? (
          <TokenTransfersTable />
        ) : (
          <>
            <PendingSwap />
            <SwapHistory />
          </>
        )}

        <div className="activity-grid">
          <div className="activity-main">
            <RecentActivity />
          </div>

          <div className="activity-side">
            <div className="token-holdings">
              <div className="token-holdings-header">
                <h3>Token Holdings</h3>
                <p>Your current token balances.</p>
              </div>
              <div className="token-holdings-content">
                <div className="token-item">
                  <div className="token-info">
                    <div className="token-icon-owner usd">$</div>
                    <div className="token-text">
                      <h4>USD Token</h4>
                      <p>US Dollar</p>
                    </div>
                  </div>
                  <div className="token-amount">
                    <p>1,000</p>
                    <span>$1,000.00</span>
                  </div>
                </div>

                <div className="token-item">
                  <div className="token-info">
                    <div className="token-icon eur">€</div>
                    <div className="token-text">
                      <h4>EUR Token</h4>
                      <p>Euro</p>
                    </div>
                  </div>
                  <div className="token-amount">
                    <p>500</p>
                    <span>€500.00</span>
                  </div>
                </div>

                <div className="token-item">
                  <div className="token-info">
                    <div className="token-icon gbp">£</div>
                    <div className="token-text">
                      <h4>GBP Token</h4>
                      <p>British Pound</p>
                    </div>
                  </div>
                  <div className="token-amount">
                    <p>250</p>
                    <span>£250.00</span>
                  </div>
                </div>
              </div>

              <div className="view-all">
                <Link replace to="/tokens">
                  View All Tokens
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default LedgerAssets;
