import { defineAgent } from "eve";
import { MODELS } from "../../lib/models";

export default defineAgent({
  description: "Produce a concrete candidate solution from the plan and constraints.",
  model: MODELS.builder,
  reasoning: "high",
  defaultTools: false,
  tool: false,
});
