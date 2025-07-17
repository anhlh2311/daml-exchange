import { dataTokenTransfer } from "utils/dataMock";
import "./token-transfers.css";

type Transfer = {
  type: string;
  token: string;
  amount: number;
  counterparty: string;
  message: string;
  status: string;
};

interface Props {
  transfer: Transfer;
  isPending: boolean;
}

export function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    Pending: "status-pending",
    Completed: "status-completed",
    Rejected: "status-rejected",
    Cancelled: "status-cancelled",
  };

  return (
    <span className={`status-badge ${colorMap[status] || "status-default"}`}>
      {status}
    </span>
  );
}

export function TransferRow({ transfer, isPending }: Props) {
  return (
    <tr className={`transfer-row ${isPending ? "row-pending" : "row-default"}`}>
      <td className="cell bold">{transfer.type}</td>
      <td className="cell">{transfer.token}</td>
      <td className="cell">{transfer.amount}</td>
      <td className="cell">{transfer.counterparty}</td>
      <td className="cell">{transfer.message || "-"}</td>
      <td className="cell">
        <StatusBadge status={transfer.status} />
      </td>
      <td className="cell actions">
        {transfer.status === "Pending" && (
          <>
            {transfer.type === "Incoming" ? (
              <>
                <button className="btn accept">Accept</button>
                <button className="btn reject">Reject</button>
              </>
            ) : (
              <button className="btn cancel">Cancel</button>
            )}
          </>
        )}
      </td>
    </tr>
  );
}

export function TokenTransfersTable() {
  return (
    <div className="token-table-container">
      <h2 className="token-table-title">Token Transfers</h2>
      <table className="token-table">
        <thead>
          <tr className="table-header">
            <th className="cell">Type</th>
            <th className="cell">Token</th>
            <th className="cell">Amount</th>
            <th className="cell">Counterparty</th>
            <th className="cell">Message</th>
            <th className="cell">Status</th>
            <th className="cell">Action</th>
          </tr>
        </thead>
        <tbody>
          {dataTokenTransfer.map((t, idx) => (
            <TransferRow
              key={idx}
              transfer={t}
              isPending={t.status === "Pending"}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
