export type Signal = 0 | 1;

export type GateType =
  | 'AND'
  | 'OR'
  | 'NOT'
  | 'NAND'
  | 'NOR'
  | 'XOR'
  | 'XNOR'
  | 'BUFFER';

export const GATE_TYPES: GateType[] = [
  'AND',
  'OR',
  'NOT',
  'NAND',
  'NOR',
  'XOR',
  'XNOR',
  'BUFFER',
];
