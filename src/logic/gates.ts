import type { GateType, Signal } from './types';

export function andGate(a: Signal, b: Signal): Signal {
  return a === 1 && b === 1 ? 1 : 0;
}

export function orGate(a: Signal, b: Signal): Signal {
  return a === 1 || b === 1 ? 1 : 0;
}

export function notGate(a: Signal): Signal {
  return a === 1 ? 0 : 1;
}

export function nandGate(a: Signal, b: Signal): Signal {
  return andGate(a, b) === 1 ? 0 : 1;
}

export function norGate(a: Signal, b: Signal): Signal {
  return orGate(a, b) === 1 ? 0 : 1;
}

export function xorGate(a: Signal, b: Signal): Signal {
  return a !== b ? 1 : 0;
}

export function xnorGate(a: Signal, b: Signal): Signal {
  return a === b ? 1 : 0;
}

export function bufferGate(a: Signal): Signal {
  return a;
}

const GATE_FUNCTIONS: Record<
  GateType,
  (a: Signal, b?: Signal) => Signal
> = {
  AND: andGate,
  OR: orGate,
  NOT: (a) => notGate(a),
  NAND: nandGate,
  NOR: norGate,
  XOR: xorGate,
  XNOR: xnorGate,
  BUFFER: (a) => bufferGate(a),
};

export function computeOutput(
  gateType: GateType,
  a: Signal,
  b: Signal = 0
): Signal {
  const fn = GATE_FUNCTIONS[gateType];
  if (gateType === 'NOT' || gateType === 'BUFFER') {
    return fn(a, 0);
  }
  return fn(a, b);
}
