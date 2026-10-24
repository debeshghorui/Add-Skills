---
name: add-ai-skills
description: Help choose, install, restore, update, list, or remove AI agent skills in a project using the Add-Skills CLI.
license: MIT
---

# Add AI Skills

Use the Add-Skills CLI when a user wants to manage AI agent skills in a project. Run commands from the target project directory so files are written there. The CLI records the selection in `skills.json`; the Skills CLI records exact sources and hashes in `skills-lock.json`.

## Choose and install skills

- For an interactive catalog and agent picker, run `npx add-ai-skills` (or `npx add-ai-skills pick`).
- To add named skills or catalog numbers directly, run `npx add-ai-skills add <name-or-number> ...`. Ranges such as `1-4` are supported.
- To choose the target agent explicitly, add `--agent <name>`; the default is Cursor. Use `--agent '*'` for all agents supported by the Skills CLI.
- To show the numbered catalog without installing anything, run `npx add-ai-skills --list`.

## Restore and manage a project's selection

- Run `npx add-ai-skills i` to restore the selection from `skills.json`. If that file is absent, the CLI can restore from `skills-lock.json` and create `skills.json`.
- Run `npx add-ai-skills list` to inspect the recorded selection.
- Run `npx add-ai-skills update` to update all selected skills, or `npx add-ai-skills update <name>` for one.
- Run `npx add-ai-skills remove <name> ...` to remove selected skills, or `npx add-ai-skills remove --all` to remove all of them.

After installing or changing skills, explain that the project should commit both `skills.json` and `skills-lock.json` so teammates can restore the same selection with `npx add-ai-skills i`.

For the complete command reference, run `npx add-ai-skills --help` or see the [Add-Skills README](https://github.com/debeshghorui/Add-Skills#readme).
