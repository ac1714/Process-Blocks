# Import Zendesk rules and Workato recipes

Note on wording: macros, triggers, and automations are Zendesk objects (the app already has `zd-macro`, `zd-trigger`, `zd-automation`, `zd-view` block types). This plan treats them as Zendesk imports. Slack keeps its existing Workflow Builder importer.

## What you get

A single **Import JSON** button in the toolbar (replacing the Slack-only one) that accepts any of these exports and turns them into blocks in the open process:

- Zendesk macros (`macros.json` / single `macro`)
- Zendesk triggers (`triggers.json` / single `trigger`)
- Zendesk automations (`automations.json`)
- Zendesk views (bonus, same shape — free to support)
- Workato recipes (`recipe.json`, including the nested `code` string)
- Slack Workflow Builder JSON (existing behaviour, unchanged)

The file is sniffed automatically, so you don't pick a format. If several objects are in one file, each becomes its own block, appended in order. Anything unrecognized still lands as a raw JSON block instead of failing.

A short summary is shown after import (e.g. "Imported 4 triggers, 2 macros").

## Mapping

Zendesk exports map directly onto the existing block types:

- macro → `zd-macro` (title, description, actions; `comment_value` action becomes the comment)
- trigger → `zd-trigger` (conditions all/any → condition groups, actions)
- automation → `zd-automation` (same, plus schedule hint from time-based conditions)
- view → `zd-view` (conditions, columns, order by)

Zendesk field/operator/value triples are humanized where obvious (`status` `is` `solved`), otherwise passed through verbatim.

Workato recipes have no direct equivalent, so each recipe becomes a small block sequence:

- Recipe header → callout with recipe name and trigger app/description
- Trigger step → `external` block (system = app, endpoint = provider action)
- Each action step → `external` block with its input payload as JSON
- `if` / `else` branch steps → `decision` block, with the nested steps summarized inside each branch's content
- Slack actions inside a recipe (post message) → Slack Block Kit message block so they render as real Slack mockups

## Technical notes

- New `src/lib/import/` module: `detect.ts` (format sniffing), `zendesk.ts`, `workato.ts`, and an `index.ts` exporting `importAnyJson(json): { blocks, summary }`. The existing `src/lib/slack/workflow-import.ts` is reused as-is for Slack.
- Detection order: Zendesk keys (`macros`/`triggers`/`automations`/`views`, or a single object with `actions` + `conditions`), Workato (`code` string or `trigger` + `blocks`), Slack (`workflow`/`steps`), else raw.
- `TopBar.tsx`: rename the button to "Import JSON", accept multiple files, call `importAnyJson`, insert via existing `insertBlocks`, and replace the `alert()` with a sonner toast for both success summary and errors.
- No changes to markdown parse/serialize — all target block types already round-trip.
