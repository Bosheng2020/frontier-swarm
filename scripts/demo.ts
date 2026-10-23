import { resolve } from "node:path";
import { setTimeout as wait } from "node:timers/promises";
import { pathToFileURL } from "node:url";
import { SwarmRunSchema } from "../agent/lib/contracts.ts";

const NOTICE =
  "OFFLINE DETERMINISTIC WALKTHROUGH — authored fixture; no model or network calls; not benchmark results.";

const plan = {
  problemFrame: "Design a reversible rollout for a rate-limited public API.",
  workstreams: [
    {
      id: "failure-model",
      owner: "analyst" as const,
      objective: "Map rate-limit and rollback failure modes.",
      deliverable: "A bounded risk analysis.",
      dependencies: [],
    },
    {
      id: "evidence",
      owner: "researcher" as const,
      objective: "Identify the evidence needed before rollout.",
      deliverable: "An evidence register with confidence labels.",
      dependencies: [],
    },
    {
      id: "candidate",
      owner: "builder" as const,
      objective: "Produce a phased implementation candidate.",
      deliverable: "A rollout plan with measurable gates.",
      dependencies: [],
    },
  ],
  successCriteria: [
    "The rollout is reversible.",
    "Rate-limit exhaustion is observable before user impact.",
    "Every phase has an explicit acceptance gate.",
  ],
  assumptions: ["Provider limits can change outside the deployment lifecycle."],
  risks: ["Retry amplification can turn throttling into an outage."],
};

const analysis = {
  summary: "The main systemic risk is synchronized retry amplification.",
  findings: [
    {
      claim: "A global cutover couples every client to one rate-limit pool.",
      evidence: "The authored fixture models one shared provider quota.",
      source: null,
      confidence: "high" as const,
    },
  ],
  recommendations: ["Use a cohort rollout with bounded retries and a kill switch."],
  openQuestions: ["What sustained request rate is safe below the provider ceiling?"],
};

const research = {
  summary: "The rollout needs primary quota telemetry and retry-rate evidence.",
  findings: [
    {
      claim: "A go/no-go gate needs live saturation and retry metrics.",
      evidence: "Static configuration cannot show runtime headroom.",
      source: null,
      confidence: "medium" as const,
    },
  ],
  recommendations: ["Record quota headroom, 429 rate, retry volume, and p95 latency."],
  openQuestions: ["Is provider quota scoped per key, account, region, or model?"],
};

const build = {
  approach: "Roll out by cohort behind a kill switch with hard retry budgets.",
  draft:
    "Shadow traffic, then 1%, 10%, and 50% cohorts; stop automatically on quota, error, or latency thresholds.",
  tradeoffs: ["A staged rollout takes longer than a global cutover."],
  risks: ["Shadow traffic consumes quota unless separately budgeted."],
};

function walkthroughRun(degraded: boolean) {
  const degradedAgents = degraded ? ["builder"] : [];
  const walkthroughBuild = degraded
    ? {
        approach: "No complete candidate was produced.",
        draft:
          "The builder failed; construct a conservative answer from verified material only.",
        tradeoffs: [],
        risks: ["Builder failure: authored walkthrough fixture."],
      }
    : build;

  return SwarmRunSchema.parse({
    status: degraded ? "completed_with_degradation" : "completed",
    mode: "balanced",
    plan,
    contributions: { analysis, research, build: walkthroughBuild },
    review: {
      critique: {
        verdict: "revise",
        issues: [
          {
            severity: "high",
            issue: "The draft does not name numeric stop thresholds.",
            fix: "Require thresholds to be supplied and approved before rollout.",
          },
        ],
        missingEvidence: ["Observed provider quota headroom"],
        strongestCounterargument: "A slower rollout delays migration value.",
      },
      verification: {
        criteria: [
          {
            criterion: "The rollout is reversible.",
            status: "met",
            evidence: "Every cohort is behind the same kill switch.",
          },
          {
            criterion: "Every phase has an explicit acceptance gate.",
            status: degraded ? "partial" : "met",
            evidence: degraded
              ? "The builder result is unavailable, so implementation detail is provisional."
              : "The authored draft defines staged cohorts and stop conditions.",
          },
        ],
        contradictions: [],
        citationRisks: ["This walkthrough contains no live provider evidence."],
        confidence: degraded ? "low" : "medium",
      },
    },
    final: {
      executiveSummary: degraded
        ? "Hold implementation until a candidate plan is rebuilt and reviewed."
        : "Use a reversible cohort rollout with bounded retries and explicit stop gates.",
      answer: degraded
        ? "Preserve the verified risks, retry the Builder, and obtain human approval before rollout."
        : "Shadow first, then advance through 1%, 10%, and 50% cohorts only while approved quota, error, retry, and latency thresholds remain satisfied.",
      decisions: degraded
        ? ["Do not infer a rollout design from the missing Builder contribution."]
        : ["Prefer staged cohorts over a global cutover.", "Require a kill switch."],
      evidence: [
        {
          claim: "Retry amplification is the dominant fixture risk.",
          evidence: "Analyst and Critic independently identify retry or threshold controls.",
          source: null,
          confidence: "medium",
        },
      ],
      caveats: [NOTICE],
      confidence: degraded ? "low" : "medium",
    },
    diagnostics: { degradedAgents, stages: 4, peakParallelism: 3 },
  });
}

type Paint = (text: string) => string;

function palette(enabled: boolean): Record<"dim" | "cyan" | "green" | "yellow", Paint> {
  const wrap = (code: string): Paint =>
    enabled ? (text) => `\u001B[${code}m${text}\u001B[0m` : (text) => text;
  return {
    dim: wrap("2"),
    cyan: wrap("36"),
    green: wrap("32"),
    yellow: wrap("33"),
  };
}

function flagValue(name: string, fallback: string): string {
  const prefix = `--${name}=`;
  return process.argv.find((argument) => argument.startsWith(prefix))?.slice(prefix.length) ?? fallback;
}

async function main() {
  const degraded = process.argv.includes("--degraded");
  const json = process.argv.includes("--json");
  const color = process.argv.includes("--color") ||
    (process.stdout.isTTY && !process.argv.includes("--no-color"));
  const delay = Number(flagValue("delay", process.stdout.isTTY ? "160" : "0"));

  if (!Number.isFinite(delay) || delay < 0 || delay > 2_000) {
    throw new Error("--delay must be a number between 0 and 2000 milliseconds");
  }

  const run = walkthroughRun(degraded);
  if (json) {
    process.stdout.write(`${JSON.stringify({ notice: NOTICE, run }, null, 2)}\n`);
    return;
  }

  const p = palette(Boolean(color));
  const lines = [
    p.cyan("Frontier Swarm — offline demo"),
    p.yellow(NOTICE),
    "",
    "Objective  Design a reversible rollout for a rate-limited public API.",
    "",
    `${p.cyan("[1/4] PLAN")}        Planner       ${p.green("✓ PlanSchema")} · 3 bounded workstreams`,
    `${p.cyan("[2/4] EXPLORE")}     parallel fan-out (peak concurrency: 3)`,
    `      ├─ Analyst                ${p.green("✓ WorkerReportSchema")}`,
    `      ├─ Researcher             ${p.green("✓ WorkerReportSchema")}`,
    degraded
      ? `      └─ Builder                ${p.yellow("↳ fallback DraftSchema · degraded")}`
      : `      └─ Builder                ${p.green("✓ DraftSchema")}`,
    `${p.cyan("[3/4] REVIEW")}      parallel independent review`,
    `      ├─ Critic                 ${p.green("✓ CritiqueSchema · revise")}`,
    `      └─ Verifier               ${p.green("✓ VerificationSchema")}`,
    `${p.cyan("[4/4] SYNTHESIZE")}  Synthesizer   ${p.green("✓ FinalAnswerSchema")}`,
    "",
    `${p.green("RESULT")}  ${run.status}`,
    `         stages=${run.diagnostics.stages} · peakParallelism=${run.diagnostics.peakParallelism} · degradedAgents=${JSON.stringify(run.diagnostics.degradedAgents)}`,
    "",
    "Status vocabulary",
    "  completed | completed_with_degradation",
    "  degradable: Analyst, Researcher, Builder, Critic, Verifier",
    "  fatal: Planner or Synthesizer failure",
    "",
    p.dim("Try the fallback path: pnpm demo -- --degraded"),
    p.dim("Inspect the validated contract: pnpm demo -- --json"),
  ];

  for (const line of lines) {
    process.stdout.write(`${line}\n`);
    if (delay > 0) await wait(delay);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await main();
}

export { NOTICE, walkthroughRun };
