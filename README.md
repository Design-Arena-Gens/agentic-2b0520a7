## FX Edge Lab

FX Edge Lab is a web-based toolkit for designing forex trading agents that pursue high expectancy
while honoring strict drawdown constraints. The interface combines parameterized risk controls,
diversified currency baskets, and Monte Carlo-style simulations to surface balanced agent
configurations.

### Features

- Adaptive optimizer that tunes risk throttle and leverage toward a drawdown budget
- Simulated equity curve with tail-risk dampening
- Institutional strategy playbooks covering momentum, carry, and volatility capture frameworks
- Capital efficiency and risk-adjusted performance metrics presented with contextual guidance
- Built on Next.js App Router with Tailwind CSS 4

### Local Development

```bash
npm install
npm run dev
```

### Production Build

```bash
npm run build
npm run start
```

### Important Notice

The analytics and simulations in this project are hypothetical and do not guarantee future
performance. Foreign exchange trading involves significant risk and can result in loss of capital.
Validate all configurations against independent data and comply with applicable regulations before
deploying live strategies.
