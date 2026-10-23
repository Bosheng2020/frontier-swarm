# Frontier Swarm Launch Kit

This document is a factual launch worksheet for the maintainer. It is not a set of posts to publish unchanged. Adapt every channel to its community, verify every link and claim against the current repository, and write personal commentary in your own voice.

## Positioning

Use this concise description:

> Frontier Swarm is an Apache-2.0 TypeScript reference implementation for auditable multi-agent workflows on Vercel eve, with typed handoffs, parallel specialists, independent review, and explicit degraded states.

The useful contrast is not “more agents.” It is a visible, bounded execution structure:

```text
Planner
  -> Analyst | Researcher | Builder       (parallel)
  -> Critic | Verifier                    (parallel)
  -> Synthesizer
```

State the boundaries near the claim:

- preview software, not a hosted product or production-readiness guarantee;
- no published public benchmark results and no state-of-the-art claim;
- model credentials are required for a live run;
- the credential-free demo is an offline deterministic walkthrough using an authored fixture, not a model run;
- quality, latency, and cost depend on the selected models, providers, prompts, tools, and retry policy.

## Launch assets checklist

Do not start a concentrated launch until these items are available and checked from a clean clone:

- [ ] a short 8–12 second terminal GIF showing the deterministic walkthrough;
- [ ] a 1280×640 repository social preview image;
- [ ] a three-command quick start with expected output;
- [ ] one real input and a short, readable output excerpt;
- [ ] a link to the architecture and failure semantics;
- [ ] an explicit label distinguishing the authored walkthrough, deterministic tests, live evals, and future benchmarks;
- [ ] a release with a concise changelog and working source archives;
- [ ] an owner who can answer technical questions for several hours after launch.

Before publishing, confirm that the GIF, repository URL, CI badge, release URL, and every command still work.

## X thread outline

Use four to six short posts. Rewrite the wording, add a personal reason for building the project, and avoid copying the same text to other platforms.

1. **Problem and artifact**
   - What repeatedly went wrong in multi-agent demos you examined?
   - State that you open-sourced Frontier Swarm.
   - Attach the terminal GIF and link to the repository.

2. **Execution structure**
   - Show the four-stage DAG.
   - Explain that three specialists explore independently before two separate reviewers inspect the combined work.

3. **Inspectable contracts**
   - Point to the typed handoff schemas.
   - Mention explicit `completed_with_degradation` handling without presenting it as a universal reliability guarantee.

4. **Try it**
   - Include the credential-free walkthrough command and the live-run command separately.
   - Make clear which one calls a model.

5. **Evidence and limits**
   - Link to the evaluation policy.
   - Say plainly that there are no published benchmark results yet.

6. **Feedback request**
   - Ask for technical criticism of failure semantics, cost controls, and eval design.
   - Invite reproducible bug reports or counterexamples; do not request likes, reposts, votes, or Stars.

## LinkedIn post worksheet

Target 200–300 words after rewriting. Replace every bracketed field and include a specific first-person observation from the build.

> I kept seeing [specific problem you personally observed] in multi-agent demos: [concrete consequence]. I built Frontier Swarm to make that part easier to inspect.
>
> Frontier Swarm is an Apache-2.0 TypeScript reference implementation on Vercel eve. A Planner defines the work, three specialists explore in parallel, a Critic and Verifier review independently, and a Synthesizer reconciles the result. Handoffs are validated with typed contracts, and partial specialist failure is surfaced as an explicit degraded state instead of being silently hidden.
>
> The project is deliberately small enough to read. The repository includes the role instructions, orchestration code, deterministic contract tests, opt-in behavioral eval definitions, architecture notes, security boundaries, and a credential-free offline walkthrough using an authored fixture. The walkthrough demonstrates the topology; it is not a live model result or benchmark.
>
> This is preview software. I am not claiming state-of-the-art performance, and I have not published a public benchmark result yet. The next evidence milestone is [specific experiment or fixture], comparing [baseline] and [swarm configuration] under equivalent tool access and disclosed budgets.
>
> Repository and demo: [URL]
>
> If you build agent runtimes, I would value a technical teardown—especially counterexamples involving partial failure, reviewer independence, budget control, or evaluation design.

Attach one architecture image or short GIF. Do not add engagement bait or ask readers to react, repost, vote, or Star.

## Show HN worksheet

Possible factual title topic—rewrite it yourself before posting:

> Show HN: Frontier Swarm – typed, durable multi-agent orchestration on Eve

**Do not publish generated or lightly edited prose on Hacker News.** Current HN guidance asks people not to put generated text in posts and requires Show HN authors to have worked on the project, make it easy to try, remain available for discussion, and avoid soliciting votes or comments. The maintainer must write the submission and replies personally after reading the current [Show HN guidelines](https://news.ycombinator.com/showhn.html) and [HN guidelines](https://news.ycombinator.com/newsguidelines.html).

Use this only as a fact checklist for a first comment:

- the personal observation that led you to build the project;
- what exists today and what a visitor can run immediately;
- the Planner → specialists → reviewers → Synthesizer topology;
- why Critic and Verifier are separate;
- where typed contracts and degraded states appear in the source;
- how the authored offline walkthrough differs from a live model run;
- preview status, missing benchmark evidence, and expected cost trade-offs;
- the two or three technical questions on which you most want disagreement;
- your availability to answer questions during the thread.

Never coordinate upvotes or comments, send a voting request to a group, or repost the same submission to manufacture attention.

## Reddit post worksheet

Post only where the current subreddit rules explicitly allow the project, self-promotion, and links. Participate in the community before promoting work, disclose that you are the maintainer, and use a weekly project or self-promotion thread when required. Do not copy one post across multiple subreddits.

Several relevant technical communities prohibit or restrict AI-generated promotional posts. Treat the outline below as research notes, then write the post from scratch in your own voice after reading that community’s current rules.

Suggested factual subject:

> I built a typed multi-agent DAG with separate reviewers—looking for failure-mode feedback

Outline:

1. Disclose that you maintain Frontier Swarm and that it is Apache-2.0 preview software.
2. Describe one concrete orchestration problem you encountered.
3. Explain the fixed four-stage topology in two or three sentences.
4. Link to a directly relevant implementation file, not only the repository home page.
5. List what works today and what remains unproven.
6. Label the credential-free walkthrough as an authored fixture, not a live result.
7. Ask one narrow technical question appropriate to the subreddit.
8. Remain available to reproduce problems and answer questions.

Do not claim superiority, conceal affiliation, mass-message members, request votes, or reuse a generic promotional paragraph.

## Five-minute trial invitation

Send this only to people you know or to practitioners for whom the project is directly relevant. Personalize the first sentence and do not ask for promotion:

> I just published an Apache-2.0 reference implementation for typed multi-agent orchestration on eve. Would you be willing to spend five minutes running the credential-free walkthrough or quick start and tell me the first place you get confused or blocked? I do not need promotion—I am looking for concrete feedback on the setup, failure semantics, and eval design. Repository: [URL]

Follow up only when the recipient replies or has explicitly invited a reminder.

## Suggested release sequence

Keep launches far enough apart to identify useful traffic sources and respond well:

| Time | Action |
| --- | --- |
| T−48 hours | Validate the clean-clone path, walkthrough, links, social image, and mobile README rendering. |
| T−24 hours | Ask 5–10 relevant developers for private usability feedback; fix the highest-friction defects. |
| Launch morning | Publish the owner-written X thread or LinkedIn post and stay available for replies. |
| +12–24 hours | Review repository traffic and fix conversion problems before using another channel. |
| Separate day | Submit a maintainer-written Show HN only if the project is easy to try and the account is eligible. |
| Later | Use one rule-compatible Reddit thread with a community-native technical question. |
| +2–7 days | Publish a feedback-driven release and a factual “what changed” update. |

Delay Product Hunt until there is a directly usable online experience with complete visual assets. Submit to curated lists only after the repository meets each list’s published eligibility requirements.

## Measurement

Record a baseline before every channel and review GitHub Insights after its data refreshes:

- unique visitors and views;
- unique clones and total clones;
- referral sources and popular content;
- successful clean-clone runs reported by external users;
- issues, discussions, pull requests, and first-time contributors;
- new Stars per unique visitor as a diagnostic conversion ratio, not a promised outcome.

Interpret the funnel before adding more distribution:

- traffic with few clones usually means the value or setup path is unclear;
- clones with no successful runs usually means installation or credentials are blocking users;
- successful runs with weak feedback usually means the project lacks a focused question or contribution path;
- healthy conversion with low traffic justifies another carefully chosen channel.

## Red lines

Never use:

- purchased, automated, exchanged, or sockpuppet Stars;
- giveaways, credits, or rewards conditioned on engagement;
- voting rings or requests for HN, Reddit, or Product Hunt votes;
- bulk direct messages, automated replies, or duplicated cross-community posts;
- invented users, testimonials, benchmark numbers, or production claims;
- “SOTA,” “best,” “safe,” or “production-ready” without reproducible evidence appropriate to that claim.

Optimize for real trials, useful criticism, and contributors. Stars are a secondary signal of that work, not the product.
