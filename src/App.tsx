import { useState, useMemo } from 'react';
import { CircuitBoard } from './components/CircuitBoard';
import { TruthTable } from './components/TruthTable';
import { GATE_TYPES } from './logic/types';
import { computeOutput } from './logic/gates';
import { GATE_INFO } from './logic/gateData';
import './App.css';

function App() {
  const [inputA, setInputA] = useState<boolean>(false);
  const [inputB, setInputB] = useState<boolean>(false);

  const sigA = inputA ? 1 : 0;
  const sigB = inputB ? 1 : 0;

  const outputs = useMemo(() => {
    return Object.fromEntries(
      GATE_TYPES.map((gt) => [
        gt,
        GATE_INFO[gt].hasTwoInputs
          ? computeOutput(gt, sigA, sigB)
          : computeOutput(gt, sigA),
      ])
    );
  }, [sigA, sigB]);

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Logic Gate Circuit Board</h1>
        <p className="app__tagline">
          Toggle switches A and B to see current flow through the circuit and
          light the LEDs.
        </p>
      </header>

      <main className="app__main">
        <p className="app__outputs">
          Outputs: {GATE_TYPES.map((g) => `${g}=${outputs[g]}`).join(', ')}
        </p>
        <CircuitBoard
          inputA={inputA}
          inputB={inputB}
          onInputAChange={() => setInputA((a) => !a)}
          onInputBChange={() => setInputB((b) => !b)}
        />
        <TruthTable inputA={sigA} inputB={sigB} />
      </main>
    </div>
  );
}

export default App;
