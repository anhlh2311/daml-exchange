import ActionCard from "components/card/action-card";
import "./quick-actions.css";

function QuickActions() {
  return (
    <div className="quick-actions-container">
      <h2 className="quick-actions-title">Quick Actions</h2>
      <div className="quick-actions-grid">
        <ActionCard
          title="Register New Party"
          desc="Add new participants to the system"
          button="Register Party"
        />
        <ActionCard
          title="Create Trading Pair"
          desc="Set up new trading pairs with exchange rates"
          button="Create Pair"
        />
        <ActionCard
          title="Update Exchange Rates"
          desc="Modify buying and selling prices"
          button="Update Rates"
        />
      </div>
    </div>
  );
}
export default QuickActions;
