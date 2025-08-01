import React from "react";
import "./pending-table.css";

type Column = {
  title: string;
  key: string;
  render?: (value: any, row: any) => React.ReactNode;
};

interface PendingTableProps {
  title: string;
  columns: Column[];
  data: any[];
}

const PendingTable: React.FC<PendingTableProps> = ({
  title,
  columns,
  data,
}) => {
  return (
    <div className="swap-table-container">
      <h2 className="swap-table-title">{title}</h2>
      <div className="swap-table-wrapper">
        <table className="swap-table">
          <thead>
            <tr className="swap-table-header-row">
              {columns.map((col) => (
                <th key={col.key} className="swap-table-header-cell">
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="swap-table-row">
                {columns.map((col) => (
                  <td key={col.key} className="swap-table-cell">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingTable;
