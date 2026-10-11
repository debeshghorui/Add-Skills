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
    agent: undefined,
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

  return parsed;
}
