# Rework the Zendesk ticket properties

Drop the cramped right-hand sidebar. Properties become a compact horizontal strip that sits with the ticket content, and you choose which fields appear.

## Layout

The ticket card becomes a single full-width column:

```text
┌───────────────────────────────────────────────┐
│ Zendesk Support · #12345        OPEN  URGENT  │
├───────────────────────────────────────────────┤
│ Customer issue summary                        │
│ ┌─ Jane Doe <jane@example.com> ─────────────┐ │
│ │ Describe the ticket context.              │ │
│ └───────────────────────────────────────────┘ │
├───────────────────────────────────────────────┤
│ ASSIGNEE      GROUP        PRIORITY   STATUS  │
│ Jane Doe      Tier 1       High       Open    │
│ TAGS                                          │
│ [billing] [enterprise]                        │
├───────────────────────────────────────────────┤
│ Field updates …                               │
└───────────────────────────────────────────────┘
```

- Properties render as a wrapping grid of small label-above-value cells (roughly 3 per row), not a sidebar — so nothing gets squeezed and the ticket note stays full width.
- Tags get their own full-width row with Garden-style chips.
- A per-block toggle sets whether the strip sits **above** or **below** the ticket note. Default: below the note, above Field updates.

## Choosing which fields show

Each ticket block carries its own field list, so different tickets in a process can show different properties.

- In Edit mode, a "Fields" control on the block opens a small popover listing the built-in fields (Assignee, Group, Priority, Status, Requester, Email, Tags, Type, Brand, Form, Organization, Ticket ID) with checkboxes.
- Same popover has "Add custom field" — a name plus a value, for things like `Plan type` or `Product area`.
- Fields can be reordered by dragging inside the popover list; custom fields can be renamed or deleted.
- Default for a new ticket block: Requester, Assignee, Group, Priority, Status, Tags.
- View mode shows only the selected fields, read-only; empty values render as a muted dash or are hidden (a "hide empty fields" checkbox in the popover, on by default in View mode).

## Technical notes

- `types.ts`: add to the `zd-ticket` block — `fields?: string[]` (ordered keys of visible fields), `customFields?: { key: string; label: string; value: string }[]`, and `propsPosition?: "above" | "below"`.
- `parse.ts` / `serialize.ts`: serialize as `fields="requester,assignee,priority,status,tags"` and `props-position="below"` on the `<zd-ticket>` tag, with custom fields as `<zd-custom-field key="" label="" value="">` children alongside the existing `<zd-field-change>` elements; parsing strips them from the body the same way. Missing attributes fall back to the defaults so existing files keep working.
- `ZendeskTicket.tsx`: replace the `grid-cols-[1fr_260px]` split and `PropertyRow` with a `PropertyStrip` component (wrapping grid + tag chips) plus a `FieldPicker` popover built from the existing shadcn `popover` and `checkbox` primitives. Zendesk Garden palette stays as-is.
- Zendesk imports and the field-updates table are untouched.
