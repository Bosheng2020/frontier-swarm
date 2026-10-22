import { z } from "zod";

export const ConfidenceSchema = z.enum(["low", "medium", "high"]);
export const SwarmModeSchema = z.enum(["fast", "balanced", "deep"]);

export const SwarmInputSchema = z.object({
  objective: z.string().min(8).max(12_000),
  context: z.string().max(24_000).default(""),
  constraints: z.array(z.string().min(1).max(1_000)).max(20).default([]),
  mode: SwarmModeSchema.default("balanced"),
});

export const PlanSchema = z.object({
  problemFrame: z.string().min(1),
  workstreams: z
    .array(
      z.object({
        id: z.string().min(1),
        owner: z.enum(["analyst", "researcher", "builder"]),
        objective: z.string().min(1),
        deliverable: z.string().min(1),
        dependencies: z.array(z.string()),
      }),
    )
    .min(2)
    .max(9),
  successCriteria: z.array(z.string().min(1)).min(1).max(12),
  assumptions: z.array(z.string()).max(12),
  risks: z.array(z.string()).max(12),
});

export const EvidenceItemSchema = z.object({
  claim: z.string().min(1),
  evidence: z.string().min(1),
  source: z.string().nullable(),
  confidence: ConfidenceSchema,
});

export const WorkerReportSchema = z.object({
  summary: z.string().min(1),
  findings: z.array(EvidenceItemSchema).max(20),
  recommendations: z.array(z.string()).max(12),
  openQuestions: z.array(z.string()).max(12),
});

export const DraftSchema = z.object({
  approach: z.string().min(1),
  draft: z.string().min(1),
  tradeoffs: z.array(z.string()).max(12),
  risks: z.array(z.string()).max(12),
});

export const CritiqueSchema = z.object({
  verdict: z.enum(["pass", "revise"]),
  issues: z
    .array(
      z.object({
        severity: z.enum(["low", "medium", "high", "critical"]),
        issue: z.string().min(1),
        fix: z.string().min(1),
      }),
    )
    .max(20),
  missingEvidence: z.array(z.string()).max(12),
  strongestCounterargument: z.string(),
});

export const VerificationSchema = z.object({
  criteria: z.array(
    z.object({
      criterion: z.string().min(1),
      status: z.enum(["met", "partial", "unmet"]),
      evidence: z.string().min(1),
    }),
  ),
  contradictions: z.array(z.string()).max(12),
  citationRisks: z.array(z.string()).max(12),
  confidence: ConfidenceSchema,
});

export const FinalAnswerSchema = z.object({
  executiveSummary: z.string().min(1),
  answer: z.string().min(1),
  decisions: z.array(z.string()).max(12),
  evidence: z.array(EvidenceItemSchema).max(20),
  caveats: z.array(z.string()).max(12),
  confidence: ConfidenceSchema,
});

export const SwarmRunSchema = z.object({
  status: z.enum(["completed", "completed_with_degradation"]),
  mode: SwarmModeSchema,
  plan: PlanSchema,
  contributions: z.object({
    analysis: WorkerReportSchema,
    research: WorkerReportSchema,
    build: DraftSchema,
  }),
  review: z.object({
    critique: CritiqueSchema,
    verification: VerificationSchema,
  }),
  final: FinalAnswerSchema,
  diagnostics: z.object({
    degradedAgents: z.array(z.string()),
    stages: z.literal(4),
    peakParallelism: z.literal(3),
  }),
});

export type SwarmInput = z.infer<typeof SwarmInputSchema>;
export type WorkerReport = z.infer<typeof WorkerReportSchema>;
export type Draft = z.infer<typeof DraftSchema>;
export type Critique = z.infer<typeof CritiqueSchema>;
export type Verification = z.infer<typeof VerificationSchema>;
