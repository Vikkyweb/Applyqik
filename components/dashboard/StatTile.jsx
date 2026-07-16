export default function StatTile({ label, value, accent = false }) {
  return (
    <div className="card p-4">
      <p className="text-xs font-medium text-slate">{label}</p>
      <p className={`mt-1 font-display text-2xl font-semibold ${accent ? 'text-accent-ink' : 'text-ink'}`}>
        {value}
      </p>
    </div>
  );
}
