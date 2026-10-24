# Proposal

## Why

Add-Skills is currently distributed as an npm CLI, while skills.sh helps users discover installable agent skills. Providing an agent skill in the existing public repository gives agents a direct, documented way to help users select and run Add-Skills, and makes the project installable through the Skills CLI.

## What Changes

- Add a standards-compatible `add-ai-skills` agent skill with clear activation guidance and safe, actionable instructions for using the existing CLI.
- Document installation from the GitHub repository with the Skills CLI and explain that skills.sh visibility and ranking depend on user installs.

## Capabilities

### New Capabilities

- `add-ai-skills-agent-skill`: An installable agent skill that guides users through selecting, installing, restoring, and managing AI skills with this project.

### Modified Capabilities

None.

## Impact

Adds skill documentation under `.agents/skills/` and updates the project README. No runtime changes to the npm CLI or new dependencies are expected.
