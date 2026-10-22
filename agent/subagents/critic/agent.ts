import { defineAgent } from "eve";
import { MODELS } from "../../lib/models";

export default defineAgent({
  description: "Adversarially review a candidate for hidden failures, omissions, and unsafe assumptions.",
  model: MODELS.critic,
  reasoning: "high",
  defaultTools: false,
  tool: false,
});
