import { defineAgent } from "eve";
import { MODELS } from "../../lib/models";

export default defineAgent({
  description: "Synthesize reviewed artifacts into a clear final answer with qualitative confidence labels.",
  model: MODELS.synthesizer,
  reasoning: "high",
  defaultTools: false,
  tool: false,
});
