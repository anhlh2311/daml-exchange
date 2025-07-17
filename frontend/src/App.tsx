import { useLedgerParty } from "./context/ledger-context";
import PartySelector from "./pages/login/party-selector";
import "./App.css";
import { Outlet } from "react-router-dom";
const App = () => {
  const { selectedParty } = useLedgerParty();

  return !selectedParty ? <PartySelector /> : <Outlet />;
};

export default App;
