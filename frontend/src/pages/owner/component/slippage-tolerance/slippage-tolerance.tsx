import React, { useState } from "react";
import "./slippage-tolerance.css";

interface IProps {
  receiveAmount: string;
  slippage: number;
  setSlippage: React.Dispatch<React.SetStateAction<number>>;
}
export const SlippageTolerance = (props: IProps) => {
  const { receiveAmount, setSlippage, slippage } = props;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlippage(parseFloat(e.target.value));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(",", ".");
    const parsed = parseFloat(val);
    if (!isNaN(parsed)) {
      const clamped = Math.min(5, Math.max(0.1, parsed));
      setSlippage(clamped);
    }
  };

  return (
    <div>
      <div className="slippage-container">
        <p className="slippage-label">Slippage Tolerance</p>
        <div className="slippage-input-group">
          <input
            type="range"
            min={0.1}
            max={5}
            step={0.1}
            value={slippage}
            onChange={handleSliderChange}
            className="slippage-slider"
          />
          <div className="slippage-value">
            <input
              readOnly
              type="text"
              value={slippage.toFixed(1).replace(".", ",")}
              onChange={handleInputChange}
            />
            &nbsp;%
          </div>
        </div>
      </div>

      <div className="price-impact-container">
        {Number(receiveAmount) ? (
          <p className="exchange-rate">
            <strong>
              1 BTC = 108589 USDC (Minimum:
              {parseFloat(receiveAmount) * (1 - slippage / 100)})
            </strong>
          </p>
        ) : null}

        <p className="price-impact-note">
          Maximum price impact based on current settings
        </p>
      </div>
    </div>
  );
};
