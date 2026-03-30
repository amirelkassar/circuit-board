export function PowerSource() {
  return (
    <div
      className="flex flex-col items-center gap-0.5 rounded-md border-2 border-[#444] bg-[#1a1a1a] px-2.5 py-1 text-base font-bold"
      role="img"
      aria-label="Power supply"
    >
      <span className="text-[#c44]">+</span>
      <span className="text-[#48f]">−</span>
    </div>
  );
}
