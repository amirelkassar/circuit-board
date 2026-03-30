import { useState, useMemo, useEffect } from 'react';
import { GATE_TYPES } from '../logic/types';
import { computeOutput } from '../logic/gates';
import { GATE_INFO } from '../logic/gateData';
import { GameBoard } from './GameBoard';

export function GateGuide() {
  const [levelIndex, setLevelIndex] = useState(0);
  const [inputA, setInputA] = useState(false);
  const [inputB, setInputB] = useState(false);

  const gate = GATE_TYPES[levelIndex];
  const gateInfo = GATE_INFO[gate];

  useEffect(() => {
    setInputA(false);
    setInputB(false);
  }, [levelIndex]);

  const hasTwoInputs = gateInfo.hasTwoInputs;
  const sigA = inputA ? 1 : 0;
  const sigB = inputB ? 1 : 0;
  const output = useMemo(
    () =>
      hasTwoInputs
        ? computeOutput(gate, sigA, sigB)
        : computeOutput(gate, sigA),
    [gate, sigA, sigB, hasTwoInputs]
  );

  const lampIsOn = output === 1;
  const isLastLevel = levelIndex === GATE_TYPES.length - 1;

  const handleNext = () => {
    if (isLastLevel) {
      setLevelIndex(0);
    } else {
      setLevelIndex((i) => i + 1);
    }
  };

  return (
    <div className="pb-6 pt-0">
      <section className="mb-6 rounded-[10px] border border-[var(--panel-border)] bg-[var(--panel-bg)] p-5">
        <h2 className="mb-3 mt-0 text-[1.1rem] font-semibold text-[var(--panel-title)]">Light the lamp</h2>
        <p className="mb-4 mt-0 text-[0.85rem] text-[var(--page-text-muted)]">
          Gate {levelIndex + 1} of {GATE_TYPES.length}:{' '}
          <strong className="text-[var(--success)]">{gate}</strong>
        </p>
        <div className="mb-5 w-full rounded-[10px] border border-[var(--panel-border)] bg-[var(--panel-bg-deep)] px-[22px] py-5">
          <h3 className="mb-3 mt-0 text-[1.15rem] font-semibold text-[var(--panel-strong)]">
            How the {gate} gate works
          </h3>
          <p className="mb-3.5 mt-0 rounded-md border-l-[3px] border-[var(--tab-active-border)] bg-[var(--panel-bg)] px-2.5 py-2 font-mono text-base text-[var(--success)]">
            Formula: {gateInfo.formula}
          </p>
          <p className="mb-4 mt-0 text-base leading-relaxed text-[var(--panel-text)]">{gateInfo.explanation}</p>
          <p className="mt-0 border-t border-[var(--panel-border)] pt-3 text-[0.9rem] leading-snug text-[var(--page-text-muted)]">
            The lamp below starts <strong className="text-[var(--panel-strong)]">off</strong>. Use the switches to
            light it.
          </p>
        </div>
        <div className="mb-4">
          <GameBoard
            gateType={gate}
            inputA={inputA}
            inputB={inputB}
            onInputAChange={() => setInputA((a) => !a)}
            onInputBChange={() => setInputB((b) => !b)}
          />
        </div>
        {lampIsOn && (
          <div className="border-t border-[var(--panel-border)] pt-3">
            <p className="mb-2.5 mt-0 font-semibold text-[var(--success)]">Lamp is on! Well done.</p>
            <button
              type="button"
              className="cursor-pointer rounded-lg border-2 border-[var(--success)] bg-[var(--panel-bg-deep)] px-5 py-2.5 text-[0.95rem] font-semibold text-[var(--success)] transition-colors duration-150 hover:brightness-110"
              onClick={handleNext}
            >
              {isLastLevel ? 'Play again' : 'Next gate'}
            </button>
          </div>
        )}
      </section>

      <section className="mt-2">
        <h2 className="mb-3 mt-0 text-[1.1rem] font-semibold text-[var(--panel-title)]">Each gate explained</h2>
        <p className="mb-3 mt-0 text-[0.85rem] text-[var(--page-text-muted)]">
          Click a card to run that gate in the board above.
        </p>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
          {GATE_TYPES.map((gateType, index) => {
            const info = GATE_INFO[gateType];
            const isSelected = index === levelIndex;
            return (
              <button
                key={gateType}
                type="button"
                className={`block w-full cursor-pointer rounded-lg border-2 p-3.5 text-left font-inherit text-inherit transition-colors duration-150 ${
                  isSelected
                    ? 'border-[var(--card-selected-border)] bg-[var(--card-selected-bg)] shadow-[0_0_0_1px_var(--card-selected-border)] hover:brightness-[1.02]'
                    : 'border-[var(--panel-border)] bg-[var(--panel-bg)] hover:border-[var(--tab-active-border)] hover:bg-[var(--tab-active-bg)]'
                }`}
                onClick={() => setLevelIndex(index)}
              >
                <h3 className="mb-1.5 mt-0 text-[0.95rem] font-bold text-[var(--success)]">{gateType}</h3>
                <p className="mb-1.5 mt-0 font-mono text-[0.9rem] text-[var(--panel-strong)]">{info.formula}</p>
                <p className="m-0 text-[0.8rem] leading-snug text-[var(--panel-text)]">{info.description}</p>
                <span
                  className={`mt-2 block text-[0.75rem] ${isSelected ? 'text-[var(--accent)]' : 'text-[var(--success)]'}`}
                >
                  {isSelected ? 'Running' : 'Run this gate'}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
