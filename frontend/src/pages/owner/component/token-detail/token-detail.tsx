import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";
import { TokenCardProps } from "utils/model";
import "./token-detail.css";

export function TokenDetail({ payload }: TokenCardProps) {
  const navigate = useNavigate();
  const {
    symbol,
    amount,
    owner,
    holder,
    registryKey,
    metadata: { name, description, decimals, issuedDate, version },
  } = payload;

  const formattedAmount = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: Number(decimals),
    maximumFractionDigits: Number(decimals),
  }).format(Number(amount) / 10 ** Number(decimals));

  return (
    <div className="token-detail-wrapper">
      <button onClick={() => navigate(-1)} className="back-button">
        <ArrowLeftIcon className="back-icon" />
        Back to Tokens
      </button>

      <div className="token-card">
        <div className="token-header">
          <div className="token-symbol">{symbol}</div>
          <div className="token-info">
            <h2 className="token-name">{name}</h2>
            <p className="token-description">{description}</p>
          </div>
        </div>

        <div className="token-amount">
          <p className="token-amount-main">Balance: {formattedAmount}</p>
        </div>

        <div className="token-details">
          <DetailItem label="Owner" value={owner} />
          <DetailItem label="Holder" value={holder} />
          <DetailItem label="Registry Key" value={registryKey} />
          <DetailItem label="Decimals" value={decimals} />
          <DetailItem
            label="Issued Date"
            value={new Date(issuedDate).toLocaleDateString()}
          />
          {version && <DetailItem label="Version" value={version} />}
        </div>

        <div className="token-actions">
          <button onClick={() => navigate("/swap")} className="primary-button">
            Transfer Token
          </button>
          <button className="secondary-button">View Transaction History</button>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="detail-item">
      <h4 className="detail-label">{label}</h4>
      <p className="detail-value">{value}</p>
    </div>
  );
}
