// Reference stat card design (icon chip + value/unit + change pill).
// Applyqik passes real data via props; visual identical to the eco reference.
export default function StatCard({
  icon: Icon,
  value,
  unit,
  label,
  change,
  positive = true,
}) {
  return (
    <div className="flex flex-1 items-center gap-3 rounded-2xl bg-surface p-4 ring-1 ring-black/5  sm:gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-line-soft">
        <Icon className="h-5 w-5 text-foreground" strokeWidth={1.8} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <p className="font-display text-xl font-bold text-primary sm:text-2xl">
            {value}
            {unit && <span className="ml-0.5 text-xs font-semibold text-foreground">{unit}</span>}
          </p>
          {change != null && (
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                positive
                  ? 'bg-success-soft text-success-ink'
                  : 'bg-red-50 text-red-500'
              }`}
            >
              {positive ? '▲' : '▼'} {change}
            </span>
          )}
        </div>
        <p className="truncate text-xs text-foreground/70">{label}</p>
      </div>
    </div>
  );
}