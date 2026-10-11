import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { intro, note } from "@clack/prompts";
import { parseArgs } from "./args.js";
import { formatCatalog, skills } from "./catalog.js";
import { installSkills } from "./install.js";
import { runInteractive } from "./prompt.js";
import { initProject, installProject, listProject, removeProject, updateProject } from "./project.js";
import { selectSkills } from "./select.js";

const packageJson = JSON.parse(
  readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "package.json"), "utf8"),
);

export const helpText = `add-ai-skills

Install AI skills into the current project. skills.json lists the skills and the agents. The Skills CLI writes skills-lock.json with the exact sources and hashes.

Usage
  npx add-ai-skills                         open the picker
  npx add-ai-skills init                    create skills.json
  npx add-ai-skills add                     pick skills and add them
  npx add-ai-skills add 1 3 find-skills     add by number or name
  npx add-ai-skills i                       install every skill in skills.json
  npx add-ai-skills remove find-skills      remove skills
  npx add-ai-skills remove --all            remove every skill in skills.json
  npx add-ai-skills list                    show skills.json
  npx add-ai-skills update                  update installed skills

Options
  -a, --agent <name>   Agent to install for. Default: cursor, or SKILLS_AGENTS
  --all                With remove, remove every skill in skills.json
  -l, --list           Print the numbered catalog
  -h, --help           Show this help
  -v, --version        Print the version

i is short for install. install, rm, and uninstall are the long forms.
add with no names opens the picker. A number or skill name with no command still adds that skill.

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
  if (parsed.list || parsed.command === "catalog") {
    console.log(formatCatalog(skills));
    return 0;
  }

  const tty = Boolean(process.stdin.isTTY && process.stdout.isTTY);
  const agentFromUser = parsed.agent ?? env.SKILLS_AGENTS;

  try {
    switch (parsed.command) {
      case "init":
        return await initProject(agentFromUser);
      case "install":
        return await installProject({ agent: agentFromUser, pretty: tty });
      case "list":
        return await listProject();
      case "remove":
        return await removeProject({
          names: parsed.tokens,
          all: parsed.all,
          agent: agentFromUser,
          pretty: tty,
        });
      case "update":
        return await updateProject(parsed.tokens, { pretty: tty });
      case "add":
      case undefined:
        return await addSkills(parsed.tokens, agentFromUser, tty);
      default:
        console.error(`Unknown command: ${parsed.command}`);
        return 1;
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    return 1;
  }
}

async function addSkills(tokens, agentFromUser, tty) {
  if (tokens.length === 0) {
    if (!tty) {
      console.error(helpText.trimEnd());
      return 1;
    }
    return runInteractive(agentFromUser);
  }

  let chosen;
  try {
    chosen = selectSkills(tokens, skills);
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
