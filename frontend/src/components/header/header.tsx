import { useLedgerParty } from "context/ledger-context";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { setSelectedParty } = useLedgerParty();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/", { replace: true });
    setSelectedParty(null);
  };

  return (
    <button className="swap-button" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default Header;
