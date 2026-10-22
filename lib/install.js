import { spawn } from "node:child_process";
import { log, outro, spinner } from "@clack/prompts";
import { recordInstalled } from "./manifest.js";

export function agentFlags(agents) {
  const list = (Array.isArray(agents) ? agents : [agents]).filter(Boolean);
  const flags = list.includes("*") ? ["*"] : list;
  return flags.flatMap((agent) => ["--agent", agent]);
}

export function installArgs(skill, agents) {
  return [
    "--yes",
    "skills",
    "add",
    skill.repo,
    "--skill",
    skill.name,
    ...agentFlags(agents),
    "--full-depth",
    "-y",
  ];
}

export function removeArgs(names, agents, { all = false } = {}) {
  return ["--yes", "skills", "remove", ...(all ? ["--all"] : names), ...agentFlags(agents), "-y"];
}

export function updateArgs(names = []) {
  return ["--yes", "skills", "update", ...names, "--project", "-y"];
}

function npxCommand() {
  return process.platform === "win32" ? "npx.cmd" : "npx";
}

function tail(output) {
  return output
    .replace(/\u001b\[[0-9;]*[A-Za-z]/g, "")
    .trim()
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(-12)
    .join("\n");
}

function runNpx(args, { inherit }) {
  return new Promise((resolve) => {
    let output = "";
    const child = spawn(npxCommand(), args, {
      stdio: inherit ? "inherit" : ["ignore", "pipe", "pipe"],
      windowsHide: true,
    });

    if (!inherit) {
      const append = (chunk) => {
        output += chunk.toString();
        if (output.length > 12000) output = output.slice(-12000);
      };
      child.stdout?.on("data", append);
      child.stderr?.on("data", append);
    }

    child.on("error", (error) => {
      resolve({ code: 1, output: error.message, errorCode: error.code });
    });
    child.on("close", (code) => {
      resolve({ code: code ?? 1, output, errorCode: undefined });
    });
  });
}

function runCommand(command, { inherit }) {
  return new Promise((resolve) => {
    let output = "";
    const child = spawn(command, {
      stdio: inherit ? "inherit" : ["ignore", "pipe", "pipe"],
      windowsHide: true,
      shell: true,
    });

    if (!inherit) {
      const append = (chunk) => {
        output += chunk.toString();
        if (output.length > 12000) output = output.slice(-12000);
      };
      child.stdout?.on("data", append);
      child.stderr?.on("data", append);
    }

    child.on("error", (error) => {
      resolve({ code: 1, output: error.message, errorCode: error.code });
    });
    child.on("close", (code) => {
      resolve({ code: code ?? 1, output, errorCode: undefined });
    });
  });
}

function missingNpx(pretty, spin) {
  const message = "npx is required. Install Node.js, then run this again.";
  if (pretty) {
    spin?.error(message);
    outro(message);
  } else {
    console.error(message);
  }
  return 1;
}

function showFailure(pretty, spin, label, output) {
  const detail = tail(output);
  if (pretty) {
    spin?.error(label);
    if (detail) log.error(detail);
  } else if (detail) {
    console.error(detail);
  }
}

export async function installSkills(chosen, agent, { pretty, cwd = process.cwd() }) {
  let ok = 0;
  let fail = 0;
  const installed = [];

  if (!pretty) {
    console.log(`\nInstalling ${chosen.length} skill(s) into ${cwd}...\n`);
  }

  for (const skill of chosen) {
    const spin = pretty ? spinner() : null;
    spin?.start(skill.name);
    if (!pretty) console.log(`→ ${skill.name}`);

    let result;
    if (skill.type === "setup") {
      // Run custom setup command
      const command = skill.command.replace("{agent}", agent);
      if (skill.useNpx === false) {
        // Run command directly without npx prefix
        result = await runCommand(command, { inherit: !pretty });
      } else {
        // Run through npx/pnpm
        const args = command.split(" ");
        result = await runNpx(args, { inherit: !pretty });
      }
    } else {
      // Run standard skill installation
      result = await runNpx(installArgs(skill, agent), { inherit: !pretty });
    }

    if (result.errorCode === "ENOENT") return missingNpx(pretty, spin);

    if (result.code === 0) {
      spin?.stop(skill.name);
      ok += 1;
      installed.push(skill);
      continue;
    }

    fail += 1;
    showFailure(pretty, spin, `Failed: ${skill.name}`, result.output);
  }

  if (installed.length > 0) {
    try {
      await recordInstalled(installed, agent, cwd);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (pretty) {
        log.error(message);
        outro(message);
      } else {
        console.error(message);
      }
      return 1;
    }
  }

  const wrote = installed.length > 0 ? " skills.json updated." : "";
  const summary = `${ok} installed, ${fail} failed.`;
  if (pretty) {
    outro(fail === 0 ? `Installed ${ok} skill${ok === 1 ? "" : "s"}.${wrote}` : `${summary}${wrote}`);
  } else {
    console.log(`\nDone. ${summary}${wrote}`);
  }

  return fail === 0 ? 0 : 1;
}

export async function removeSkills(names, agents, { pretty, all = false }) {
  const label = all ? "Removing all skills" : `Removing ${names.join(", ")}`;
  const spin = pretty ? spinner() : null;
  spin?.start(label);
  if (!pretty) console.log(label);

  const result = await runNpx(removeArgs(names, agents, { all }), { inherit: !pretty });
  if (result.errorCode === "ENOENT") return missingNpx(pretty, spin);
  if (result.code === 0) {
    spin?.stop(all ? "Removed all skills" : `Removed ${names.join(", ")}`);
    return 0;
  }

  showFailure(pretty, spin, "Remove failed", result.output);
  return 1;
}

export async function updateSkills(names, { pretty }) {
  const label = names.length ? `Updating ${names.join(", ")}` : "Updating skills";
  const spin = pretty ? spinner() : null;
  spin?.start(label);
  if (!pretty) console.log(label);

  const result = await runNpx(updateArgs(names), { inherit: !pretty });
  if (result.errorCode === "ENOENT") return missingNpx(pretty, spin);
  if (result.code === 0) {
    spin?.stop("Updated");
    if (pretty) outro("Updated installed skills.");
    else console.log("Updated installed skills.");
    return 0;
  }

  showFailure(pretty, spin, "Update failed", result.output);
  if (pretty) outro("Update failed.");
  return 1;
}
