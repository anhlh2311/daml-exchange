import { useLedgerParty } from "./context/ledger-context";
import PartySelector from "./pages/party-selector";
import "./App.css";
import { Outlet } from "react-router-dom";
const App = () => {
  const { selectedParty } = useLedgerParty();

  return (
    <div className="App">
      {!selectedParty ? (
        <PartySelector />
      ) : (
        <>
          <Outlet />
        </>
      )}
    </div>
  );
};

export default App;
