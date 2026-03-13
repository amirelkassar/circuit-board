import './LampLED.css';

type Props = {
  on: boolean;
  label?: string;
};

export function LampLED({ on, label }: Props) {
  return (
    <g className="lamp-led">
      <circle
        className={`lamp-led__bulb ${on ? 'lamp-led__bulb--on' : 'lamp-led__bulb--off'}`}
        cx={0}
        cy={0}
        r={10}
      />
      {label && (
        <text className="lamp-led__label" y={22} textAnchor="middle">
          {label}
        </text>
      )}
    </g>
  );
}
