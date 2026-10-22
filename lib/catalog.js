// Names are the skill frontmatter name, which is what `skills add --skill` expects.
// Order is the catalog number: index 0 is skill 1.
export const skills = [
  { group: "Discover", name: "find-skills", repo: "https://github.com/vercel-labs/skills", source: "Vercel", description: "Find and install other agent skills" },
  { group: "Discover", name: "skill-creator", repo: "https://github.com/anthropics/skills", source: "Anthropic", description: "Create, edit, and test a new skill" },

  { group: "Planning", name: "grill-me", repo: "https://github.com/mattpocock/skills", source: "Matt Pocock", description: "Interview a plan until the decisions are solid" },
  { group: "Planning", name: "grill-with-docs", repo: "https://github.com/mattpocock/skills", source: "Matt Pocock", description: "Same interview, checked against project docs" },
  { group: "Planning", name: "prototype", repo: "https://github.com/mattpocock/skills", source: "Matt Pocock", description: "Build a small prototype before committing" },
  { group: "Planning", name: "teach", repo: "https://github.com/mattpocock/skills", source: "Matt Pocock", description: "Explain a topic and check that it landed" },
  { group: "Planning", name: "codebase-design", repo: "https://github.com/mattpocock/skills", source: "Matt Pocock", description: "Design how a codebase should be structured" },
  { group: "Planning", name: "domain-modeling", repo: "https://github.com/mattpocock/skills", source: "Matt Pocock", description: "Model the domain before writing the schema" },
  { group: "Planning", name: "improve-codebase-architecture", repo: "https://github.com/mattpocock/skills", source: "Matt Pocock", description: "Find and fix structural problems" },
  { group: "Planning", name: "brainstorming", repo: "https://github.com/obra/superpowers", source: "Superpowers", description: "Refine a design before any code is written" },
  { group: "Planning", name: "writing-plans", repo: "https://github.com/obra/superpowers", source: "Superpowers", description: "Turn an approved design into an implementation plan" },
  { group: "Planning", name: "handoff", repo: "https://github.com/mattpocock/skills", source: "Matt Pocock", description: "Hand the next session enough context to continue" },
  { group: "Planning", name: "triage", repo: "https://github.com/mattpocock/skills", source: "Matt Pocock", description: "Sort bugs and tasks by what to do next" },

  { group: "Quality", name: "tdd", repo: "https://github.com/mattpocock/skills", source: "Matt Pocock", description: "Write the test first, then the code" },
  { group: "Quality", name: "test-driven-development", repo: "https://github.com/obra/superpowers", source: "Superpowers", description: "Red-green-refactor, with the testing anti-patterns" },
  { group: "Quality", name: "diagnosing-bugs", repo: "https://github.com/mattpocock/skills", source: "Matt Pocock", description: "Find the cause of a bug before changing code" },
  { group: "Quality", name: "systematic-debugging", repo: "https://github.com/obra/superpowers", source: "Superpowers", description: "Four-phase root-cause debugging" },
  { group: "Quality", name: "verification-before-completion", repo: "https://github.com/obra/superpowers", source: "Superpowers", description: "Prove a fix works before calling it done" },
  { group: "Quality", name: "code-review", repo: "https://github.com/mattpocock/skills", source: "Matt Pocock", description: "Review a diff before it lands" },
  { group: "Quality", name: "code-review-and-quality", repo: "https://github.com/addyosmani/agent-skills", source: "Addy Osmani", description: "Multi-axis review of a diff or pull request" },
  { group: "Quality", name: "differential-review", repo: "https://github.com/trailofbits/skills", source: "Trail of Bits", description: "Security review of a diff, with blast radius" },
  { group: "Quality", name: "security-and-hardening", repo: "https://github.com/addyosmani/agent-skills", source: "Addy Osmani", description: "Harden input, auth, and dependencies" },
  { group: "Quality", name: "sharp-edges", repo: "https://github.com/trailofbits/skills", source: "Trail of Bits", description: "Spot error-prone APIs and dangerous defaults" },
  { group: "Quality", name: "security-audit", repo: "https://github.com/cloudflare/security-audit-skill", source: "Cloudflare", description: "Multi-phase security audit with verified findings" },

  { group: "MCP", name: "shadcn-mcp", repo: "setup", source: "shadcn", description: "Set up shadcn MCP server for the agent", type: "setup", command: "pnpm dlx shadcn@latest mcp init --client {agent}" },
  
  { group: "Frontend", name: "chaiui", repo: "https://ui.chaicode.com", source: "ChaiUI", description: "ChaiUI design system for shadcn" },
  { group: "Frontend", name: "frontend-design", repo: "https://github.com/anthropics/skills", source: "Anthropic", description: "Distinctive UI design instead of generic templates" },
  { group: "Frontend", name: "hallmark", repo: "https://github.com/nutlope/hallmark", source: "Hallmark", description: "Build UI that refuses to look AI-generated" },
  { group: "Frontend", name: "impeccable", repo: "https://github.com/pbakaus/impeccable", source: "Impeccable", description: "Design, critique, and polish a frontend" },
  { group: "Frontend", name: "design-taste-frontend", repo: "https://github.com/leonxlnx/taste-skill", source: "Taste", description: "Landing pages that do not look templated" },
  { group: "Frontend", name: "frontend-ui-engineering", repo: "https://github.com/addyosmani/agent-skills", source: "Addy Osmani", description: "Accessible, production-quality interface code" },
  { group: "Frontend", name: "web-design-guidelines", repo: "https://github.com/vercel-labs/agent-skills", source: "Vercel", description: "Audit UI for accessibility, UX, and performance" },
  { group: "Frontend", name: "vercel-react-best-practices", repo: "https://github.com/vercel-labs/agent-skills", source: "Vercel", description: "React and Next.js performance practices" },
  { group: "Frontend", name: "vercel-composition-patterns", repo: "https://github.com/vercel-labs/agent-skills", source: "Vercel", description: "React composition that stays flexible" },
  { group: "Frontend", name: "vercel-react-native-skills", repo: "https://github.com/vercel-labs/agent-skills", source: "Vercel", description: "React Native practices from Vercel" },
  { group: "Frontend", name: "react-native-best-practices", repo: "https://github.com/callstackincubator/agent-skills", source: "Callstack", description: "React Native performance from Callstack" },
  { group: "Frontend", name: "agent-browser", repo: "https://github.com/vercel-labs/agent-browser", source: "Vercel", description: "Drive a browser: click, fill, screenshot, test" },
  { group: "Frontend", name: "webapp-testing", repo: "https://github.com/anthropics/skills", source: "Anthropic", description: "Test a local web app with Playwright" },
  { group: "Frontend", name: "web-perf", repo: "https://github.com/cloudflare/skills", source: "Cloudflare", description: "Audit Core Web Vitals and load performance" },
  { group: "Frontend", name: "performance-optimization", repo: "https://github.com/addyosmani/agent-skills", source: "Addy Osmani", description: "Speed up UI, queries, and backend paths" },
  { group: "Frontend", name: "expo-router", repo: "https://github.com/expo/skills", source: "Expo", description: "Navigation and routes in an Expo app" },
  { group: "Frontend", name: "expo-native-ui", repo: "https://github.com/expo/skills", source: "Expo", description: "Native UI in Expo" },
  { group: "Frontend", name: "expo-data-fetching", repo: "https://github.com/expo/skills", source: "Expo", description: "Network, cache, and offline data in Expo" },

  { group: "Documents", name: "pdf", repo: "https://github.com/anthropics/skills", source: "Anthropic", description: "Read, merge, fill, and create PDFs" },
  { group: "Documents", name: "docx", repo: "https://github.com/anthropics/skills", source: "Anthropic", description: "Create and edit Word documents" },
  { group: "Documents", name: "pptx", repo: "https://github.com/anthropics/skills", source: "Anthropic", description: "Create and edit PowerPoint decks" },
  { group: "Documents", name: "xlsx", repo: "https://github.com/anthropics/skills", source: "Anthropic", description: "Create and edit Excel spreadsheets" },

  { group: "Platforms", name: "supabase", repo: "https://github.com/supabase/agent-skills", source: "Supabase", description: "Auth, database, storage, and the Supabase CLI" },
  { group: "Platforms", name: "supabase-postgres-best-practices", repo: "https://github.com/supabase/agent-skills", source: "Supabase", description: "Postgres schema, SQL, RLS, and query performance" },
  { group: "Platforms", name: "workers-best-practices", repo: "https://github.com/cloudflare/skills", source: "Cloudflare", description: "Production patterns for Cloudflare Workers" },
  { group: "Platforms", name: "wrangler", repo: "https://github.com/cloudflare/skills", source: "Cloudflare", description: "Develop and deploy Workers with Wrangler" },
  { group: "Platforms", name: "deploy-to-vercel", repo: "https://github.com/vercel-labs/agent-skills", source: "Vercel", description: "Deploy an app and return the live link" },
  { group: "Platforms", name: "vercel-optimize", repo: "https://github.com/vercel-labs/agent-skills", source: "Vercel", description: "Cut Vercel cost and slow routes" },
  { group: "Platforms", name: "mcp-builder", repo: "https://github.com/anthropics/skills", source: "Anthropic", description: "Build an MCP server for an external API" },
  { group: "Platforms", name: "gemini-api-dev", repo: "https://github.com/google-gemini/gemini-skills", source: "Google", description: "Call the Gemini API from Python or TypeScript" },
  { group: "Platforms", name: "sentry-fix-issues", repo: "https://github.com/getsentry/agent-skills", source: "Sentry", description: "Fix a production issue from a Sentry trace" },
  { group: "Platforms", name: "remotion-best-practices", repo: "https://github.com/remotion-dev/skills", source: "Remotion", description: "Make videos in React with Remotion" },
];

export function formatCatalog(list = skills) {
  const lines = [];
  let lastGroup = "";
  list.forEach((skill, index) => {
    if (skill.group !== lastGroup) {
      if (lines.length > 0) lines.push("");
      lines.push(skill.group);
      lastGroup = skill.group;
    }
    const number = String(index + 1).padStart(2, " ");
    lines.push(`  ${number}  ${skill.name.padEnd(36)}  ${skill.description}`);
  });
  return lines.join("\n");
}
