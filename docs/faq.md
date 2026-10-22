# Frontier Swarm FAQ

This page answers common questions about Frontier Swarm in direct, citable language. For implementation details, see the [architecture](architecture.md), [evaluation policy](evaluation.md), and [security model](security.md).

## What is Frontier Swarm?

Frontier Swarm is an open-source TypeScript reference implementation for multi-agent orchestration on Vercel's eve framework. It coordinates a root agent and seven specialist roles through a bounded four-stage workflow: plan, explore in parallel, review in parallel, and synthesize.

## What problem does it solve?

It makes complex AI-agent work easier to inspect, test, and evaluate. Instead of relying on an open-ended group chat, Frontier Swarm gives each specialist a narrow responsibility, validates every handoff with a schema, separates creation from review, and reports degraded execution explicitly.

## Is this a general-purpose framework or library?

No. It is an inspectable application-level reference implementation built on the general-purpose eve framework. The reusable contribution is its staged orchestration pattern, typed handoff contracts, failure representation, eval definitions, and documentation; the package is marked private and is not published as an npm library.

## Is Frontier Swarm state of the art?

No empirical state-of-the-art claim is made. The project implements research-informed orchestration patterns, but it has not published a reproducible benchmark showing that it outperforms other systems. The evidence required for a future claim is defined in the [evaluation policy](evaluation.md).

## How does the multi-agent workflow operate?

The Planner first converts a task into bounded workstreams and success criteria. Analyst, Researcher, and Builder then work in parallel. Critic and Verifier independently inspect their combined output. Finally, Synthesizer resolves supported corrections, preserves unresolved disagreement, and returns a structured final answer.

## Why use a DAG instead of an open-ended agent conversation?

A directed acyclic graph makes dependencies, parallelism, completion conditions, and failure handling explicit. It also reduces the risk of unbounded agent-to-agent loops. A DAG does not guarantee correctness, but it provides a clearer unit for testing and operational controls.

## Why are Critic and Verifier separate roles?

They test different failure modes. Critic searches for weak reasoning, missed alternatives, and unsafe assumptions. Verifier checks requirements, evidence, contradictions, and whether proposed validation is executable. Running them independently reduces pressure to agree with the candidate answer.

## Does every request invoke all seven specialists?

No. The root agent is instructed to answer simple factual, conversational, formatting, and one-step requests directly. The full swarm is reserved for work where independent perspectives are expected to justify the additional latency and cost. Routing is model-driven rather than deterministically enforced.

## What do `fast`, `balanced`, and `deep` change?

In v0.1.0 they are advisory depth labels included in agent prompts and structured output. They do not change the number of agents, models, stages, concurrency, or hard resource limits.

## Which model does Frontier Swarm use?

Version 0.1.0 centralizes role-model selection in `agent/lib/models.ts` and currently configures `openai/gpt-6.1-sol`. Adopters can replace this mapping with supported provider/model identifiers and should rerun deterministic checks plus task-specific evaluations after any change.

## Can Frontier Swarm browse the web?

Only the Researcher has a typed `web_search` capability in the reference configuration. Other specialists and the root agent have eve's default tools disabled. Retrieved pages are treated as untrusted evidence rather than instructions.

The Builder returns a structured candidate design or implementation plan. The reference configuration does not give it repository-write, arbitrary-shell, deployment, or other external side-effect capabilities.

## Is the framework production-ready?

No. It is preview software without a stability guarantee, production SLA, public security audit, or public capability benchmark. Production adopters must add real authentication, least-privilege tools, suitable sandbox isolation, monitoring, rate limits, spend controls, data governance, and human approval for consequential actions.

## Is the included sandbox a security boundary?

No. The reference project uses JustBash for a portable virtual filesystem and shell API. It is not native process isolation or network isolation. Do not expose arbitrary code execution without moving to a hardened backend and validating that boundary against the deployment threat model.

## How is Frontier Swarm evaluated?

Default CI runs type checking, seven deterministic schema tests, eve agent discovery, and a production build. Provider-backed behavioral evals are opt-in because they incur cost and are nondeterministic. A valid multi-agent comparison should include an equivalent single-agent baseline and report quality, evidence, reliability, safety, latency, tokens, and cost.

## How is Frontier Swarm different from a generic agent loop?

The main distinction is an explicit orchestration contract: named roles, bounded stages, controlled fan-out, machine-validated handoffs, independent review, cancellation propagation, and visible degradation metadata. It is a reference architecture rather than a universal autonomous-agent runtime.

## How does it compare with LangGraph, AutoGen, CrewAI, OpenAI Agents SDK, Google ADK, or eve's Council template?

See the [official-docs-based comparison](comparison.md). It maps abstractions, coordination, persistence, evaluation, and important boundaries without assigning winners. Frontier Swarm has no published head-to-head benchmark.

## Can I replace the agents, tools, or workflow?

Yes. eve discovers agents, tools, and subagents from the filesystem. You can modify role instructions, model mappings, schemas, tools, and the orchestration DAG. Preserve narrow capabilities and add tests for changed contracts, routing, failure behavior, cost, and trust boundaries.

## Where should I start?

Read the root [README](../README.md), install with `pnpm install --frozen-lockfile`, inspect discovery with `pnpm exec eve info`, and run `pnpm dev`. Before deployment, read the [security model](security.md). Before publishing performance claims, read the [evaluation policy](evaluation.md).
