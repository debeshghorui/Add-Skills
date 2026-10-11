import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { formatManifest, readManifest, recordInstalled, skillsFromLock } from "../lib/manifest.js";
import { initProject, installProject, removeProject } from "../lib/project.js";

test("skills.json records skills and merges the next add", async () => {
  const cwd = await mkdtemp(join(tmpdir(), "skills-json-"));
  try {
    await recordInstalled(
      [
        {
          name: "find-skills",
          repo: "https://github.com/vercel-labs/skills",
          description: "Find and install other agent skills",
        },
      ],
      ["cursor"],
      cwd,
    );
    await recordInstalled(
      [
        {
          name: "tdd",
          repo: "https://github.com/mattpocock/skills",
          description: "Write the test first, then the code",
        },
      ],
      ["claude-code"],
      cwd,
    );

    const manifest = await readManifest(cwd);
    assert.deepEqual(manifest.agents, ["cursor", "claude-code"]);
    assert.equal(manifest.skills["find-skills"].repo, "https://github.com/vercel-labs/skills");
    assert.equal(manifest.skills.tdd.description, "Write the test first, then the code");
    const raw = await readFile(join(cwd, "skills.json"), "utf8");
    assert.equal(raw, formatManifest(manifest));
    assert.ok(raw.endsWith("\n"));
    assert.ok(raw.indexOf("find-skills") < raw.indexOf("tdd"));
  } finally {
    await rm(cwd, { recursive: true, force: true });
  }
});

test("init creates skills.json and does not overwrite it", async () => {
  const cwd = await mkdtemp(join(tmpdir(), "skills-init-"));
  try {
    assert.equal(await initProject("claude-code", cwd), 0);
    const created = await readManifest(cwd);
    assert.deepEqual(created.agents, ["claude-code"]);
    assert.deepEqual(created.skills, {});

    await recordInstalled(
      [{ name: "tdd", repo: "https://github.com/mattpocock/skills", description: "Tests first" }],
      ["cursor"],
      cwd,
    );
    assert.equal(await initProject("gemini-cli", cwd), 0);
    const kept = await readManifest(cwd);
    assert.equal(kept.skills.tdd.repo, "https://github.com/mattpocock/skills");
    assert.deepEqual(kept.agents, ["claude-code", "cursor"]);
  } finally {
    await rm(cwd, { recursive: true, force: true });
  }
});

test("install and remove fail before npx when there is nothing to do", async () => {
  const cwd = await mkdtemp(join(tmpdir(), "skills-empty-"));
  try {
    assert.equal(await installProject({ pretty: false, cwd }), 1);
    assert.equal(await removeProject({ names: [], pretty: false, cwd }), 1);
    assert.equal(await readManifest(cwd), null);
  } finally {
    await rm(cwd, { recursive: true, force: true });
  }
});

test("skills-lock.json restores github skills and skips node_modules", () => {
  const converted = skillsFromLock({
    version: 1,
    skills: {
      pdf: { source: "anthropics/skills", sourceType: "github", computedHash: "abc" },
      bundled: { source: "some-pkg", sourceType: "node_modules", computedHash: "def" },
      remote: {
        source: "ignored",
        sourceType: "github",
        sourceUrl: "https://github.com/vercel-labs/agent-skills",
        computedHash: "g",
      },
    },
  });

  assert.deepEqual(
    converted.skills.map((skill) => skill.name),
    ["pdf", "remote"],
  );
  assert.equal(converted.skills[0].repo, "anthropics/skills");
  assert.equal(converted.skills[1].repo, "https://github.com/vercel-labs/agent-skills");
  assert.deepEqual(converted.skipped, ["bundled"]);
});
