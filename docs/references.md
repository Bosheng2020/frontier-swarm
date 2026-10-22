# Design References

Frontier Swarm is an independent open-source implementation. These primary sources inform its engineering decisions; they do not endorse the project or establish a performance ranking.

## Agent architecture and evaluation

- [How we built our multi-agent research system — Anthropic](https://www.anthropic.com/research/multi-agent-research-system): describes a lead agent coordinating parallel research subagents and discusses delegation, token use, and evaluation challenges.
- [Patterns and problems in emerging multiagent systems — Anthropic](https://www.anthropic.com/research/multiagent-systems): analyzes coordination, conformity, and epistemic failure modes that multi-agent designs must address.
- [Demystifying evals for AI agents — Anthropic](https://www.anthropic.com/research/demystifying-evals-for-ai-agents): motivates task-specific evaluation, multiple metrics, and analysis beyond a single aggregate score.
- [eve getting started](https://eve.dev/docs/getting-started): authoritative setup and runtime documentation for the framework used by this repository.
- [eve workflow tools](https://eve.dev/docs/tools/workflows): primary documentation for durable workflow tools.
- [eve subagents](https://eve.dev/docs/subagents): primary documentation for declared subagents and child sessions.
- [eve evals overview](https://eve.dev/docs/evals/overview): primary documentation for provider-backed behavioral evaluation.
- [eve v0.81.1 release](https://github.com/vercel/eve/releases/tag/eve%400.81.1): version reference for the pinned dependency.

## Discoverability and documentation

- [Creating helpful, reliable, people-first content — Google Search Central](https://developers.google.com/search/docs/fundamentals/creating-helpful-content): source for descriptive headings, substantive content, trust, and avoidance of search-first keyword padding.
- [Classifying a repository with topics — GitHub Docs](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics): explains how repository topics support discovery and contribution.
- [About repository README files — GitHub Docs](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes): documents README rendering and generated navigation.
- [About CITATION files — GitHub Docs](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-citation-files): documents GitHub's machine-readable software citation support.
- [The `llms.txt` proposal](https://llmstxt.org/): an informal convention for a concise, AI-readable project map. It is included for navigation and is not claimed to improve ranking.

## Generative-engine visibility

- [GEO: Generative Engine Optimization — KDD 2024](https://arxiv.org/abs/2311.09735): introduces the GEO research problem and evaluates content-level visibility interventions within its experimental setting.

GEO remains an emerging field. A clean information architecture, explicit definitions, verifiable claims, primary-source links, and honest limitations help both human readers and automated systems; none guarantees indexing, citation, or ranking.
