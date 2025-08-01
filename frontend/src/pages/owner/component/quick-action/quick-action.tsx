import ActionCard from "components/card/action-card";
import "./quick-action.css";
import { useNavigate } from "react-router-dom";

function QuickAction() {
  const navigate = useNavigate();

  return (
    <div className="quick-action-container">
      <h2 className="quick-action-title">Quick Actions</h2>
      <div className="quick-action-grid">
        {/* <ActionCard
          title="Create New Token"
          desc="Create a new token with metadata"
          button="Create"
        />
        <ActionCard
          title="Mint Tokens"
          desc="Increase token supply"
          button="Mint"
        />
        <ActionCard
          title="Burn Tokens"
          desc="Reduce token supply"
          button="Burn"
        />
        <ActionCard
          title="Request Listing"
          desc="Submit token for exchange listing"
          button="Request"
        /> */}
        {/* <ActionCard
          title="Transfer Tokens"
          desc="Send tokens to another party"
          button="Transfer"
        /> */}
        <ActionCard
          onClick={() => navigate("/swap")}
          title="Initiate Swap"
          desc="Exchange tokens for other tokens"
          button="Swap"
        />
      </div>
    </div>
  );
}
export default QuickAction;
