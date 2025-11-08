"use client";

import { useMemo, useState } from "react";
import { DrawdownChart } from "@/components/DrawdownChart";
import { MetricCard } from "@/components/MetricCard";
import {
  simulateAgentPerformance,
  type AgentConfig,
  type StrategyFocus,
  type TradingHorizon,
} from "@/lib/simulation";

const PAIRS = [
  "EUR/USD",
  "GBP/USD",
  "USD/JPY",
  "AUD/USD",
  "USD/CAD",
  "NZD/USD",
  "USD/CHF",
  "EUR/JPY",
];

const formatPercent = (value: number, decimals = 1) =>
  `${(value * 100).toLocaleString(undefined, {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  })}%`;

const formatRatio = (value: number, decimals = 2) =>
  value.toLocaleString(undefined, {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  });

export function AgentConfigurator() {
  const [config, setConfig] = useState<AgentConfig>({
    capital: 250_000,
    riskLevel: 42,
    drawdownTarget: 8,
    leverage: 5,
    horizon: "swing",
    strategyFocus: "trend",
    pairs: ["EUR/USD", "USD/JPY", "GBP/USD"],
  });

  const simulation = useMemo(() => simulateAgentPerformance(config), [config]);

  const updateConfig = <Key extends keyof AgentConfig>(key: Key, value: AgentConfig[Key]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const togglePair = (pair: string) => {
    setConfig((prev) => {
      const exists = prev.pairs.includes(pair);
      if (exists) {
        return { ...prev, pairs: prev.pairs.filter((item) => item !== pair) };
      }
      return { ...prev, pairs: [...prev.pairs, pair] };
    });
  };

  return (
    <section className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <div className="space-y-6">
        <div className="rounded-3xl border border-white/10 bg-white/70 p-6 shadow-xl shadow-slate-900/10 backdrop-blur dark:bg-slate-900/80">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-500">
            Configure Agent
          </h2>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
            Align the capital engine with your drawdown ceiling. The optimizer tunes risk surfaces
            for the strongest expectancy inside your allocated stress budget.
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/60 p-4 dark:bg-slate-900/70">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Capital (USD)
              </span>
              <input
                type="range"
                min={25000}
                max={1_000_000}
                step={25000}
                value={config.capital}
                onChange={(event) => updateConfig("capital", Number(event.target.value))}
              />
              <span className="text-lg font-semibold text-slate-900 dark:text-white">
                ${config.capital.toLocaleString()}
              </span>
            </label>

            <label className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/60 p-4 dark:bg-slate-900/70">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Drawdown Budget
              </span>
              <input
                type="range"
                min={3}
                max={20}
                step={1}
                value={config.drawdownTarget}
                onChange={(event) => updateConfig("drawdownTarget", Number(event.target.value))}
              />
              <span className="text-lg font-semibold text-slate-900 dark:text-white">
                {config.drawdownTarget}%
              </span>
            </label>

            <label className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/60 p-4 dark:bg-slate-900/70">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Risk Throttle
              </span>
              <input
                type="range"
                min={10}
                max={90}
                step={1}
                value={config.riskLevel}
                onChange={(event) => updateConfig("riskLevel", Number(event.target.value))}
              />
              <span className="text-lg font-semibold text-slate-900 dark:text-white">
                {config.riskLevel}
              </span>
            </label>

            <label className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/60 p-4 dark:bg-slate-900/70">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Leverage
              </span>
              <input
                type="range"
                min={1}
                max={12}
                step={1}
                value={config.leverage}
                onChange={(event) => updateConfig("leverage", Number(event.target.value))}
              />
              <span className="text-lg font-semibold text-slate-900 dark:text-white">
                {config.leverage}x
              </span>
            </label>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Trading Horizon
              </span>
              <div className="flex flex-wrap gap-2">
                {(["intraday", "swing", "position"] as TradingHorizon[]).map((horizon) => (
                  <button
                    key={horizon}
                    type="button"
                    onClick={() => updateConfig("horizon", horizon)}
                    className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                      config.horizon === horizon
                        ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/30"
                        : "bg-white/60 text-slate-600 hover:bg-emerald-100/60 dark:bg-slate-900/60 dark:text-slate-200"
                    }`}
                  >
                    {horizon === "intraday" ? "Intraday" : horizon === "swing" ? "Swing" : "Position"}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Strategy Bias
              </span>
              <div className="flex flex-wrap gap-2">
                {(
                  ["trend", "meanReversion", "carry", "volatilityCapture"] as StrategyFocus[]
                ).map((strategy) => (
                  <button
                    key={strategy}
                    type="button"
                    onClick={() => updateConfig("strategyFocus", strategy)}
                    className={`rounded-full px-3 py-1 text-sm font-medium capitalize transition-colors ${
                      config.strategyFocus === strategy
                        ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/30"
                        : "bg-white/60 text-slate-600 hover:bg-emerald-100/60 dark:bg-slate-900/60 dark:text-slate-200"
                    }`}
                  >
                    {strategy.replace(/([A-Z])/g, " $1")}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Active Pairs
            </span>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {PAIRS.map((pair) => {
                const selected = config.pairs.includes(pair);
                return (
                  <button
                    key={pair}
                    type="button"
                    onClick={() => togglePair(pair)}
                    className={`flex items-center justify-between rounded-xl border px-3 py-2 text-sm font-medium transition-all ${
                      selected
                        ? "border-emerald-400 bg-emerald-500/10 text-emerald-600 shadow-inner shadow-emerald-500/10 dark:border-emerald-400/70 dark:bg-emerald-400/10 dark:text-emerald-300"
                        : "border-white/10 bg-white/50 text-slate-600 hover:border-emerald-400/60 hover:bg-emerald-50 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-emerald-500/10"
                    }`}
                  >
                    {pair}
                    <span
                      className={`h-2 w-2 rounded-full ${
                        selected ? "bg-emerald-400" : "bg-slate-300 dark:bg-slate-600"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <MetricCard
            label="Expected Return"
            value={formatPercent(simulation.expectedAnnualReturn, 1)}
            helper="Annualized expectancy post-optimization."
            emphasis
          />
          <MetricCard
            label="Max Drawdown"
            value={formatPercent(simulation.maxDrawdown, 1)}
            helper="Peak-to-trough risk in the simulation window."
          />
          <MetricCard
            label="Sharpe"
            value={formatRatio(simulation.sharpe, 2)}
            helper="Risk-adjusted edge factor (rfr=0)."
          />
          <MetricCard
            label="Win Rate"
            value={formatPercent(simulation.winRate, 1)}
            helper="Positive sessions vs. total sessions."
          />
          <MetricCard
            label="Profit Factor"
            value={formatRatio(simulation.profitFactor, 2)}
            helper="Gross gains divided by gross losses."
          />
          <MetricCard
            label="Capital Efficiency"
            value={`$${Math.round(simulation.capitalEfficiency).toLocaleString()}`}
            helper="Capital deployed per unit of max drawdown."
          />
        </div>
      </div>

      <div className="space-y-6">
        <DrawdownChart timeline={simulation.equityCurve} />

        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/80 to-slate-900/50 p-6 text-slate-200 shadow-xl shadow-emerald-500/10">
          <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">
            Risk Playbook
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            {simulation.optimization.narrative}
          </p>
          <dl className="mt-5 grid gap-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-400">Tuned Risk Level</dt>
              <dd className="font-semibold text-white">{simulation.optimization.tunedRiskLevel}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Tuned Leverage</dt>
              <dd className="font-semibold text-white">{simulation.optimization.tunedLeverage}x</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Projected Return</dt>
              <dd className="font-semibold text-emerald-400">
                {formatPercent(simulation.optimization.projectedReturn, 1)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Projected Drawdown</dt>
              <dd className="font-semibold text-amber-200">
                {formatPercent(simulation.optimization.projectedDrawdown, 1)}
              </dd>
            </div>
          </dl>
          <p className="mt-6 text-[11px] leading-relaxed text-slate-400">
            Simulations are hypothetical and incorporate conservative slippage, liquidity controls,
            and volatility filters. No model can guarantee future performance. Align sizing with your
            regulatory obligations and stress-test across independent data.
          </p>
        </div>
      </div>
    </section>
  );
}
