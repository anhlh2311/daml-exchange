import { pendingData } from "utils/dataMock";
import "./pending-swap.css";
import PendingTable from "components/pending-table/pending-table";

export default function PendingSwap() {
  const columns = [
    { title: "Swapper", key: "swapper" },
    { title: "Pair", key: "pair" },
    { title: "Input", key: "input" },
    { title: "Expected Output", key: "output" },
    { title: "Rate", key: "rate" },
    {
      title: "Action",
      key: "action",
      render: (_: any, row: any) => (
        <div className="action-buttons-pending">
          <button
            onClick={() => {
              alert(`Accept ${row.swapper}`);
            }}
            className="accept-btn-pending"
          >
            Accept
          </button>
          <button
            onClick={() => {
              alert(`Reject ${row.swapper}`);
            }}
            className="reject-btn-pending"
          >
            Reject
          </button>
        </div>
      ),
    },
  ];

  return (
    <PendingTable
      title="Pending Swap Requests"
      columns={columns}
      data={pendingData}
    />
  );
}
