interface MetricCardProps {
  label: string;
  value: string;
  helper?: string;
  emphasis?: boolean;
}

export function MetricCard({ label, value, helper, emphasis }: MetricCardProps) {
  return (
    <div
      className={`rounded-2xl border border-white/5 bg-white/70 p-5 shadow-lg shadow-slate-900/5 backdrop-blur-md dark:bg-slate-900/60 ${
        emphasis ? "border-emerald-500/60" : ""
      }`}
    >
      <div className="text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </div>
      <div className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{value}</div>
      {helper ? (
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300/80">{helper}</p>
      ) : null}
    </div>
  );
}
