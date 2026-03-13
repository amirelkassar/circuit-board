import { useMemo } from 'react';
import type { GateType, Signal } from '../logic/types';
import { computeOutput } from '../logic/gates';
import { GATE_INFO } from '../logic/gateData';
import { PowerSource } from './PowerSource';
import { SwitchInput } from './SwitchInput';
import { Wire } from './Wire';
import { LogicGate } from './LogicGate';
import { LampLED } from './LampLED';
import './GameBoard.css';

type Props = {
  gateType: GateType;
  inputA: boolean;
  inputB: boolean;
  onInputAChange: () => void;
  onInputBChange: () => void;
};

const GW = 36;
const GH = 28;
const GATE_CX = 160;
const GATE_CY = 70;
const LED_X = 280;

export function GameBoard({
  gateType,
  inputA,
  inputB,
  onInputAChange,
  onInputBChange,
}: Props) {
  const sigA: Signal = inputA ? 1 : 0;
  const sigB: Signal = inputB ? 1 : 0;
  const hasTwoInputs = GATE_INFO[gateType].hasTwoInputs;

  const output = useMemo(
    () =>
      hasTwoInputs
        ? computeOutput(gateType, sigA, sigB)
        : computeOutput(gateType, sigA),
    [gateType, sigA, sigB, hasTwoInputs]
  );

  const wireA = hasTwoInputs
    ? `M 72 55 L 100 55 L 100 ${GATE_CY - 6} L ${GATE_CX - GW / 2} ${GATE_CY - 6}`
    : `M 72 55 L 100 55 L 100 ${GATE_CY} L ${GATE_CX - GW / 2} ${GATE_CY}`;
  const wireB = hasTwoInputs
    ? `M 72 85 L 100 85 L 100 ${GATE_CY + 6} L ${GATE_CX - GW / 2} ${GATE_CY + 6}`
    : 'M 0 0 L 0 0';
  const wireOut = `M ${GATE_CX + GW / 2 + (['NAND', 'NOR', 'NOT'].includes(gateType) ? 4 : 0)} ${GATE_CY} L ${LED_X - 14} ${GATE_CY}`;

  return (
    <div className="game-board">
      <svg
        className="game-board__svg"
        viewBox="0 0 320 140"
        preserveAspectRatio="xMidYMid meet"
      >
        <foreignObject x={8} y={8} width={58} height={36} className="game-board__fo">
          <div className="game-board__fo-inner">
            <PowerSource />
          </div>
        </foreignObject>
        <foreignObject x={8} y={48} width={58} height={38} className="game-board__fo">
          <div className="game-board__fo-inner">
            <SwitchInput label="A" on={inputA} onToggle={onInputAChange} />
          </div>
        </foreignObject>
        <foreignObject x={8} y={92} width={58} height={38} className="game-board__fo">
          <div className="game-board__fo-inner">
            <SwitchInput label="B" on={inputB} onToggle={onInputBChange} />
          </div>
        </foreignObject>

        <Wire d={wireA} active={sigA === 1} />
        {hasTwoInputs && <Wire d={wireB} active={sigB === 1} />}
        <Wire d={wireOut} active={output === 1} />

        <g transform={`translate(${GATE_CX - GW / 2}, ${GATE_CY - GH / 2})`}>
          <LogicGate gateType={gateType} />
        </g>
        <g transform={`translate(${LED_X}, ${GATE_CY})`}>
          <LampLED on={output === 1} label={gateType} />
        </g>
      </svg>
    </div>
  );
}
