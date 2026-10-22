import { defineEval } from "eve/evals";
import { SwarmRunSchema } from "../../agent/lib/contracts";

export default defineEval({
  description:
    "A high-impact research and architecture request is delegated once to the bounded swarm and returned as a decision-ready synthesis.",
  tags: ["routing", "swarm", "evidence", "critical-path"],
  async test(t) {
    const turn = await t.send(`
You are advising a public-sector procurement committee. Produce a decision memo comparing an event-sourced architecture with a conventional queue-based architecture for a multi-agent incident-response platform.

The memo must include independent research, an adversarial threat-model review, failure modes, cost and latency trade-offs, a recommendation with decision criteria, explicit confidence, and unresolved uncertainties. This is high-impact and research-heavy. Do not ask a follow-up question; state reasonable assumptions instead.
    `.trim());

    t.succeeded();
    t.calledTool("run_swarm", {
      input: { mode: "deep" },
      output: (value) => SwarmRunSchema.safeParse(value).success,
      count: 1,
    });
    t.maxToolCalls(1);

    const judgments = t.judge({
      state: {
        request:
          "Decision memo comparing event-sourced and queue-based multi-agent incident-response architectures.",
        response: turn.message ?? "",
      },
      questions: {
        decisionQuality: {
          type: "boolean",
          instructions:
            "Does the response make a concrete, conditional recommendation and explain decision criteria, material trade-offs, failure modes, and operational risks for both architectures?",
        },
        evidenceDiscipline: {
          type: "boolean",
          instructions:
            "Does the response distinguish supported facts from assumptions or analysis, preserve important uncertainty, and avoid presenting unverifiable or invented citations as established evidence?",
        },
        reviewDepth: {
          type: "boolean",
          instructions:
            "Does the response reflect independent adversarial review by addressing security threats, counterarguments, and unresolved questions rather than merely advocating one option?",
        },
      },
    });

    judgments.decisionQuality.label("decision-quality").gate(0.8);
    judgments.evidenceDiscipline.label("evidence-discipline").gate(0.8);
    judgments.reviewDepth.label("review-depth").gate(0.8);
  },
});
