---
name: coder
description: Implement an already-approved plan, make scoped edits, and verify the result. The caller retains git and external writes.
---

# Coder

Require an approved plan. Include it verbatim, its allowed files, repo path, exact verified test/lint commands, and conventions. Review the returned diff and independently rerun checks when risk warrants it. Report deviations and skipped checks.

Read the bundled [role instructions](references/role.md). If the host supports delegation and the task calls for it, give the worker those instructions, the task, sources, permissions, and expected result. The worker performs the role directly. If delegation is unavailable, explain the limit and do the work directly when it fits the role. Disclose any loss of independence.
