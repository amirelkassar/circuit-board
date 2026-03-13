import type { GateType } from '../logic/types';
import './LogicGate.css';

const BOX_WIDTH = 52;
const BOX_HEIGHT = 28;

type Props = {
  gateType: GateType;
};

export function LogicGate({ gateType }: Props) {
  const hasBubble = gateType === 'NAND' || gateType === 'NOR' || gateType === 'NOT';
  return (
    <g className={`logic-gate logic-gate--${gateType}`}>
      <rect
        className="logic-gate__box"
        x={0}
        y={0}
        width={BOX_WIDTH}
        height={BOX_HEIGHT}
        rx={4}
      />
      <text
        className="logic-gate__label"
        x={BOX_WIDTH / 2}
        y={BOX_HEIGHT / 2}
      >
        {gateType}
      </text>
      {hasBubble && (
        <circle
          className="logic-gate__bubble"
          cx={BOX_WIDTH}
          cy={BOX_HEIGHT / 2}
          r={5}
        />
      )}
    </g>
  );
}
