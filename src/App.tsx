import { useState, useMemo, useEffect } from 'react';
import { CircuitBoard, GATE_ORDER } from './components/CircuitBoard';
import { TruthTable } from './components/TruthTable';
import { GateGuide } from './components/GateGuide';
import { GATE_TYPES } from './logic/types';
import { computeOutput } from './logic/gates';
import { GATE_INFO } from './logic/gateData';

type Tab = 'board' | 'learn';
type Theme = 'dark' | 'light';

const THEME_KEY = 'circuit-board-theme';

const tabBase =
  'px-4 py-2 text-[0.95rem] font-semibold border-2 rounded-lg cursor-pointer transition-colors duration-150';

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
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--page-text)] p-5">
      <header className="relative mb-6 text-center">
        <h1 className="mb-2 mt-0 text-[1.75rem] font-bold text-[var(--page-text-strong)]">
          Circuit Board
        </h1>
        <button
          type="button"
          className="absolute right-0 top-0 cursor-pointer rounded-lg border-2 border-[var(--panel-border)] bg-[var(--tab-bg)] px-3 py-1.5 text-sm font-semibold text-[var(--tab-text)] transition-colors duration-150 hover:border-[var(--tab-active-border)] hover:bg-[var(--tab-active-bg)] hover:text-[var(--tab-active-text)] max-[520px]:static max-[520px]:mx-auto max-[520px]:mb-3 max-[520px]:block"
          onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>
        <nav className="flex flex-wrap justify-center gap-2" aria-label="Main sections">
          <button
            type="button"
            className={`${tabBase} ${
              activeTab === 'learn'
                ? 'border-[var(--tab-active-border)] bg-[var(--tab-active-bg)] text-[var(--tab-active-text)]'
                : 'border-[var(--tab-border)] bg-[var(--tab-bg)] text-[var(--tab-text)] hover:border-[var(--tab-active-border)] hover:bg-[var(--tab-active-bg)] hover:text-[var(--tab-active-text)]'
            }`}
            onClick={() => setActiveTab('learn')}
          >
            Learn the gates
          </button>
          <button
            type="button"
            className={`${tabBase} ${
              activeTab === 'board'
                ? 'border-[var(--tab-active-border)] bg-[var(--tab-active-bg)] text-[var(--tab-active-text)]'
                : 'border-[var(--tab-border)] bg-[var(--tab-bg)] text-[var(--tab-text)] hover:border-[var(--tab-active-border)] hover:bg-[var(--tab-active-bg)] hover:text-[var(--tab-active-text)]'
            }`}
            onClick={() => setActiveTab('board')}
          >
            Circuit board
          </button>
        </nav>
      </header>

      <main className="mx-auto max-w-[980px]">
        {activeTab === 'learn' && <GateGuide />}
        {activeTab === 'board' && (
          <>
            <section
              className="mb-5 rounded-[10px] border border-[var(--panel-border)] bg-[var(--panel-bg)] px-5 py-4"
              aria-label="How to use"
            >
              <h2 className="mb-3 mt-0 text-base font-semibold text-[var(--panel-title)]">
                How it works
              </h2>
              <ul className="m-0 list-disc pl-5 text-[0.9rem] leading-relaxed text-[var(--panel-text)] [&_li]:mb-2 [&_li:last-child]:mb-0 [&_strong]:text-[var(--panel-strong)]">
                <li>
                  <strong>Switches A and B</strong> — Turn each input ON (1) or OFF (0). The same A and B
                  signals go to every gate. When both are OFF, all lights stay off.
                </li>
                <li>
                  <strong>Power</strong> — V+ and GND rails run along the board. Wires glow orange/yellow
                  when they carry a 1; dark when they carry 0.
                </li>
                <li>
                  <strong>Gates</strong> — The board has 16 gates in four rows (two of each type, in random
                  order). Each gate is labeled (AND, OR, NOT, etc.). NOT and BUFFER use only input A; the
                  rest use A and B. Hover a gate to see what it does and how it affects the circuit.
                </li>
                <li>
                  <strong>Lights</strong> — Each gate has an LED on the right. It turns green when that
                  gate’s output is 1. The two small lamps on the left show when the A and B buses are high.
                </li>
                <li>
                  <strong>Truth tables</strong> — Below the board, each gate type has a truth table. The row
                  for your current A and B is highlighted.
                </li>
              </ul>
            </section>
            <p className="mb-3 mt-0 text-[0.85rem] tabular-nums text-[var(--panel-text)]">
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
