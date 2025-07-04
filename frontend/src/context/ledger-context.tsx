// src/context/LedgerContext.tsx
import DamlLedger from "@daml/react";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { authConfig, Insecure } from "utils/helper";
import { Party } from "utils/model";

interface LedgerContextType {
  selectedParty: Party | null;
  setSelectedParty: (party: Party | null) => void;
  token: string;
}

const LedgerContext = createContext<LedgerContextType | undefined>(undefined);

export const useLedgerParty = (): LedgerContextType => {
  const ctx = useContext(LedgerContext);
  if (!ctx) {
    throw new Error("useLedgerParty must be used within a LedgerProvider");
  }
  return ctx;
};

interface Props {
  children: ReactNode;
}

export const LedgerProvider: React.FC<Props> = ({ children }) => {
  const [selectedParty, setSelectedParty] = useState<Party | null>(null);
  const token = (authConfig as Insecure).makeToken(
    selectedParty?.displayName ?? "Admin"
  );
  return (
    <LedgerContext.Provider value={{ selectedParty, setSelectedParty, token }}>
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
