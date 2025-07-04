// router.tsx
import AppLayout from "App";
import LedgerAssets from "pages/ledger-assets";
import Swap from "pages/swap";
import TokenDetail from "pages/token-detail";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <LedgerAssets /> },
      { path: "swap", element: <Swap /> },
      { path: "token/:contractId", element: <TokenDetail /> },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
