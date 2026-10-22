## Summary

Describe the problem, the user-visible outcome, and the chosen approach.

Closes #

## Change type

- [ ] Bug fix
- [ ] New or changed agent behavior
- [ ] Evaluation or test coverage
- [ ] Security or privacy hardening
- [ ] Documentation or maintenance
- [ ] Breaking change

## Architecture impact

Which stages or boundaries are affected?

- [ ] Planner
- [ ] Analyst / Researcher / Builder fan-out
- [ ] Critic / Verifier review fan-out
- [ ] Synthesizer
- [ ] Tools, connections, approvals, or sandbox
- [ ] No runtime architecture impact

Explain changes to hand-offs, parallelism, failure handling, data flow, or compatibility:

## Safety, privacy, and cost

Describe new permissions, external side effects, sensitive data, prompt-injection exposure, sandbox/network access, human approvals, provider calls, latency, token usage, and spend. Write “No material change” only after checking each category.

## Verification

List the exact tests, fixtures, or evals run and their results. For model-backed evidence, include model/provider identifiers, date, budgets, retries, run count, failures, latency, tokens, and estimated cost.

- [ ] `pnpm typecheck`
- [ ] `pnpm test`
- [ ] `pnpm exec eve info --json`
- [ ] `pnpm build`
- [ ] New or changed behavior has deterministic coverage
- [ ] Live evals were not required, or their reproducible evidence is linked

## Documentation and compatibility

- [ ] User-facing and architecture documentation is updated
- [ ] `CHANGELOG.md` is updated for a notable change
- [ ] Breaking changes and migration steps are explicit
- [ ] Claims accurately distinguish current behavior from future work
- [ ] No unsupported SOTA, safety, or production-readiness claim was added

## Author checklist

- [ ] The change is focused and contains no unrelated generated files
- [ ] I reviewed the diff for secrets, credentials, personal data, and private prompts
- [ ] I have the right to contribute all code, data, fixtures, prompts, and media in this pull request
- [ ] I considered cancellation, timeout, retry, partial failure, and idempotency where relevant
- [ ] I read and will follow `CONTRIBUTING.md` and the Code of Conduct
