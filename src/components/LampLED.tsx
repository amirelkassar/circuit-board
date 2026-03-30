type Props = {
  on: boolean;
  label?: string;
};

export function LampLED({ on, label }: Props) {
  return (
    <g>
      <circle
        className={`stroke-[#333] stroke-[1.5] transition-[fill,filter] duration-200 ${
          on
            ? 'fill-[#88ff88] [filter:drop-shadow(0_0_6px_rgba(136,255,136,0.9))] [animation:lamp-pulse_0.6s_ease-in-out_infinite_alternate]'
            : 'fill-[#2a2a2a]'
        }`}
        cx={0}
        cy={0}
        r={10}
      />
      {label && (
        <text className="fill-[#888] font-sans text-[10px]" y={22} textAnchor="middle">
          {label}
        </text>
      )}
    </g>
  );
}
