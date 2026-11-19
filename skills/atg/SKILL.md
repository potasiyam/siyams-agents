---
name: atg
description: Plan AND execute a complex multi-step task as an Atomic Task Graph (arXiv:2607.01942) — recursively compile the task into a DAG of atomic tool calls with preserved input/output interfaces, validate it with a pre-execution thought experiment, execute independent branches in parallel, and self-repair only the minimal failed subgraph until the goal is reached. Use when the user asks to "plan with ATG", "atg plan", "atg run", "graph plan", or "execute the atg". Not for simple tasks — ATG adds overhead there.
disable-model-invocation: true
---

# ATG — Atomic Task Graph

Source: Zhang et al., "Atomic Task Graph: A Unified Framework for Agentic Planning and Execution", arXiv:2607.01942. Training-free control framework. Plan and execution share one explicit DAG. One agent plans, executes, and repairs.

Paper limitation (§7): ATG adds overhead for simple tasks. Simple task → say so, do it directly, stop.

## Model

- **Task** x: objective, constraints, desired output. GOAL = what an acceptable final output y looks like.
- **Tool**: atomic functional unit, used only through its input → output interface. Never decomposed further.
- **Node** v = (input i, tool f, output o) = exactly one concrete tool call.
- **Edge** v_j → v_k: output o_j is part of input i_k. Linear chains and trees are special cases.
- **Feasible graph**: every node is a valid tool call, every edge is a correct input-output dependency, and running the graph in topological order yields y.

## State file

Keep the graph in `atg-state.md` (project dir if writable and never committed, else a temp dir). The file holds the graph, not the conversation. Update it after every change.

```
## ATG: <task>
GOAL: <acceptable final output>

N1: <tool call: verb + object>          [pending]
  IN: <user/task | N?.OUT>
  OUT: <what it produces>
  ANCESTRY: <root > A > A2>

Rounds: 1: N1, N2 · 2: N3
```

Sections below the graph:
- `## Refinement history` — the full intermediate graph after each refinement round (G0, G1, …, Gn). Not a summary.
- `## Node state` — per executed node: input, output, status, error message.
- `## Thought experiment` — per detected issue: step, error type, diagnostic.

Status tags: `[pending]` `[running]` `[done]` `[failed]` `[frozen]` `[repaired]`.

## 1 — Interface-preserving recursive graph compilation (§4.1)

1. Write GOAL. Build a coarse initial graph G0.
2. Refine each non-atomic node v into a subgraph G_v. Repeat until every node is one atomic tool call.
3. **Interface preservation**: G_v consumes the same external inputs as v and produces output compatible with v's output. The rest of the graph does not change.
4. **Local context**: when refining a node, use only the context directly relevant to that node. Deeper nodes get narrower context.
5. Add an edge only when one node's output is another node's input.
6. **Record history**: after every refinement round, append the full intermediate graph to `## Refinement history`, and keep each node's ANCESTRY chain.

Termination: every node = one directly executable tool call.

## 2 — Thought experiment (§4.2)

Before real execution, simulate the graph internally in topological order. Check whether decomposition, tool assignment, dependency structure, and node interfaces support success. Look for:

- incorrect tool selection
- missing intermediate steps
- invalid dependency assumptions
- interface mismatches between connected nodes
- implausible execution paths

For each issue, record the step where it appears, the error type, and the diagnostic. Repair each detected issue with Phase 4 before execution.

## 3 — Dependency-aware execution (§4.2)

- Execute strictly according to the graph, in topological order.
- A node is ready when all predecessors are done and its inputs are resolved. Readiness comes from the graph, not from re-reading the full history.
- Ready nodes with no unresolved dependency conflict run in parallel.
- For each node, record input, output, status, and any error in `## Node state`.
- Execute each node with only its declared inputs as context.
- Terminal nodes done → check the output against GOAL. Not acceptable → treat it as a failure (Phase 4).

## 4 — Minimal necessary subgraph repair (§4.3)

Applies to failures from the thought experiment and from real execution. The same agent repairs, without human intervention.

1. **Localize**: find the failed atomic node v_f, or the set F of failed nodes.
2. **Trace**: follow ANCESTRY and `## Refinement history` back to the lowest common historical ancestor a_f — the smallest ancestor the failed region was derived from. a_f marks the planning scope where the error was introduced.
3. **Build the repair subgraph** from v_f and a_f: the failed node(s), their relevant upstream context, and the downstream nodes affected by their output.
4. **Freeze** the rest of the graph. Do not recompute validated nodes.
5. **Repair** inside the subgraph only: replace incorrect tools, insert missing nodes, or adjust local dependencies. Keep its external input-output interface. Record the new graph in `## Refinement history`.
6. **Reintegrate** it, then continue Phase 3.

Do not replan globally for a local failure. Loop Phases 3–4 until the output meets GOAL or the action budget is spent. Budget spent → stop and report the graph state.

## Harness mapping

- **Cursor**: parallel tool calls in one message, or parallel `Task` subagents with the node's `IN`/`OUT` in the prompt. Optional: one todo per node via `TodoWrite`.
- **OpenCode**: parallel tool calls, or parallel `task` subagents with the node's `IN`/`OUT` in the prompt. Optional: one todo per node via `todowrite`.
- **Pi**: parallel tool calls in one message where the model supports them, else run each round's ready nodes one after another. The graph stays the same.

A subagent call is a way to run one node with local context. It must still perform one atomic tool-use unit. Do not give a subagent a whole subgraph.
