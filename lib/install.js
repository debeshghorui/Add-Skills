import { spawn } from "node:child_process";
import { log, outro, spinner } from "@clack/prompts";

export function installArgs(skill, agents) {
  const list = (Array.isArray(agents) ? agents : [agents]).filter(Boolean);
  const flags = list.includes("*") ? ["*"] : list;
  return [
    "--yes",
    "skills",
    "add",
    skill.repo,
    "--skill",
    skill.name,
    ...flags.flatMap((agent) => ["--agent", agent]),
    "--full-depth",
    "-y",
  ];
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

export async function installSkills(chosen, agent, { pretty }) {
  let ok = 0;
  let fail = 0;

  if (!pretty) {
    console.log(`\nInstalling ${chosen.length} skill(s) into ${process.cwd()}...\n`);
  }

  for (const skill of chosen) {
    const spin = pretty ? spinner() : null;
    spin?.start(skill.name);
    if (!pretty) console.log(`→ ${skill.name}`);

    const result = await runNpx(installArgs(skill, agent), { inherit: !pretty });
    if (result.errorCode === "ENOENT") {
      const message = "npx is required. Install Node.js, then run this again.";
      if (pretty) {
        spin?.error(message);
        outro(message);
      } else {
        console.error(message);
      }
      return 1;
    }

    if (result.code === 0) {
      spin?.stop(skill.name);
      ok += 1;
      continue;
    }

    fail += 1;
    const detail = tail(result.output);
    if (pretty) {
      spin?.error(`Failed: ${skill.name}`);
      if (detail) log.error(detail);
    } else if (detail) {
      console.error(detail);
    }
  }

  const summary = `${ok} installed, ${fail} failed.`;
  if (pretty) outro(fail === 0 ? `Installed ${ok} skill${ok === 1 ? "" : "s"}.` : summary);
  else console.log(`\nDone. ${summary}`);

  return fail === 0 ? 0 : 1;
}
