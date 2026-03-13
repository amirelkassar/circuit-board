import './PowerSource.css';

export function PowerSource() {
  return (
    <div className="power-source" role="img" aria-label="Power supply">
      <span className="power-source__plus">+</span>
      <span className="power-source__minus">−</span>
    </div>
  );
}
