import { useMemo, useState } from 'react';
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

const GATE_TYPES: GateType[] = ['AND', 'OR', 'NAND', 'NOR', 'XOR', 'XNOR', 'NOT', 'BUFFER'];

function shuffle<T>(array: T[]): T[] {
  const out = [...array];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export const GATE_ORDER: GateType[] = shuffle([...GATE_TYPES, ...GATE_TYPES]);

type Props = {
  inputA: boolean;
  inputB: boolean;
  onInputAChange: () => void;
  onInputBChange: () => void;
};

const SCALE = 1.5;
const GW = 52;
const GH = 28;
const COLS = 4;
const ROWS = 4;
const COL_X = [180, 320, 460, 600];
const ROW_Y = [58, 138, 218, 298];
const CX: number[] = [];
const CY: number[] = [];
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    CX.push(COL_X[c]);
    CY.push(ROW_Y[r]);
  }
}

const LED_X = 720;
const FO_X = 16;
const FO_Y_A = 24;
const FO_Y_B = 88;
const FO_Y_C = 152;
const FO_W = 68;
const FO_H = 48;
const BUS_X = 98;
const WIRE_A_Y = 106;
const WIRE_B_Y = 170;
const JUNCTION_R = 3;

function wireAToGate(i: number): string {
  const gx = CX[i];
  const gy = CY[i];
  const hasTwo = GATE_INFO[GATE_ORDER[i]].hasTwoInputs;
  const inY = hasTwo ? gy - 10 : gy;
  return `M ${BUS_X} ${WIRE_A_Y} L 128 ${WIRE_A_Y} L 128 ${inY} L ${gx - (GW * SCALE) / 2} ${inY}`;
}

function wireBToGate(i: number): string {
  const gx = CX[i];
  const gy = CY[i];
  if (!GATE_INFO[GATE_ORDER[i]].hasTwoInputs) return 'M 0 0 L 0 0';
  return `M ${BUS_X} ${WIRE_B_Y} L 128 ${WIRE_B_Y} L 128 ${gy + 10} L ${gx - (GW * SCALE) / 2} ${gy + 10}`;
}

function gateOutX(i: number): number {
  const gx = CX[i];
  return gx + (GW * SCALE) / 2 + (['NAND', 'NOR', 'NOT'].includes(GATE_ORDER[i]) ? 9 : 0);
}

function buildJunctions(): { x: number; y: number; active: 'A' | 'B' | 'out'; outIndex?: number }[] {
  const list: { x: number; y: number; active: 'A' | 'B' | 'out'; outIndex?: number }[] = [
    { x: BUS_X, y: WIRE_A_Y, active: 'A' },
    { x: 128, y: WIRE_A_Y, active: 'A' },
    { x: BUS_X, y: WIRE_B_Y, active: 'B' },
    { x: 128, y: WIRE_B_Y, active: 'B' },
  ];
  GATE_ORDER.forEach((_, i) => {
    list.push({
      x: CX[i] - (GW * SCALE) / 2,
      y: GATE_INFO[GATE_ORDER[i]].hasTwoInputs ? CY[i] - 10 : CY[i],
      active: 'A',
    });
    if (GATE_INFO[GATE_ORDER[i]].hasTwoInputs) {
      list.push({ x: CX[i] - (GW * SCALE) / 2, y: CY[i] + 10, active: 'B' });
    }
    const outX = gateOutX(i);
    const midX = (outX + LED_X - 18) / 2;
    list.push({ x: outX, y: CY[i], active: 'out', outIndex: i });
    list.push({ x: midX, y: CY[i], active: 'out', outIndex: i });
  });
  return list;
}
const JUNCTIONS = buildJunctions();

export function CircuitBoard({
  inputA,
  inputB,
  onInputAChange,
  onInputBChange,
}: Props) {
  const sigA: Signal = inputA ? 1 : 0;
  const sigB: Signal = inputB ? 1 : 0;
  const [hoveredGateIndex, setHoveredGateIndex] = useState<number | null>(null);

  const outputs = useMemo(() => {
    return GATE_ORDER.map((gt) =>
      GATE_INFO[gt].hasTwoInputs ? computeOutput(gt, sigA, sigB) : computeOutput(gt, sigA)
    );
  }, [sigA, sigB]);

  const gateLabels = useMemo(() => {
    const serialByType: Partial<Record<GateType, number>> = {};
    return GATE_ORDER.map((gt) => {
      const serial = serialByType[gt] ?? 0;
      serialByType[gt] = serial + 1;
      return `${gt}${serial}`;
    });
  }, []);

  // When both switches are off, all lights stay off (start state / demo rule)
  const displayOutputs =
    sigA === 0 && sigB === 0 ? outputs.map(() => 0 as Signal) : outputs;

  const isJunctionActive = (j: (typeof JUNCTIONS)[number]) => {
    if (j.active === 'A') return sigA === 1;
    if (j.active === 'B') return sigB === 1;
    if (j.active === 'out' && j.outIndex !== undefined) return displayOutputs[j.outIndex] === 1;
    return false;
  };

  return (
    <div className="circuit-board">
      {hoveredGateIndex !== null && (
        <div className="circuit-board__tooltip" role="tooltip">
          <strong className="circuit-board__tooltip-name">{gateLabels[hoveredGateIndex]}</strong>
          <span className="circuit-board__tooltip-formula">
            {GATE_INFO[GATE_ORDER[hoveredGateIndex]].formula}
          </span>
          <p className="circuit-board__tooltip-desc">
            {GATE_INFO[GATE_ORDER[hoveredGateIndex]].description}
          </p>
          <p className="circuit-board__tooltip-effect">
            In this circuit it drives its LED: the lamp is on when its output is 1.
          </p>
        </div>
      )}
      <svg
        className="circuit-board__svg"
        viewBox="0 0 760 360"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <pattern id="circuit-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect x="0" y="0" width="760" height="360" fill="url(#circuit-grid)" className="circuit-board__grid" />

        {/* Power rails */}
        <path className="circuit-board__rail" d="M 88 16 L 752 16" fill="none" strokeWidth="2" />
        <path className="circuit-board__rail circuit-board__rail--gnd" d="M 88 338 L 752 338" fill="none" strokeWidth="2" />
        <path className="circuit-board__rail" d="M 88 48 L 88 16" fill="none" strokeWidth="1.5" />
        <path className="circuit-board__rail circuit-board__rail--gnd" d="M 88 318 L 88 338" fill="none" strokeWidth="1.5" />

        <foreignObject x={FO_X} y={FO_Y_A} width={FO_W} height={FO_H} className="circuit-board__fo">
          <div className="circuit-board__header-inner"><PowerSource /></div>
        </foreignObject>
        <foreignObject x={FO_X} y={FO_Y_B} width={FO_W} height={FO_H} className="circuit-board__fo">
          <div className="circuit-board__header-inner"><SwitchInput label="A" on={inputA} onToggle={onInputAChange} /></div>
        </foreignObject>
        <foreignObject x={FO_X} y={FO_Y_C} width={FO_W} height={FO_H} className="circuit-board__fo">
          <div className="circuit-board__header-inner"><SwitchInput label="B" on={inputB} onToggle={onInputBChange} /></div>
        </foreignObject>

        <text x={92} y={98} className="circuit-board__bus-label">A</text>
        <text x={92} y={162} className="circuit-board__bus-label">B</text>
        <text x={72} y={12} className="circuit-board__rail-label">V+</text>
        <text x={72} y={348} className="circuit-board__rail-label circuit-board__rail-label--gnd">GND</text>

        {/* Long A and B bus */}
        <Wire d={`M ${BUS_X} ${WIRE_A_Y} L 280 ${WIRE_A_Y}`} active={sigA === 1} />
        <Wire d={`M ${BUS_X} ${WIRE_B_Y} L 280 ${WIRE_B_Y}`} active={sigB === 1} />

        {/* Vertical spines (A/B distribution) */}
        <Wire d="M 128 106 L 128 48 L 140 48" active={sigA === 1} />
        <Wire d="M 128 106 L 128 168 L 140 168" active={sigA === 1} />
        <Wire d="M 128 170 L 128 128 L 140 128" active={sigB === 1} />
        <Wire d="M 128 170 L 128 248 L 140 248" active={sigB === 1} />

        {GATE_ORDER.map((_, i) => (
          <Wire key={`a-${i}`} d={wireAToGate(i)} active={sigA === 1} />
        ))}
        {GATE_ORDER.map((_, i) =>
          GATE_INFO[GATE_ORDER[i]].hasTwoInputs ? (
            <Wire key={`b-${i}`} d={wireBToGate(i)} active={sigB === 1} />
          ) : null
        )}

        {/* Horizontal wires between adjacent gates (not from last gate in row, to avoid stray wire) */}
        {ROW_Y.map((ry, ri) => {
          const indices = GATE_ORDER.map((_, i) => i).filter((i) => CY[i] === ry);
          return indices.slice(0, -1).map((_, j) => {
            const i0 = indices[j];
            const i1 = indices[j + 1];
            const x0 = gateOutX(i0);
            const x1 = gateOutX(i1);
            return (
              <Wire
                key={`between-${ri}-${j}`}
                d={`M ${x0} ${ry} L ${x1} ${ry}`}
                active={displayOutputs[i0] === 1 || displayOutputs[i1] === 1}
              />
            );
          });
        })}

        {/* Output wires: gate -> mid -> LED (two segments each); wire ends at LED */}
        {displayOutputs.map((out, i) => {
          const gy = CY[i];
          const outX = gateOutX(i);
          const endX = LED_X - 10;
          const midX = (outX + endX) / 2;
          return (
            <g key={`out-${i}`}>
              <Wire d={`M ${outX} ${gy} L ${midX} ${gy}`} active={out === 1} />
              <Wire d={`M ${midX} ${gy} L ${endX} ${gy}`} active={out === 1} />
            </g>
          );
        })}

        {/* Vertical spine wires (left of gates, end at bottom row — no dangling) */}
        <Wire d={`M 145 48 L 145 ${ROW_Y[ROWS - 1] + 12}`} active={sigA === 1} />
        <Wire d={`M 165 128 L 165 ${ROW_Y[ROWS - 1] + 12}`} active={sigB === 1} />

        <Resistor x={112} y={WIRE_A_Y} active={sigA === 1} />
        <Resistor x={112} y={WIRE_B_Y} active={sigB === 1} />
        <Resistor x={185} y={WIRE_A_Y} active={sigA === 1} />
        <Resistor x={185} y={WIRE_B_Y} active={sigB === 1} />
        <Resistor x={258} y={WIRE_A_Y} active={sigA === 1} />
        <Resistor x={258} y={WIRE_B_Y} active={sigB === 1} />

        {JUNCTIONS.map((j, i) => (
          <circle
            key={i}
            className={`circuit-board__junction ${isJunctionActive(j) ? 'circuit-board__junction--active' : ''}`}
            cx={j.x}
            cy={j.y}
            r={JUNCTION_R}
          />
        ))}

        {GATE_ORDER.map((gt, i) => (
          <g
            key={`${gt}-${i}`}
            className="circuit-board__gate-wrap"
            transform={`translate(${CX[i] - (GW * SCALE) / 2}, ${CY[i] - (GH * SCALE) / 2}) scale(${SCALE})`}
            onMouseEnter={() => setHoveredGateIndex(i)}
            onMouseLeave={() => setHoveredGateIndex(null)}
          >
            <title>{gateLabels[i]}: {GATE_INFO[gt].description}</title>
            <LogicGate gateType={gt} label={gateLabels[i]} />
          </g>
        ))}

        {/* Bus indicator LEDs (A and B) */}
        <g transform={`translate(268, ${WIRE_A_Y}) scale(${SCALE})`}>
          <LampLED on={sigA === 1} />
        </g>
        <g transform={`translate(268, ${WIRE_B_Y}) scale(${SCALE})`}>
          <LampLED on={sigB === 1} />
        </g>

        {displayOutputs.map((out, i) => (
          <g
            key={`led-${i}`}
            className="circuit-board__led-wrap"
            transform={`translate(${LED_X}, ${CY[i]}) scale(${SCALE})`}
          >
            <LampLED on={out === 1} />
          </g>
        ))}
      </svg>
    </div>
  );
}
