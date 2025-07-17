import BoxSystemOverView from "components/box-overview/box-system-overview";
import MainLayout from "components/layout/main-layout";
import RecentActivity from "components/recent-activity/recent-activity";
import { useAuthStore } from "stores/authStore";
import { metrics, metricsProvider } from "utils/dataMock";
import QuickAction from "./component/quick-action/quick-action";
import "./index.css";
import SwapRequest from "./component/swap-request/swap-request";

const Owner = () => {
  const { role } = useAuthStore();
  const isProvider = role === "liquidity";

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

        {/* {role === "liquidity" ? (
          <TokenTransfersTable />
        ) : (
          <> */}
        {/* <PendingSwap />
        <SwapHistory /> */}
        {/* </>
        )} */}
        <SwapRequest />
        <RecentActivity />

        {/* <div className="activity-grid">
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
        </div> */}
      </div>
    </MainLayout>
  );
};

export default Owner;
