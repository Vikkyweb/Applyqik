// A match/ATS score, color-ramped. Mono font so numbers read as data.
export default function ScoreBadge({ score, size = 'md' }) {
  if (score === null || score === undefined) return null;

  const tone =
    score >= 80
      ? 'bg-accent-soft text-accent-ink'
      : score >= 60
      ? 'bg-[#FBF3E3] text-[#9A6B12]'
      : 'bg-line-soft text-slate';

  const sizing = size === 'lg' ? 'text-sm px-2.5 py-1' : 'text-xs px-2 py-0.5';

  return (
    <span className={`inline-flex items-center rounded-pill font-mono font-semibold ${tone} ${sizing}`}>
      {score}
      <span className="opacity-60">%</span>
    </span>
  );
}
