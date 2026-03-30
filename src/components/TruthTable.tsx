import { GATE_TYPES } from '../logic/types';
import { getTruthTable, GATE_INFO } from '../logic/gateData';
import type { Signal, GateType } from '../logic/types';

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
    <div className="mt-4 rounded-[10px] border-2 border-[var(--panel-border)] bg-[var(--panel-bg)] p-3">
      <h3 className="mb-2 mt-0 text-base text-[var(--panel-title)]">Truth tables</h3>
      <p className="mb-3 mt-0 text-[0.9rem] text-[var(--panel-text)] [&_strong]:text-[var(--accent)]">
        Current: A = <strong>{inputA}</strong>, B = <strong>{inputB}</strong>
      </p>
      {gateStatuses && gateStatuses.length > 0 && (
        <div className="mb-4 border-b border-[var(--panel-border)] pb-4">
          <h4 className="mb-2.5 mt-0 text-[0.95rem] font-semibold text-[var(--panel-title)]">
            Each gate on board (A, B, Out)
          </h4>
          <div className="grid grid-cols-4 gap-2.5 max-[600px]:grid-cols-2 min-[900px]:grid-cols-8">
            {gateStatuses.map(({ position, gateType, label, output }) => {
              const hasTwo = GATE_INFO[gateType].hasTwoInputs;
              return (
                <div
                  key={position}
                  className={`rounded-lg border px-2.5 py-2 text-[0.85rem] ${
                    output
                      ? 'border-[var(--success)] bg-[rgba(136,204,136,0.12)]'
                      : 'border-[var(--panel-border)] bg-[var(--panel-bg-deep)]'
                  }`}
                >
                  <div className="mb-1.5 text-[0.9rem] font-bold text-[var(--success)]">{label}</div>
                  <table className="w-full border-collapse text-[0.8rem]">
                    <thead>
                      <tr>
                        <th className="border border-[var(--panel-border)] px-1.5 py-1 text-center font-semibold text-[var(--page-text-muted)]">
                          A
                        </th>
                        {hasTwo && (
                          <th className="border border-[var(--panel-border)] px-1.5 py-1 text-center font-semibold text-[var(--page-text-muted)]">
                            B
                          </th>
                        )}
                        <th className="border border-[var(--panel-border)] px-1.5 py-1 text-center font-semibold text-[var(--page-text-muted)]">
                          Out
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-[var(--panel-border)] px-1.5 py-1 text-center tabular-nums text-[var(--panel-text)]">
                          {inputA}
                        </td>
                        {hasTwo && (
                          <td className="border border-[var(--panel-border)] px-1.5 py-1 text-center tabular-nums text-[var(--panel-text)]">
                            {inputB}
                          </td>
                        )}
                        <td
                          className={`border border-[var(--panel-border)] px-1.5 py-1 text-center font-bold tabular-nums text-[var(--panel-text)] ${output ? 'text-[var(--success)]' : ''}`}
                        >
                          {output}
                        </td>
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
        <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-2.5">
          {GATE_TYPES.map((gateType) => {
            const rows = getTruthTable(gateType);
            const hasTwo = rows[0].b !== null;
            return (
              <div
                key={gateType}
                className="overflow-hidden rounded-md border border-[var(--panel-border)] bg-[var(--panel-bg-deep)]"
              >
                <div className="bg-[var(--panel-bg)] px-1.5 py-1 text-center text-[0.7rem] font-bold text-[var(--success)]">
                  {gateType}
                </div>
                <table className="w-full border-collapse text-[0.75rem]">
                  <thead>
                    <tr>
                      <th className="border-b border-[var(--panel-border)] px-1.5 py-0.5 text-center text-[var(--page-text-muted)]">
                        A
                      </th>
                      {hasTwo && (
                        <th className="border-b border-[var(--panel-border)] px-1.5 py-0.5 text-center text-[var(--page-text-muted)]">
                          B
                        </th>
                      )}
                      <th className="border-b border-[var(--panel-border)] px-1.5 py-0.5 text-center text-[var(--page-text-muted)]">
                        Out
                      </th>
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
                            isActive
                              ? 'bg-[rgba(184,134,32,0.15)] [&_td]:text-[var(--accent)]'
                              : ''
                          }
                        >
                          <td className="border-b border-[var(--panel-border)] px-1.5 py-0.5 text-center text-[var(--panel-text)]">
                            {row.a}
                          </td>
                          {hasTwo && (
                            <td className="border-b border-[var(--panel-border)] px-1.5 py-0.5 text-center text-[var(--panel-text)]">
                              {row.b}
                            </td>
                          )}
                          <td className="border-b border-[var(--panel-border)] px-1.5 py-0.5 text-center font-semibold text-[var(--panel-text)]">
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
