# add-ai-skills

Install a curated set of AI agent skills into the project you are in, then restore that same set on any machine with one command.

```bash
npx add-ai-skills
```

Run it from the project directory. It opens a picker, installs the skills you choose for the agents you choose, and records the result in `skills.json`. It uses the [Skills CLI](https://skills.sh/) (`npx skills`) and writes skills into that project. Cursor is the default agent. Claude Code, Codex, Gemini CLI, and other editors and CLI agents are in the same picker.

`skills.json` is the list of skills and agents for this project. `skills-lock.json` is the exact sources and hashes, written by the Skills CLI. Commit both. On a fresh checkout, `npx add-ai-skills i` installs every skill in `skills.json`, the same way `npm i` installs from a lockfile.

Requires [Node.js](https://nodejs.org/) 20.12 or newer, with `npx` on your `PATH`.

## Quick start

From the project that should receive the skills:

```bash
npx add-ai-skills
```

The picker shows that directory before you confirm. Choose agents, choose skills, and confirm. Nothing installs until you confirm. npm runs the installer without adding this package as a dependency.

After that, commit `skills.json` and `skills-lock.json`. Anyone who clones the repo restores the skills with:

```bash
npx add-ai-skills i
```

To skip the picker:

```bash
npx add-ai-skills add find-skills frontend-design
npx add-ai-skills add 1 3 5
npx add-ai-skills add 1-4
```

Numbers match the [catalog](#skill-catalog). Print it with `npx add-ai-skills --list`.

## Project files

| File | Written by | What it records |
| --- | --- | --- |
| `skills.json` | add-ai-skills | Which skills to install, and which agents receive them |
| `skills-lock.json` | Skills CLI | Exact sources and content hashes |

```json
{
  "agents": ["cursor"],
  "skills": {
    "find-skills": {
      "repo": "https://github.com/vercel-labs/skills",
      "description": "Find and install other agent skills"
    }
  }
}
```

`i` reads `skills.json` and installs every listed skill for the agents in that file. If `skills.json` is missing, `i` restores what it can from `skills-lock.json`, installs those skills for Cursor, and writes `skills.json`. Pass `--agent` to use a different agent for that run.

```bash
npx add-ai-skills i --agent claude-code
```

Each selected skill is installed with:

```bash
npx --yes skills add <repo> --skill <name> --agent cursor --full-depth -y
```

For Cursor, files land in `.agents/skills/` inside the project you ran the command from. Each skill that installs is added to `skills.json`. The CLI prints how many installs succeeded and how many failed. Skills that succeeded stay installed and are written to `skills.json`.

## Commands

| Command | Also | What it does |
| --- | --- | --- |
| `npx add-ai-skills` | `pick`, `menu` | Open the interactive picker |
| `npx add-ai-skills init` | | Create an empty `skills.json` |
| `npx add-ai-skills add` | | Open the picker and add the skills you choose |
| `npx add-ai-skills add 1 3 find-skills` | | Add skills by catalog number or name |
| `npx add-ai-skills i` | `install` | Install every skill in `skills.json` |
| `npx add-ai-skills remove find-skills` | `rm`, `uninstall` | Remove skills from the project and from `skills.json` |
| `npx add-ai-skills remove --all` | | Remove every skill in `skills.json` |
| `npx add-ai-skills list` | `ls` | Show the skills and agents in `skills.json` |
| `npx add-ai-skills update` | `upgrade` | Update installed skills to the latest version |
| `npx add-ai-skills update find-skills` | | Update one skill |
| `npx add-ai-skills --list` | `catalog`, `-l` | Print the numbered catalog |
| `npx add-ai-skills --help` | `-h` | Show help |
| `npx add-ai-skills --version` | `-v` | Print the version |

`add` with no skill names opens the picker. A number or name with no command adds that skill.

### Add from the command line

```bash
npx add-ai-skills add all
npx add-ai-skills add 1 3 5
npx add-ai-skills add 1-4
npx add-ai-skills add 2,4
npx add-ai-skills add find-skills frontend-design
```

`all` (or `a`) selects every skill. `none` (or `n`) clears the selection so far. An unknown name, a bad range, or a number outside the list stops the command before anything is installed.

### Remove and update

```bash
npx add-ai-skills remove find-skills pdf
npx add-ai-skills remove --all
npx add-ai-skills update
npx add-ai-skills update find-skills
```

`remove` deletes the skill files and those entries from `skills.json`. `--all` is only valid with `remove`. If removal fails, `skills.json` is left unchanged.

### Choose the agent

Skills install for Cursor by default. Pass `--agent` (`-a`), or set `SKILLS_AGENTS`. Use `*` for every agent the Skills CLI supports.

```bash
npx add-ai-skills --agent claude-code 24
npx add-ai-skills --agent '*' find-skills
SKILLS_AGENTS=claude-code npx add-ai-skills 24
```

When you pass an agent this way, the picker skips the agent question and goes straight to the skill list.

## Picker

```bash
npx add-ai-skills
npx add-ai-skills pick
```

There are two screens. The first is agents. Cursor starts selected. Type `cli` to show terminal agents such as Claude Code, Codex, Gemini CLI, and OpenCode, and select as many as you want. The second screen is the skill list. Type `react`, `security`, or a group name to filter it.

| Key | What it does |
| --- | --- |
| Type | Filter the list |
| `↑` `↓` | Move through the matches |
| `space` or `tab` | Select or clear the highlighted row |
| `enter` | Confirm this screen and continue |
| `ctrl-c` | Quit without installing |

Choose **Other** on the agent screen to type an agent name that is not in the list. **All agents** passes `*` to the Skills CLI.

Built-in agents: Cursor, Claude Code, Codex, Gemini CLI, OpenCode, GitHub Copilot, Amp, Droid, Grok, Qwen Code, Kiro CLI, Kilo Code, Warp, Goose, Devin, OpenHands, Crush, Continue, Windsurf, Antigravity, Cline, Zed, and Roo Code.

## Skill catalog

Fifty-eight skills. The number is the menu index used by `npx add-ai-skills <number>`.

Browse the wider catalog at [skills.sh](https://skills.sh/), or install [find-skills](https://skills.sh/vercel-labs/skills/find-skills) and ask the agent to look one up.

### Setup

| # | Skill | Description | Source |
| --- | --- | --- | --- |
| 1 | openspec-setup | Set up OpenSpec in the project | OpenSpec |

### Discover

| # | Skill | Description | Source |
| --- | --- | --- | --- |
| 2 | [find-skills](https://skills.sh/vercel-labs/skills/find-skills) | Find and install other agent skills | Vercel |
| 3 | [skill-creator](https://skills.sh/anthropics/skills/skill-creator) | Create, edit, and test a new skill | Anthropic |

### Planning

| # | Skill | Description | Source |
| --- | --- | --- | --- |
| 4 | [grill-me](https://skills.sh/mattpocock/skills/grill-me) | Interview a plan until the decisions are solid | Matt Pocock |
| 5 | [grill-with-docs](https://skills.sh/mattpocock/skills/grill-with-docs) | Same interview, checked against project docs | Matt Pocock |
| 6 | [prototype](https://skills.sh/mattpocock/skills/prototype) | Build a small prototype before committing | Matt Pocock |
| 7 | [teach](https://skills.sh/mattpocock/skills/teach) | Explain a topic and check that it landed | Matt Pocock |
| 8 | [codebase-design](https://skills.sh/mattpocock/skills/codebase-design) | Design how a codebase should be structured | Matt Pocock |
| 9 | [domain-modeling](https://skills.sh/mattpocock/skills/domain-modeling) | Model the domain before writing the schema | Matt Pocock |
| 10 | [improve-codebase-architecture](https://skills.sh/mattpocock/skills/improve-codebase-architecture) | Find and fix structural problems | Matt Pocock |
| 11 | [brainstorming](https://skills.sh/obra/superpowers/brainstorming) | Refine a design before any code is written | Superpowers |
| 12 | [writing-plans](https://skills.sh/obra/superpowers/writing-plans) | Turn an approved design into an implementation plan | Superpowers |
| 13 | [handoff](https://skills.sh/mattpocock/skills/handoff) | Hand the next session enough context to continue | Matt Pocock |
| 14 | [triage](https://skills.sh/mattpocock/skills/triage) | Sort bugs and tasks by what to do next | Matt Pocock |

### Quality

| # | Skill | Description | Source |
| --- | --- | --- | --- |
| 15 | [tdd](https://skills.sh/mattpocock/skills/tdd) | Write the test first, then the code | Matt Pocock |
| 16 | [test-driven-development](https://skills.sh/obra/superpowers/test-driven-development) | Red-green-refactor, with the testing anti-patterns | Superpowers |
| 17 | [diagnosing-bugs](https://skills.sh/mattpocock/skills/diagnosing-bugs) | Find the cause of a bug before changing code | Matt Pocock |
| 18 | [systematic-debugging](https://skills.sh/obra/superpowers/systematic-debugging) | Four-phase root-cause debugging | Superpowers |
| 19 | [verification-before-completion](https://skills.sh/obra/superpowers/verification-before-completion) | Prove a fix works before calling it done | Superpowers |
| 20 | [code-review](https://skills.sh/mattpocock/skills/code-review) | Review a diff before it lands | Matt Pocock |
| 21 | [code-review-and-quality](https://skills.sh/addyosmani/agent-skills/code-review-and-quality) | Multi-axis review of a diff or pull request | Addy Osmani |
| 22 | [differential-review](https://skills.sh/trailofbits/skills/differential-review) | Security review of a diff, with blast radius | Trail of Bits |
| 23 | [security-and-hardening](https://skills.sh/addyosmani/agent-skills/security-and-hardening) | Harden input, auth, and dependencies | Addy Osmani |
| 24 | [sharp-edges](https://skills.sh/trailofbits/skills/sharp-edges) | Spot error-prone APIs and dangerous defaults | Trail of Bits |
| 25 | [security-audit](https://github.com/cloudflare/security-audit-skill) | Multi-phase security audit with verified findings | Cloudflare |

### MCP

| # | Skill | Description | Source |
| --- | --- | --- | --- |
| 26 | shadcn-mcp | Set up shadcn MCP server for the agent | shadcn |

### Frontend

| # | Skill | Description | Source |
| --- | --- | --- | --- |
| 27 | chaiui | ChaiUI design system for shadcn | ChaiUI |
| 28 | [frontend-design](https://skills.sh/anthropics/skills/frontend-design) | Distinctive UI design instead of generic templates | Anthropic |
| 29 | [hallmark](https://github.com/nutlope/hallmark) | Build UI that refuses to look AI-generated | Hallmark |
| 30 | [impeccable](https://github.com/pbakaus/impeccable) | Design, critique, and polish a frontend | Impeccable |
| 31 | [design-taste-frontend](https://github.com/leonxlnx/taste-skill) | Landing pages that do not look templated | Taste |
| 32 | [frontend-ui-engineering](https://skills.sh/addyosmani/agent-skills/frontend-ui-engineering) | Accessible, production-quality interface code | Addy Osmani |
| 33 | [web-design-guidelines](https://skills.sh/vercel-labs/agent-skills/web-design-guidelines) | Audit UI for accessibility, UX, and performance | Vercel |
| 34 | [vercel-react-best-practices](https://skills.sh/vercel-labs/agent-skills/vercel-react-best-practices) | React and Next.js performance practices | Vercel |
| 35 | [vercel-composition-patterns](https://skills.sh/vercel-labs/agent-skills/vercel-composition-patterns) | React composition that stays flexible | Vercel |
| 36 | [vercel-react-native-skills](https://skills.sh/vercel-labs/agent-skills/vercel-react-native-skills) | React Native practices from Vercel | Vercel |
| 37 | [react-native-best-practices](https://skills.sh/callstackincubator/agent-skills/react-native-best-practices) | React Native performance from Callstack | Callstack |
| 38 | [agent-browser](https://skills.sh/vercel-labs/agent-browser/agent-browser) | Drive a browser: click, fill, screenshot, test | Vercel |
| 39 | [webapp-testing](https://skills.sh/anthropics/skills/webapp-testing) | Test a local web app with Playwright | Anthropic |
| 40 | [web-perf](https://skills.sh/cloudflare/skills/web-perf) | Audit Core Web Vitals and load performance | Cloudflare |
| 41 | [performance-optimization](https://skills.sh/addyosmani/agent-skills/performance-optimization) | Speed up UI, queries, and backend paths | Addy Osmani |
| 42 | [expo-router](https://skills.sh/expo/skills/expo-router) | Navigation and routes in an Expo app | Expo |
| 43 | [expo-native-ui](https://skills.sh/expo/skills/expo-native-ui) | Native UI in Expo | Expo |
| 44 | [expo-data-fetching](https://skills.sh/expo/skills/expo-data-fetching) | Network, cache, and offline data in Expo | Expo |

### Documents

| # | Skill | Description | Source |
| --- | --- | --- | --- |
| 45 | [pdf](https://skills.sh/anthropics/skills/pdf) | Read, merge, fill, and create PDFs | Anthropic |
| 46 | [docx](https://skills.sh/anthropics/skills/docx) | Create and edit Word documents | Anthropic |
| 47 | [pptx](https://skills.sh/anthropics/skills/pptx) | Create and edit PowerPoint decks | Anthropic |
| 48 | [xlsx](https://skills.sh/anthropics/skills/xlsx) | Create and edit Excel spreadsheets | Anthropic |

### Platforms

| # | Skill | Description | Source |
| --- | --- | --- | --- |
| 49 | [supabase](https://skills.sh/supabase/agent-skills/supabase) | Auth, database, storage, and the Supabase CLI | Supabase |
| 50 | [supabase-postgres-best-practices](https://skills.sh/supabase/agent-skills/supabase-postgres-best-practices) | Postgres schema, SQL, RLS, and query performance | Supabase |
| 51 | [workers-best-practices](https://skills.sh/cloudflare/skills/workers-best-practices) | Production patterns for Cloudflare Workers | Cloudflare |
| 52 | [wrangler](https://skills.sh/cloudflare/skills/wrangler) | Develop and deploy Workers with Wrangler | Cloudflare |
| 53 | [deploy-to-vercel](https://skills.sh/vercel-labs/agent-skills/deploy-to-vercel) | Deploy an app and return the live link | Vercel |
| 54 | [vercel-optimize](https://skills.sh/vercel-labs/agent-skills/vercel-optimize) | Cut Vercel cost and slow routes | Vercel |
| 55 | [mcp-builder](https://skills.sh/anthropics/skills/mcp-builder) | Build an MCP server for an external API | Anthropic |
| 56 | [gemini-api-dev](https://skills.sh/google-gemini/gemini-skills/gemini-api-dev) | Call the Gemini API from Python or TypeScript | Google |
| 57 | [sentry-fix-issues](https://skills.sh/getsentry/agent-skills/sentry-fix-issues) | Fix a production issue from a Sentry trace | Sentry |
| 58 | [remotion-best-practices](https://skills.sh/remotion-dev/skills/remotion-best-practices) | Make videos in React with Remotion | Remotion |


## Sources

| Source | Repository |
| --- | --- |
| Vercel | [vercel-labs/skills](https://github.com/vercel-labs/skills), [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills), [vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser) |
| Anthropic | [anthropics/skills](https://github.com/anthropics/skills) |
| Hallmark | [nutlope/hallmark](https://github.com/nutlope/hallmark) |
| Impeccable | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) |
| Taste | [leonxlnx/taste-skill](https://github.com/leonxlnx/taste-skill) |
| Matt Pocock | [mattpocock/skills](https://github.com/mattpocock/skills) |
| Superpowers | [obra/superpowers](https://github.com/obra/superpowers) |
| Addy Osmani | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) |
| Trail of Bits | [trailofbits/skills](https://github.com/trailofbits/skills) |
| Callstack | [callstackincubator/agent-skills](https://github.com/callstackincubator/agent-skills) |
| Cloudflare | [cloudflare/skills](https://github.com/cloudflare/skills), [cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill) |
| Expo | [expo/skills](https://github.com/expo/skills) |
| Supabase | [supabase/agent-skills](https://github.com/supabase/agent-skills) |
| Google | [google-gemini/gemini-skills](https://github.com/google-gemini/gemini-skills) |
| Sentry | [getsentry/agent-skills](https://github.com/getsentry/agent-skills) |
| Remotion | [remotion-dev/skills](https://github.com/remotion-dev/skills) |
| OpenSpec | [openspec.dev](https://openspec.dev) |
| shadcn | [ui.shadcn.com](https://ui.shadcn.com) |
| ChaiUI | [ui.chaicode.com](https://ui.chaicode.com) |

## Develop

Clone the repo, install its dependencies, then run it from the project that should receive the skills:

```bash
git clone https://github.com/debeshghorui/Add-Skills.git
cd Add-Skills
npm install
cd /path/to/your-project
node /path/to/Add-Skills/bin/add-ai-skills.js
```
