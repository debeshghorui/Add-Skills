import { intro, note, outro } from "@clack/prompts";
import { installSkills, removeSkills, updateSkills } from "./install.js";
import {
  createManifest,
  formatSkillList,
  readLock,
  readManifest,
  removeFromManifest,
  skillsFromLock,
  skillsFromManifest,
  writeManifest,
} from "./manifest.js";

export async function initProject(agent, cwd = process.cwd()) {
  const existing = await readManifest(cwd);
  if (existing) {
    console.log("skills.json already exists.");
    return 0;
  }

  await writeManifest(createManifest(agent || "cursor"), cwd);
  console.log("Created skills.json.");
  console.log("Add skills with: npx add-ai-skills add");
  return 0;
}

export async function listProject(cwd = process.cwd()) {
  const manifest = await readManifest(cwd);
  if (!manifest) {
    console.error("No skills.json in this directory. Run: npx add-ai-skills init");
    return 1;
  }
  console.log(formatSkillList(manifest));
  return 0;
}

export async function installProject({ agent, pretty, cwd = process.cwd() }) {
  const manifest = await readManifest(cwd);
  let chosen;
  let agents;
  let restoredFromLock = false;
  let skipped = [];

  if (manifest && Object.keys(manifest.skills).length > 0) {
    chosen = skillsFromManifest(manifest);
    agents = agent ? [agent] : manifest.agents;
  } else {
    const lock = await readLock(cwd);
    if (!lock) {
      console.error("No skills to install. Run: npx add-ai-skills add");
      return 1;
    }
    const converted = skillsFromLock(lock);
    skipped = converted.skipped;
    if (converted.skills.length === 0) {
      const detail = skipped.length ? ` Skipped: ${skipped.join(", ")}.` : "";
      console.error(`skills-lock.json has no skills this command can restore.${detail}`);
      return 1;
    }
    chosen = converted.skills;
    agents = agent ? [agent] : ["cursor"];
    restoredFromLock = true;
  }

  if (pretty) {
    const lines = [cwd, `Agents: ${agents.join(", ")}`];
    if (restoredFromLock && !agent) {
      lines.push("No skills.json yet. These install for cursor. Edit agents in skills.json after this.");
    }
    if (skipped.length) lines.push(`Skipped: ${skipped.join(", ")}`);
    intro("Common AI skills");
    note(lines.join("\n"), "Installs into");
  } else if (restoredFromLock && !agent) {
    console.log("No skills.json yet. Restoring from skills-lock.json for cursor.");
  }
  if (!pretty && skipped.length) {
    console.error(`Skipped skills this command cannot restore: ${skipped.join(", ")}`);
  }

  return installSkills(chosen, agents, { pretty, cwd });
}

export async function removeProject({ names, all = false, agent, pretty, cwd = process.cwd() }) {
  if (!all && names.length === 0) {
    console.error("Name the skills to remove, or pass --all.");
    return 1;
  }

  const manifest = await readManifest(cwd);
  const agents = agent ? [agent] : manifest?.agents?.length ? manifest.agents : ["cursor"];
  if (pretty) intro("Common AI skills");

  const code = await removeSkills(all ? [] : names, agents, { pretty, all });
  if (code !== 0) {
    if (pretty) outro("skills.json was left unchanged.");
    return code;
  }
  if (!manifest) {
    if (pretty) outro("Removed.");
    return 0;
  }

  await writeManifest(removeFromManifest(manifest, names, { all }), cwd);
  if (pretty) outro("Updated skills.json.");
  else console.log("Updated skills.json.");
  return 0;
}

export async function updateProject(names, { pretty }) {
  if (pretty) intro("Common AI skills");
  return updateSkills(names, { pretty });
}
