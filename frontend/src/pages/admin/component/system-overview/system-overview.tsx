import BoxSystemOverView from "components/box-overview/box-system-overview";
import { metricsAdmin } from "utils/dataMock";

function SystemOverview() {
  return <BoxSystemOverView data={metricsAdmin} title="System Overview" />;
}
export default SystemOverview;
