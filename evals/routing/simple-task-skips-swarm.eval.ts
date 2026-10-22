import { defineEval } from "eve/evals";
import { satisfies } from "eve/evals/expect";

export default defineEval({
  description:
    "A deterministic one-step request is answered directly without paying the latency or token cost of the swarm.",
  tags: ["routing", "cost", "deterministic", "critical-path"],
  async test(t) {
    const turn = await t.send(
      "Return the result of 17 multiplied by 6. Reply with the digits only and do not explain.",
    );

    t.succeeded();
    t.usedNoTools();
    t.check(
      turn.message ?? "",
      satisfies(
        (value) => typeof value === "string" && value.trim() === "102",
        "exact direct answer is 102",
      ),
    );
  },
});
