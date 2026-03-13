import type { GateType } from './types';
import { computeOutput } from './gates';

export const GATE_INFO: Record<
  GateType,
  { formula: string; description: string; hasTwoInputs: boolean }
> = {
  AND: {
    formula: 'A · B',
    description: 'Output 1 only when both A and B are 1.',
    hasTwoInputs: true,
  },
  OR: {
    formula: 'A + B',
    description: 'Output 1 when at least one input is 1.',
    hasTwoInputs: true,
  },
  NOT: {
    formula: 'Ā',
    description: 'Inverts the input.',
    hasTwoInputs: false,
  },
  NAND: {
    formula: '¬(A · B)',
    description: 'NOT AND. Output 0 only when both are 1.',
    hasTwoInputs: true,
  },
  NOR: {
    formula: '¬(A + B)',
    description: 'NOT OR. Output 1 only when both are 0.',
    hasTwoInputs: true,
  },
  XOR: {
    formula: 'A ⊕ B',
    description: 'Exclusive OR. Output 1 when A ≠ B.',
    hasTwoInputs: true,
  },
  XNOR: {
    formula: 'A ⊙ B',
    description: 'Exclusive NOR. Output 1 when A = B.',
    hasTwoInputs: true,
  },
  BUFFER: {
    formula: 'A',
    description: 'Output equals input A.',
    hasTwoInputs: false,
  },
};

export function getTruthTable(
  gateType: GateType
): { a: number; b: number | null; output: number }[] {
  const info = GATE_INFO[gateType];
  if (!info.hasTwoInputs) {
    return [
      { a: 0, b: null, output: computeOutput(gateType, 0) },
      { a: 1, b: null, output: computeOutput(gateType, 1) },
    ];
  }
  return [
    { a: 0, b: 0, output: computeOutput(gateType, 0, 0) },
    { a: 0, b: 1, output: computeOutput(gateType, 0, 1) },
    { a: 1, b: 0, output: computeOutput(gateType, 1, 0) },
    { a: 1, b: 1, output: computeOutput(gateType, 1, 1) },
  ];
}
