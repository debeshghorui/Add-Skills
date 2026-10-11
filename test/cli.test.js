import assert from "node:assert/strict";
import test from "node:test";
import { parseArgs } from "../lib/args.js";
import { skills } from "../lib/catalog.js";
import { installArgs } from "../lib/install.js";
import { selectSkills } from "../lib/select.js";

test("catalog numbers stay aligned with the README", () => {
  assert.equal(skills.length, 55);
  assert.equal(skills[0].name, "find-skills");
  assert.equal(skills[23].name, "security-audit");
  assert.equal(skills[54].name, "remotion-best-practices");
});

test("selects by number, range, name, and comma list", () => {
  assert.deepEqual(
    selectSkills(["1", "3"], skills).map((skill) => skill.name),
    ["find-skills", "grill-me"],
  );
  assert.deepEqual(
    selectSkills(["1-2"], skills).map((skill) => skill.name),
    ["find-skills", "skill-creator"],
  );
  assert.deepEqual(
    selectSkills(["2,4"], skills).map((skill) => skill.name),
    ["skill-creator", "grill-with-docs"],
  );
  assert.deepEqual(
    selectSkills(["frontend-design"], skills).map((skill) => skill.name),
    ["frontend-design"],
  );
});

test("all selects every skill and none clears earlier picks", () => {
  assert.equal(selectSkills(["all"], skills).length, 55);
  assert.deepEqual(selectSkills(["1", "none", "tdd"], skills).map((skill) => skill.name), ["tdd"]);
  assert.equal(selectSkills(["none"], skills).length, 0);
});

test("unknown skill, bad range, and out-of-range number fail before install", () => {
  assert.throws(() => selectSkills(["not-a-skill"], skills), /Unknown skill: not-a-skill/);
  assert.throws(() => selectSkills(["4-1"], skills), /Bad range: 4-1/);
  assert.throws(() => selectSkills(["99"], skills), /No skill numbered 99/);
});

test("parses agent flags and leaves skill tokens alone", () => {
  assert.equal(parseArgs(["--agent", "claude-code", "24"]).agent, "claude-code");
  assert.deepEqual(parseArgs(["-a", "cursor", "find-skills"]).tokens, ["find-skills"]);
  assert.equal(parseArgs(["--agent=*"]).agent, "*");
  assert.equal(parseArgs(["--list"]).list, true);
  assert.throws(() => parseArgs(["--nope"]), /Unknown option: --nope/);
  assert.throws(() => parseArgs(["--agent"]), /Missing value for --agent/);
});

test("builds the skills CLI command", () => {
  assert.deepEqual(installArgs(skills[0], "cursor"), [
    "--yes",
    "skills",
    "add",
    "https://github.com/vercel-labs/skills",
    "--skill",
    "find-skills",
    "--agent",
    "cursor",
    "--full-depth",
    "-y",
  ]);
  assert.deepEqual(installArgs(skills[0], ["cursor", "claude-code"]).slice(6, 10), [
    "--agent",
    "cursor",
    "--agent",
    "claude-code",
  ]);
  assert.ok(installArgs(skills[0], ["cursor", "*"]).includes("*"));
  assert.equal(installArgs(skills[0], ["cursor", "*"]).filter((part) => part === "--agent").length, 1);
});
