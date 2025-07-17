import MainLayout from "components/layout/main-layout";
import SystemOverview from "./component/system-overview/system-overview";
import QuickActions from "./component/quick-actions/quick-actions";
import TokenAndActivity from "./component/token-and-activity/token-and-activity";
import "./index.css";

const AdminPage = () => {
  return (
    <MainLayout>
      <div className="container-admin">
        <SystemOverview />
        <QuickActions />
      </div>
      <TokenAndActivity />
    </MainLayout>
  );
};

export default AdminPage;
