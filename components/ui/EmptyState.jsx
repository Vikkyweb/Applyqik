// An empty screen is an invitation to act, not a dead end.
export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {Icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-line-soft">
          <Icon className="h-5 w-5 text-slate" />
        </div>
      )}
      <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-slate">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
