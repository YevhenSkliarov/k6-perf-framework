# k6 Performance Testing Framework

[![Performance tests](https://github.com/YevhenSkliarov/k6-perf-framework/actions/workflows/performance.yml/badge.svg)](https://github.com/YevhenSkliarov/k6-perf-framework/actions/workflows/performance.yml)

Performance test framework built with **k6 + TypeScript** against [QuickPizza](https://github.com/grafana/quickpizza), Grafana's demo application.
One set of user scenarios runs under different load profiles (smoke, load, stress, spike, soak), with pass/fail decided by thresholds, HTML/JSON reports, and CI in GitHub Actions.

## run quickpizza locally
docker run --rm -it -p 3333:3333 ghcr.io/grafana/quickpizza-local:latest

## Tech stack

- **k6 1.x** with native TypeScript support (no bundler)
- **TypeScript** for type checking only (`tsc --noEmit`)
- **Docker** to run the system under test locally
- **GitHub Actions** for CI, with QuickPizza as a service container
- **k6 web dashboard** and `handleSummary` for reports

## Project structure

```
├── src/
│   ├── api/          # API clients: send requests, never assert
│   │   ├── auth.ts
│   │   ├── pizza.ts
│   │   └── ratings.ts
│   ├── config/
│   │   ├── env.ts        # BASE_URL from environment
│   │   └── profiles.ts   # load profiles + thresholds, selected by PROFILE
│   ├── scenarios/    # user flows with checks (orderPizza, ratePizza)
│   ├── setup/        # test data preparation for setup()
│   └── utils/        # http params, checks, data generators, summary
├── tests/
│   └── api/          # entry points: options + setup + default + handleSummary
├── types/            # declarations for remote jslib imports
├── reports/          # generated HTML/JSON reports (git-ignored)
└── .github/workflows/performance.yml
```

## Design decisions

| Decision | Why |
|---|---|
| **Scenario is separate from load profile** | The same flow runs as smoke, load, stress, spike or soak. No duplicated test code. |
| **API clients never assert** | Clients are reusable in any test type. Scenarios decide what to check. |
| **`check` + `thresholds` for pass/fail** | Standard k6 approach: a load test judges the success rate and percentiles, not a single failed request. |
| **`expect` (k6-testing) only in `setup()`** | If test data can't be prepared, there is no point in generating load, so the run stops immediately. |
| **User pool created in `setup()`** | Registration is not part of what we measure; VUs pick users from the pool. |
| **`tags.name` on every request** | Groups URLs with IDs (`/api/ratings/123`) into one metric and enables per-endpoint thresholds. |
| **Per-endpoint thresholds** | The overall p95 mixes fast and slow endpoints; critical requests get their own SLO. |
| **Heavy profiles only against localhost** | Guard in `getProfile()` prevents load testing a public server by accident. |

## Load profiles

| Profile | Shape | Purpose | Key thresholds |
|---|---|---|---|
| `smoke` | 1 VU, 1 iteration | Scenario works at all | checks = 100%, no failed requests |
| `load` | ramp to 10 VU, hold, ramp down | Expected traffic | checks > 99%, p95 < 500 ms, createPizza p95 < 800 ms |
| `stress` | 20 → 50 → 100 VU | Find where degradation starts | failures < 5% (abort on fail), p95 < 1.5 s |
| `spike` | 5 → 100 → 5 VU in seconds | Sudden burst and recovery | same as stress |
| `soak` | 10 VU for a long period | Memory/connection leaks | same as load |

## Getting started

Prerequisites: [k6](https://grafana.com/docs/k6/latest/set-up/install-k6/), Node.js, Docker.

```bash
# 1. Start the system under test
docker run --rm -it -p 3333:3333 ghcr.io/grafana/quickpizza-local:latest

# 2. Install type definitions and check types
npm install
npm run typecheck

# 3. Run tests
npm run test:smoke
npm run test:load
```

Run any profile manually:

```bash
k6 run -e PROFILE=stress -e USERS=20 tests/api/rate-pizza.test.ts
```

| Variable | Default | Description |
|---|---|---|
| `PROFILE` | `smoke` | `smoke`, `load`, `stress`, `spike`, `soak` |
| `BASE_URL` | `http://localhost:3333` | Target application |
| `USERS` | `5` | Size of the user pool created in `setup()` |

## Reports

- **Live dashboard:** add `K6_WEB_DASHBOARD=true` and open http://localhost:5665 during the run.
- **HTML report:** `K6_WEB_DASHBOARD_EXPORT=reports/<name>.html` saves the dashboard as a file.
- **JSON summary:** `handleSummary` writes `reports/<profile>-<timestamp>.json` for automated comparison between runs.

## CI

`.github/workflows/performance.yml`:

- on every push and pull request: type check + **smoke** test
- manual run (**Run workflow**) with a profile choice: load, stress, spike
- QuickPizza runs as a service container; the job waits for `/ready`
- a failed threshold fails the build (k6 exits with a non-zero code)
- reports are uploaded as build artifacts even when the test fails

## Next steps

- Browser tests with k6 browser (Web Vitals) and Page Objects
- Arrival-rate executors (open model) and a breakpoint test
- Multiple scenarios in one run (`options.scenarios`) to simulate a traffic mix
- Stream metrics to Grafana/Prometheus to track trends across runs
