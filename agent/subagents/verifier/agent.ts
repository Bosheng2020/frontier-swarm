import { defineAgent } from "eve";
import { MODELS } from "../../lib/models";

export default defineAgent({
  description: "Verify success criteria, evidence traceability, contradictions, and confidence.",
  model: MODELS.verifier,
  reasoning: "high",
  defaultTools: false,
  tool: false,
});
