import assert from "node:assert/strict";
import test from "node:test";

// Keep the explicit .ts suffix required by Node 24's native type stripping while
// avoiding a static-specifier conflict with the project's no-emit tsconfig.
const contractsModulePath = "../agent/lib/contracts.ts";
const {
  CritiqueSchema,
  FinalAnswerSchema,
  PlanSchema,
  SwarmInputSchema,
  SwarmRunSchema,
  VerificationSchema,
  WorkerReportSchema,
} = await import(contractsModulePath);

const plan = {
  problemFrame: "Choose a safe launch path from incomplete evidence.",
  workstreams: [
    {
      id: "analysis",
      owner: "analyst",
      objective: "Compare the available claims.",
      deliverable: "A bounded risk analysis.",
      dependencies: [],
    },
    {
      id: "research",
      owner: "researcher",
      objective: "Check the provenance of material claims.",
      deliverable: "An evidence register.",
      dependencies: [],
    },
  ],
  successCriteria: ["Material claims are traceable to evidence."],
  assumptions: ["No production change is authorized."],
  risks: ["The supplied summaries may be stale."],
} as const;

const workerReport = {
  summary: "The available evidence is insufficient for an irreversible decision.",
  findings: [
    {
      claim: "The launch evidence is incomplete.",
      evidence: "Neither summary includes primary test output.",
      source: null,
      confidence: "high",
    },
  ],
  recommendations: ["Obtain the raw test artifacts."],
  openQuestions: ["Which commit and dataset were tested?"],
} as const;

const draft = {
  approach: "Prefer a reversible hold pending verification.",
  draft: "Do not launch until the replay discrepancy is resolved.",
  tradeoffs: ["A hold delays expected value."],
  risks: ["Launching may create ledger inconsistencies."],
} as const;

const critique = {
  verdict: "revise",
  issues: [
    {
      severity: "high",
      issue: "The source reports conflict.",
      fix: "Require raw replay output before deciding.",
    },
  ],
  missingEvidence: ["Raw replay output"],
  strongestCounterargument: "A delay has a measurable opportunity cost.",
} as const;

const verification = {
  criteria: [
    {
      criterion: "Material claims are traceable to evidence.",
      status: "partial",
      evidence: "The contradiction is documented, but primary artifacts are absent.",
    },
  ],
  contradictions: ["Zero mismatches versus 31 mismatches."],
  citationRisks: ["Both summaries lack provenance."],
  confidence: "low",
} as const;

const finalAnswer = {
  executiveSummary: "Hold the launch until the replay conflict is resolved.",
  answer: "Run an independently observed replay against the candidate commit.",
  decisions: ["No-go pending primary evidence."],
  evidence: [
    {
      claim: "Current summaries conflict.",
      evidence: "One says zero mismatches and one says 31.",
      source: null,
      confidence: "high",
    },
  ],
  caveats: ["No raw test output was supplied."],
  confidence: "low",
} as const;

function validSwarmRun() {
  return {
    status: "completed",
    mode: "deep",
    plan,
    contributions: {
      analysis: workerReport,
      research: workerReport,
      build: draft,
    },
    review: { critique, verification },
    final: finalAnswer,
    diagnostics: {
      degradedAgents: [],
      stages: 4,
      peakParallelism: 3,
    },
  };
}

test("SwarmInputSchema applies safe defaults", () => {
  const parsed = SwarmInputSchema.parse({
    objective: "Compare two deployment strategies safely.",
  });

  assert.deepEqual(parsed, {
    objective: "Compare two deployment strategies safely.",
    context: "",
    constraints: [],
    mode: "balanced",
  });
});

test("SwarmInputSchema enforces objective, mode, and fan-out bounds", () => {
  assert.equal(SwarmInputSchema.safeParse({ objective: "short" }).success, false);
  assert.equal(
    SwarmInputSchema.safeParse({
      objective: "A sufficiently long objective.",
      mode: "unbounded",
    }).success,
    false,
  );
  assert.equal(
    SwarmInputSchema.safeParse({
      objective: "A sufficiently long objective.",
      constraints: Array.from({ length: 21 }, (_, index) => `constraint-${index}`),
    }).success,
    false,
  );
});

test("PlanSchema requires a bounded multi-workstream plan", () => {
  assert.equal(PlanSchema.safeParse(plan).success, true);
  assert.equal(
    PlanSchema.safeParse({ ...plan, workstreams: [plan.workstreams[0]] }).success,
    false,
  );
  assert.equal(
    PlanSchema.safeParse({
      ...plan,
      workstreams: Array.from({ length: 10 }, (_, index) => ({
        id: `workstream-${index}`,
        owner: "analyst",
        objective: "Analyze one bounded concern.",
        deliverable: "A finding.",
        dependencies: [],
      })),
    }).success,
    false,
  );
});

test("evidence-bearing schemas reject invalid confidence and verification status", () => {
  assert.equal(WorkerReportSchema.safeParse(workerReport).success, true);
  assert.equal(
    WorkerReportSchema.safeParse({
      ...workerReport,
      findings: [{ ...workerReport.findings[0], confidence: "certain" }],
    }).success,
    false,
  );

  assert.equal(VerificationSchema.safeParse(verification).success, true);
  assert.equal(
    VerificationSchema.safeParse({
      ...verification,
      criteria: [{ ...verification.criteria[0], status: "assumed" }],
    }).success,
    false,
  );
});

test("CritiqueSchema rejects unsupported verdicts and severities", () => {
  assert.equal(CritiqueSchema.safeParse(critique).success, true);
  assert.equal(CritiqueSchema.safeParse({ ...critique, verdict: "approve" }).success, false);
  assert.equal(
    CritiqueSchema.safeParse({
      ...critique,
      issues: [{ ...critique.issues[0], severity: "blocker" }],
    }).success,
    false,
  );
});

test("FinalAnswerSchema accepts nullable provenance but rejects non-enum confidence", () => {
  assert.equal(FinalAnswerSchema.safeParse(finalAnswer).success, true);
  assert.equal(
    FinalAnswerSchema.safeParse({
      ...finalAnswer,
      evidence: [{ ...finalAnswer.evidence[0], confidence: 0.99 }],
    }).success,
    false,
  );
});

test("SwarmRunSchema validates the complete four-stage contract", () => {
  const run = validSwarmRun();
  assert.equal(SwarmRunSchema.safeParse(run).success, true);

  assert.equal(
    SwarmRunSchema.safeParse({
      ...run,
      diagnostics: { ...run.diagnostics, stages: 5 },
    }).success,
    false,
  );
  assert.equal(
    SwarmRunSchema.safeParse({
      ...run,
      diagnostics: { ...run.diagnostics, peakParallelism: 4 },
    }).success,
    false,
  );
});
