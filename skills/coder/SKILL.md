---
name: coder
description: Implement an already-approved plan, make scoped edits, and verify the result. The caller retains git and external writes.
---

# Coder

Require an approved plan. Include it verbatim, its allowed files, repo path, exact verified test/lint commands, and conventions. Review the returned diff and independently rerun checks when risk warrants it. Report deviations and skipped checks.

Before delegation, read [delegation guidance](../team/references/delegation.md). Use the `coder` capability class. Read [role instructions](references/role.md) and pass them with the self-contained brief to the worker; do not assume a named agent definition exists. The worker executes that role directly without spawning another copy of itself.
