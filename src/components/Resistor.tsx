import './Resistor.css';

type Props = {
  x: number;
  y: number;
  active?: boolean;
};

export function Resistor({ x, y, active = false }: Props) {
  return (
    <g
      className={`resistor ${active ? 'resistor--active' : ''}`}
      transform={`translate(${x}, ${y})`}
    >
      <rect
        x={-8}
        y={-4}
        width={16}
        height={8}
        rx={2}
        className="resistor__body"
      />
    </g>
  );
}
