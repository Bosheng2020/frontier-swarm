import { defineAgent } from "eve";
import { MODELS } from "../../lib/models";

export default defineAgent({
  description: "Decompose complex objectives into bounded, testable workstreams.",
  model: MODELS.planner,
  reasoning: "high",
  defaultTools: false,
  tool: false,
});
