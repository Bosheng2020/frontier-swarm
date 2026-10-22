/**
 * Central model assignments. Change one value to swap a role without touching
 * orchestration code. All defaults route through Vercel AI Gateway.
 */
export const MODELS = {
  orchestrator: "openai/gpt-6.1-sol",
  planner: "openai/gpt-6.1-sol",
  analyst: "openai/gpt-6.1-sol",
  researcher: "openai/gpt-6.1-sol",
  builder: "openai/gpt-6.1-sol",
  critic: "openai/gpt-6.1-sol",
  verifier: "openai/gpt-6.1-sol",
  synthesizer: "openai/gpt-6.1-sol",
} as const;
