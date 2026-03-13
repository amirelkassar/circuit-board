import { useState, useMemo } from 'react';
import { CircuitBoard } from './components/CircuitBoard';
import { TruthTable } from './components/TruthTable';
import { GateGuide } from './components/GateGuide';
import { GATE_TYPES } from './logic/types';
import { computeOutput } from './logic/gates';
import { GATE_INFO } from './logic/gateData';
import './App.css';

type Tab = 'board' | 'learn';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('learn');
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
        <h1 className="app__title">Circuit Board</h1>
        <nav className="app__tabs" aria-label="Main sections">
          <button
            type="button"
            className={`app__tab ${activeTab === 'learn' ? 'app__tab--active' : ''}`}
            onClick={() => setActiveTab('learn')}
          >
            Learn the gates
          </button>
          <button
            type="button"
            className={`app__tab ${activeTab === 'board' ? 'app__tab--active' : ''}`}
            onClick={() => setActiveTab('board')}
          >
            Circuit board
          </button>
        </nav>
      </header>

      <main className="app__main">
        {activeTab === 'learn' && <GateGuide />}
        {activeTab === 'board' && (
          <>
        <section className="app__tips" aria-label="How to use">
          <h2 className="app__tips-title">How it works</h2>
          <ul className="app__tips-list">
            <li>
              <strong>Switches A and B</strong> — Click them to turn each input ON (1) or OFF (0). They feed the same signal to every gate on the board.
            </li>
            <li>
              <strong>Wires</strong> — When a signal is 1, the wire glows (red/yellow) to show current flow. Dark wires mean signal 0.
            </li>
            <li>
              <strong>Logic gates</strong> — Each gate (AND, OR, NOT, etc.) computes one output from its inputs. NOT and BUFFER use only input A.
            </li>
            <li>
              <strong>LEDs</strong> — Each gate has an LED on the right. It lights up (green) when that gate’s output is 1.
            </li>
            <li>
              <strong>Truth tables</strong> — Below the board you can see the full truth table for every gate. The row that matches your current A and B is highlighted.
            </li>
          </ul>
        </section>
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
          </>
        )}
      </main>
    </div>
  );
}

export default App;
