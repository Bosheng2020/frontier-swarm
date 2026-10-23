import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";

const demoScript = "scripts/demo.ts";

function runDemo(...args: string[]) {
  return execFileSync(process.execPath, [demoScript, "--no-color", "--delay=0", ...args], {
    cwd: process.cwd(),
    encoding: "utf8",
  });
}

test("offline demo labels the walkthrough and renders all four stages", () => {
  const output = runDemo();

  assert.match(output, /OFFLINE DETERMINISTIC WALKTHROUGH/);
  assert.match(output, /no model or network calls; not benchmark results/);
  assert.match(output, /\[1\/4\] PLAN/);
  assert.match(output, /\[2\/4\] EXPLORE/);
  assert.match(output, /\[3\/4\] REVIEW/);
  assert.match(output, /\[4\/4\] SYNTHESIZE/);
  assert.match(output, /RESULT\s+completed/);
  assert.match(output, /completed_with_degradation/);
});

test("degraded walkthrough uses the typed fallback and reports its agent", () => {
  const output = runDemo("--degraded");

  assert.match(output, /fallback DraftSchema · degraded/);
  assert.match(output, /RESULT\s+completed_with_degradation/);
  assert.match(output, /degradedAgents=\["builder"\]/);
});

test("JSON mode emits a schema-validated walkthrough fixture", () => {
  const parsed = JSON.parse(runDemo("--degraded", "--json"));

  assert.match(parsed.notice, /not benchmark results/);
  assert.equal(parsed.run.status, "completed_with_degradation");
  assert.deepEqual(parsed.run.diagnostics, {
    degradedAgents: ["builder"],
    stages: 4,
    peakParallelism: 3,
  });
  assert.equal(parsed.run.plan.workstreams.length, 3);
});
