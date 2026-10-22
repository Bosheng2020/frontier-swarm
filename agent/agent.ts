import { defineAgent } from "eve";
import { MODELS } from "./lib/models";

export default defineAgent({
  description:
    "Coordinate bounded specialist teams for complex, evidence-sensitive work; answer simple requests directly.",
  model: MODELS.orchestrator,
  reasoning: "high",
  defaultTools: false,
  tool: false,
  limits: {
    maxInputTokensPerSession: 1_000_000,
    maxOutputTokensPerSession: 80_000,
    maxTokenCostUsdPerSession: 5,
    sessionTimeoutMs: 7 * 24 * 60 * 60 * 1_000,
  },
});
