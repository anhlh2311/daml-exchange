import { useLedgerParty } from "context/ledger-context";
import { useToast } from "context/toastStore";
import { useSwapRequestAction } from "hooks/useSwapRequestAction";
import "./swap-request.css";

export default function SwapRequest() {
  const { contracts, finalizeSwap } = useSwapRequestAction();
  const { setIsLoading } = useLedgerParty();
  const toast = useToast();

  const handleClaim = (id: any) => {
    try {
      finalizeSwap(id);
      setIsLoading(true);
      toast.displaySuccess("Claimed successful");
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.log({ error });
      toast.displayError("Error when finalize swap");
      setIsLoading(false);
    }
  };

  return (
    <div className="swap-requests-container">
      <h2 className="swap-request-title">My Swap Requests</h2>
      <table className="swap-table">
        <thead>
          <tr>
            <th>From</th>
            <th>To</th>
            <th>Input Amount</th>
            <th>Expected Output</th>
            <th>Liquidity Provider</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {contracts.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                style={{ textAlign: "center", padding: "1rem", color: "#888" }}
              >
                Empty
              </td>
            </tr>
          ) : (
            contracts.map((item, idx) => {
              const payload = item.payload;
              const from = payload.tokenPairKey._3._2;
              const to = payload.tokenPairKey._2._2;
              const inputAmount = Number(payload.inputAmount).toFixed(2);
              const expectedOutput = Number(
                payload.expectedOutputAmount
              ).toFixed(6);
              const liquidityProvider =
                payload.liquidityProvider.split("::")[0];
              const status =
                payload.outputTokenLockCid !== null ? "Accepted" : "Pending";

              return (
                <tr key={idx} className="pending-row">
                  <td>{from}</td>
                  <td>{to}</td>
                  <td>{inputAmount}</td>
                  <td>{expectedOutput}</td>
                  <td>{liquidityProvider}</td>
                  <td>
                    <span className={`status ${status.toLowerCase()}`}>
                      {status}
                    </span>
                  </td>
                  {payload.outputTokenLockCid !== null ? (
                    <td>
                      <button
                        className="btn claim"
                        onClick={() => handleClaim(item.contractId)}
                      >
                        Claim
                      </button>
                    </td>
                  ) : (
                    <td>
                      <button className="btn cancel">Pending Swap</button>
                    </td>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
