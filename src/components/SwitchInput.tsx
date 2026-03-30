type Props = {
  label: string;
  on: boolean;
  onToggle: () => void;
};

export function SwitchInput({ label, on, onToggle }: Props) {
  return (
    <button
      type="button"
      className={`flex min-w-[52px] cursor-pointer flex-col items-center gap-0.5 rounded-lg border-2 px-2.5 py-1.5 text-sm font-semibold transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fa0] ${
        on
          ? 'border-[#4a6a2a] bg-[#2a3a1a] text-[#8f8] shadow-[0_0_10px_rgba(255,200,100,0.25)] hover:bg-[#334428]'
          : 'border-[#555] bg-[#2a2a2a] text-[#666] hover:border-[#666] hover:bg-[#333]'
      }`}
      onClick={onToggle}
      aria-pressed={on}
      aria-label={`Switch ${label}: ${on ? 'ON' : 'OFF'}`}
    >
      <span className="text-[0.7rem] uppercase tracking-wide">{label}</span>
      <span className="text-[0.85rem]">{on ? 'ON' : 'OFF'}</span>
    </button>
  );
}
