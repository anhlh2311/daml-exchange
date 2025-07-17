import DamlLedger from "@daml/react";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Role } from "stores/authStore";
import { authConfig, Insecure } from "utils/helper";
import { Party } from "utils/model";

interface LedgerContextType {
  selectedParty: Party | null;
  setSelectedParty: (party: Party | null) => void;
  token: string;
  role: Role;
  setRole: (role: Role) => void;
}

interface Props {
  children: ReactNode;
}

const LedgerContext = createContext<LedgerContextType | undefined>(undefined);

export const useLedgerParty = (): LedgerContextType => {
  const ctx = useContext(LedgerContext);
  if (!ctx) {
    throw new Error("useLedgerParty must be used within a LedgerProvider");
  }
  return ctx;
};

export const LedgerProvider: React.FC<Props> = ({ children }) => {
  const [selectedParty, setSelectedParty] = useState<Party | null>(null);
  const [role, setRole] = useState<Role>(null);

  const token = (authConfig as Insecure).makeToken(
    selectedParty?.displayName ?? "Admin"
  );
  return (
    <LedgerContext.Provider
      value={{ selectedParty, setSelectedParty, token, role, setRole }}
    >
      {selectedParty ? (
        <DamlLedger
          party={selectedParty.displayName}
          token={token}
          httpBaseUrl="http://localhost:3000/api/"
        >
          {children}
        </DamlLedger>
      ) : (
        <DamlLedger
          party="Admin"
          token={token}
          httpBaseUrl="http://localhost:3000/api/"
        >
          {children}
        </DamlLedger>
      )}
    </LedgerContext.Provider>
  );
};
