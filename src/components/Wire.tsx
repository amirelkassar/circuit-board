import './Wire.css';

type Props = {
  d: string;
  active: boolean;
  className?: string;
};

export function Wire({ d, active, className = '' }: Props) {
  return (
    <path
      className={`wire ${active ? 'wire--active' : ''} ${className}`.trim()}
      d={d}
      fill="none"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}
