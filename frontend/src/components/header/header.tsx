import { useLedgerParty } from "context/ledger-context";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./header.css";

const Header = () => {
  const { setSelectedParty, selectedParty } = useLedgerParty();
  const navigate = useNavigate();
  const pathName = useLocation().pathname;

  const handleLogout = () => {
    navigate("/", { replace: true });
    setSelectedParty(null);
  };

  return (
    <div className="bg-white shadow">
      <div className="container">
        <div className="navbar">
          <div className="nav-left">
            <div className="nav-link-redirect">
              <div className="nav-logo">
                <Link to={"/"} replace>
                  <span>DAML Exchange</span>
                </Link>
              </div>
              <div className="nav-menu">
                <Link
                  to="/swap"
                  className={`nav-link ${pathName === "/swap" && "active"}`}
                >
                  Swap
                </Link>

                <Link
                  to="/token"
                  className={`nav-link ${pathName === "/token" && "active"}`}
                >
                  Token
                </Link>
              </div>
            </div>
            <button className="nav-button" onClick={handleLogout}>
              Logout
            </button>
            <p className="user-name">{selectedParty?.displayName}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
