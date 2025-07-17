import "./action-card.css";

function ActionCard({
  title,
  desc,
  button,
}: {
  title: string;
  desc: string;
  button: string;
}) {
  return (
    <div className="card">
      <h4 className="card-title">{title}</h4>
      <p className="card-desc">{desc}</p>
      <button className="card-button">{button}</button>
    </div>
  );
}
export default ActionCard;
