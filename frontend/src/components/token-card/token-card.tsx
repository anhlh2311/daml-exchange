import { TokenCardProps } from "utils/model";
import "./token-card.css";
import { useNavigate } from "react-router-dom";

type TokenCardProp = {
  data?: TokenCardProps;
  isEmpty?: boolean;
};

function TokenCard({ data, isEmpty }: TokenCardProp) {
  const navigate = useNavigate();

  if (isEmpty) {
    return (
      <div className="token-card empty-card">
        <div className="token-header">
          <div className="token-card-symbol empty-symbol">—</div>
          <div className="token-info">
            <h4>No Token</h4>
            <p>No token available</p>
          </div>
        </div>
        <div className="token-amount">
          <p className="amount">0</p>
          <p className="formatted-amount">—</p>
        </div>
        <div className="token-actions">
          <button disabled className="transfer-btn disabled-btn">
            Transfer
          </button>
          <button disabled className="details-btn disabled-btn">
            Details
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { payload } = data;
  const { metadata, amount, symbol } = payload;
  const { name, description } = metadata;
  const formattedAmount = `${symbol} ${amount}`;

  const handleShowTransfer = () => {
    navigate("/swap");
  };

  const handleShowDetails = () => {
    navigate(`/token-detail`, { state: data });
  };

  return (
    <div className="token-card">
      <div className="token-header">
        <div className="token-card-symbol">
          <span>{symbol}</span>
        </div>
        <div className="token-info">
          <h4>{name}</h4>
          <p>{description}</p>
        </div>
      </div>
      <div className="token-amount">
        <p className="amount">{amount}</p>
        <p className="formatted-amount">{formattedAmount}</p>
      </div>
      <div className="token-actions">
        <button onClick={handleShowTransfer} className="transfer-btn">
          Transfer
        </button>
        <button onClick={handleShowDetails} className="details-btn">
          Details
        </button>
      </div>
    </div>
  );
}

export default TokenCard;
