import { useLedgerParty } from "context/ledger-context";
import { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { role, selectedParty } = useLedgerParty();
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedParty || !role) return;

    if (role === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  }, [navigate, role, selectedParty]);

  if (!role) return <Navigate to="/" replace />;

  if (!allowedRoles.includes(role))
    return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
};
