import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { intro, note } from "@clack/prompts";
import { parseArgs } from "./args.js";
import { formatCatalog, skills } from "./catalog.js";
import { installSkills } from "./install.js";
import { runInteractive } from "./prompt.js";
import { selectSkills } from "./select.js";

const packageJson = JSON.parse(
  readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "package.json"), "utf8"),
);

export const helpText = `add-ai-skills

Pick common AI skills and install them into the current project.

Usage
  npx add-ai-skills                         open the picker
  npx add-ai-skills all                     install every skill
  npx add-ai-skills 1 3 5                   install by catalog number
  npx add-ai-skills 1-4                     install a range
  npx add-ai-skills find-skills             install by name
  npx add-ai-skills --agent claude-code 24  choose the agent

Options
  -a, --agent <name>   Agent to install for. Default: cursor, or SKILLS_AGENTS
  -l, --list           Print the numbered catalog
  -h, --help           Show this help
  -v, --version        Print the version

The picker is a live search. Type to filter, ↑↓ moves, space or tab selects, and enter confirms.
Ctrl-c quits without installing. Agents include editors and CLI agents such as Claude Code, Codex, and Gemini CLI.
`;

export async function run(argv, env = process.env) {
  let parsed;
  try {
    parsed = parseArgs(argv);
  } catch (error) {
    console.error(error.message);
    return 1;
  }

  if (parsed.help) {
    console.log(helpText.trimEnd());
    return 0;
  }
  if (parsed.version) {
    console.log(packageJson.version);
    return 0;
  }
  if (parsed.list) {
    console.log(formatCatalog(skills));
    return 0;
  }

  const tty = Boolean(process.stdin.isTTY && process.stdout.isTTY);
  const agentFromUser = parsed.agent ?? env.SKILLS_AGENTS;

  if (parsed.tokens.length === 0) {
    if (!tty) {
      console.error(helpText.trimEnd());
      return 1;
    }
    return runInteractive(agentFromUser);
  }

  let chosen;
  try {
    chosen = selectSkills(parsed.tokens, skills);
  } catch (error) {
    console.error(error.message);
    return 1;
  }
  if (chosen.length === 0) {
    console.error("Nothing selected.");
    return 1;
  }

  const agent = agentFromUser || "cursor";
  if (tty) {
    intro("Common AI skills");
    note(`${process.cwd()}\nAgent: ${agent}`, "Installs into");
  }
  return installSkills(chosen, agent, { pretty: tty });
}

export async function main() {
  const code = await run(process.argv.slice(2));
  process.exit(code);
}
