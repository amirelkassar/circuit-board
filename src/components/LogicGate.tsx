import type { GateType } from '../logic/types';

const BOX_WIDTH = 52;
const BOX_HEIGHT = 28;

type Props = {
  gateType: GateType;
  /** Optional label (e.g. AND, AND1) for board; defaults to gateType */
  label?: string;
};

export function LogicGate({ gateType, label }: Props) {
  const hasBubble = gateType === 'NAND' || gateType === 'NOR' || gateType === 'NOT';
  const displayLabel = label ?? gateType;
  return (
    <g>
      <rect
        className="fill-[#1e1e1e] stroke-[#555] stroke-[1.5]"
        x={0}
        y={0}
        width={BOX_WIDTH}
        height={BOX_HEIGHT}
        rx={4}
      />
      <text
        className="fill-[#8c8] font-sans text-[10px] font-bold tracking-wide"
        x={BOX_WIDTH / 2}
        y={BOX_HEIGHT / 2}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {displayLabel}
      </text>
      {hasBubble && (
        <circle
          className="fill-[#1e1e1e] stroke-[#555] stroke-[1.5]"
          cx={BOX_WIDTH}
          cy={BOX_HEIGHT / 2}
          r={5}
        />
      )}
    </g>
  );
}
