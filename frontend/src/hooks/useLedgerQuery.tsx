import { useEffect, useState } from "react";
import { useLedger } from "@daml/react";

export function useLedgerQuery(template: any, contractId: any) {
  const ledger = useLedger();
  const [contract, setContract] = useState<any>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const result = await ledger.fetch(template, contractId);
        console.log({ result });

        setContract(result);
      } catch (err) {
        console.error("Failed to fetch contract:", err);
      }
    };
    fetch();
  }, [contractId, ledger, template]);

  return { contract };
}
