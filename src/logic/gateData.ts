import type { GateType } from './types';
import { computeOutput } from './gates';

export const GATE_INFO: Record<
  GateType,
  {
    formula: string;
    description: string;
    explanation: string;
    hasTwoInputs: boolean;
  }
> = {
  AND: {
    formula: 'A · B',
    description: 'Output 1 only when both A and B are 1.',
    explanation:
      'The AND gate is the “all must be true” gate. It has two inputs (A and B) and one output. ' +
      'The output is 1 only when both inputs are 1. If either input is 0, the output is 0. ' +
      'Think of it like a strict checklist: both conditions must be satisfied. ' +
      'In real circuits, AND is used when you need two signals to agree before something happens (e.g. enable a circuit only when two safety switches are on). ' +
      'To light the lamp with an AND gate, you must turn both switch A and switch B ON.',
    hasTwoInputs: true,
  },
  OR: {
    formula: 'A + B',
    description: 'Output 1 when at least one input is 1.',
    explanation:
      'The OR gate is the “at least one” gate. It has two inputs (A and B) and one output. ' +
      'The output is 1 if input A is 1, or input B is 1, or both are 1. The output is 0 only when both inputs are 0. ' +
      'So any “yes” on the inputs gives a “yes” on the output. ' +
      'OR gates are used when you want to combine several possible triggers: for example, “ring the bell if button 1 OR button 2 is pressed.” ' +
      'To light the lamp with an OR gate, turn ON either switch A, or switch B, or both.',
    hasTwoInputs: true,
  },
  NOT: {
    formula: 'Ā (read: “not A”)',
    description: 'Inverts the input: output is the opposite of A.',
    explanation:
      'The NOT gate is an inverter. It has a single input (A) and one output. ' +
      'Whatever the input is, the output is the opposite: if A is 0, the output is 1; if A is 1, the output is 0. ' +
      'So NOT “flips” or “inverts” the signal. In formulas it is often written as Ā or ¬A. ' +
      'NOT is used when you need the opposite of a condition, for example “do something when a sensor is NOT triggered.” ' +
      'On this board, only switch A is used (B is ignored). To light the lamp with a NOT gate, leave switch A OFF so that the gate outputs 1.',
    hasTwoInputs: false,
  },
  NAND: {
    formula: '¬(A · B) — NOT of (A AND B)',
    description: 'Output 0 only when both A and B are 1; otherwise output is 1.',
    explanation:
      'NAND means “NOT AND.” It is an AND gate followed by an inverter. It has two inputs (A and B) and one output. ' +
      'The output is 0 only when both inputs are 1. In every other case (0 and 0, 0 and 1, 1 and 0) the output is 1. ' +
      'So NAND is the opposite of AND: it says “no” only when both inputs are “yes.” ' +
      'NAND is very important in digital design because you can build any other logic from NAND gates alone. ' +
      'To light the lamp with a NAND gate, use any combination except both A and B ON—so at least one switch must be OFF.',
    hasTwoInputs: true,
  },
  NOR: {
    formula: '¬(A + B) — NOT of (A OR B)',
    description: 'Output 1 only when both A and B are 0; otherwise output is 0.',
    explanation:
      'NOR means “NOT OR.” It is an OR gate followed by an inverter. It has two inputs (A and B) and one output. ' +
      'The output is 1 only when both inputs are 0. If either input (or both) is 1, the output is 0. ' +
      'So NOR says “yes” only when both inputs say “no.” Like NAND, NOR is universal: you can build any logic circuit using only NOR gates. ' +
      'NOR is often used when you need “neither condition true,” for example “activate only when neither alarm has been triggered.” ' +
      'To light the lamp with a NOR gate, leave both switch A and switch B OFF.',
    hasTwoInputs: true,
  },
  XOR: {
    formula: 'A ⊕ B (Exclusive OR)',
    description: 'Output 1 when A and B are different; output 0 when they are the same.',
    explanation:
      'XOR stands for “Exclusive OR.” It has two inputs (A and B) and one output. ' +
      'The output is 1 when the two inputs are different (one is 0 and the other is 1). The output is 0 when both inputs are the same (both 0 or both 1). ' +
      'So XOR answers the question “are A and B different?” It is used in comparators, adders, and error-checking. ' +
      'For example, XOR can detect when two signals disagree. In binary addition, the sum bit is often an XOR of the two bits. ' +
      'To light the lamp with an XOR gate, set the switches so that one is ON and the other is OFF (either A=1 and B=0, or A=0 and B=1).',
    hasTwoInputs: true,
  },
  XNOR: {
    formula: 'A ⊙ B (Exclusive NOR)',
    description: 'Output 1 when A and B are the same; output 0 when they are different.',
    explanation:
      'XNOR is “Exclusive NOR,” or the inverse of XOR. It has two inputs (A and B) and one output. ' +
      'The output is 1 when both inputs are the same (both 0 or both 1). The output is 0 when the inputs are different. ' +
      'So XNOR answers “are A and B equal?” It is used in equality checks and in some adder and comparator circuits. ' +
      'You can think of it as “XOR with the output inverted.” Where XOR detects difference, XNOR detects agreement. ' +
      'To light the lamp with an XNOR gate, set both switches to the same state: either both ON or both OFF.',
    hasTwoInputs: true,
  },
  BUFFER: {
    formula: 'Output = A',
    description: 'Output simply copies the input A; no change.',
    explanation:
      'A BUFFER gate has one input (A) and one output. The output always equals the input: when A is 0, the output is 0; when A is 1, the output is 1. ' +
      'So logically it does not change the signal. Why use it? In real circuits, buffers are used to strengthen a weak signal, isolate one part of a circuit from another, or drive a heavy load without affecting the source. ' +
      'They are also used for timing and to match signal levels. On this board, only switch A is used (B is ignored). ' +
      'To light the lamp with a BUFFER gate, turn switch A ON so that the gate passes 1 to the lamp.',
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
