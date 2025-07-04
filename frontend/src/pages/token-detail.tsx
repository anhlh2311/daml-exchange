import { useLocation, useNavigate } from "react-router-dom";
import { TokenCardProps } from "utils/model";
import "./token-detail.css";

const TokenDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const token = location.state;
  const { contractId, payload, signatories, templateId, observers } =
    token as TokenCardProps;
  const { metadata, owner, amount, holder, registryKey, symbol } = payload;

  return (
    <div className="token-detail-wrapper">
      <div className="group-btn-wrapper">
        <button className="back-button" onClick={() => navigate(-1)}>
          Back
        </button>
        <button
          className="back-button"
          onClick={() =>
            navigate("/swap", {
              state: {
                defaultToken: {
                  symbol: symbol,
                  name: metadata.name,
                },
              },
            })
          }
        >
          🔁 Swap
        </button>
      </div>
      <h2 className="token-title">Token Detail</h2>

      <div className="token-section">
        <h3>General Info</h3>
        <p>
          <strong>Template ID:</strong> {templateId}
        </p>
        <p>
          <strong>Contract ID:</strong> {contractId}
        </p>
        <p>
          <strong>Owner:</strong> {owner}
        </p>
        <p>
          <strong>Holder:</strong> {holder}
        </p>
        <p>
          <strong>Amount:</strong> {amount}
        </p>
        <p>
          <strong>Registry Key:</strong> {registryKey}
        </p>
      </div>

      <div className="token-section">
        <h3>Metadata</h3>
        <p>
          <strong>Name:</strong> {metadata.name}
        </p>
        <p>
          <strong>Symbol:</strong> {metadata.symbol}
        </p>
        <p>
          <strong>Decimals:</strong> {metadata.decimals}
        </p>
        <p>
          <strong>Description:</strong> {metadata.description}
        </p>
        <p>
          <strong>Issued Date:</strong>
          {new Date(metadata.issuedDate).toLocaleString()}
        </p>
        <p>
          <strong>Version:</strong> {metadata.version}
        </p>
      </div>

      <div className="token-section">
        <h3>Parties</h3>
        <p>
          <strong>Signatories:</strong>{" "}
          <span className="wrap-long">{signatories.join(", ")}</span>
        </p>
        <p>
          <strong>Observers:</strong>{" "}
          <span className="wrap-long">
            {observers.length ? observers.join(", ") : "None"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default TokenDetail;
