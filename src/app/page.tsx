import { AgentConfigurator } from "@/components/AgentConfigurator";
import { StrategyPlaybooks } from "@/components/StrategyPlaybooks";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.18),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(14,116,144,0.22),_transparent_60%)]" />
      <main className="relative mx-auto flex min-h-screen max-w-6xl flex-col gap-14 px-5 py-16 sm:px-8 lg:px-10">
        <header className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/50 bg-emerald-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300">
            FX Edge Lab
          </span>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Deploy forex trading agents engineered for maximum expectancy inside disciplined drawdown
            budgets.
          </h1>
          <p className="max-w-2xl text-lg text-slate-300">
            Model-based risk overlays balance aggressive alpha capture with real-world stress limits.
            Blend momentum, carry, and volatility edges into a unified execution stack that respects
            liquidity and protects capital.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400" /> Adaptive position sizing
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-teal-400" /> Tail-risk suppression
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-sky-400" /> Liquidity aware routing
            </span>
          </div>
        </header>

        <AgentConfigurator />

        <StrategyPlaybooks />

        <footer className="rounded-3xl border border-white/10 bg-white/10 p-6 text-sm text-slate-300 backdrop-blur">
          <div className="font-semibold uppercase tracking-wide text-slate-400">
            Disclaimer & Risk Notice
          </div>
          <p className="mt-3 leading-relaxed text-slate-300">
            The projections and simulations shown are hypothetical and do not guarantee future
            results. FX trading involves substantial risk of loss and is not suitable for every
            investor. Past performance is not indicative of future outcomes. Use these tools for
            research support, validate assumptions against independent data, and ensure compliance
            with applicable regulations before deploying live capital.
          </p>
        </footer>
      </main>
    </div>
  );
}
