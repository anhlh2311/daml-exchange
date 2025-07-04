import { TokenCardProps } from "utils/model";
import "./token-card.css";
import { useNavigate } from "react-router-dom";

interface IProps {
  token: TokenCardProps;
}
const TokenCard = (props: IProps) => {
  const { payload, contractId } = props.token;
  const { owner, amount, holder, symbol, metadata } = payload;
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/token/${contractId}`, { state: props.token });
  };

  return (
    <div className="token-card" onClick={handleClick}>
      <div className="token-header">
        <img
          src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f4b0.png"
          alt="token-icon"
          className="token-icon"
        />
        <h2>
          {metadata.name} ({symbol})
        </h2>
      </div>

      <div className="token-details">
        <p>
          <strong>Contract ID:</strong>{" "}
          <span className="truncate-text" title={contractId}>
            {contractId}
          </span>
        </p>

        <p>
          <strong>Owner:</strong> <span className="truncate-text">{owner}</span>
        </p>
        <p>
          <strong>Holder:</strong>{" "}
          <span className="truncate-text">{holder}</span>
        </p>
        <p>
          <strong>Amount:</strong> {amount}
        </p>
        <p>
          <strong>Decimals:</strong> {metadata.decimals}
        </p>
        <p>
          <strong>Issued Date:</strong>{" "}
          {new Date(metadata.issuedDate).toLocaleDateString()}
        </p>
        <p>
          <strong>Description:</strong>{" "}
          <span className="truncate-text" title={metadata.description}>
            {metadata.description}
          </span>
        </p>

        {metadata.version && (
          <p>
            <strong>Version:</strong> {metadata.version}
          </p>
        )}
      </div>
    </div>
  );
};

export default TokenCard;
