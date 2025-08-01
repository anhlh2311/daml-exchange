import MainLayout from "components/layout/main-layout";
import { TokenDetail } from "pages/owner/component/token-detail/token-detail";
import { useLocation } from "react-router-dom";

export function TokenDetailPage() {
  const location = useLocation();
  const data = location.state;

  return (
    <MainLayout>
      <TokenDetail {...data} />
    </MainLayout>
  );
}
