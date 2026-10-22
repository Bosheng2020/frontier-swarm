import { defineEval } from "eve/evals";
import { SwarmRunSchema } from "../../agent/lib/contracts";

export default defineEval({
  description:
    "The swarm surfaces a material contradiction instead of collapsing conflicting evidence into a false certainty.",
  tags: ["evidence", "contradictions", "calibration", "swarm"],
  async test(t) {
    const turn = await t.send(`
Write a go/no-go recommendation for the Atlas launch using independent analysis and verification. Two equally recent internal summaries conflict:

- Summary A says the payment migration passed 4,000 replay tests with zero mismatches.
- Summary B says 31 of the same 4,000 replay tests produced ledger mismatches.

Neither summary includes raw test output or a link to the test run. Explain what can and cannot be concluded, give a provisional recommendation, identify the minimum evidence needed to resolve the conflict, and calibrate confidence. This is a consequential launch decision; do not ask a follow-up question.
    `.trim());

    t.succeeded();
    t.calledTool("run_swarm", {
      output: (value) => SwarmRunSchema.safeParse(value).success,
      count: 1,
    });
    t.maxToolCalls(1);

    const judgments = t.judge({
      state: {
        response: turn.message ?? "",
        knownConflict:
          "Summary A reports zero mismatches; Summary B reports 31 mismatches; neither provides primary evidence.",
      },
      questions: {
        contradictionPreserved: {
          type: "boolean",
          instructions:
            "Does the response explicitly preserve the contradiction and avoid selecting either unsupported summary as fact?",
        },
        conservativeDecision: {
          type: "boolean",
          instructions:
            "Is the go/no-go recommendation appropriately conservative and reversible given a potentially material ledger-integrity failure?",
        },
        verificationPlan: {
          type: "boolean",
          instructions:
            "Does the response request concrete primary evidence or reruns capable of resolving the exact discrepancy and calibrate confidence accordingly?",
        },
      },
    });

    judgments.contradictionPreserved.label("contradiction-preserved").gate(0.85);
    judgments.conservativeDecision.label("conservative-decision").gate(0.8);
    judgments.verificationPlan.label("verification-plan").gate(0.85);
  },
});
