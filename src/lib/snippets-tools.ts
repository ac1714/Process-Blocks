import {
  BRAND_MARK_COLUMN,
  BRAND_MARK_LINE,
  brandLogoHtml,
  brandMarkSize,
  type BrandName,
} from "./brand-logos";
import type { Palette } from "./snippet-colors";
import type { Snippet } from "./snippets";

/* ---------------------------------------------------------------------------
   Tools & process
   Every example below is composed individually. There is no shared "mode"
   template: variety comes from the composition, not from recoloring one shape.
--------------------------------------------------------------------------- */

const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const MONO = "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace";

const INK = "#0f172a";
const BODY = "#475569";
const MUTED = "#64748b";
const LINE = "#cbd5e1";
const RULE = "#e2e8f0";
const PAPER = "#f8fafc";
const RADIUS = "6px";

/* One type scale, four roles. */
const H_LG = `font-family:${FONT};font-size:20px;line-height:1.3;font-weight:700;color:${INK};margin:0;`;
const H = `font-family:${FONT};font-size:18px;line-height:1.35;font-weight:700;color:${INK};margin:0;`;
const TXT = `font-family:${FONT};font-size:16px;line-height:1.55;color:${BODY};margin:0;`;
const SUP = `font-family:${FONT};font-size:14px;line-height:1.5;color:${MUTED};margin:0;`;
const META = `font-family:${FONT};font-size:13px;line-height:1.4;color:${MUTED};margin:0;`;
const LBL = `font-family:${FONT};font-size:13px;line-height:1.2;letter-spacing:.8px;text-transform:uppercase;font-weight:700;margin:0;`;

const ZD = "#03363d";
const SLACK = "#4a154b";
const JIRA = "#2684ff";
const CONF = "#1868db";
const GMAIL = "#ea4335";
const DRIVE = "#0f9d58";
const SHEETS = "#0f9d58";
const SALESFORCE = "#00a1e0";
const WORKATO = "#430099";
const URGENT = "#b91c1c";

/* ---------------------------------------------------------------------------
   Media layout primitives

   Every logo in this file is drawn through these four primitives, so the mark
   size, its alignment against the first line of text, and the spacing around
   process arrows are decided in exactly one place.
--------------------------------------------------------------------------- */

/** Height of the first text line each header logo is aligned to. */
const LINE_BOX = 22;

/** Logo cropped to its ink, vertically centered on the first text line. */
const mark = (brand: BrandName) => {
  const size = brandMarkSize(brand);
  const offset = Math.max(0, Math.round((LINE_BOX - size.height) / 2));
  return `<span style="display:block;flex:0 0 auto;margin-top:${offset}px;line-height:0;">${brandLogoHtml(brand)}</span>`;
};

/** Logo sitting in the shared process column so stacked arrows line up with it. */
const markColumn = (brand: BrandName) => {
  const size = brandMarkSize(brand);
  const offset = Math.max(0, Math.round((LINE_BOX - size.height) / 2));
  return `<span style="display:flex;align-items:flex-start;justify-content:center;flex:0 0 ${BRAND_MARK_COLUMN}px;width:${BRAND_MARK_COLUMN}px;line-height:0;"><span style="display:block;margin-top:${offset}px;line-height:0;">${brandLogoHtml(brand)}</span></span>`;
};

/** One header line: logo, optional wordmark, optional right-aligned trailing item. */
const brandHeader = (brand: BrandName, opts: { name?: boolean; trailing?: string } = {}) => {
  const name = opts.name
    ? `<span style="display:flex;align-items:center;min-height:${LINE_BOX}px;font-family:${FONT};font-size:16px;line-height:1.35;font-weight:700;color:${INK};">${brand}</span>`
    : "";
  const trailing = opts.trailing
    ? `<span style="display:flex;align-items:center;min-height:${LINE_BOX}px;margin-left:auto;min-width:0;">${opts.trailing}</span>`
    : "";
  return `<div style="display:flex;align-items:flex-start;flex-wrap:wrap;column-gap:10px;row-gap:6px;min-height:${LINE_BOX}px;">${mark(brand)}${name}${trailing}</div>`;
};

/** Logo plus wordmark. */
const brandRow = (brand: BrandName, trailing = "") =>
  brandHeader(brand, { name: true, ...(trailing ? { trailing } : {}) });

/** Logo only, no brand name. */
const brandOnly = (brand: BrandName, trailing = "") =>
  brandHeader(brand, trailing ? { trailing } : {});

/** Logo, a bold first line, a supporting line, and an optional trailing item. */
const brandStack = (brand: BrandName, title: string, detail: string, trailing = "") =>
  `<div style="display:flex;align-items:flex-start;column-gap:11px;row-gap:6px;flex-wrap:wrap;">${mark(brand)}<span style="display:block;min-width:0;flex:1;"><span style="display:flex;align-items:center;min-height:${LINE_BOX}px;overflow-wrap:anywhere;font-family:${FONT};font-size:16px;line-height:1.35;font-weight:700;color:${INK};">${title}</span><span style="display:block;${META}margin-top:2px;">${detail}</span></span>${
    trailing
      ? `<span style="display:flex;align-items:center;min-height:${LINE_BOX}px;">${trailing}</span>`
      : ""
  }</div>`;

const shell = (extra: string, pad: string, inner: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 20px;font-family:${FONT};border-collapse:separate;border-spacing:0;${extra}"><tr><td valign="top" style="padding:${pad};">${inner}</td></tr></table>`;

const framed = (extra = "") =>
  `background-color:#ffffff;border:1px solid ${LINE};border-radius:${RADIUS};${extra}`;

const pill = (text: string, color: string, bg = "#ffffff") =>
  `<span style="display:inline-block;font-family:${FONT};font-size:13px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;color:${color};background-color:${bg};border:1px solid ${color};border-radius:999px;padding:4px 10px;">${text}</span>`;

const dot = (color: string) =>
  `<span style="display:inline-block;width:9px;height:9px;border-radius:50%;background-color:${color};"></span>`;

/** Uniform two-line step used by every vertical cross-tool flow. */
const step = (brand: BrandName, action: string) =>
  `<div style="display:flex;align-items:flex-start;gap:12px;padding:4px 0;">${markColumn(brand)}<span style="display:block;min-width:0;flex:1;"><span style="display:flex;align-items:center;min-height:${LINE_BOX}px;font-family:${FONT};font-size:16px;line-height:1.4;font-weight:700;color:${INK};">${action}</span><span style="display:block;${SUP}margin-top:2px;">${brand}</span></span></div>`;

/**
 * Vertical connector. It is as wide as the logo column and sized to the marks
 * it joins, so the arrow is centered under the logo with equal space above and
 * below.
 */
const ARROW_SIZE = Math.round(BRAND_MARK_LINE * 0.9);

const link = (color: string) =>
  `<div aria-hidden="true" data-process-arrow="down" style="display:flex;align-items:center;justify-content:center;width:${BRAND_MARK_COLUMN}px;height:${ARROW_SIZE}px;margin:6px 0;font-family:${FONT};font-size:${ARROW_SIZE}px;line-height:1;color:${color};transform:translateY(-11px);">&darr;</div>`;

/** Horizontal connector between two blocks of equal height. */
const linkAcross = (color: string) =>
  `<span aria-hidden="true" data-process-arrow="right" style="display:inline-flex;align-items:center;justify-content:center;width:${ARROW_SIZE}px;height:${ARROW_SIZE}px;font-family:${FONT};font-size:${ARROW_SIZE}px;line-height:1;color:${color};">&rarr;</span>`;

const flow = (p: Palette, title: string, steps: [BrandName, string][]) =>
  shell(
    `background-color:#ffffff;border:1px solid ${LINE};border-left:4px solid ${p.base};border-radius:${RADIUS};`,
    "16px 18px",
    `<div style="${LBL}color:${p.base};margin-bottom:12px;">${title}</div>${steps
      .map((s, i) => (i ? link(p.base) : "") + step(s[0], s[1]))
      .join("")}`,
  );

const kv = (label: string, value: string, last = false) =>
  `<tr><td valign="top" style="padding:9px 0;${last ? "" : `border-bottom:1px solid ${RULE};`}width:38%;"><span style="${META}font-weight:600;">${label}</span></td><td valign="top" style="padding:9px 0;${last ? "" : `border-bottom:1px solid ${RULE};`}"><span style="font-family:${FONT};font-size:14px;line-height:1.45;font-weight:600;color:${INK};">${value}</span></td></tr>`;

const kvTable = (rows: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">${rows}</table>`;

/* ------------------------------- the examples ------------------------------- */

type Entry = {
  id: string;
  label: string;
  brand: string;
  detail: string;
  render: (p: Palette, alt: [Palette, Palette]) => string;
  multicolor?: boolean;
};

const ENTRIES: Entry[] = [
  /* ---- Zendesk ---- */
  {
    id: "zd-frame",
    label: "Update a Zendesk ticket",
    brand: "Zendesk",
    detail: "Field-by-field view of what changes on the ticket.",
    render: (p) =>
      shell(
        framed(),
        "0",
        `<div style="padding:11px 16px;background-color:${PAPER};border-bottom:1px solid ${LINE};border-radius:${RADIUS} ${RADIUS} 0 0;">${brandRow("Zendesk", `<span style="${META}">Ticket #4821</span>`)}</div><div style="padding:14px 16px 16px;"><div style="${H}">Update the ticket</div><div style="${SUP}margin-top:5px;">Set each field, then submit.</div><div style="margin-top:12px;">${kvTable(
          kv("Assignee", "Support &mdash; Tier 2") +
            kv("Priority", "High") +
            kv("Status", "Pending", true),
        )}</div><div style="margin-top:14px;"><span style="display:inline-block;background-color:${p.base};color:${p.onBase};font-family:${FONT};font-size:14px;font-weight:700;padding:8px 14px;border-radius:${RADIUS};">Submit as Pending</span></div></div>`,
      ),
  },
  {
    id: "zd-field-change",
    label: "Run a Zendesk macro",
    brand: "Zendesk",
    detail: "Tinted rail block listing what the macro sets.",
    render: (p) =>
      shell(
        `background-color:${p.bg};border-left:4px solid ${ZD};border-radius:0 ${RADIUS} ${RADIUS} 0;`,
        "16px 18px",
        `${brandRow("Zendesk")}<div style="${H_LG}margin-top:11px;">Apply the selected macro</div><div style="${TXT}margin-top:6px;">One click sets the reply and three fields at once.</div><div style="margin-top:12px;display:flex;flex-wrap:wrap;gap:7px;">${pill("Reply added", ZD)}${pill("Status &rarr; Solved", ZD)}${pill("Tag: refund", ZD)}</div>`,
      ),
  },
  {
    id: "zd-ticket-mock",
    label: "Observe a macro run",
    brand: "Zendesk",
    detail: "Receipt of a completed macro with a checked change list.",
    render: () =>
      shell(
        `background-color:#ffffff;border:1px solid ${LINE};border-top:3px solid ${ZD};border-radius:${RADIUS};`,
        "15px 18px",
        `${brandRow("Zendesk", pill("Complete", ZD))}<div style="${H}margin-top:12px;">Macro completed</div><div style="margin-top:10px;border-top:1px solid ${RULE};padding-top:10px;">${[
          "Public reply sent",
          "Status changed to Solved",
          "Tag added: refund",
        ]
          .map(
            (t) =>
              `<div style="display:flex;align-items:center;gap:9px;padding:5px 0;"><span style="font-family:${FONT};font-size:14px;color:${ZD};font-weight:700;">&#10003;</span><span style="font-family:${FONT};font-size:14px;color:${INK};">${t}</span></div>`,
          )
          .join(
            "",
          )}</div><div style="${META}margin-top:10px;font-family:${MONO};">10:24 AM &middot; run by A. Rivera</div>`,
      ),
  },
  {
    id: "zd-before-after",
    label: "Observe an automation",
    brand: "Zendesk",
    detail: "Side-by-side before and after panels.",
    render: (p) =>
      shell(
        framed(),
        "15px 17px",
        `<div style="display:flex;align-items:flex-start;column-gap:10px;min-height:${LINE_BOX}px;margin-bottom:12px;">${mark("Zendesk")}<span style="display:flex;align-items:center;min-height:${LINE_BOX}px;${LBL}color:${p.base};">Automation result</span></div><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="table-layout:fixed;border-collapse:separate;border-spacing:0;"><tr><td valign="top" width="50%" style="overflow-wrap:anywhere;background-color:${PAPER};border-radius:${RADIUS};padding:13px 15px;"><div style="${LBL}color:${MUTED};">Before</div><div style="${H}margin-top:7px;">Pending &middot; unassigned</div><div style="${SUP}margin-top:5px;">Waiting 48 hours with no reply.</div></td><td width="14"></td><td valign="top" width="50%" style="overflow-wrap:anywhere;background-color:${p.bg};border-radius:${RADIUS};padding:13px 15px;"><div style="${LBL}color:${ZD};">After</div><div style="${H}margin-top:7px;">Open &middot; Tier 2</div><div style="${SUP}margin-top:5px;">Reassigned and priority raised.</div></td></tr></table>`,
      ),
  },
  {
    id: "zd-macro-card",
    label: "Escalate a ticket",
    brand: "Zendesk",
    detail: "Heavy outlined card for an urgent escalation.",
    render: () =>
      shell(
        `background-color:#ffffff;border:2px solid ${INK};border-radius:${RADIUS};`,
        "16px 18px",
        `${brandRow("Zendesk", pill("Urgent", URGENT))}<div style="${H_LG}margin-top:12px;">Send the escalation</div><div style="${TXT}margin-top:6px;">Say what is blocked, what you already tried, and what you need next.</div><div style="${META}margin-top:12px;padding-top:10px;border-top:1px solid ${RULE};">Destination: Tier 3 queue &middot; Response target: 2 hours</div>`,
      ),
  },

  /* ---- Slack ---- */
  {
    id: "slack-frame",
    label: "Post a channel update",
    brand: "Slack",
    detail: "Message composed for a channel, with a footer action row.",
    render: (p) =>
      shell(
        framed(),
        "15px 17px",
        `${brandRow("Slack", `<span style="${META}font-family:${MONO};">#support-updates</span>`)}<div style="${H}margin-top:12px;">Post the update in Slack</div><div style="${TXT}margin-top:6px;">Status, owner, and the time of the next check-in.</div><div style="margin-top:12px;padding-top:10px;border-top:1px solid ${RULE};display:flex;gap:16px;"><span style="${META}font-weight:700;color:${p.base};">Send</span><span style="${META}">Save draft</span><span style="${META}">Add to thread</span></div>`,
      ),
  },
  {
    id: "slack-channel-chip",
    label: "Ask for help in Slack",
    brand: "Slack",
    detail: "Borderless rail block with the ask and who answers.",
    render: (p) =>
      shell(
        `background-color:#ffffff;border-left:3px solid ${p.base};`,
        "14px 16px 14px 16px",
        `${brandRow("Slack")}<div style="${H}margin-top:10px;">Ask the right group for help</div><div style="${TXT}margin-top:5px;">Include the ticket link and what you have already checked.</div><div style="margin-top:11px;">${kvTable(kv("Ask in", "#billing-help") + kv("Expect a reply", "Within 1 hour", true))}</div>`,
      ),
  },
  {
    id: "slack-message",
    label: "Post a ticket escalation",
    brand: "Slack",
    detail: "Tinted message with the source ticket quoted inside.",
    render: (p) =>
      shell(
        `background-color:${p.bg};border-radius:${RADIUS};`,
        "16px 18px",
        `${brandRow("Slack")}<div style="${H}margin-top:11px;">Share the escalation</div><div style="margin-top:10px;padding-left:12px;border-left:3px solid ${p.base};"><div style="${META}font-family:${MONO};">Ticket #4821</div><div style="${TXT}margin-top:3px;">Refund blocked by a failed payment sync.</div></div><div style="${SUP}margin-top:11px;">State exactly what you need and by when.</div>`,
      ),
  },
  {
    id: "slack-thread",
    label: "Hand over in a thread",
    brand: "Slack",
    detail: "Threaded replies stacked under a connector line.",
    render: () =>
      shell(
        framed(),
        "15px 17px",
        `${brandRow("Slack", `<span style="${META}">3 replies</span>`)}<div style="${H}margin-top:12px;">Complete the handover</div><div style="margin-top:11px;padding-left:14px;border-left:2px solid ${RULE};">${[
          ["Outgoing owner", "Context and open questions posted."],
          ["Incoming owner", "Confirms they are picking it up."],
          ["Outgoing owner", "Reassigns the ticket and leaves the thread."],
        ]
          .map(
            ([who, what]) =>
              `<div style="padding:6px 0;"><span style="${META}font-weight:700;color:${INK};">${who}</span><div style="${SUP}color:${BODY};margin-top:2px;">${what}</div></div>`,
          )
          .join("")}</div>`,
      ),
  },
  {
    id: "slack-command",
    label: "Observe a workflow run",
    brand: "Slack",
    detail: "Compact single-line confirmation strip.",
    render: () =>
      shell(
        framed(),
        "12px 15px",
        brandStack(
          "Slack",
          "Workflow completed",
          "Submitted 4 inputs &middot; routed to #approvals",
          pill("Done", SLACK),
        ),
      ),
  },

  /* ---- Knowledge ---- */
  {
    id: "kb-frame",
    label: "Reference an internal article",
    brand: "Confluence",
    detail: "Document card with a source footer.",
    render: () =>
      shell(
        `background-color:#ffffff;border:1px solid ${LINE};border-top:4px solid ${CONF};border-radius:${RADIUS};`,
        "15px 18px",
        `${brandRow("Confluence")}<div style="${H_LG}margin-top:12px;">Use the internal policy</div><div style="${TXT}margin-top:6px;">Link the exact section that applies, not the whole page.</div><div style="${META}margin-top:12px;padding-top:10px;border-top:1px solid ${RULE};">Owner: Support Ops &middot; Reviewed: March &middot; Internal only</div>`,
      ),
  },
  {
    id: "kb-public-chip",
    label: "Choose internal or public",
    brand: "Process",
    detail: "Two-option fork for picking the right source.",
    multicolor: true,
    render: (p, alt) =>
      shell(
        framed(),
        "15px 17px",
        `<div style="${LBL}color:${INK};margin-bottom:10px;">Which source do you use?</div><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:separate;border-spacing:0;"><tr><td valign="top" width="50%" style="background-color:${p.bg};border-radius:${RADIUS};padding:14px 15px;"><div style="${LBL}color:${p.base};">Internal</div><div style="font-family:${FONT};font-size:16px;line-height:1.35;font-weight:700;color:${INK};margin-top:7px;">Decide what to do</div><div style="${SUP}margin-top:5px;">Policy, runbooks, and approval limits.</div></td><td width="14"></td><td valign="top" width="50%" style="background-color:${alt[0].bg};border-radius:${RADIUS};padding:14px 15px;"><div style="${LBL}color:${alt[0].base};">Public</div><div style="font-family:${FONT};font-size:16px;line-height:1.35;font-weight:700;color:${INK};margin-top:7px;">Explain it to the customer</div><div style="${SUP}margin-top:5px;">Help centre wording you can quote.</div></td></tr></table>`,
      ),
  },
  {
    id: "kb-article-card",
    label: "Find the right article",
    brand: "Confluence",
    detail: "Article title over a metadata check table.",
    render: () =>
      shell(
        `background-color:${PAPER};border-radius:${RADIUS};`,
        "15px 17px",
        `${brandRow("Confluence")}<div style="${H}margin-top:11px;">Refund approval limits</div><div style="margin-top:10px;background-color:#ffffff;border:1px solid ${LINE};border-radius:${RADIUS};padding:4px 14px;">${kvTable(kv("Owner", "Support Ops") + kv("Applies to", "EU and UK accounts") + kv("Last reviewed", "12 March", true))}</div><div style="${SUP}margin-top:10px;">If any line looks stale, ask the owner before using it.</div>`,
      ),
  },
  {
    id: "confluence-runbook",
    label: "Follow a Confluence runbook",
    brand: "Confluence",
    detail: "Numbered runbook steps with badges.",
    render: (p) =>
      shell(
        framed(),
        "15px 17px",
        `${brandRow("Confluence")}<div style="${H}margin-top:11px;">Follow the runbook</div><div style="margin-top:11px;">${[
          ["Confirm the account is affected", "Check the region and plan first."],
          ["Run the documented steps in order", "Do not skip the verification step."],
          ["Record any exception", "Note it on the ticket and tell the owner."],
        ]
          .map(
            ([title, body], i) =>
              `<div style="display:flex;gap:12px;padding:10px 0;${i < 2 ? `border-bottom:1px solid ${RULE};` : ""}"><span style="display:inline-block;width:26px;height:26px;flex:0 0 26px;border-radius:50%;background-color:${p.base};color:${p.onBase};font-family:${FONT};font-size:13px;font-weight:700;line-height:26px;text-align:center;">${i + 1}</span><span style="display:block;"><span style="display:block;font-family:${FONT};font-size:16px;font-weight:700;color:${INK};">${title}</span><span style="display:block;${SUP}margin-top:2px;">${body}</span></span></div>`,
          )
          .join("")}</div>`,
      ),
  },

  /* ---- Cross-tool and process ---- */
  {
    id: "tool-step-stack",
    label: "Cross-tool handoff",
    brand: "Process",
    detail: "Zendesk to Slack and back, as one vertical flow.",
    render: (p) =>
      flow(p, "Cross-tool workflow", [
        ["Zendesk", "Ticket escalated"],
        ["Slack", "Team responds"],
        ["Zendesk", "Resolution logged"],
      ]),
  },
  {
    id: "tool-escalation-path",
    label: "Process evidence trail",
    brand: "Process",
    detail: "Timestamped timeline of who did what.",
    render: (p) =>
      shell(
        framed(),
        "15px 17px",
        `<div style="${LBL}color:${p.base};margin-bottom:10px;">Evidence trail</div><div style="padding-left:16px;border-left:2px solid ${RULE};">${[
          ["09:12", "Ticket received", "Customer reported the failed refund."],
          ["09:40", "Escalated to Tier 2", "Screenshot and log ID attached."],
          ["10:24", "Resolved", "Refund reissued and confirmed in writing."],
        ]
          .map(
            ([time, title, body]) =>
              `<div style="padding:7px 0;"><div style="display:flex;align-items:center;gap:9px;">${dot(p.base)}<span style="${META}font-family:${MONO};font-weight:700;color:${INK};">${time}</span><span style="font-family:${FONT};font-size:16px;font-weight:700;color:${INK};">${title}</span></div><div style="${SUP}margin:3px 0 0 18px;">${body}</div></div>`,
          )
          .join("")}</div>`,
      ),
  },
  {
    id: "generic-checkpoint",
    label: "Process checkpoint",
    brand: "Process",
    detail: "Centered stop-and-verify marker.",
    render: (p) =>
      shell(
        `background-color:${p.bg};border-radius:${RADIUS};`,
        "20px 18px",
        `<div style="text-align:center;"><div style="font-family:${FONT};font-size:24px;line-height:1;font-weight:700;color:${p.base};">&#10003;</div><div style="${LBL}color:${p.base};margin-top:9px;">Checkpoint</div><div style="${H}margin-top:6px;">Pause and verify</div><div style="${TXT}margin-top:5px;">Confirm the owner, the evidence, and the next action before moving on.</div></div>`,
      ),
  },

  /* ---- Jira ---- */
  {
    id: "jira-update-issue",
    label: "Update a Jira issue",
    brand: "Jira",
    detail: "Issue header with key badge and field columns.",
    render: () =>
      shell(
        framed(),
        "15px 17px",
        `<div style="display:flex;align-items:flex-start;flex-wrap:wrap;column-gap:10px;row-gap:6px;min-height:${LINE_BOX}px;">${mark("Jira")}<span style="display:flex;align-items:center;min-height:${LINE_BOX}px;"><span style="display:inline-block;font-family:${MONO};font-size:13px;line-height:1.2;font-weight:700;color:${JIRA};background-color:${PAPER};border:1px solid ${LINE};border-radius:${RADIUS};padding:3px 8px;">OPS-1284</span></span><span style="display:flex;align-items:center;min-height:${LINE_BOX}px;margin-left:auto;">${pill("In progress", JIRA)}</span></div><div style="${H}margin-top:12px;">Update the Jira issue</div><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:12px;border-collapse:separate;border-spacing:0;"><tr>${[
          ["Assignee", "R. Okafor"],
          ["Priority", "High"],
          ["Sprint", "Sprint 24"],
        ]
          .map(
            ([k, v], i) =>
              `<td valign="top" width="33.33%" style="${i ? `padding:0 12px;border-left:1px solid ${RULE};` : "padding:0 12px 0 0;"}"><div style="${META}">${k}</div><div style="font-family:${FONT};font-size:14px;font-weight:700;color:${INK};margin-top:3px;">${v}</div></td>`,
          )
          .join("")}</tr></table>`,
      ),
  },
  {
    id: "jira-transition",
    label: "Move work to the next status",
    brand: "Jira",
    detail: "Horizontal status pipeline with the current step filled.",
    render: (p) =>
      shell(
        `background-color:${PAPER};border-radius:${RADIUS};`,
        "15px 17px",
        `${brandOnly("Jira", `<span style="${META}">OPS-1284</span>`)}<div style="${H}margin-top:11px;">Transition the issue</div><div style="margin-top:12px;display:flex;align-items:center;flex-wrap:wrap;gap:9px;"><span style="display:inline-block;font-family:${FONT};font-size:13px;line-height:1.2;font-weight:700;color:${MUTED};background-color:#ffffff;border:1px solid ${LINE};border-radius:999px;padding:5px 11px;">To do</span>${linkAcross(MUTED)}<span style="display:inline-block;font-family:${FONT};font-size:13px;line-height:1.2;font-weight:700;color:${p.onBase};background-color:${p.base};border-radius:999px;padding:5px 11px;">In review</span>${linkAcross(MUTED)}<span style="display:inline-block;font-family:${FONT};font-size:13px;line-height:1.2;font-weight:700;color:${MUTED};background-color:#ffffff;border:1px solid ${LINE};border-radius:999px;padding:5px 11px;">Done</span></div><div style="${SUP}margin-top:11px;">Check the acceptance criteria before moving it forward.</div>`,
      ),
  },

  /* ---- Google Workspace ---- */
  {
    id: "drive-share",
    label: "Share a Google Drive file",
    brand: "Google Drive",
    detail: "File row, access setting, and copyable link.",
    render: (p) =>
      shell(
        framed(),
        "14px 16px",
        `${brandStack("Google Drive", "Escalation playbook.pdf", "Updated yesterday &middot; 1.4 MB")}<div style="margin-top:12px;padding-top:11px;border-top:1px solid ${RULE};display:flex;align-items:center;gap:10px;"><span style="${SUP}min-width:0;color:${BODY};flex:1;">Anyone at the company can view</span>${pill("Change", DRIVE)}</div><div style="overflow-wrap:anywhere;margin-top:11px;background-color:${PAPER};border:1px solid ${LINE};border-radius:${RADIUS};padding:9px 11px;font-family:${MONO};font-size:13px;color:${p.base};">drive.google.com/&hellip;/playbook</div>`,
      ),
  },
  {
    id: "drive-review",
    label: "Request a document review",
    brand: "Google Drive",
    detail: "Drive to Slack and back, as one vertical flow.",
    render: (p) =>
      flow(p, "Review workflow", [
        ["Google Drive", "Review requested"],
        ["Slack", "Feedback shared"],
        ["Google Drive", "Document approved"],
      ]),
  },
  {
    id: "gmail-send-update",
    label: "Send a Gmail update",
    brand: "Gmail",
    detail: "Addressed email header above the message body.",
    render: () =>
      shell(
        `background-color:#ffffff;border:1px solid ${LINE};border-radius:${RADIUS};`,
        "0",
        `<div style="padding:12px 16px;border-bottom:1px solid ${RULE};">${brandOnly("Gmail", pill("Draft", GMAIL))}<div style="margin-top:9px;">${kvTable(kv("To", "customer@example.com") + kv("Subject", "Your refund is on the way", true))}</div></div><div style="padding:14px 16px 16px;"><div style="${TXT}">We reissued the refund this morning. It should land within three working days.</div><div style="${SUP}margin-top:9px;">Close with one clear next step and who to reply to.</div></div>`,
      ),
  },
  {
    id: "meet-join-review",
    label: "Join a Google Meet review",
    brand: "Google Meet",
    detail: "Meeting card with time, purpose, and join action.",
    render: (p) =>
      shell(
        `background-color:${p.bg};border-radius:${RADIUS};`,
        "16px 18px",
        `${brandOnly("Google Meet", `<span style="${META}">30 min &middot; 4 people</span>`)}<div style="${H_LG}margin-top:11px;">Thursday, 2:00 PM</div><div style="font-family:${FONT};font-size:16px;line-height:1.35;font-weight:700;color:${INK};margin-top:5px;">Escalation review</div><div style="${TXT}margin-top:5px;">Bring the ticket and the decision you need made.</div><div style="margin-top:13px;"><span style="display:inline-block;background-color:${p.base};color:${p.onBase};font-family:${FONT};font-size:14px;font-weight:700;padding:8px 14px;border-radius:999px;">Join the call</span></div>`,
      ),
  },
  {
    id: "sheets-update-tracker",
    label: "Update a Google Sheet",
    brand: "Google Sheets",
    detail: "Small tracker grid showing the row you add.",
    render: () =>
      shell(
        `background-color:#ffffff;border-left:3px solid ${SHEETS};`,
        "14px 16px 14px 16px",
        `${brandRow("Google Sheets", `<span style="${META}">Escalation tracker</span>`)}<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="table-layout:fixed;margin-top:12px;border-collapse:separate;border-spacing:0;border:1px solid ${LINE};border-radius:${RADIUS};overflow:hidden;"><tr>${[
          "Ticket",
          "Outcome",
          "Next due",
        ]
          .map(
            (h, i) =>
              `<th align="left" style="overflow-wrap:anywhere;padding:9px 8px;background-color:${PAPER};border-bottom:2px solid ${SHEETS};${i ? `border-left:1px solid ${RULE};` : ""}"><span style="${LBL}color:${MUTED};">${h}</span></th>`,
          )
          .join("")}</tr>${[
          ["#4821", "Refund reissued", "24 March"],
          ["#4822", "Waiting on customer", "26 March"],
        ]
          .map(
            (row, r) =>
              `<tr>${row
                .map(
                  (c, i) =>
                    `<td style="overflow-wrap:anywhere;padding:10px 8px;${r ? "" : `border-bottom:1px solid ${RULE};`}${i ? `border-left:1px solid ${RULE};` : ""}"><span style="font-family:${FONT};font-size:14px;color:${i ? BODY : INK};font-weight:${i ? 400 : 700};">${c}</span></td>`,
                )
                .join("")}</tr>`,
          )
          .join(
            "",
          )}</table><div style="${SUP}margin-top:9px;">Add the result, the owner, and the next due date.</div>`,
      ),
  },
  {
    id: "sheets-assignment-queue",
    label: "Assign a Google Sheets queue",
    brand: "Google Sheets",
    detail: "Owner queue with status, priority, and next-action fields.",
    render: (p) =>
      shell(
        `background-color:${p.bg};border-left:4px solid ${SHEETS};border-radius:0 ${RADIUS} ${RADIUS} 0;`,
        "16px 18px",
        `${brandRow("Google Sheets", `<span style="${META}">Support queue</span>`)}<div style="${H}margin-top:12px;">Assign the next request</div><div style="${TXT}margin-top:5px;">Claim the row, set its priority, and record the next action.</div><div style="margin-top:12px;">${kvTable(kv("Owner", "A. Rivera") + kv("Priority", "High") + kv("Next action", "Review account history", true))}</div>`,
      ),
  },
  {
    id: "sheets-weekly-summary",
    label: "Review a Google Sheets summary",
    brand: "Google Sheets",
    detail: "Compact weekly metrics with a clearly labeled reporting period.",
    render: () =>
      shell(
        framed(`border-top:3px solid ${SHEETS};`),
        "16px 18px",
        `${brandOnly("Google Sheets", `<span style="${META}">Week of 18 March</span>`)}<div style="${H}margin-top:12px;">Support operations summary</div><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:12px;border-collapse:separate;border-spacing:0;"><tr>${[
          ["Resolved", "184"],
          ["Escalated", "12"],
          ["SLA met", "96%"],
        ]
          .map(
            ([label, value], index) =>
              `<td valign="top" width="33.33%" style="${index ? `border-left:1px solid ${RULE};padding-left:14px;` : "padding-right:14px;"}"><div style="${META}">${label}</div><div style="${H_LG}margin-top:3px;">${value}</div></td>`,
          )
          .join("")}</tr></table>`,
      ),
  },

  /* ---- Salesforce ---- */
  {
    id: "salesforce-record",
    label: "Update a Salesforce record",
    brand: "Salesforce",
    detail: "Record header over a three-part status strip.",
    render: () =>
      shell(
        `background-color:#ffffff;border-bottom:2px solid ${SALESFORCE};`,
        "16px 18px",
        `${brandRow("Salesforce", `<span style="${META}">Account</span>`)}<div style="${H_LG}margin-top:11px;">Northwind Retail</div><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:12px;border-collapse:separate;border-spacing:0;"><tr>${[
          ["Stage", "Renewal"],
          ["Owner", "M. Chen"],
          ["Next step", "Send quote"],
        ]
          .map(
            ([k, v], i) =>
              `<td valign="top" width="33.33%" style="${i ? `padding:0 12px;border-left:1px solid ${RULE};` : "padding:0 12px 0 0;"}"><div style="${META}">${k}</div><div style="font-family:${FONT};font-size:16px;font-weight:700;color:${INK};margin-top:3px;">${v}</div></td>`,
          )
          .join("")}</tr></table>`,
      ),
  },
  {
    id: "salesforce-handoff",
    label: "Log a Salesforce handoff",
    brand: "Salesforce",
    detail: "From and to owners either side of a handoff arrow.",
    render: (p) =>
      shell(
        framed(),
        "15px 17px",
        `${brandOnly("Salesforce", pill("Logged", SALESFORCE))}<div style="${H}margin-top:11px;">Hand off the account</div><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:12px;border-collapse:separate;border-spacing:0;"><tr><td valign="middle" style="background-color:${PAPER};border-radius:${RADIUS};padding:11px 13px;"><div style="${META}">From</div><div style="font-family:${FONT};font-size:16px;font-weight:700;color:${INK};margin-top:3px;">M. Chen &middot; Sales</div></td><td valign="middle" align="center" style="width:${ARROW_SIZE + 20}px;">${linkAcross(p.base)}</td><td valign="middle" style="background-color:${p.bg};border-radius:${RADIUS};padding:11px 13px;"><div style="${META}">To</div><div style="font-family:${FONT};font-size:16px;font-weight:700;color:${INK};margin-top:3px;">P. Adeyemi &middot; Success</div></td></tr></table><div style="${META}margin-top:11px;">Context, timing, and open commitments recorded on the record.</div>`,
      ),
  },

  /* ---- Workato ---- */
  {
    id: "workato-recipe",
    label: "Observe a Workato recipe",
    brand: "Workato",
    detail: "Job log with status dots and durations.",
    render: () =>
      shell(
        framed(),
        "14px 16px",
        `${brandOnly("Workato", pill("Success", WORKATO))}<div style="${H}margin-top:11px;">Check the recipe run</div><div style="margin-top:11px;border-top:1px solid ${RULE};">${[
          ["Trigger: new ticket", "0.2s"],
          ["Look up the account", "0.6s"],
          ["Update the record", "1.1s"],
        ]
          .map(
            ([name, time]) =>
              `<div style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid ${RULE};">${dot(WORKATO)}<span style="font-family:${FONT};font-size:14px;color:${INK};flex:1;">${name}</span><span style="${META}font-family:${MONO};">${time}</span></div>`,
          )
          .join("")}</div>`,
      ),
  },
  {
    id: "workato-action",
    label: "Run a Workato action",
    brand: "Workato",
    detail: "Workato trigger, connected action, and receipt.",
    render: (p) =>
      flow(p, "Automated action", [
        ["Workato", "Recipe triggered"],
        ["Salesforce", "Record updated"],
        ["Workato", "Receipt recorded"],
      ]),
  },
];

/** Superseded examples: hidden from the gallery, kept so saved stacks still open. */
const RETIRED = [
  "zd-ticket-chip",
  "zd-field-stack",
  "zd-macro-chip",
  "zd-automation-flow",
  "slack-reactions",
  "kb-internal-chip",
  "kb-shelf",
  "kb-source-of-truth",
  "tool-window",
  "tool-chip-row",
  "tool-action-rows",
];

const fallback = ENTRIES[0]!;

export const TOOL_SNIPPETS: Snippet[] = [
  ...ENTRIES.map((entry) => ({
    id: entry.id,
    label: entry.label,
    category: "Tools & process" as const,
    description: `${entry.brand}: ${entry.detail}`,
    ...(entry.multicolor ? { multicolor: true as const } : {}),
    render: entry.render,
  })),
  ...RETIRED.map((id) => ({
    id,
    label: id,
    category: "Tools & process" as const,
    description: "Superseded example kept for saved stacks.",
    gallery: false as const,
    render: fallback.render,
  })),
];
