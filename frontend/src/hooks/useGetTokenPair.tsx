import { TokenPair } from "@daml.js/exchange-0.0.1/lib/Exchange/TokenPair";
import { useLedger, useQuery } from "@daml/react";
import { useLedgerParty } from "context/ledger-context";
import { useEffect, useState } from "react";
import { TokenLedger } from "@daml.js/exchange-0.0.1/lib/Currency/TokenLedger";
import { getBalanceToken } from "utils/helper";

export interface ListTokenProps {
  symbol: string;
  name: string;
  balance: string;
}
export const useTokenPair = () => {
  const ledger = useLedger();
  const { contracts, loading } = useQuery(TokenPair);
  const { contracts: tokenLedgers, loading: loadingTokenLedger } = useQuery(
    TokenLedger,
    () => ({ holder: selectedParty?.identifier }),
    []
  );
  const tokens: ListTokenProps[] = tokenLedgers.map((item) => {
    return {
      symbol: item.payload.symbol,
      name: item.payload.metadata.name,
      balance: item.payload.amount,
    };
  });
  /*
      const { contracts: tokenLedgers, loading: loadingTokenLedger } = useQuery(
    TokenLedger,
    () => ({ holder: selectedParty?.identifier }),
    []
  );
  const { selectedParty } = useLedgerParty();
  const [listTokenPairs, setListTokenPairs] = useState<ListTokenProps[]>([]);
  const [rate, setRate] = useState<{
    sellingPrice: string;
    buyingPrice: string;
  } | null>(null);
  const [rateLoading, setRateLoading] = useState(false);
  const tokens: ListTokenProps[] = tokenLedgers.map((item) => {
    return {
      symbol: item.payload.symbol,
      name: item.payload.metadata.name,
      balance: item.payload.amount,
    };
  });
    */
  const { selectedParty } = useLedgerParty();
  const [listTokens, setListTokens] = useState<ListTokenProps[]>([]);
  const [rate, setRate] = useState<{
    sellingPrice: string;
    buyingPrice: string;
  } | null>(null);
  const [rateLoading, setRateLoading] = useState(false);

  useEffect(() => {
    const fetchRate = async () => {
      if (!contracts || contracts.length === 0) return;
      const listToken: ListTokenProps[] = [
        {
          symbol: contracts[0].key._2._2,
          name: "Bitcoin",
          balance: getBalanceToken(tokens, contracts[0].key._2._2),
        },
        {
          symbol: contracts[0].key._3._2,
          name: "USD Coin",
          balance: getBalanceToken(tokens, contracts[0].key._3._2),
        },
      ];
      console.log({ listToken });

      setListTokens(listToken);
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
    tokens: listTokens,
  };
};
