import { GATE_TYPES } from '../logic/types';
import { getTruthTable } from '../logic/gateData';
import type { Signal } from '../logic/types';
import './TruthTable.css';

type Props = {
  inputA: Signal;
  inputB: Signal;
};

export function TruthTable({ inputA, inputB }: Props) {
  return (
    <div className="truth-table-panel">
      <h3 className="truth-table-panel__title">Truth tables</h3>
      <p className="truth-table-panel__current">
        Current: A = <strong>{inputA}</strong>, B = <strong>{inputB}</strong>
      </p>
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
    </div>
  );
}
