#!/usr/bin/env bash
# Pick common AI skills and install the ones you select into the current project.
#
# Usage:
#   ./install-ai-skills.sh              interactive menu
#   ./install-ai-skills.sh all          install every skill
#   ./install-ai-skills.sh 1 3 5        install by menu number
#   ./install-ai-skills.sh find-skills  install by skill name
#
# Installs into the directory you run it from (project scope, not global).
# Override the target agent with SKILLS_AGENTS (default: cursor). Use * for all agents:
#   SKILLS_AGENTS='*' ./install-ai-skills.sh

set -u

AGENTS="${SKILLS_AGENTS:-cursor}"

# group|name|repo|source|description
# Names are the skill's frontmatter name, which is what `skills add --skill` expects.
SKILL_TABLE=$(cat << 'EOF'
Discover|find-skills|https://github.com/vercel-labs/skills|Vercel|Find and install other agent skills
Discover|skill-creator|https://github.com/anthropics/skills|Anthropic|Create, edit, and test a new skill

Planning|grill-me|https://github.com/mattpocock/skills|Matt Pocock|Interview a plan until the decisions are solid
Planning|grill-with-docs|https://github.com/mattpocock/skills|Matt Pocock|Same interview, checked against project docs
Planning|prototype|https://github.com/mattpocock/skills|Matt Pocock|Build a small prototype before committing
Planning|teach|https://github.com/mattpocock/skills|Matt Pocock|Explain a topic and check that it landed
Planning|codebase-design|https://github.com/mattpocock/skills|Matt Pocock|Design how a codebase should be structured
Planning|domain-modeling|https://github.com/mattpocock/skills|Matt Pocock|Model the domain before writing the schema
Planning|improve-codebase-architecture|https://github.com/mattpocock/skills|Matt Pocock|Find and fix structural problems
Planning|brainstorming|https://github.com/obra/superpowers|Superpowers|Refine a design before any code is written
Planning|writing-plans|https://github.com/obra/superpowers|Superpowers|Turn an approved design into an implementation plan
Planning|handoff|https://github.com/mattpocock/skills|Matt Pocock|Hand the next session enough context to continue
Planning|triage|https://github.com/mattpocock/skills|Matt Pocock|Sort bugs and tasks by what to do next

Quality|tdd|https://github.com/mattpocock/skills|Matt Pocock|Write the test first, then the code
Quality|test-driven-development|https://github.com/obra/superpowers|Superpowers|Red-green-refactor, with the testing anti-patterns
Quality|diagnosing-bugs|https://github.com/mattpocock/skills|Matt Pocock|Find the cause of a bug before changing code
Quality|systematic-debugging|https://github.com/obra/superpowers|Superpowers|Four-phase root-cause debugging
Quality|verification-before-completion|https://github.com/obra/superpowers|Superpowers|Prove a fix works before calling it done
Quality|code-review|https://github.com/mattpocock/skills|Matt Pocock|Review a diff before it lands
Quality|code-review-and-quality|https://github.com/addyosmani/agent-skills|Addy Osmani|Multi-axis review of a diff or pull request
Quality|differential-review|https://github.com/trailofbits/skills|Trail of Bits|Security review of a diff, with blast radius
Quality|security-and-hardening|https://github.com/addyosmani/agent-skills|Addy Osmani|Harden input, auth, and dependencies
Quality|sharp-edges|https://github.com/trailofbits/skills|Trail of Bits|Spot error-prone APIs and dangerous defaults

Frontend|frontend-design|https://github.com/anthropics/skills|Anthropic|Distinctive UI design instead of generic templates
Frontend|hallmark|https://github.com/nutlope/hallmark|Hallmark|Build UI that refuses to look AI-generated
Frontend|impeccable|https://github.com/pbakaus/impeccable|Impeccable|Design, critique, and polish a frontend
Frontend|design-taste-frontend|https://github.com/leonxlnx/taste-skill|Taste|Landing pages that do not look templated
Frontend|frontend-ui-engineering|https://github.com/addyosmani/agent-skills|Addy Osmani|Accessible, production-quality interface code
Frontend|web-design-guidelines|https://github.com/vercel-labs/agent-skills|Vercel|Audit UI for accessibility, UX, and performance
Frontend|vercel-react-best-practices|https://github.com/vercel-labs/agent-skills|Vercel|React and Next.js performance practices
Frontend|vercel-composition-patterns|https://github.com/vercel-labs/agent-skills|Vercel|React composition that stays flexible
Frontend|vercel-react-native-skills|https://github.com/vercel-labs/agent-skills|Vercel|React Native practices from Vercel
Frontend|react-native-best-practices|https://github.com/callstackincubator/agent-skills|Callstack|React Native performance from Callstack
Frontend|agent-browser|https://github.com/vercel-labs/agent-browser|Vercel|Drive a browser: click, fill, screenshot, test
Frontend|webapp-testing|https://github.com/anthropics/skills|Anthropic|Test a local web app with Playwright
Frontend|web-perf|https://github.com/cloudflare/skills|Cloudflare|Audit Core Web Vitals and load performance
Frontend|performance-optimization|https://github.com/addyosmani/agent-skills|Addy Osmani|Speed up UI, queries, and backend paths
Frontend|expo-router|https://github.com/expo/skills|Expo|Navigation and routes in an Expo app
Frontend|expo-native-ui|https://github.com/expo/skills|Expo|Native UI in Expo
Frontend|expo-data-fetching|https://github.com/expo/skills|Expo|Network, cache, and offline data in Expo

Documents|pdf|https://github.com/anthropics/skills|Anthropic|Read, merge, fill, and create PDFs
Documents|docx|https://github.com/anthropics/skills|Anthropic|Create and edit Word documents
Documents|pptx|https://github.com/anthropics/skills|Anthropic|Create and edit PowerPoint decks
Documents|xlsx|https://github.com/anthropics/skills|Anthropic|Create and edit Excel spreadsheets

Platforms|supabase|https://github.com/supabase/agent-skills|Supabase|Auth, database, storage, and the Supabase CLI
Platforms|supabase-postgres-best-practices|https://github.com/supabase/agent-skills|Supabase|Postgres schema, SQL, RLS, and query performance
Platforms|workers-best-practices|https://github.com/cloudflare/skills|Cloudflare|Production patterns for Cloudflare Workers
Platforms|wrangler|https://github.com/cloudflare/skills|Cloudflare|Develop and deploy Workers with Wrangler
Platforms|deploy-to-vercel|https://github.com/vercel-labs/agent-skills|Vercel|Deploy an app and return the live link
Platforms|vercel-optimize|https://github.com/vercel-labs/agent-skills|Vercel|Cut Vercel cost and slow routes
Platforms|mcp-builder|https://github.com/anthropics/skills|Anthropic|Build an MCP server for an external API
Platforms|gemini-api-dev|https://github.com/google-gemini/gemini-skills|Google|Call the Gemini API from Python or TypeScript
Platforms|sentry-fix-issues|https://github.com/getsentry/agent-skills|Sentry|Fix a production issue from a Sentry trace
Platforms|remotion-best-practices|https://github.com/remotion-dev/skills|Remotion|Make videos in React with Remotion
EOF
)

SKILL_GROUPS=()
NAMES=()
REPOS=()
SOURCES=()
DESCS=()

# Index assignment, not +=. macOS bash 3.2 drops the row when the field
# variable is named "name".
i=0
while IFS='|' read -r group skill repo source desc; do
  [ -z "${skill:-}" ] && continue
  SKILL_GROUPS[$i]=$group
  NAMES[$i]=$skill
  REPOS[$i]=$repo
  SOURCES[$i]=$source
  DESCS[$i]=$desc
  i=$((i + 1))
done << EOF
$SKILL_TABLE
EOF

COUNT=${#NAMES[@]}
SELECTED=()
i=0
while [ "$i" -lt "$COUNT" ]; do
  SELECTED[$i]=0
  i=$((i + 1))
done

if [ -t 1 ]; then
  BOLD=$'\033[1m'
  DIM=$'\033[2m'
  GREEN=$'\033[32m'
  RED=$'\033[31m'
  CYAN=$'\033[36m'
  RESET=$'\033[0m'
else
  BOLD="" DIM="" GREEN="" RED="" CYAN="" RESET=""
fi

die() {
  printf '%s%s%s\n' "$RED" "$1" "$RESET" >&2
  exit 1
}

warn() {
  printf '\n%s%s%s\n' "$RED" "$1" "$RESET" >&2
}

mark() {
  local index="$1" value="$2"
  if [ "$index" -lt 0 ] || [ "$index" -ge "$COUNT" ]; then
    return 1
  fi
  SELECTED[$index]=$value
}

toggle() {
  local index="$1"
  if [ "$index" -lt 0 ] || [ "$index" -ge "$COUNT" ]; then
    return 1
  fi
  if [ "${SELECTED[$index]}" -eq 1 ]; then
    SELECTED[$index]=0
  else
    SELECTED[$index]=1
  fi
}

select_all() {
  local value="$1" n=0
  while [ "$n" -lt "$COUNT" ]; do
    SELECTED[$n]=$value
    n=$((n + 1))
  done
}

find_by_name() {
  local name="$1" n=0
  while [ "$n" -lt "$COUNT" ]; do
    if [ "${NAMES[$n]}" = "$name" ]; then
      printf '%s\n' "$n"
      return 0
    fi
    n=$((n + 1))
  done
  return 1
}

apply_token() {
  local token="$1" mode="${2:-select}" start end index

  case "$token" in
    all|a|A)
      select_all 1
      ;;
    none|n|N)
      select_all 0
      ;;
    *)
      if printf '%s' "$token" | grep -Eq '^[0-9]+-[0-9]+$'; then
        start=${token%-*}
        end=${token#*-}
        if [ "$start" -gt "$end" ]; then
          warn "Bad range: $token"
          return 1
        fi
        index=$start
        while [ "$index" -le "$end" ]; do
          if ! mark $((index - 1)) 1; then
            warn "No skill numbered $index"
            return 1
          fi
          index=$((index + 1))
        done
      elif printf '%s' "$token" | grep -Eq '^[0-9]+$'; then
        if [ "$mode" = "toggle" ]; then
          if ! toggle $((token - 1)); then
            warn "No skill numbered $token"
            return 1
          fi
        elif ! mark $((token - 1)) 1; then
          warn "No skill numbered $token"
          return 1
        fi
      else
        index=$(find_by_name "$token") || {
          warn "Unknown skill: $token"
          return 1
        }
        if [ "$mode" = "toggle" ]; then
          toggle "$index"
        else
          mark "$index" 1
        fi
      fi
      ;;
  esac
}

print_menu() {
  local n=0 box
  printf '\n%sCommon AI skills%s\n' "$BOLD" "$RESET"
  printf '%sInstalls into:%s %s\n' "$DIM" "$RESET" "$(pwd)"
  printf '%sAgent:%s %s   %s(override with SKILLS_AGENTS)%s\n\n' "$DIM" "$RESET" "$AGENTS" "$DIM" "$RESET"

  local last_group=""
  while [ "$n" -lt "$COUNT" ]; do
    if [ "${SKILL_GROUPS[$n]}" != "$last_group" ]; then
      printf '\n  %s%s%s\n' "$BOLD" "${SKILL_GROUPS[$n]}" "$RESET"
      last_group=${SKILL_GROUPS[$n]}
    fi
    if [ "${SELECTED[$n]}" -eq 1 ]; then
      box="${GREEN}[x]${RESET}"
    else
      box="[ ]"
    fi
    printf '  %s  %2d  %s%-34s%s  %-46s  %s%s%s\n' \
      "$box" $((n + 1)) "$CYAN" "${NAMES[$n]}" "$RESET" \
      "${DESCS[$n]}" "$DIM" "${SOURCES[$n]}" "$RESET"
    n=$((n + 1))
  done

  printf '\n%sType numbers to toggle%s (1 3 5, 1-4, 2,4, or a skill name).\n' "$BOLD" "$RESET"
  printf 'all = select all    none = clear    q = quit    enter = install selection\n\n'
}

selected_count() {
  local n=0 total=0
  while [ "$n" -lt "$COUNT" ]; do
    if [ "${SELECTED[$n]}" -eq 1 ]; then
      total=$((total + 1))
    fi
    n=$((n + 1))
  done
  printf '%s\n' "$total"
}

install_selected() {
  local n=0 ok=0 fail=0 total
  total=$(selected_count)
  if [ "$total" -eq 0 ]; then
    printf '%sNothing selected.%s\n' "$DIM" "$RESET"
    return 1
  fi

  printf '\n%sInstalling %s skill(s) into this project...%s\n\n' "$BOLD" "$total" "$RESET"

  while [ "$n" -lt "$COUNT" ]; do
    if [ "${SELECTED[$n]}" -eq 1 ]; then
      printf '%s→ %s%s\n' "$CYAN" "${NAMES[$n]}" "$RESET"
      if npx --yes skills add "${REPOS[$n]}" --skill "${NAMES[$n]}" --agent "$AGENTS" --full-depth -y; then
        ok=$((ok + 1))
      else
        fail=$((fail + 1))
        printf '%s  failed: %s%s\n' "$RED" "${NAMES[$n]}" "$RESET" >&2
      fi
      printf '\n'
    fi
    n=$((n + 1))
  done

  printf '%sDone.%s %s installed, %s failed.\n' "$BOLD" "$RESET" "$ok" "$fail"
  [ "$fail" -eq 0 ]
}

if ! command -v npx >/dev/null 2>&1; then
  die "npx is required. Install Node.js, then run this script again."
fi

if [ "$#" -gt 0 ]; then
  for arg in "$@"; do
    apply_token "$arg" select || exit 1
  done
  install_selected
  exit $?
fi

while true; do
  print_menu
  printf 'Selection: '
  IFS= read -r line || exit 0

  if [ -z "$line" ]; then
    install_selected && exit 0
    continue
  fi

  if [ "$line" = "q" ] || [ "$line" = "quit" ]; then
    exit 0
  fi

  # shellcheck disable=SC2086
  for token in $(printf '%s\n' "$line" | tr ',' ' '); do
    apply_token "$token" toggle || true
  done
done
