import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import { getRoleFromDisplayName } from "utils/helper";
import { Party } from "utils/model";
import { useLedgerParty } from "../../context/ledger-context";
import "./party-selector.css";

const PartySelector = () => {
  const { setSelectedParty, token, selectedParty, setRole } = useLedgerParty();
  const [listParties, setListParties] = useState<Party[]>([]);
  // const navigate = useNavigate();

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

  const handleSelectParty = (selected: Party) => {
    setSelectedParty(selected);
    const role = getRoleFromDisplayName(selected.displayName);

    setRole(role);

    // if (role === "admin") {
    //   navigate("/admin");
    // } else {
    //   navigate("/");
    // }
  };

  return (
    <div className="party-selector-container">
      <Listbox value={selectedParty} onChange={handleSelectParty}>
        {({ open }) => (
          <>
            <div className="party-selector-wrapper">
              <ListboxButton className="party-selector-button">
                <span className="party-selector-content">Select party</span>
                <span className="party-chevron">
                  <ChevronDownIcon
                    className="chevron-icon"
                    aria-hidden="true"
                  />
                </span>
              </ListboxButton>

              <Transition
                show={open}
                as="div"
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <ListboxOptions className="party-options">
                  {listParties.map((party) => (
                    <ListboxOption
                      key={party.identifier}
                      className={({ active }) =>
                        active
                          ? "party-option party-option-active"
                          : "party-option"
                      }
                      value={party}
                    >
                      {({ selected, active }) => (
                        <>
                          <div className="party-option-content">
                            <span
                              className={`party-option-name ${
                                selected ? "selected" : ""
                              }`}
                            >
                              {party.displayName}
                            </span>
                          </div>

                          {selected && (
                            <span
                              className={`party-option-check ${
                                active ? "active" : ""
                              }`}
                            >
                              <CheckIcon
                                className="check-icon"
                                aria-hidden="true"
                              />
                            </span>
                          )}
                        </>
                      )}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
    </div>
  );
};

export default PartySelector;
