import { defineWorkflowTool } from "eve/tools";
import {
  CritiqueSchema,
  DraftSchema,
  FinalAnswerSchema,
  PlanSchema,
  SwarmInputSchema,
  SwarmRunSchema,
  VerificationSchema,
  WorkerReportSchema,
  type Critique,
  type Draft,
  type Verification,
  type WorkerReport,
} from "../lib/contracts";

type FailedResult = { status: string; error?: { message?: string } };

function failureReason(result: FailedResult): string {
  return result.error?.message ?? `agent ended with status ${result.status}`;
}

function degradedWorker(agent: string, reason: string): WorkerReport {
  return {
    summary: `${agent} was unavailable; synthesis must not assume its work was completed.`,
    findings: [],
    recommendations: [],
    openQuestions: [`Retry ${agent}: ${reason}`],
  };
}

function degradedDraft(reason: string): Draft {
  return {
    approach: "No complete candidate was produced.",
    draft: "The builder failed; construct a conservative answer from verified material only.",
    tradeoffs: [],
    risks: [`Builder failure: ${reason}`],
  };
}

function degradedCritique(reason: string): Critique {
  return {
    verdict: "revise",
    issues: [
      {
        severity: "high",
        issue: "Independent critique was unavailable.",
        fix: "Treat the result as provisional and obtain human or agent review.",
      },
    ],
    missingEvidence: [reason],
    strongestCounterargument: "No independent critic result was available.",
  };
}

function degradedVerification(reason: string): Verification {
  return {
    criteria: [],
    contradictions: [],
    citationRisks: [`Independent verification failed: ${reason}`],
    confidence: "low",
  };
}

function payload(value: unknown): string {
  return JSON.stringify(value);
}

export default defineWorkflowTool({
  description:
    "Run a bounded four-stage specialist DAG for complex work: plan; parallel analysis, research, and building; parallel critique and verification; then synthesis. Use only when independent perspectives justify the added latency and cost.",
  inputSchema: SwarmInputSchema,
  outputSchema: SwarmRunSchema,
  async execute(input, ctx) {
    "use workflow";

    const base = {
      objective: input.objective,
      context: input.context,
      constraints: input.constraints,
      mode: input.mode,
    };

    const planResponse = await ctx.agent("planner").send(
      `Create a bounded execution plan for this request.\n${payload(base)}`,
      { outputSchema: PlanSchema, signal: ctx.abortSignal },
    );
    const planResult = await planResponse.result();
    if (planResult.status === "failed" || !planResult.data) {
      throw new Error(`planner failed: ${failureReason(planResult)}`);
    }
    const plan = planResult.data;

    const workerInput = payload({ ...base, plan });
    const [analysisResponse, researchResponse, buildResponse] = await Promise.all([
      ctx
        .agent("analyst")
        .send(`Analyze the task from first principles.\n${workerInput}`, {
          outputSchema: WorkerReportSchema,
          signal: ctx.abortSignal,
        }),
      ctx
        .agent("researcher")
        .send(`Research the task and verify current claims where useful.\n${workerInput}`, {
          outputSchema: WorkerReportSchema,
          signal: ctx.abortSignal,
        }),
      ctx
        .agent("builder")
        .send(`Build a concrete candidate solution.\n${workerInput}`, {
          outputSchema: DraftSchema,
          signal: ctx.abortSignal,
        }),
    ]);
    const [analysisResult, researchResult, buildResult] = await Promise.all([
      analysisResponse.result(),
      researchResponse.result(),
      buildResponse.result(),
    ]);

    const degradedAgents: string[] = [];
    if (!analysisResult.data) degradedAgents.push("analyst");
    if (!researchResult.data) degradedAgents.push("researcher");
    if (!buildResult.data) degradedAgents.push("builder");

    const analysis =
      analysisResult.data ?? degradedWorker("analyst", failureReason(analysisResult));
    const research =
      researchResult.data ?? degradedWorker("researcher", failureReason(researchResult));
    const build = buildResult.data ?? degradedDraft(failureReason(buildResult));

    const reviewInput = payload({ ...base, plan, analysis, research, build });
    const [critiqueResponse, verificationResponse] = await Promise.all([
      ctx
        .agent("critic")
        .send(`Adversarially review the candidate and supporting work.\n${reviewInput}`, {
          outputSchema: CritiqueSchema,
          signal: ctx.abortSignal,
        }),
      ctx
        .agent("verifier")
        .send(`Verify the candidate against the plan and evidence.\n${reviewInput}`, {
          outputSchema: VerificationSchema,
          signal: ctx.abortSignal,
        }),
    ]);
    const [critiqueResult, verificationResult] = await Promise.all([
      critiqueResponse.result(),
      verificationResponse.result(),
    ]);

    if (!critiqueResult.data) degradedAgents.push("critic");
    if (!verificationResult.data) degradedAgents.push("verifier");
    const critique = critiqueResult.data ?? degradedCritique(failureReason(critiqueResult));
    const verification =
      verificationResult.data ?? degradedVerification(failureReason(verificationResult));

    const synthesisInput = payload({
      ...base,
      plan,
      contributions: { analysis, research, build },
      review: { critique, verification },
      degradedAgents,
    });
    const finalResponse = await ctx.agent("synthesizer").send(
      `Synthesize the final answer. Incorporate valid fixes and qualify confidence conservatively.\n${synthesisInput}`,
      { outputSchema: FinalAnswerSchema, signal: ctx.abortSignal },
    );
    const finalResult = await finalResponse.result();
    if (finalResult.status === "failed" || !finalResult.data) {
      throw new Error(`synthesizer failed: ${failureReason(finalResult)}`);
    }

    return {
      status: degradedAgents.length === 0 ? "completed" : "completed_with_degradation",
      mode: input.mode,
      plan,
      contributions: { analysis, research, build },
      review: { critique, verification },
      final: finalResult.data,
      diagnostics: {
        degradedAgents,
        stages: 4,
        peakParallelism: 3,
      },
    };
  },
});
