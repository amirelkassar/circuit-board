type Props = {
  x: number;
  y: number;
  active?: boolean;
};

export function Resistor({ x, y, active = false }: Props) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect
        x={-8}
        y={-4}
        width={16}
        height={8}
        rx={2}
        className={
          active
            ? 'fill-[#5a4a20] stroke-[#bb9900] stroke-1'
            : 'fill-[#3a3520] stroke-[#666] stroke-1'
        }
      />
    </g>
  );
}
