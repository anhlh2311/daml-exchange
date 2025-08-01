import App from "App";
import { ProtectedRoute } from "components/routers/protected-route";
import AdminPage from "pages/admin";
import Owner from "pages/owner";
import Swap from "pages/owner/pages/swap/swap";
import TokenCardPage from "pages/owner/pages/token-card/token-card";
import { TokenDetailPage } from "pages/owner/pages/token-detail/token-detail";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <ProtectedRoute allowedRoles={["admin"]} />,
        children: [{ path: "admin", element: <AdminPage /> }],
      },
      {
        element: (
          <ProtectedRoute allowedRoles={["owner", "holder", "liquidity"]} />
        ),
        children: [
          { index: true, element: <Owner /> },
          { path: "swap", element: <Swap /> },
          { path: "token", element: <TokenCardPage /> },
          { path: "token-detail", element: <TokenDetailPage /> },
        ],
      },
      {
        path: "unauthorized",
        element: <div>Unauthorized</div>,
      },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
