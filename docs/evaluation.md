# Evaluating Multi-Agent Orchestration: Quality, Safety, Cost, and Baselines

Frontier Swarm currently has **no published public benchmark results** and makes no state-of-the-art claim. This document separates implemented checks from the broader evidence required for future capability claims.

This document defines the evidence required for future claims.

## Evaluation objectives

Evaluation should answer five separate questions:

1. Does the system complete the requested task correctly?
2. Does multi-agent orchestration improve quality over an equivalent single-agent baseline?
3. Are citations, artifacts, and tool effects verifiable?
4. How does the system behave under partial failure, adversarial input, and budget pressure?
5. What quality is obtained for the added latency, tokens, and monetary cost?

No single aggregate score answers all five.

## Test layers

### Deterministic checks

Ordinary CI currently runs these checks without provider credentials:

- TypeScript checking and production build compilation;
- agent and subagent discovery through `eve info`;
- seven Zod schema contract tests.

Deterministic end-to-end orchestration fixtures are not implemented yet. Future CI coverage should add stage ordering, fan-out/gather, cancellation, timeout, partial-failure, prompt-injection, and unsafe-tool regression cases without live provider calls.

Deterministic checks establish runtime behavior, not answer quality on open-ended tasks.

### Behavioral evals

eve discovers evals in `evals/**/*.eval.ts`. A behavioral eval should drive the same HTTP/session surface used by clients, assert the run completed, and test meaningful intermediate behavior such as specialist delegation or rejection of an unsafe request.

Use deterministic assertions as hard gates. Treat model-based judging as a noisy measurement: use a separate judge model, publish its identity and rubric, include human spot checks, and never make a sole judge score the basis of a broad capability claim.

Provider-backed evals are opt-in because they require credentials and incur cost:

```bash
pnpm exec eve eval --strict
```

### Capability benchmarks

A public benchmark suite should cover multiple task families rather than one favorable domain:

- evidence-backed research and synthesis;
- planning under explicit constraints;
- software or artifact construction with executable verification;
- error detection and correction;
- long-context conflict resolution;
- safe refusal and escalation;
- recovery from missing, malformed, or failed specialist output.

Use datasets whose licenses permit redistribution and evaluation. Record contamination risks and never include private user content in a public dataset without explicit permission.

### Adversarial and reliability evaluation

At minimum, exercise:

- prompt injection in user input, retrieved content, and tool output;
- attempts to leak secrets or cross session/tenant boundaries;
- unsafe external side effects;
- malicious or inconsistent specialist output;
- provider timeouts, rate limits, malformed responses, and partial outages;
- cancellation during each stage;
- token, time, concurrency, and monetary budget exhaustion;
- repeated runs to measure variance.

## Baselines

Every multi-agent comparison needs an equivalent baseline:

- the same root model operating as a single agent;
- the same model with an equivalent total token or monetary budget;
- where useful, a sequential specialist pipeline;
- other publicly available orchestrators only when tool access, prompts, models, retry policy, and budget can be matched and disclosed.

A larger model budget is a confounder, not evidence that orchestration itself caused an improvement.

## Required run metadata

Publish enough information for an independent rerun:

- repository commit and dirty-state status;
- eve version and dependency lockfile;
- dataset name, version, split, license, and task exclusions;
- model and provider identifiers, access date, and reasoning settings;
- complete system and role prompts or stable hashes with an explanation of redactions;
- tool availability, network access, retrieval corpus, and sandbox policy;
- token, time, concurrency, retry, and monetary budgets;
- temperature, seed when supported, and number of repeated runs;
- scorer implementation, judge model and rubric, and human-review procedure;
- hardware/region or hosted environment when it affects latency;
- failures, refusals, timeouts, and invalid outputs without cherry-picking them away.

Provider behavior can change behind a stable model name. Reports should include the evaluation date and avoid presenting results as timeless.

## Metrics

Report a vector of metrics instead of one opaque score:

| Category | Example metrics |
| --- | --- |
| Task quality | exact match, unit-test pass rate, rubric score, constraint satisfaction |
| Evidence | citation precision/recall, claim support rate, source validity |
| Review value | defect detection rate, false-positive rate, corrected-error rate |
| Reliability | completion, timeout, retry, invalid-output, and recovery rates |
| Safety | unsafe-action rate, approval bypass rate, secret-leakage rate |
| Efficiency | input/output tokens, model/tool calls, wall time, estimated cost |
| Stability | mean, median, dispersion, and confidence interval across repeats |

For code or structured artifacts, prefer executable checks over judge scores. For subjective tasks, publish rubrics and blinded human ratings with inter-rater agreement where practical.

## Statistical reporting

- Predeclare primary metrics and exclusions.
- Run enough independent repetitions to expose model variance.
- Report sample count, central tendency, dispersion, and confidence intervals.
- Use paired comparisons when systems evaluate the same cases.
- Publish per-case results or anonymized error categories where licensing permits.
- Separate exploratory tuning results from the held-out evaluation.

Do not use a win rate without also reporting ties, failures, cost, and latency.

## Public results

There are no public results yet.

When results become available, add a dated report that links to the exact commit, configuration, raw result artifact, and reproduction command. Keep superseded reports available and label them rather than silently replacing them.

## Claim policy

Allowed before public results:

- precise descriptions of implemented behavior;
- statements tied to source code, deterministic checks, or clearly labeled provider-backed eval definitions;
- explicit descriptions of preview status, missing evidence, and limitations.

Not allowed before reproducible evidence:

- “state of the art,” “best,” or “beats” a named system;
- universal quality, safety, reliability, cost, or latency claims;
- production-readiness claims based only on demos;
- benchmark claims that omit failed runs or use unequal budgets.
