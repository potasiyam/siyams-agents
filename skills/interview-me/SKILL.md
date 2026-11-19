---
name: interview-me
description: Find out what the user actually wants before any spec, plan, or code. One question at a time, each with a guess, until ~95% confidence; ends with a confirmed statement of intent, including success criteria and scope boundaries. Use when an ask or ticket is underspecified (no acceptance criteria, no "for whom"/"why"), when you catch yourself filling in requirements silently, or on /interview-me, "interview me", "grill me", "are we sure?".
---

# Interview me

End with a **confirmed statement of intent** for the next planning step.

## 0. Look before you ask
Don't ask what a source can answer. Read first: the ticket + comments (scout), linked Figma, the code, and any project notes supplied by the user. Ask only about what is left.

## 1. Hypothesis + confidence
One sentence: your best read of what the user wants. Add a confidence number. Below ~70%, name what is missing on the same line.

```
HYPOTHESIS: <one sentence>
CONFIDENCE: ~40% — missing: who uses it, what "done" looks like
```

## 2. One question per turn, guess attached
- One question. Never batch.
- Attach your guess and the reason behind it. The user corrects a wrong guess faster than they answer from scratch.
- If the harness has an ask-question tool, use it: your guess is option 1 "(Recommended)", one or two real alternatives after it. Short labels. Otherwise ask in plain text.

## 3. Want vs. should-want
Answers like "scalable", "clean", "the standard way", "I should probably…" are not goals. Probe: *"If you didn't have to justify this to anyone, what would you want?"*

## 4. Restate (5–7 lines, user's own words)
```
- Outcome:      <one line>
- User:         <who benefits>
- Success:      <testable acceptance criteria>
- Constraint:   <the binding limit>
- Out of scope: <what we are NOT doing>   ← never skip
- Open:         <anything still unknown, or "none">
Yes / no / refine?
```

## 5. Confirm intent
Accept clear confirmation in the user’s own words. Incorporate corrections and confirm again if the change affects the outcome or scope. Ask a follow-up when the reply leaves a material decision open.

## 6. Stop
- **Done** when you can predict the user's reaction to the next three questions you would ask. Then restate.
- **Stuck** after ~5 questions with no rise in confidence: say so — "something foundational is missing, step back?" Don't grind.
- **On confirmation:** give the final intent. Save it or hand it to a planner when the user requested that step.
