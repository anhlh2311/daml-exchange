import { dataTokenAndActivity } from "utils/dataMock";
import "./recent-activity.css";

const RecentActivity = () => {
  return (
    <div className="recent-activity">
      <h2 className="recent-activity-title">Recent Activity</h2>
      <div className="table-container">
        <table className="activity-table">
          <thead>
            <tr className="table-header">
              <th>Action</th>
              <th>Parties</th>
              <th>Tokens</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {dataTokenAndActivity.map(
              ([action, parties, tokens, amount, status, time], i) => (
                <tr key={i} className="table-row">
                  <td>{action}</td>
                  <td>{parties}</td>
                  <td>{tokens}</td>
                  <td>{amount}</td>
                  <td>
                    <span className="status-label">{status}</span>
                  </td>
                  <td>{time}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentActivity;
