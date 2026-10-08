# Common AI Skills

Pick the skills you want and install them into the project you are in. The installer is `install-ai-skills.sh`. It uses the [Skills CLI](https://skills.sh/) (`npx skills`) and writes skills into the current directory for Cursor. It does not install them globally.

## Requirements

- [Node.js](https://nodejs.org/) with `npx` on your `PATH`
- A project directory you want the skills installed into

## User manual

Run the script from the project that should receive the skills. The target directory is whatever `pwd` prints when the menu opens.

### Download from GitHub

From the project directory, fetch the script and run it:

```bash
curl -fsSL https://raw.githubusercontent.com/debeshghorui/Add-Skills/main/install-ai-skills.sh -o install-ai-skills.sh
chmod +x install-ai-skills.sh
./install-ai-skills.sh
```

That writes `install-ai-skills.sh` into the current directory, then opens the menu. Skills install into that same directory.

### Run a local copy

If you already have the file:

```bash
cd /path/to/your-project
bash /path/to/install-ai-skills.sh
```

You can also make the script executable and call it directly:

```bash
chmod +x install-ai-skills.sh
./install-ai-skills.sh
```

### Interactive menu

With no arguments, the script prints every skill, grouped, and waits for a selection.

| Input | What it does |
| --- | --- |
| `1 3 5` | Toggle skills 1, 3, and 5 |
| `1-4` | Toggle a range |
| `2,4` | Toggle those numbers (commas work the same as spaces) |
| `find-skills` | Toggle by skill name |
| `all` or `a` | Select every skill |
| `none` or `n` | Clear the selection |
| Enter | Install whatever is selected, then exit |
| `q` or `quit` | Exit without installing |

Selected rows show `[x]`. Press Enter on an empty selection and nothing is installed; the menu stays open.

### Install from the command line

Arguments select skills and install them immediately. There is no menu.

```bash
./install-ai-skills.sh all
./install-ai-skills.sh 1 3 5
./install-ai-skills.sh 1-4
./install-ai-skills.sh find-skills frontend-design
```

Numbers match the catalog below. An unknown name or a number outside the list stops the script before anything is installed.

### Choose the agent

Skills install for Cursor by default. Set `SKILLS_AGENTS` to another agent, or `*` for every agent the Skills CLI supports.

```bash
SKILLS_AGENTS='*' ./install-ai-skills.sh find-skills
SKILLS_AGENTS=claude-code ./install-ai-skills.sh 24
```

### What gets installed

Each selected skill is installed with:

```bash
npx --yes skills add <repo> --skill <name> --agent cursor --full-depth -y
```

For Cursor, files land in `.agents/skills/` inside the project you ran the script from. The script prints a count of installs that succeeded and installs that failed. A failed skill does not roll back the ones that already succeeded.

### Update later

This script only adds skills. To refresh ones already in the project:

```bash
npx skills update
```

Browse the wider catalog at [skills.sh](https://skills.sh/), or install [find-skills](https://skills.sh/vercel-labs/skills/find-skills) and ask the agent to look one up.

## Skill catalog

Fifty-one skills. The number is the menu index used by `./install-ai-skills.sh <number>`.

### Discover

| # | Skill | Description | Source |
| --- | --- | --- | --- |
| 1 | [find-skills](https://skills.sh/vercel-labs/skills/find-skills) | Find and install other agent skills | Vercel |
| 2 | [skill-creator](https://skills.sh/anthropics/skills/skill-creator) | Create, edit, and test a new skill | Anthropic |

### Planning

| # | Skill | Description | Source |
| --- | --- | --- | --- |
| 3 | [grill-me](https://skills.sh/mattpocock/skills/grill-me) | Interview a plan until the decisions are solid | Matt Pocock |
| 4 | [grill-with-docs](https://skills.sh/mattpocock/skills/grill-with-docs) | Same interview, checked against project docs | Matt Pocock |
| 5 | [prototype](https://skills.sh/mattpocock/skills/prototype) | Build a small prototype before committing | Matt Pocock |
| 6 | [teach](https://skills.sh/mattpocock/skills/teach) | Explain a topic and check that it landed | Matt Pocock |
| 7 | [codebase-design](https://skills.sh/mattpocock/skills/codebase-design) | Design how a codebase should be structured | Matt Pocock |
| 8 | [domain-modeling](https://skills.sh/mattpocock/skills/domain-modeling) | Model the domain before writing the schema | Matt Pocock |
| 9 | [improve-codebase-architecture](https://skills.sh/mattpocock/skills/improve-codebase-architecture) | Find and fix structural problems | Matt Pocock |
| 10 | [brainstorming](https://skills.sh/obra/superpowers/brainstorming) | Refine a design before any code is written | Superpowers |
| 11 | [writing-plans](https://skills.sh/obra/superpowers/writing-plans) | Turn an approved design into an implementation plan | Superpowers |
| 12 | [handoff](https://skills.sh/mattpocock/skills/handoff) | Hand the next session enough context to continue | Matt Pocock |
| 13 | [triage](https://skills.sh/mattpocock/skills/triage) | Sort bugs and tasks by what to do next | Matt Pocock |

### Quality

| # | Skill | Description | Source |
| --- | --- | --- | --- |
| 14 | [tdd](https://skills.sh/mattpocock/skills/tdd) | Write the test first, then the code | Matt Pocock |
| 15 | [test-driven-development](https://skills.sh/obra/superpowers/test-driven-development) | Red-green-refactor, with the testing anti-patterns | Superpowers |
| 16 | [diagnosing-bugs](https://skills.sh/mattpocock/skills/diagnosing-bugs) | Find the cause of a bug before changing code | Matt Pocock |
| 17 | [systematic-debugging](https://skills.sh/obra/superpowers/systematic-debugging) | Four-phase root-cause debugging | Superpowers |
| 18 | [verification-before-completion](https://skills.sh/obra/superpowers/verification-before-completion) | Prove a fix works before calling it done | Superpowers |
| 19 | [code-review](https://skills.sh/mattpocock/skills/code-review) | Review a diff before it lands | Matt Pocock |
| 20 | [code-review-and-quality](https://skills.sh/addyosmani/agent-skills/code-review-and-quality) | Multi-axis review of a diff or pull request | Addy Osmani |
| 21 | [differential-review](https://skills.sh/trailofbits/skills/differential-review) | Security review of a diff, with blast radius | Trail of Bits |
| 22 | [security-and-hardening](https://skills.sh/addyosmani/agent-skills/security-and-hardening) | Harden input, auth, and dependencies | Addy Osmani |
| 23 | [sharp-edges](https://skills.sh/trailofbits/skills/sharp-edges) | Spot error-prone APIs and dangerous defaults | Trail of Bits |

### Frontend

| # | Skill | Description | Source |
| --- | --- | --- | --- |
| 24 | [frontend-design](https://skills.sh/anthropics/skills/frontend-design) | Distinctive UI design instead of generic templates | Anthropic |
| 25 | [frontend-ui-engineering](https://skills.sh/addyosmani/agent-skills/frontend-ui-engineering) | Accessible, production-quality interface code | Addy Osmani |
| 26 | [web-design-guidelines](https://skills.sh/vercel-labs/agent-skills/web-design-guidelines) | Audit UI for accessibility, UX, and performance | Vercel |
| 27 | [vercel-react-best-practices](https://skills.sh/vercel-labs/agent-skills/vercel-react-best-practices) | React and Next.js performance practices | Vercel |
| 28 | [vercel-composition-patterns](https://skills.sh/vercel-labs/agent-skills/vercel-composition-patterns) | React composition that stays flexible | Vercel |
| 29 | [vercel-react-native-skills](https://skills.sh/vercel-labs/agent-skills/vercel-react-native-skills) | React Native practices from Vercel | Vercel |
| 30 | [react-native-best-practices](https://skills.sh/callstackincubator/agent-skills/react-native-best-practices) | React Native performance from Callstack | Callstack |
| 31 | [agent-browser](https://skills.sh/vercel-labs/agent-browser/agent-browser) | Drive a browser: click, fill, screenshot, test | Vercel |
| 32 | [webapp-testing](https://skills.sh/anthropics/skills/webapp-testing) | Test a local web app with Playwright | Anthropic |
| 33 | [web-perf](https://skills.sh/cloudflare/skills/web-perf) | Audit Core Web Vitals and load performance | Cloudflare |
| 34 | [performance-optimization](https://skills.sh/addyosmani/agent-skills/performance-optimization) | Speed up UI, queries, and backend paths | Addy Osmani |
| 35 | [expo-router](https://skills.sh/expo/skills/expo-router) | Navigation and routes in an Expo app | Expo |
| 36 | [expo-native-ui](https://skills.sh/expo/skills/expo-native-ui) | Native UI in Expo | Expo |
| 37 | [expo-data-fetching](https://skills.sh/expo/skills/expo-data-fetching) | Network, cache, and offline data in Expo | Expo |

### Documents

| # | Skill | Description | Source |
| --- | --- | --- | --- |
| 38 | [pdf](https://skills.sh/anthropics/skills/pdf) | Read, merge, fill, and create PDFs | Anthropic |
| 39 | [docx](https://skills.sh/anthropics/skills/docx) | Create and edit Word documents | Anthropic |
| 40 | [pptx](https://skills.sh/anthropics/skills/pptx) | Create and edit PowerPoint decks | Anthropic |
| 41 | [xlsx](https://skills.sh/anthropics/skills/xlsx) | Create and edit Excel spreadsheets | Anthropic |

### Platforms

| # | Skill | Description | Source |
| --- | --- | --- | --- |
| 42 | [supabase](https://skills.sh/supabase/agent-skills/supabase) | Auth, database, storage, and the Supabase CLI | Supabase |
| 43 | [supabase-postgres-best-practices](https://skills.sh/supabase/agent-skills/supabase-postgres-best-practices) | Postgres schema, SQL, RLS, and query performance | Supabase |
| 44 | [workers-best-practices](https://skills.sh/cloudflare/skills/workers-best-practices) | Production patterns for Cloudflare Workers | Cloudflare |
| 45 | [wrangler](https://skills.sh/cloudflare/skills/wrangler) | Develop and deploy Workers with Wrangler | Cloudflare |
| 46 | [deploy-to-vercel](https://skills.sh/vercel-labs/agent-skills/deploy-to-vercel) | Deploy an app and return the live link | Vercel |
| 47 | [vercel-optimize](https://skills.sh/vercel-labs/agent-skills/vercel-optimize) | Cut Vercel cost and slow routes | Vercel |
| 48 | [mcp-builder](https://skills.sh/anthropics/skills/mcp-builder) | Build an MCP server for an external API | Anthropic |
| 49 | [gemini-api-dev](https://skills.sh/google-gemini/gemini-skills/gemini-api-dev) | Call the Gemini API from Python or TypeScript | Google |
| 50 | [sentry-fix-issues](https://skills.sh/getsentry/agent-skills/sentry-fix-issues) | Fix a production issue from a Sentry trace | Sentry |
| 51 | [remotion-best-practices](https://skills.sh/remotion-dev/skills/remotion-best-practices) | Make videos in React with Remotion | Remotion |

## Sources

| Source | Repository |
| --- | --- |
| Vercel | [vercel-labs/skills](https://github.com/vercel-labs/skills), [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills), [vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser) |
| Anthropic | [anthropics/skills](https://github.com/anthropics/skills) |
| Matt Pocock | [mattpocock/skills](https://github.com/mattpocock/skills) |
| Superpowers | [obra/superpowers](https://github.com/obra/superpowers) |
| Addy Osmani | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) |
| Trail of Bits | [trailofbits/skills](https://github.com/trailofbits/skills) |
| Callstack | [callstackincubator/agent-skills](https://github.com/callstackincubator/agent-skills) |
| Cloudflare | [cloudflare/skills](https://github.com/cloudflare/skills) |
| Expo | [expo/skills](https://github.com/expo/skills) |
| Supabase | [supabase/agent-skills](https://github.com/supabase/agent-skills) |
| Google | [google-gemini/gemini-skills](https://github.com/google-gemini/gemini-skills) |
| Sentry | [getsentry/agent-skills](https://github.com/getsentry/agent-skills) |
| Remotion | [remotion-dev/skills](https://github.com/remotion-dev/skills) |
