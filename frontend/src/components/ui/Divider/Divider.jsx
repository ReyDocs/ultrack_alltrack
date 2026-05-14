import './Divider.css';

export default function Divider({ text }) {
  return (
    <div className="divider" role="separator">
      <span className="divider__line" />
      <span className="divider__text">{text}</span>
      <span className="divider__line" />
    </div>
  );
}
