import React from "react";
import "./swap-submitted.css";

interface SwapSubmittedProps {
  inputAmount: string;
  inputToken: string;
  outputAmount: string;
  outputToken: string;
  onGoDashboard: () => void;
}

const SwapSubmitted: React.FC<SwapSubmittedProps> = ({
  inputAmount,
  inputToken,
  outputAmount,
  outputToken,
  onGoDashboard,
}) => {
  return (
    <div className="swap-submitted-container">
      <p className="swap-message">
        Swap request submitted! {inputAmount} {inputToken} for {outputAmount}{" "}
        {outputToken}. Please return to your dashboard to monitor the swap
        status and wait for liquidity provider approval.
      </p>
      <button className="dashboard-button" onClick={onGoDashboard}>
        Go to Token Holder Dashboard
      </button>
    </div>
  );
};

export default SwapSubmitted;
