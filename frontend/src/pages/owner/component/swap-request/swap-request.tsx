import "./swap-request.css";

export default function SwapRequest() {
  return (
    <div className="swap-requests-container">
      <h2 className="swap-request-title">My Swap Requests</h2>
      <table className="swap-table">
        <thead>
          <tr>
            <th>From</th>
            <th>To</th>
            <th>Input Amount</th>
            <th>Expected Output</th>
            <th>Liquidity Provider</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr className="pending-row">
            <td>USDT</td>
            <td>BTC</td>
            <td>1095.12</td>
            <td>0.010000</td>
            <td>LiquidityProvider</td>
            <td>
              <span className="status pending">Pending</span>
            </td>
            <td>
              <button className="btn cancel">Cancel Swap</button>
            </td>
          </tr>
          <tr className="pending-row">
            <td>ETH</td>
            <td>USDT</td>
            <td>1.5</td>
            <td>4165.50</td>
            <td>LiquidityProvider</td>
            <td>
              <span className="status pending">Pending</span>
            </td>
            <td>
              <button className="btn cancel">Cancel Swap</button>
            </td>
          </tr>
          <tr className="accepted-row">
            <td>BTC</td>
            <td>USDT</td>
            <td>0.005</td>
            <td>547.415</td>
            <td>LiquidityProvider</td>
            <td>
              <span className="status accepted">Accepted</span>
            </td>
            <td>
              <button className="btn claim">Claim</button>
            </td>
          </tr>
          <tr>
            <td>SOL</td>
            <td>USDT</td>
            <td>10.0</td>
            <td>2770.00</td>
            <td>LiquidityProvider</td>
            <td>
              <span className="status completed">Completed</span>
            </td>
            <td>-</td>
          </tr>
          <tr>
            <td>BNB</td>
            <td>BTC</td>
            <td>2.0</td>
            <td>0.050000</td>
            <td>LiquidityProvider</td>
            <td>
              <span className="status completed">Completed</span>
            </td>
            <td>-</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
