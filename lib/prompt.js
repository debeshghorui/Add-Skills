import {
  autocompleteMultiselect,
  cancel,
  intro,
  isCancel,
  log,
  note,
  text,
} from "@clack/prompts";
import { agents } from "./agents.js";
import { skills } from "./catalog.js";
import { installSkills } from "./install.js";

const OTHER = "__other__";

function pageSize() {
  const rows = process.stdout.rows || 24;
  return Math.max(8, Math.min(12, rows - 10));
}

async function askAgents() {
  const picked = await autocompleteMultiselect({
    message: "Which agents should get these skills?",
    placeholder: "Search agents. Try cli or claude",
    initialValues: ["cursor"],
    required: true,
    maxItems: 8,
    options: [
      ...agents.map((agent) => ({
        value: agent.value,
        label: agent.label,
        hint: agent.hint,
      })),
      { value: OTHER, label: "Other", hint: "type an agent name" },
    ],
  });
  if (isCancel(picked)) return picked;

  const selected = picked.filter((value) => value !== OTHER);
  if (!picked.includes(OTHER)) return selected;

  const name = await text({
    message: "Agent name",
    placeholder: "aider-desk",
    validate(value) {
      if (!value || !value.trim()) return "Enter an agent name";
      return undefined;
    },
  });
  if (isCancel(name)) return name;
  selected.push(name.trim());
  return selected;
}

export async function runInteractive(agentFromUser) {
  intro("Common AI skills");
  note(process.cwd(), "Installs into");

  let selectedAgents = agentFromUser ? [agentFromUser] : await askAgents();
  if (isCancel(selectedAgents)) {
    cancel("Cancelled.");
    return 0;
  }
  if (selectedAgents.includes("*")) selectedAgents = ["*"];

  const pickedSkills = await autocompleteMultiselect({
    message: "Select skills to install",
    placeholder: "Search by name, group, or description",
    required: true,
    maxItems: pageSize(),
    options: skills.map((skill) => ({
      value: skill.name,
      label: skill.name,
      hint: `${skill.group} · ${skill.description}`,
    })),
  });
  if (isCancel(pickedSkills)) {
    cancel("Cancelled.");
    return 0;
  }

  const names = new Set(pickedSkills);
  const chosen = skills.filter((skill) => names.has(skill.name));
  if (chosen.length === 0) {
    log.warn("Nothing selected.");
    return 0;
  }

  log.step(`${chosen.length} skill${chosen.length === 1 ? "" : "s"} → ${selectedAgents.join(", ")}`);
  return installSkills(chosen, selectedAgents, { pretty: true });
}
