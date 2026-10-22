import { defineEvalConfig } from "eve/evals";

export default defineEvalConfig({
  judge: { model: "typesafe-ai/jev" },
  maxConcurrency: 2,
  timeoutMs: 15 * 60 * 1_000,
});
