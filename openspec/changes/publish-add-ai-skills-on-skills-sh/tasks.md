# Tasks

## 1. Add the installable agent skill

- [x] 1.1 Create `.agents/skills/add-ai-skills/SKILL.md` with valid `name` and `description` frontmatter and accurate guidance for interactive selection, adding by name or catalog number, restoring, listing, updating, and removing skills; verify the metadata name matches the directory and every command matches the CLI help/documentation.
- [ ] 1.2 Verify the Skills CLI discovers the repository skill by running `npx skills add debeshghorui/Add-Skills --list` and confirm `add-ai-skills` is listed without installing it.

## 2. Document installation and discovery

- [x] 2.1 Update README with the Skills CLI install command for `debeshghorui/Add-Skills` and the skill name, explain skills.sh discovery through installs, and verify the command and explanation match current skills.sh documentation.
- [x] 2.2 Add the skills.sh badge using the documented repository URL and verify the rendered link targets the Add-Skills repository page.
