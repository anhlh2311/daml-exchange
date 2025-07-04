import { useEffect, useState } from "react";
import { Party } from "utils/model";
import { useLedgerParty } from "../context/ledger-context";
import "./party-selector.css";

const PartySelector = () => {
  const { setSelectedParty, token } = useLedgerParty();
  const [listParties, setListParties] = useState<Party[]>([]);

  useEffect(() => {
    const fetchParties = async () => {
      const res = await fetch("/api/v1/parties", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error("Failed to fetch parties:", res.status, await res.text());
        return;
      }

      const result = await res.json();
      setListParties(result.result as Party[]);
    };

    fetchParties();
  }, [token]);

  const handleSelectParty = (e: any) => {
    e.preventDefault();
    const selectedId = e.target.value;

    const selectedParty = listParties.find((p) => p.identifier === selectedId);

    if (selectedParty) {
      setSelectedParty({
        identifier: selectedParty.identifier,
        displayName: selectedParty.displayName,
      });
    }
  };

  return (
    <select
      className="party-dropdown"
      onChange={(e) => handleSelectParty(e)}
      defaultValue=""
    >
      <option value="" disabled>
        Select a party
      </option>
      {listParties.map((c) => (
        <option key={c.identifier} value={c.identifier}>
          {c.displayName}
        </option>
      ))}
    </select>
  );
};

export default PartySelector;
