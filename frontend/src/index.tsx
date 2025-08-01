import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { LedgerProvider } from "./context/ledger-context";
import { AppRouter } from "routers";
import { ToastProvider } from "context/toastStore";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <LedgerProvider>
      <ToastProvider>
        <AppRouter />
      </ToastProvider>
    </LedgerProvider>
  </React.StrictMode>
);

reportWebVitals();
