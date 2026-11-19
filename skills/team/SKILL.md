---
name: team
description: Coordinate scout, advisor, planner, coder, and reviewer roles using the current harness. Use for team workflows and multi-agent implementation; skip unnecessary delegation on small tasks.
---

# Team

The main agent owns integration, user communication, git, external writes, and any requested project notes. Read [delegation guidance](references/delegation.md) before dispatch; the sibling [scout](../scout/SKILL.md), [advisor](../advisor/SKILL.md), [planner](../planner/SKILL.md), [coder](../coder/SKILL.md), and [reviewer](../reviewer/SKILL.md) skills supply their worker instructions. These portable skills require no named agent definitions or particular model provider.

Before dispatch, check that the required role instructions are available. Name any missing roles and use the delegation guidance to decide whether a direct pass can satisfy the request.

## Model capability preferences

| Role | Preferred capability | Writes source files? |
|---|---|---|
| scout | Economical text retrieval and faithful extraction, with required tools/context | No |
| advisor | Strong reasoning about alternatives, architecture, and risks | No |
| planner | Strong code understanding and concrete implementation planning | No |
| coder | Economical agentic coding, tool use, and verification | Yes |
| reviewer | Independent code reasoning and defect detection | No |

Exact model IDs and invocation syntax belong to active harness instructions. Roles are not claims of equivalent model quality.

## Ticket flow

1. Scout retrieves the ticket and comments; planner receives the extract, repo context, and acceptance criteria.
2. Planner produces a concrete plan. Use advisor when a decision warrants another perspective.
3. Obtain plan approval before implementation unless the user already supplied it. Preserve active authorization; do not ask twice.
4. Coder implements the approved plan; the main agent inspects the diff and verifies relevant results.
5. Reviewer checks risky/large changes or a requested review. Supply intent, sources, and checks without the implementer's verdict. At most three reviewer/fix rounds; unresolved blockers require a report and user direction.
6. Main agent handles separately authorized git/external actions and requested project notes.

Skip roles that add no value. Parallelize only independent tasks with disjoint write ownership and within the runtime's concurrency limit. Do not parallelize a reviewer with an unfinished implementation or a coder with a pending plan.

## Briefs and results

Supply task, absolute repo path, applicable instructions, source evidence, boundaries, allowed files, and verification commands. Include fetched extracts instead of requesting redundant retrieval. Pass relevant code-search instructions explicitly; do not assume inheritance. A self-contained brief works whether context is inherited or isolated.

Accept scout duplication pointers only when their source text is present; request named missing sections. Treat advice as input to judgment, not authority. Report disagreements and unverified claims. Keep long-lived servers/watchers in the main agent's control with a verified launch/stop method.
