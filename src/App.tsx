import { useState, useMemo, useEffect } from 'react';
import { CircuitBoard, GATE_ORDER } from './components/CircuitBoard';
import { TruthTable } from './components/TruthTable';
import { GateGuide } from './components/GateGuide';
import { GATE_TYPES } from './logic/types';
import { computeOutput } from './logic/gates';
import { GATE_INFO } from './logic/gateData';
import './App.css';

type Tab = 'board' | 'learn';
type Theme = 'dark' | 'light';

const THEME_KEY = 'circuit-board-theme';

function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem(THEME_KEY);
    return stored === 'light' ? 'light' : 'dark';
  });
  const [activeTab, setActiveTab] = useState<Tab>('learn');
  const [inputA, setInputA] = useState<boolean>(false);
  const [inputB, setInputB] = useState<boolean>(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

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
        <button
          type="button"
          className="app__theme-toggle"
          onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>
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
              <strong>Switches A and B</strong> — Turn each input ON (1) or OFF (0). The same A and B signals go to every gate. When both are OFF, all lights stay off.
            </li>
            <li>
              <strong>Power</strong> — V+ and GND rails run along the board. Wires glow orange/yellow when they carry a 1; dark when they carry 0.
            </li>
            <li>
              <strong>Gates</strong> — The board has 16 gates in four rows (two of each type, in random order). Each gate is labeled (AND, OR, NOT, etc.). NOT and BUFFER use only input A; the rest use A and B. Hover a gate to see what it does and how it affects the circuit.
            </li>
            <li>
              <strong>Lights</strong> — Each gate has an LED on the right. It turns green when that gate’s output is 1. The two small lamps on the left show when the A and B buses are high.
            </li>
            <li>
              <strong>Truth tables</strong> — Below the board, each gate type has a truth table. The row for your current A and B is highlighted.
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
        <TruthTable
          inputA={sigA}
          inputB={sigB}
          gateStatuses={(() => {
            const serialByType: Record<string, number> = {};
            return GATE_ORDER.map((gateType, i) => {
              const serial = serialByType[gateType] ?? 0;
              serialByType[gateType] = serial + 1;
              return {
                position: i + 1,
                gateType,
                label: serial === 0 ? gateType : `${gateType}${serial}`,
                output: (sigA === 0 && sigB === 0 ? 0 : outputs[gateType]) as 0 | 1,
              };
            });
          })()}
        />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
