export type TradingHorizon = "intraday" | "swing" | "position";

export type StrategyFocus = "trend" | "meanReversion" | "carry" | "volatilityCapture";

export interface AgentConfig {
  capital: number;
  riskLevel: number; // 1 - 100
  drawdownTarget: number; // target drawdown percentage
  leverage: number; // 1 - 20
  horizon: TradingHorizon;
  strategyFocus: StrategyFocus;
  pairs: string[];
}

export interface EquityPoint {
  index: number;
  equity: number;
  drawdown: number;
}

export interface OptimizationInsight {
  tunedRiskLevel: number;
  tunedLeverage: number;
  projectedReturn: number;
  projectedDrawdown: number;
  narrative: string;
}

export interface SimulationResult {
  expectedAnnualReturn: number;
  volatility: number;
  sharpe: number;
  maxDrawdown: number;
  winRate: number;
  profitFactor: number;
  equityCurve: EquityPoint[];
  optimization: OptimizationInsight;
  capitalEfficiency: number;
}

type StrategyProfile = {
  baseDrift: number;
  baseVolatility: number;
};

const STRATEGY_PROFILES: Record<StrategyFocus, StrategyProfile> = {
  trend: { baseDrift: 0.00075, baseVolatility: 0.0095 },
  meanReversion: { baseDrift: 0.00055, baseVolatility: 0.0075 },
  carry: { baseDrift: 0.00065, baseVolatility: 0.006 },
  volatilityCapture: { baseDrift: 0.00045, baseVolatility: 0.0055 },
};

const HORIZON_MODIFIERS: Record<
  TradingHorizon,
  { driftMultiplier: number; volatilityMultiplier: number }
> = {
  intraday: {
    driftMultiplier: 0.65,
    volatilityMultiplier: 1.4,
  },
  swing: {
    driftMultiplier: 1,
    volatilityMultiplier: 1,
  },
  position: {
    driftMultiplier: 1.2,
    volatilityMultiplier: 0.75,
  },
};

const currencyDiversificationBonus = (pairs: string[]): number => {
  const uniqueBases = new Set<string>();
  const uniqueQuotes = new Set<string>();

  pairs.forEach((pair) => {
    const [base, quote] = pair.split("/");
    if (base) uniqueBases.add(base);
    if (quote) uniqueQuotes.add(quote);
  });

  const depthScore = Math.min(1.15, 1 + (uniqueBases.size + uniqueQuotes.size) * 0.015);
  return depthScore;
};

const gaussian = (mean: number, stdDev: number): number => {
  const u1 = Math.random() || Number.EPSILON;
  const u2 = Math.random() || Number.EPSILON;
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return z0 * stdDev + mean;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const applyTailRiskControls = (rawReturn: number, riskLevel: number, drawdownTarget: number) => {
  const tailBuffer = 0.02 + (drawdownTarget / 100) * 0.25;
  const maxLossPerPeriod = -0.04 - (riskLevel / 100) * 0.08;
  const softenedReturn = Math.tanh(rawReturn / tailBuffer) * tailBuffer;
  return Math.max(softenedReturn, maxLossPerPeriod);
};

export const simulateAgentPerformance = (config: AgentConfig): SimulationResult => {
  const strategyProfile = STRATEGY_PROFILES[config.strategyFocus];
  const horizonModifier = HORIZON_MODIFIERS[config.horizon];
  const diversificationMultiplier = currencyDiversificationBonus(config.pairs);

  const riskScalar = 0.6 + (config.riskLevel / 100) * 1.4;
  const leverageScalar = 0.6 + (config.leverage / 10);
  const drawdownDiscipline = clamp(1 - config.drawdownTarget / 100, 0.35, 0.95);

  const adjustedDrift =
    strategyProfile.baseDrift *
    horizonModifier.driftMultiplier *
    diversificationMultiplier *
    (0.85 + (config.riskLevel / 120) * drawdownDiscipline);

  const adjustedVolatility =
    strategyProfile.baseVolatility *
    horizonModifier.volatilityMultiplier *
    diversificationMultiplier *
    riskScalar *
    (0.85 + (1 - drawdownDiscipline));

  const normalizedLeverage = clamp(leverageScalar, 0.8, 2.2);
  const periods = 220;
  const periodReturns: number[] = [];
  const equityCurve: EquityPoint[] = [];

  let equity = 1;
  let runningPeak = 1;
  let maxDrawdown = 0;
  let wins = 0;
  let positiveSum = 0;
  let negativeSum = 0;

  for (let i = 0; i < periods; i++) {
    const drift = adjustedDrift * normalizedLeverage * (0.95 + Math.random() * 0.1);
    const volShock = gaussian(0, adjustedVolatility * normalizedLeverage);
    const fatTail = (Math.random() - 0.5) * adjustedVolatility * 1.5 * (riskScalar - 0.3);
    const rawReturn = drift + volShock + fatTail;
    const controlledReturn = applyTailRiskControls(
      rawReturn,
      config.riskLevel,
      config.drawdownTarget
    );

    periodReturns.push(controlledReturn);
    equity *= 1 + controlledReturn;
    runningPeak = Math.max(runningPeak, equity);
    const drawdown = runningPeak === 0 ? 0 : (runningPeak - equity) / runningPeak;
    maxDrawdown = Math.max(maxDrawdown, drawdown);

    if (controlledReturn >= 0) {
      wins += 1;
      positiveSum += controlledReturn;
    } else {
      negativeSum += Math.abs(controlledReturn);
    }

    equityCurve.push({
      index: i,
      equity,
      drawdown,
    });
  }

  const avgReturn = periodReturns.reduce((acc, val) => acc + val, 0) / periods;
  const variance =
    periodReturns.reduce((acc, val) => acc + Math.pow(val - avgReturn, 2), 0) / periods;
  const stdDev = Math.sqrt(variance);
  const annualizationFactor = 252 / periods;
  const expectedAnnualReturn = Math.pow(equity, annualizationFactor) - 1;
  const annualVolatility = stdDev * Math.sqrt(252);
  const sharpe = annualVolatility === 0 ? 0 : expectedAnnualReturn / annualVolatility;

  const winRate = wins / periods;
  const profitFactor =
    positiveSum === 0 || negativeSum === 0 ? 1 : clamp(positiveSum / negativeSum, 0.4, 3.5);

  const capitalEfficiency =
    maxDrawdown === 0 ? config.capital : (config.capital * (expectedAnnualReturn + 1)) / maxDrawdown;

  const targetDrawdown = config.drawdownTarget / 100;
  const tunedRiskLevel =
    maxDrawdown === 0
      ? config.riskLevel
      : clamp(
          config.riskLevel * clamp(targetDrawdown / maxDrawdown, 0.45, 1.25) * 0.96,
          8,
          92
        );

  const tunedLeverage =
    maxDrawdown === 0
      ? config.leverage
      : clamp(
          config.leverage * clamp(targetDrawdown / maxDrawdown, 0.5, 1.15) * 0.94,
          1,
          15
        );

  const projectedDrawdown = maxDrawdown * clamp(tunedRiskLevel / config.riskLevel, 0.5, 1.2);
  const projectedReturn =
    expectedAnnualReturn * clamp(tunedRiskLevel / config.riskLevel, 0.6, 1.1) * 0.95;

  const optimization: OptimizationInsight = {
    tunedRiskLevel: Math.round(tunedRiskLevel),
    tunedLeverage: Math.round(tunedLeverage * 10) / 10,
    projectedReturn,
    projectedDrawdown: clamp(projectedDrawdown, 0.02, 0.25),
    narrative:
      maxDrawdown > targetDrawdown
        ? "Risk controls tightened to respect the drawdown objective while preserving the core edge."
        : "Headroom available. Gradually increase risk until the drawdown budget is utilized.",
  };

  return {
    expectedAnnualReturn,
    volatility: annualVolatility,
    sharpe,
    maxDrawdown,
    winRate,
    profitFactor,
    equityCurve,
    optimization,
    capitalEfficiency,
  };
};
