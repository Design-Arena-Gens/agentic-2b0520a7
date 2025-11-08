const PLAYBOOKS = [
  {
    title: "Momentum Matrix",
    focus: "Trend Alignment",
    description:
      "Constructs correlated trend baskets with staggered entry timing. Uses adaptive trailing stops keyed to FX volatility regimes.",
    checklist: [
      "Pair strength scan across DXY, risk-on FX, and exotics",
      "14 & 48 session slope confirmation with ATR gating",
      "Partial exits at 1.8R, 2.6R, trail balance with structure-based stops",
    ],
  },
  {
    title: "Carry Reinforcement",
    focus: "Rate Divergence",
    description:
      "Harvests positive carry with volatility hedges. Deploys dynamic position sizing relative to central bank path dispersion.",
    checklist: [
      "Real yield spread > 60 bps and trending widening",
      "Macro confirmation through PMI & CPI surprises",
      "Overlay long vol gamma on event-heavy weeks",
    ],
  },
  {
    title: "Volatility Capture",
    focus: "Mean Reversion + Gamma",
    description:
      "Straddles range-bound regimes with gamma scalping. Uses machine-aided pivots to fade extension candles inside liquidity pockets.",
    checklist: [
      "Implied vs realized volatility gap above 1.4x",
      "Liquidity pulse via session volume heat map",
      "Hard stop at -0.6R with auto re-entry when tape stabilizes",
    ],
  },
];

export function StrategyPlaybooks() {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/60 p-6 shadow-lg shadow-slate-900/10 backdrop-blur-md dark:bg-slate-900/70">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-500">
            Institutional Playbooks
          </h3>
          <p className="mt-1 max-w-xl text-base text-slate-600 dark:text-slate-300">
            Curated frameworks reinforce agent logic in fast-moving FX regimes. Activate, adapt,
            deploy.
          </p>
        </div>
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {PLAYBOOKS.map((playbook) => (
          <article
            key={playbook.title}
            className="group flex flex-col rounded-2xl border border-white/10 bg-gradient-to-br from-white via-white/70 to-slate-100/60 p-5 shadow-md shadow-emerald-500/5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/70 hover:shadow-lg hover:shadow-emerald-500/20 dark:from-slate-900 dark:via-slate-900/80 dark:to-slate-900/50"
          >
            <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
              {playbook.focus}
            </div>
            <h4 className="mt-2 text-lg font-semibold text-slate-900 group-hover:text-emerald-500 dark:text-white">
              {playbook.title}
            </h4>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {playbook.description}
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              {playbook.checklist.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1 h-2 w-2 flex-none rounded-full bg-emerald-400/80" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
