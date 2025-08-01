import RecentActivity from "components/recent-activity/recent-activity";
import { dataTokens } from "utils/dataMock";
import "./token-and-activity.css";

function TokenAndActivity() {
  return (
    <div className="token-container">
      <div className="token-card-activity">
        <h2 className="token-title-activity">Token Listing Requests</h2>
        <div className="token-table-wrapper">
          <table className="token-table">
            <thead>
              <tr className="token-table-header">
                <th className="token-table-cell">Token</th>
                <th className="token-table-cell">Owner</th>
                <th className="token-table-cell">Symbol</th>
                <th className="token-table-cell">Decimals</th>
                <th className="token-table-cell">Action</th>
              </tr>
            </thead>
            <tbody>
              {dataTokens.map(([token, owner, symbol, decimals], i) => (
                <tr key={i} className="table-row">
                  <td className="table-cell">{token}</td>
                  <td className="table-cell">{owner}</td>
                  <td className="table-cell">{symbol}</td>
                  <td className="table-cell">{decimals}</td>
                  <td className="table-cell">
                    <div className="button-group">
                      <button className="button-approve">Approve</button>
                      <button className="button-reject">Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <RecentActivity />
    </div>
  );
}
export default TokenAndActivity;
