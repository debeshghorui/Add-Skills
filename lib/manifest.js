import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

export const MANIFEST_FILE = "skills.json";
export const LOCK_FILE = "skills-lock.json";

export function normalizeAgents(agents) {
  const list = [];
  const source = Array.isArray(agents) ? agents : [agents];
  for (const agent of source) {
    if (typeof agent !== "string") continue;
    const trimmed = agent.trim();
    if (!trimmed || list.includes(trimmed)) continue;
    list.push(trimmed);
  }
  if (list.includes("*")) return ["*"];
  return list;
}

export function createManifest(agents = "cursor") {
  const list = normalizeAgents(agents);
  return { agents: list.length ? list : ["cursor"], skills: {} };
}

export function parseManifest(parsed) {
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("skills.json must be a JSON object");
  }
  if (parsed.agents !== undefined && !Array.isArray(parsed.agents)) {
    throw new Error("skills.json agents must be an array");
  }
  if (
    parsed.skills !== undefined &&
    (typeof parsed.skills !== "object" || parsed.skills === null || Array.isArray(parsed.skills))
  ) {
    throw new Error("skills.json skills must be an object");
  }

  const skills = {};
  for (const [name, entry] of Object.entries(parsed.skills ?? {})) {
    if (
      !entry ||
      typeof entry !== "object" ||
      Array.isArray(entry) ||
      typeof entry.repo !== "string" ||
      !entry.repo.trim()
    ) {
      throw new Error(`skills.json skill "${name}" needs a repo`);
    }
    const description = typeof entry.description === "string" ? entry.description.trim() : "";
    skills[name] = {
      repo: entry.repo.trim(),
      ...(description ? { description } : {}),
    };
  }

  const agents = normalizeAgents(parsed.agents ?? ["cursor"]);
  return { agents: agents.length ? agents : ["cursor"], skills };
}

export function mergeInstalled(manifest, chosen, agents) {
  const skills = { ...(manifest?.skills ?? {}) };
  for (const skill of chosen) {
    if (!skill?.name || !skill?.repo) throw new Error("A skill needs a name and a repo");
    const previous = skills[skill.name] ?? {};
    const description = skill.description || previous.description;
    skills[skill.name] = {
      repo: skill.repo,
      ...(description ? { description } : {}),
    };
  }

  const mergedAgents = normalizeAgents([...(manifest?.agents ?? []), ...normalizeAgents(agents)]);
  return {
    agents: mergedAgents.length ? mergedAgents : ["cursor"],
    skills,
  };
}

export function removeFromManifest(manifest, names, { all = false } = {}) {
  if (all) return { agents: manifest.agents, skills: {} };
  const drop = new Set(names);
  const skills = {};
  for (const [name, entry] of Object.entries(manifest.skills)) {
    if (!drop.has(name)) skills[name] = entry;
  }
  return { agents: manifest.agents, skills };
}

export function skillsFromManifest(manifest) {
  return Object.keys(manifest.skills)
    .sort()
    .map((name) => {
      const entry = manifest.skills[name];
      return {
        name,
        repo: entry.repo,
        ...(entry.description ? { description: entry.description } : {}),
      };
    });
}

export function repoFromLockEntry(entry) {
  if (!entry || typeof entry !== "object") return null;
  if (entry.sourceType === "node_modules") return null;
  if (typeof entry.sourceUrl === "string" && entry.sourceUrl.trim()) return entry.sourceUrl.trim();
  if (typeof entry.source === "string" && entry.source.trim()) return entry.source.trim();
  return null;
}

export function skillsFromLock(lock) {
  if (!lock || typeof lock.skills !== "object" || lock.skills === null || Array.isArray(lock.skills)) {
    throw new Error("skills-lock.json has no skills object");
  }

  const skills = [];
  const skipped = [];
  for (const name of Object.keys(lock.skills).sort()) {
    const repo = repoFromLockEntry(lock.skills[name]);
    if (!repo) skipped.push(name);
    else skills.push({ name, repo });
  }
  return { skills, skipped };
}

export function formatManifest(manifest) {
  const skills = {};
  for (const name of Object.keys(manifest.skills).sort()) {
    const entry = manifest.skills[name];
    skills[name] = {
      repo: entry.repo,
      ...(entry.description ? { description: entry.description } : {}),
    };
  }
  return `${JSON.stringify({ agents: manifest.agents, skills }, null, 2)}\n`;
}

export function formatSkillList(manifest) {
  const lines = ["Agents"];
  if (manifest.agents.length === 0) lines.push("  (none)");
  else for (const agent of manifest.agents) lines.push(`  ${agent}`);

  lines.push("", "Skills");
  const names = Object.keys(manifest.skills).sort();
  if (names.length === 0) {
    lines.push("  (none)");
    return lines.join("\n");
  }

  for (const name of names) {
    const skill = manifest.skills[name];
    lines.push(`  ${name}`);
    if (skill.description) lines.push(`    ${skill.description}`);
    lines.push(`    ${skill.repo}`);
  }
  return lines.join("\n");
}

async function readText(path) {
  try {
    return await readFile(path, "utf8");
  } catch (error) {
    if (error?.code === "ENOENT") return null;
    throw error;
  }
}

export async function readManifest(cwd = process.cwd()) {
  const raw = await readText(join(cwd, MANIFEST_FILE));
  if (raw === null) return null;
  try {
    return parseManifest(JSON.parse(raw));
  } catch (error) {
    if (error instanceof SyntaxError) throw new Error("Could not read skills.json: invalid JSON");
    throw error;
  }
}

export async function readLock(cwd = process.cwd()) {
  const raw = await readText(join(cwd, LOCK_FILE));
  if (raw === null) return null;
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error("Could not read skills-lock.json: invalid JSON");
  }
}

export async function writeManifest(manifest, cwd = process.cwd()) {
  await writeFile(join(cwd, MANIFEST_FILE), formatManifest(manifest), "utf8");
}

export async function recordInstalled(chosen, agents, cwd = process.cwd()) {
  const current = await readManifest(cwd);
  const next = mergeInstalled(current, chosen, agents);
  await writeManifest(next, cwd);
  return next;
}
