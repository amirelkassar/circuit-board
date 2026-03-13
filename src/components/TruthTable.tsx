import { GATE_TYPES } from '../logic/types';
import { getTruthTable, GATE_INFO } from '../logic/gateData';
import type { Signal, GateType } from '../logic/types';
import './TruthTable.css';

export type GateStatus = {
  position: number;
  gateType: GateType;
  /** e.g. AND0, AND1 for repeated types */
  label: string;
  output: Signal;
};

type Props = {
  inputA: Signal;
  inputB: Signal;
  /** When provided (e.g. on full board tab), show a table per gate with A, B, Out */
  gateStatuses?: GateStatus[];
};

export function TruthTable({ inputA, inputB, gateStatuses }: Props) {
  return (
    <div className="truth-table-panel">
      <h3 className="truth-table-panel__title">Truth tables</h3>
      <p className="truth-table-panel__current">
        Current: A = <strong>{inputA}</strong>, B = <strong>{inputB}</strong>
      </p>
      {gateStatuses && gateStatuses.length > 0 && (
        <div className="truth-table-panel__gate-status">
          <h4 className="truth-table-panel__gate-status-title">Each gate on board (A, B, Out)</h4>
          <div className="truth-table-panel__gate-status-grid">
            {gateStatuses.map(({ position, gateType, label, output }) => {
              const hasTwo = GATE_INFO[gateType].hasTwoInputs;
              return (
                <div
                  key={position}
                  className={`truth-table-panel__gate-status-item truth-table-panel__gate-status-item--${output ? 'on' : 'off'}`}
                >
                  <div className="truth-table-panel__gate-status-label">{label}</div>
                  <table className="truth-table-panel__gate-status-table">
                    <thead>
                      <tr>
                        <th>A</th>
                        {hasTwo && <th>B</th>}
                        <th>Out</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{inputA}</td>
                        {hasTwo && <td>{inputB}</td>}
                        <td className="truth-table-panel__gate-status-out-cell">{output}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {(!gateStatuses || gateStatuses.length === 0) && (
        <div className="truth-table-panel__grid">
          {GATE_TYPES.map((gateType) => {
            const rows = getTruthTable(gateType);
            const hasTwo = rows[0].b !== null;
            return (
              <div key={gateType} className="truth-table-block">
                <div className="truth-table-block__gate">{gateType}</div>
                <table className="truth-table-block__table">
                  <thead>
                    <tr>
                      <th>A</th>
                      {hasTwo && <th>B</th>}
                      <th>Out</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => {
                      const isActive = hasTwo
                        ? row.a === inputA && row.b === inputB
                        : row.a === inputA;
                      return (
                        <tr
                          key={i}
                          className={
                            isActive ? 'truth-table-block__row--active' : ''
                          }
                        >
                          <td>{row.a}</td>
                          {hasTwo && <td>{row.b}</td>}
                          <td className="truth-table-block__out">
                            {row.output}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
