const COMMANDS = {
  init: "init",
  i: "install",
  install: "install",
  add: "add",
  remove: "remove",
  rm: "remove",
  uninstall: "remove",
  list: "list",
  ls: "list",
  update: "update",
  upgrade: "update",
  catalog: "catalog",
};

const ALLOWS_NAMES = new Set(["add", "remove", "update"]);

export class ArgsError extends Error {
  constructor(message) {
    super(message);
    this.name = "ArgsError";
  }
}

export function parseArgs(argv) {
  const parsed = {
    help: false,
    version: false,
    list: false,
    all: false,
    agent: undefined,
    command: undefined,
    tokens: [],
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      parsed.help = true;
    } else if (arg === "--version" || arg === "-v") {
      parsed.version = true;
    } else if (arg === "--list" || arg === "-l") {
      parsed.list = true;
    } else if (arg === "--all") {
      parsed.all = true;
    } else if (arg === "--agent" || arg === "-a") {
      const value = argv[i + 1];
      if (!value || value.startsWith("-")) {
        throw new ArgsError("Missing value for --agent");
      }
      parsed.agent = value;
      i += 1;
    } else if (arg.startsWith("--agent=")) {
      const value = arg.slice("--agent=".length);
      if (!value) throw new ArgsError("Missing value for --agent");
      parsed.agent = value;
    } else if (arg === "--") {
      parsed.tokens.push(...argv.slice(i + 1));
      break;
    } else if (arg.startsWith("-")) {
      throw new ArgsError(`Unknown option: ${arg}`);
    } else {
      parsed.tokens.push(arg);
    }
  }

  const head = parsed.tokens[0];
  if (head && Object.hasOwn(COMMANDS, head)) {
    parsed.command = COMMANDS[head];
    parsed.tokens.shift();
  }

  if (parsed.all && parsed.command !== "remove") {
    throw new ArgsError("--all is only for remove");
  }
  if (parsed.command && !ALLOWS_NAMES.has(parsed.command) && parsed.tokens.length > 0) {
    throw new ArgsError(`${parsed.command} does not take skill names. Use add to add skills.`);
  }

  return parsed;
}
