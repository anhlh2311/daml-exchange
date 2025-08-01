import "./action-card.css";

function ActionCard({
  title,
  desc,
  button,
  onClick,
}: {
  title: string;
  desc: string;
  button: string;
  onClick?: () => void;
}) {
  return (
    <div className="card" onClick={onClick}>
      <h4 className="card-title">{title}</h4>
      <p className="card-desc">{desc}</p>
      <button className="card-button">{button}</button>
    </div>
  );
}
export default ActionCard;
