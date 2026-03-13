import { useState, useMemo, useEffect } from 'react';
import type { GateType } from '../logic/types';
import { GATE_TYPES } from '../logic/types';
import { computeOutput } from '../logic/gates';
import { GATE_INFO } from '../logic/gateData';
import { GameBoard } from './GameBoard';
import './GateGuide.css';

export function GateGuide() {
  const [levelIndex, setLevelIndex] = useState(0);
  const [inputA, setInputA] = useState(false);
  const [inputB, setInputB] = useState(false);

  const gate = GATE_TYPES[levelIndex];
  const gateInfo = GATE_INFO[gate];

  // When switching to a new gate, always start with lamp off so the user lights it
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
    <div className="gate-guide">
      <section className="gate-guide__game">
        <h2 className="gate-guide__section-title">Light the lamp</h2>
        <p className="gate-guide__level">
          Gate {levelIndex + 1} of {GATE_TYPES.length}: <strong>{gate}</strong>
        </p>
        <div className="gate-guide__description">
          <h3 className="gate-guide__description-title">How the {gate} gate works</h3>
          <p className="gate-guide__description-formula">Formula: {gateInfo.formula}</p>
          <p className="gate-guide__description-text">{gateInfo.explanation}</p>
          <p className="gate-guide__game-instruction">
            The lamp below starts <strong>off</strong>. Use the switches to light it.
          </p>
        </div>
        <div className="gate-guide__board-wrap">
          <GameBoard
            gateType={gate}
            inputA={inputA}
            inputB={inputB}
            onInputAChange={() => setInputA((a) => !a)}
            onInputBChange={() => setInputB((b) => !b)}
          />
        </div>
        {lampIsOn && (
          <div className="gate-guide__success">
            <p className="gate-guide__success-text">Lamp is on! Well done.</p>
            <button type="button" className="gate-guide__next" onClick={handleNext}>
              {isLastLevel ? 'Play again' : 'Next gate'}
            </button>
          </div>
        )}
      </section>

      <section className="gate-guide__explain">
        <h2 className="gate-guide__section-title">Each gate explained</h2>
        <p className="gate-guide__pick-hint">Click a card to run that gate in the board above.</p>
        <div className="gate-guide__gates">
          {GATE_TYPES.map((gateType, index) => {
            const info = GATE_INFO[gateType];
            const isSelected = index === levelIndex;
            return (
              <button
                key={gateType}
                type="button"
                className={`gate-guide__card ${isSelected ? 'gate-guide__card--selected' : ''}`}
                onClick={() => setLevelIndex(index)}
              >
                <h3 className="gate-guide__card-title">{gateType}</h3>
                <p className="gate-guide__formula">{info.formula}</p>
                <p className="gate-guide__desc">{info.description}</p>
                <span className="gate-guide__card-action">
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
