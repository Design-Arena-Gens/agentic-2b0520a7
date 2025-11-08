import type { EquityPoint } from "@/lib/simulation";

interface DrawdownChartProps {
  timeline: EquityPoint[];
}

const formatPoint = (value: number) => Number(value.toFixed(4));

export function DrawdownChart({ timeline }: DrawdownChartProps) {
  if (!timeline.length) return null;

  const maxEquity = Math.max(...timeline.map((point) => point.equity));
  const minEquity = Math.min(...timeline.map((point) => point.equity));
  const equitySpan = maxEquity - minEquity || 1;

  const points = timeline
    .map((point, idx) => {
      const x = (idx / (timeline.length - 1 || 1)) * 100;
      const normalizedEquity = (point.equity - minEquity) / equitySpan;
      const y = 100 - normalizedEquity * 100;
      return `${formatPoint(x)},${formatPoint(y)}`;
    })
    .join(" ");

  return (
    <div className="rounded-2xl border border-white/5 bg-gradient-to-b from-slate-900 via-slate-900/80 to-slate-900/50 p-6 shadow-lg shadow-slate-900/20">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
        Equity Curve Projection
      </h3>
      <div className="mt-4 h-48">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <defs>
            <linearGradient id="equityGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#1f2937" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <polyline
            fill="none"
            stroke="url(#equityGradient)"
            strokeWidth={1.6}
            points={points}
            vectorEffect="non-scaling-stroke"
          />
          <polyline
            fill="url(#equityGradient)"
            stroke="none"
            points={`0,100 ${points} 100,100`}
            opacity={0.4}
          />
        </svg>
      </div>
      <p className="mt-3 text-xs text-slate-400">
        Simulated performance path after applying adaptive risk and tail-risk controls.
      </p>
    </div>
  );
}
