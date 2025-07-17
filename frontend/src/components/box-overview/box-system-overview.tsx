import { System } from "utils/model";
import "./box-system-overview.css";

interface IProps {
  data: System[];
  title: string;
}
const BoxSystemOverView = (props: IProps) => {
  const { data, title } = props;
  return (
    <div className="overview-container">
      <h2 className="overview-title">{title}</h2>

      <div className="overview-grid">
        {data.map((item, idx) => (
          <div key={idx} className="overview-card">
            <p className="overview-value">{item.value}</p>
            <p className="overview-label">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoxSystemOverView;
