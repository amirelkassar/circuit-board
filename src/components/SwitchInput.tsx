import './SwitchInput.css';

type Props = {
  label: string;
  on: boolean;
  onToggle: () => void;
};

export function SwitchInput({ label, on, onToggle }: Props) {
  return (
    <button
      type="button"
      className={`switch-input ${on ? 'switch-input--on' : 'switch-input--off'}`}
      onClick={onToggle}
      aria-pressed={on}
      aria-label={`Switch ${label}: ${on ? 'ON' : 'OFF'}`}
    >
      <span className="switch-input__label">{label}</span>
      <span className="switch-input__state">{on ? 'ON' : 'OFF'}</span>
    </button>
  );
}
