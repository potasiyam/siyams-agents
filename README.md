# Siyam's Agents

Five agent roles and 15 skills for coding assistants. Start with `interview-me` to clarify a request, `planner` to turn it into testable changes, or `reviewer` to check a diff. The `team` skill coordinates roles when the host supports delegation.

## Install

From the project where you want the skills, run:

```sh
npx skills add potasiyam/siyams-agents
```

Choose your skills and coding assistant. Add `-g` to install across projects. For the team workflow, select `team`, `advisor`, `planner`, `coder`, `reviewer`, and `scout` together.

### Install native agents or use Python

From this folder, run the Python 3 installer. This example installs all skills for a project that reads `.agents/skills` and the five native agent definitions for Claude Code.

```sh
python install.py --skills-dir .agents/skills --agents-dir .claude/agents
```

Use `python3` on macOS or Linux, or `py -3` on Windows, if that is your Python 3 launcher. Relative destinations resolve from the current directory. To install in a different project or in a user profile, pass its actual skills or agents directory. Either option works on its own. For Cursor's Markdown agents, use `.cursor/agents`. Repeating the command skips identical files. The installer reports existing files with different contents before copying.

You can also copy the contents of `skills/` into a harness's skill directory. Hosts that accept plain prompts can use the self-contained Markdown files in `agents/`. Restart or reload the host and check its skills or agents list.

## Collection

| Use | Skills |
| --- | --- |
| Delegate work | advisor, planner, coder, reviewer, scout, team |
| Clarify and deliver changes | interview-me, ticket-implement, atg, gitflow, project-onboard |
| Inspect pages and interfaces | chrome-page-snapshot, pxdiff, ui-copy |
| Compare local installations | skills-sync |

The Markdown agents are advisor, planner, coder, reviewer, and scout. Each receives its task and context from the caller. Choose models and enforce tool permissions in the host's configuration.
