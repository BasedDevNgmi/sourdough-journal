export function CountdownUnit({ value, label }) {
  const display = String(value).padStart(2, '0')
  return (
    <div className="flex flex-col items-center gap-3">
      <span
        key={display}
        className="tick-in font-mono text-7xl sm:text-8xl font-thin text-white tabular-nums"
      >
        {display}
      </span>
      <span className="text-neutral-500 text-xs tracking-widest uppercase">
        {label}
      </span>
    </div>
  )
}
