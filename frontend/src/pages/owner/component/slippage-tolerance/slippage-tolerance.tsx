import React, { useState } from "react";
import "./slippage-tolerance.css";

export const SlippageTolerance = () => {
  const [slippage, setSlippage] = useState(1.2);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlippage(parseFloat(e.target.value));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(",", "."); // Hỗ trợ dấu phẩy
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
        <p className="exchange-rate">
          <strong>1 BTC = 40.000000 ETH (Minimum: 39.520000)</strong>
        </p>
        <p className="price-impact-note">
          Maximum price impact based on current settings
        </p>
      </div>
    </div>
  );
};
