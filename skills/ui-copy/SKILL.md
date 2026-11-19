---
name: ui-copy
description: >-
  Write or review crisp, human UI microcopy without AI slop. Use when drafting,
  editing, or reviewing user-facing interface text, buttons, labels, helper
  text, tooltips, toasts, modals, empty/error states, pricing/plan cards, or
  i18n/locale strings.
---

# UI Copy

Write clear, scannable product copy. Preserve verbatim copy from Figma, Jira acceptance criteria, or CMS payloads unless asked to draft, edit, or review it (flag obvious defects briefly instead of rewriting silently).

## 1. Punctuation & Separators
- **No clause dashes:** Never join clauses or labels with em dashes (`—`), spaced en dashes (` – `), double hyphens (`--`), or spaced hyphens (` - `). Use a period or separate UI fields.
- **Allowed dashes:** En dash (`–`) ONLY in compact numeric, date, or time ranges (`Jan 12–15`, `9:00 AM–5:00 PM`, `1–10 of 48`, `$10–$20`). Standard hyphen (`-`) for compound words (`auto-save`, `sign-in`, `read-only`), negative numbers, and literals (`2026-11-18`, `UTF-8`).
- **Metadata separator:** Use a spaced middle dot (`·`) for inline status, counts, or billing terms (`$20/mo · Billed annually · 3 seats`). Never use `|` or `/` as metadata separators.
- **No exclamation inflation:** Drop `!` in toasts, confirmations, headings, and empty states (`Saved`, not `Saved!`).
- **Parentheses sparingly:** Reserve for brief optionality or unit hints (`Phone number (optional)`, `Timeout (seconds)`).

## 2. Structure & Casing
- **Layout over punctuation:** Put title, subtitle, and helper text in distinct props/elements when the component supports it, rather than concatenating into one string.
- **One idea per sentence:** Cap helper text and tooltips at 1–2 short sentences separated by a period. Cut lead-in clauses.
- **Sentence case by default:** Use sentence case for headings, buttons, labels, tabs, and menus (`Create API key`, not `Create API Key`), keeping proper nouns and acronyms (`CSV`, `SSO`, `Wi-Fi`) capitalized. Exception: match existing repo casing if the surrounding UI is strictly Title Case.

## 3. Kill AI Slop & Filler
- **Cut throat-clearing & hype:** Never use `Please`, `Please note that`, `Keep in mind`, `Simply`, `Easily`, `Just`, `Seamless`, `Effortlessly`, `Empower`, `Dive in`, `Oops`, `Uh-oh`, or `Whoops`.
- **Cut redundant status adverbs:** Write `Changes saved` or `Webhook created`, never `Successfully saved your changes!`. Write `Export failed`, never `Unfortunately, your export failed to complete`.
- **No redundant role prefixes:** Don't start banner/tooltip text with `Note:`, `Tip:`, or `Warning:` when the component's visual style already signals it.

## 4. Component Patterns
- **Buttons = Verb + Object:** Name the concrete action (`Delete project`, `Export CSV`, `Send invite`). Avoid `Submit`, `Confirm`, `Yes`, `OK`, or `Proceed`. Pair destructive modals with matching verbs (`Revoke key?` -> `Cancel` / `Revoke key`).
- **Errors = What failed + Next step:** State the problem plainly without blaming the user (`Enter a valid work email`, not `Invalid input`) and state how to recover (`Payment declined. Try another card or contact your bank.`). Never surface raw codes/jargon (`500`, `null`) as the primary copy.
- **Empty states = State + Action:** Don't echo the title in the body (`No webhooks` / `You have no webhooks yet.`). Pair a plain title (`No webhooks yet`) with one sentence on value/next step (`Send real-time payment events to your server.`) and a verb+object CTA (`Add webhook`).
- **Confirmations:** Cut `Are you sure you want to...?`. Title names the action (`Delete workspace?`); body states the concrete consequence (`All 14 projects and API keys will stop working immediately.`).

## Examples
- **Bad:** `Sync paused — connect to Wi-Fi to back up your files.`
  **Good:** `Sync paused. Connect to Wi-Fi to back up your files.`
- **Bad:** `Pro Plan — $20/month — billed annually`
  **Good:** Title: `Pro Plan` · Subtitle: `$20/month · Billed annually`
- **Bad:** `Oops! Something went wrong while exporting (PDF or CSV) — please try again!`
  **Good:** `Couldn't export report. Check your connection and try again.`
- **Bad:** Modal: `Confirm Action` / `Are you sure you want to delete this key?` / `[Cancel]` `[Yes]`
  **Good:** Modal: `Delete API key?` / `Apps using prod-key-04 will lose access immediately.` / `[Cancel]` `[Delete key]`

## Verify
Before finishing, check every drafted/changed UI string:
1. Zero clause dashes (`—`, ` – `, `--`, ` - `), zero `|` separators, zero `!`.
2. Zero AI filler (`Please`, `Successfully`, `Oops`, `Simply`, `Seamless`, `Are you sure you want to`).
3. Buttons use `Verb + Object` and casing matches the surrounding screen.
