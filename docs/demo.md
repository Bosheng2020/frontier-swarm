# Offline deterministic walkthrough

Frontier Swarm includes a credential-free walkthrough so you can inspect its four-stage topology and typed result contract before configuring a model provider:

```bash
pnpm demo
```

The walkthrough performs no model or network calls. It uses a fixed, authored fixture and validates the resulting object with the same `SwarmRunSchema` used by the live workflow. It is **not** a live agent run, capability evaluation, or benchmark result.

## What it shows

```text
Planner
  -> Analyst | Researcher | Builder       (parallel)
  -> Critic | Verifier                    (parallel)
  -> Synthesizer
```

The terminal output names each handoff schema, the four stage boundaries, and the walkthrough fixture's `stages`, `peakParallelism`, and `degradedAgents` diagnostics.

To inspect a typed fallback after a simulated Builder failure:

```bash
pnpm demo -- --degraded
```

This path ends as `completed_with_degradation`, preserves the missing role in `diagnostics.degradedAgents`, and replaces the unavailable contribution with a conservative `DraftSchema` fallback. In the live workflow, Analyst, Researcher, Builder, Critic, and Verifier results can degrade this way; Planner and Synthesizer failures remain fatal.

To inspect the complete validated payload:

```bash
pnpm demo -- --json
```

For a live provider-backed session, configure the provider described in the [eve getting-started guide](https://eve.dev/docs/getting-started) and run `pnpm dev`. Live model quality, latency, tokens, and cost depend on the selected provider and configuration. See the [evaluation policy](evaluation.md) before publishing comparative results.
