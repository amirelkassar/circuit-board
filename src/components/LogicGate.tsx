import type { GateType } from '../logic/types';
import './LogicGate.css';

const GATE_SYMBOLS: Record<GateType, string> = {
  AND: '&',
  OR: '≥1',
  NOT: '1',
  NAND: '&',
  NOR: '≥1',
  XOR: '=1',
  XNOR: '=1',
  BUFFER: '1',
};

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
        width={36}
        height={28}
        rx={3}
      />
      <text className="logic-gate__symbol" x={18} y={19}>
        {GATE_SYMBOLS[gateType]}
      </text>
      {hasBubble && (
        <circle className="logic-gate__bubble" cx={36} cy={14} r={4} />
      )}
    </g>
  );
}
