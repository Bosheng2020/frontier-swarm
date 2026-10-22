# Contributing to Frontier Swarm

Thank you for helping improve Frontier Swarm. This project is an experimental reference implementation, so clear evidence, bounded claims, and safe defaults matter as much as new capabilities.

By participating, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Before you start

- Search existing issues and pull requests.
- Use a feature request for substantial behavior or architecture changes.
- Report security vulnerabilities privately according to [SECURITY.md](SECURITY.md).
- Do not include secrets, private prompts, customer data, or restricted benchmark material in issues, tests, traces, or commits.

Small fixes can go directly to a pull request. For a large change, open an issue first so the scope, safety impact, and evaluation plan can be discussed before implementation.

## Development setup

Requirements:

- Node.js 24 or newer;
- pnpm;
- provider credentials only when intentionally running live model-backed evals.

```bash
git clone <your-fork-url>
cd frontier-swarm
pnpm install --frozen-lockfile
pnpm exec eve info
```

The dependency lock resolves eve v0.81.1. Read the documentation shipped with the installed eve package before changing eve-specific behavior so examples match the installed version.

Run the local agent with:

```bash
pnpm dev
```

Never commit `.env*`, provider credentials, generated `.eve/` state, local traces, or model-produced files that contain sensitive data.

## Architecture constraints

Changes should preserve the visible pipeline unless an accepted design issue says otherwise:

```text
Planner
  -> Analyst | Researcher | Builder       (parallel)
  -> Critic | Verifier                    (parallel)
  -> Synthesizer
```

When adding or changing a role:

- give it one primary responsibility;
- provide every child the context it needs, because eve subagents do not inherit parent conversation history;
- keep parallel work packets independent and mutation scopes non-overlapping;
- validate hand-off data before downstream use;
- make timeouts, retries, cancellation, and partial failure explicit;
- do not treat subagent isolation as authorization or approval;
- expose uncertainty and disagreement to the Synthesizer.

## Tests and evaluation

Before opening a pull request, run:

```bash
pnpm typecheck
pnpm test
pnpm exec eve info
pnpm build
```

Add or update deterministic tests for behavior changes. Prefer executable checks and fixture models over network-backed tests in default CI.

Live eve evals are opt-in because they require credentials, cost money, and can vary over time:

```bash
pnpm exec eve eval --strict
```

If you submit model-backed results, include the model/provider identifiers, evaluation date, dataset revision, prompts or prompt hashes, budgets, retry policy, number of runs, failures, latency, tokens, and estimated cost. Follow [docs/evaluation.md](docs/evaluation.md). Do not describe a change as SOTA without reproducible public evidence.

## Pull requests

Keep pull requests focused. A useful description explains:

- the problem and intended user outcome;
- the chosen approach and alternatives considered;
- affected roles, tools, data flows, and trust boundaries;
- cost, latency, security, and compatibility impact;
- tests and evaluation evidence;
- documentation and migration steps.

All required CI checks should pass. Reviews may request smaller scope, stronger tests, safer defaults, or narrower claims.

## Commit guidance

Write imperative, descriptive commit subjects, for example:

```text
Add verifier contract tests
Bound parallel specialist retries
Document benchmark disclosure policy
```

Avoid mixing unrelated formatting, dependency, and behavior changes in one commit.

## Documentation style

- Write concise, concrete English.
- Distinguish current behavior from roadmap ideas.
- State limitations and operational costs near the relevant feature.
- Use runnable commands and keep them aligned with `package.json`.
- Avoid unsupported superlatives such as “best,” “safe,” or “state of the art.”
- Link to primary documentation for eve or external protocols.

## Licensing contributions

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in this project is licensed under the [Apache License 2.0](LICENSE), consistent with Section 5 of that license. You must have the right to submit the contribution and any included data, prompts, fixtures, or media.
