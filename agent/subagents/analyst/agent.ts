import { defineAgent } from "eve";
import { MODELS } from "../../lib/models";

export default defineAgent({
  description: "Analyze requirements, constraints, tradeoffs, and decision structure.",
  model: MODELS.analyst,
  reasoning: "high",
  defaultTools: false,
  tool: false,
});
