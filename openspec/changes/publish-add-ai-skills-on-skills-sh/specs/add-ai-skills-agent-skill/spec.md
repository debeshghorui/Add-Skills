# Spec Delta

## Purpose

Provide an installable agent skill that helps users discover and operate the Add-Skills CLI to choose, install, restore, and manage agent skills in their projects.

## ADDED Requirements

### Requirement: Agent can guide users through Add-Skills
The agent skill MUST explain the Add-Skills CLI's purpose and guide users to an appropriate supported command based on their request.

#### Scenario: User wants to choose skills interactively
- **WHEN** a user asks to browse or select skills for a project
- **THEN** the agent recommends running `npx add-ai-skills` from that project directory and explains that it opens the interactive picker

#### Scenario: User names skills to add
- **WHEN** a user identifies one or more skills to install
- **THEN** the agent provides the `npx add-ai-skills add <skill-names>` form and explains that catalog numbers and names are supported

### Requirement: Agent explains restore and management commands
The agent skill MUST provide accurate commands for restoring and managing the skill selection recorded in a project.

#### Scenario: User wants to restore project skills
- **WHEN** a user asks how to restore skills from project configuration
- **THEN** the agent recommends `npx add-ai-skills i` and explains that it reads `skills.json` and uses `skills-lock.json` as a fallback

#### Scenario: User wants to inspect or change installed skills
- **WHEN** a user asks to list, update, or remove configured skills
- **THEN** the agent provides the corresponding `list`, `update`, or `remove` command and describes its effect

### Requirement: Agent skill is discoverable and installable
The repository MUST provide the agent skill in a Skills CLI discoverable location with valid skill metadata and instructions for installation from the public repository.

#### Scenario: Skills CLI discovers the skill
- **WHEN** a user lists skills available in the public repository with the Skills CLI
- **THEN** the CLI can identify the Add-Skills skill by its declared name and description

#### Scenario: User installs the skill from GitHub
- **WHEN** a user runs the documented Skills CLI install command for the repository
- **THEN** the Add-Skills agent skill can be installed by name
