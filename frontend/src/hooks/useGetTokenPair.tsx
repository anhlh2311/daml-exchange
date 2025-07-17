import { useEffect, useState } from "react";
import { useLedger, useQuery, useParty } from "@daml/react";
import { TokenPair } from "@daml.js/exchange-0.0.1/lib/Exchange/TokenPair";
import { useLedgerParty } from "context/ledger-context";

export const useTokenPair = () => {
  const ledger = useLedger();
  const { contracts, loading } = useQuery(TokenPair);
  const { selectedParty } = useLedgerParty();

  const [rate, setRate] = useState<{
    sellingPrice: string;
    buyingPrice: string;
  } | null>(null);
  const [rateLoading, setRateLoading] = useState(false);

  useEffect(() => {
    const fetchRate = async () => {
      if (!contracts || contracts.length === 0) return;

      setRateLoading(true);
      try {
        const res = (await ledger.exercise(
          TokenPair.GetRate,
          contracts[0].contractId,
          { requester: selectedParty?.identifier ?? "" }
        )) as any;
        const sellingPrice = res?.[0]?._1;
        const buyingPrice = res?.[0]?._2;

        setRate({ sellingPrice, buyingPrice });
      } catch (err) {
        console.error(err);
      } finally {
        setRateLoading(false);
      }
    };

    fetchRate();
  }, [contracts, ledger]);

  return {
    tokenPairs: contracts,
    rate,
    rateLoading,
    loading,
  };
};
