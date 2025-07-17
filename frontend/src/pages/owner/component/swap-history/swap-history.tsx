import PendingTable from "components/pending-table/pending-table";
import { historyData } from "utils/dataMock";
import "./swap-history.css";

export default function SwapHistory() {
  const columns = [
    { title: "Date", key: "date" },
    { title: "Swapper", key: "swapper" },
    { title: "Pair", key: "pair" },
    { title: "Input", key: "input" },
    { title: "Output", key: "output" },
    { title: "Rate", key: "rate" },
    {
      title: "Status",
      key: "status",
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          Completed: "completed",
          Rejected: "rejected",
          Cancelled: "cancelled",
        };

        return (
          <span className={`status-label ${colorMap[status]}`}>{status}</span>
        );
      },
    },
  ];

  return (
    <PendingTable title="Swap History" columns={columns} data={historyData} />
  );
}
