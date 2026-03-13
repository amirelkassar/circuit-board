import { useMemo } from 'react';
import type { GateType, Signal } from '../logic/types';
import { computeOutput } from '../logic/gates';
import { GATE_INFO } from '../logic/gateData';
import { PowerSource } from './PowerSource';
import { SwitchInput } from './SwitchInput';
import { Wire } from './Wire';
import { LogicGate } from './LogicGate';
import { LampLED } from './LampLED';
import { Resistor } from './Resistor';
import './CircuitBoard.css';

const GATE_ORDER: GateType[] = [
  'AND',
  'OR',
  'NAND',
  'NOR',
  'XOR',
  'XNOR',
  'NOT',
  'BUFFER',
];

type Props = {
  inputA: boolean;
  inputB: boolean;
  onInputAChange: () => void;
  onInputBChange: () => void;
};

const GW = 36;
const GH = 28;
const CX = [118, 218, 318, 418, 118, 218, 318, 418];
const CY = [42, 42, 42, 42, 162, 162, 162, 162];
const LED_X = 520;

function wireAToGate(i: number): string {
  const gx = CX[i];
  const gy = CY[i];
  const hasTwo = GATE_INFO[GATE_ORDER[i]].hasTwoInputs;
  const inY = hasTwo ? gy - 6 : gy;
  return `M 72 78 L 90 78 L 90 ${inY} L ${gx - GW / 2} ${inY}`;
}

function wireBToGate(i: number): string {
  const gx = CX[i];
  const gy = CY[i];
  if (!GATE_INFO[GATE_ORDER[i]].hasTwoInputs) return 'M 0 0 L 0 0';
  return `M 72 123 L 90 123 L 90 ${gy + 6} L ${gx - GW / 2} ${gy + 6}`;
}

function wireGateToLED(i: number): string {
  const gx = CX[i];
  const gy = CY[i];
  const hasBubble = ['NAND', 'NOR', 'NOT'].includes(GATE_ORDER[i]);
  const outX = gx + GW / 2 + (hasBubble ? 4 : 0);
  return `M ${outX} ${gy} L ${LED_X - 14} ${gy}`;
}

export function CircuitBoard({
  inputA,
  inputB,
  onInputAChange,
  onInputBChange,
}: Props) {
  const sigA: Signal = inputA ? 1 : 0;
  const sigB: Signal = inputB ? 1 : 0;

  const outputs = useMemo(() => {
    return GATE_ORDER.map((gt) =>
      GATE_INFO[gt].hasTwoInputs
        ? computeOutput(gt, sigA, sigB)
        : computeOutput(gt, sigA)
    );
  }, [sigA, sigB]);

  return (
    <div className="circuit-board">
      <svg
        className="circuit-board__svg"
        viewBox="0 0 560 200"
        preserveAspectRatio="xMidYMid meet"
      >
        <foreignObject x={8} y={8} width={58} height={36} className="circuit-board__fo">
          <div className="circuit-board__header-inner">
            <PowerSource />
          </div>
        </foreignObject>
        <foreignObject x={8} y={52} width={58} height={38} className="circuit-board__fo">
          <div className="circuit-board__header-inner">
            <SwitchInput label="A" on={inputA} onToggle={onInputAChange} />
          </div>
        </foreignObject>
        <foreignObject x={8} y={98} width={58} height={38} className="circuit-board__fo">
          <div className="circuit-board__header-inner">
            <SwitchInput label="B" on={inputB} onToggle={onInputBChange} />
          </div>
        </foreignObject>

        {GATE_ORDER.map((_, i) => (
          <Wire key={`a-${i}`} d={wireAToGate(i)} active={sigA === 1} />
        ))}
        {GATE_ORDER.map((_, i) =>
          GATE_INFO[GATE_ORDER[i]].hasTwoInputs ? (
            <Wire key={`b-${i}`} d={wireBToGate(i)} active={sigB === 1} />
          ) : null
        )}
        {outputs.map((out, i) => (
          <Wire key={`out-${i}`} d={wireGateToLED(i)} active={out === 1} />
        ))}

        <Resistor x={88} y={78} active={sigA === 1} />
        <Resistor x={88} y={123} active={sigB === 1} />

        {GATE_ORDER.map((gt, i) => (
          <g
            key={gt}
            transform={`translate(${CX[i] - GW / 2}, ${CY[i] - GH / 2})`}
          >
            <LogicGate gateType={gt} />
          </g>
        ))}

        {outputs.map((out, i) => (
          <g key={`led-${i}`} transform={`translate(${LED_X}, ${CY[i]})`}>
            <LampLED on={out === 1} label={GATE_ORDER[i]} />
          </g>
        ))}
      </svg>
    </div>
  );
}
