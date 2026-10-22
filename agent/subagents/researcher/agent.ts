import { defineAgent } from "eve";
import { MODELS } from "../../lib/models";

export default defineAgent({
  description: "Find current primary-source evidence and expose uncertainty or conflicting claims.",
  model: MODELS.researcher,
  reasoning: "high",
  defaultTools: false,
  tool: false,
});
