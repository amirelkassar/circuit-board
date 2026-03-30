type Props = {
  d: string;
  active: boolean;
  className?: string;
  /** SVG stroke width (circuit board uses thicker wires) */
  strokeWidth?: number;
};

export function Wire({ d, active, className = '', strokeWidth = 2.5 }: Props) {
  return (
    <path
      className={`fill-none stroke-linecap-round stroke-linejoin-round transition-[stroke,filter] duration-200 ${
        active
          ? 'stroke-[#ee8800] [filter:drop-shadow(0_0_3px_rgba(255,200,80,0.9))] [animation:wire-glow_0.5s_ease-in-out_infinite_alternate]'
          : 'stroke-[#333]'
      } ${className}`.trim()}
      d={d}
      strokeWidth={strokeWidth}
    />
  );
}
