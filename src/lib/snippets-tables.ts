import type { Palette } from "./snippet-colors";
import type { Snippet } from "./snippets";

const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const INK = "#0f172a";
const BODY = "#475569";
const LINE = "#94a3b8";
const SOFT = "#cbd5e1";
const PAPER = "#f8fafc";
const BASE = `margin:0 0 20px;font-family:${FONT};`;
const META = `font-family:${FONT};font-size:12px;line-height:1.3;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;`;
const PRIMARY = `font-family:${FONT};font-size:16px;line-height:1.4;font-weight:700;color:${INK};`;
const SECONDARY = `font-family:${FONT};font-size:14px;line-height:1.45;color:${BODY};`;
const framed = (rows: string, style = "") =>
  `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="${BASE}border-collapse:separate;border-spacing:0;background:#ffffff;border:1px solid ${LINE};border-radius:6px;overflow:hidden;${style}">${rows}</table>`;
const badge = (text: string, p: Palette) =>
  `<span style="display:inline-block;padding:3px 7px;border:1px solid ${p.border};border-radius:999px;background:${p.bg};color:${p.text};font-size:13px;line-height:1.3;font-weight:700;">${text}</span>`;

export const TABLE_SNIPPETS: Snippet[] = [
  {
    id: "tables-records",
    label: "Record table",
    category: "Tables & data",
    description: "A clear list of records and owners.",
    render: (p) => {
      const row = (name: string, owner: string, status: string, last = false) =>
        `<tr><td style="padding:13px 16px;${PRIMARY}${last ? "" : `border-bottom:1px solid ${SOFT};`}">${name}<div style="${SECONDARY}font-size:13px;margin-top:2px;">${owner}</div></td><td width="92" align="right" style="padding:13px 16px;${last ? "" : `border-bottom:1px solid ${SOFT};`}">${badge(status, p)}</td></tr>`;
      return framed(
        `<tr><td colspan="2" style="padding:10px 16px;border-bottom:2px solid ${INK};${META}color:${BODY};">Active records</td></tr>${row("Support review", "Owner · M. Chen", "Open")}${row("Policy update", "Owner · A. Rivera", "Ready", true)}`,
      );
    },
  },
  {
    id: "tables-comparison",
    label: "Bordered comparison",
    category: "Tables & data",
    description: "Compare options across visible grid lines.",
    render: (p) => {
      const cell = (value: string, style = "") =>
        `<td style="padding:12px 14px;border-right:1px solid ${LINE};border-bottom:1px solid ${LINE};${SECONDARY}${style}">${value}</td>`;
      return framed(
        `<tr><td style="padding:10px 14px;background:${INK};color:#ffffff;${META}">Option</td><td style="padding:10px 14px;background:${p.base};color:${p.onBase};${META}">Best for</td><td style="padding:10px 14px;background:${p.base};color:${p.onBase};${META}">Timing</td></tr><tr>${cell("Standard", `color:${INK};font-weight:700;background:${PAPER};`)}${cell("Routine requests")}${cell("1 day", "border-right:0;")}</tr><tr>${cell("Escalated", `color:${INK};font-weight:700;background:${PAPER};border-bottom:0;`)}${cell("Urgent risk", "border-bottom:0;")}${cell("2 hours", "border:0;")}</tr>`,
      );
    },
  },
  {
    id: "tables-status",
    label: "Status table",
    category: "Tables & data",
    description: "Track work and its current state.",
    render: (p) => {
      const row = (task: string, status: string, width: number) =>
        `<tr><td style="padding:0 0 10px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;background:#ffffff;border:1px solid ${SOFT};border-left:4px solid ${p.base};border-radius:6px;"><tr><td style="padding:11px 13px;${PRIMARY}">${task}</td><td width="92" align="right" style="padding:11px 13px;${SECONDARY}">${status}</td></tr><tr><td colspan="2" style="padding:0 13px 11px;"><div style="height:4px;background:${p.bg};font-size:0;"><div style="height:4px;width:${width}%;background:${p.base};font-size:0;">&nbsp;</div></div></td></tr></table></td></tr>`;
      return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="${BASE}border-collapse:collapse;"><tr><td style="${META}color:${p.text};padding:0 0 9px;">Workflow status</td></tr>${row("Verify details", "Complete", 100)}${row("Request approval", "In review", 64)}${row("Notify owner", "Waiting", 22)}</table>`;
    },
  },
  {
    id: "tables-owner-due",
    label: "Owner and due date",
    category: "Tables & data",
    description: "A compact responsibility tracker.",
    render: (p) => {
      const row = (action: string, owner: string, due: string, last = false) =>
        `<tr><td style="padding:11px 14px;${last ? "" : `border-bottom:1px solid ${SOFT};`}"><span style="${PRIMARY}">${action}</span><span style="${SECONDARY}"> &nbsp;·&nbsp; ${owner}</span></td><td width="80" align="right" style="padding:11px 14px;${META}color:${p.text};font-variant-numeric:tabular-nums;${last ? "" : `border-bottom:1px solid ${SOFT};`}">${due}</td></tr>`;
      return framed(
        `${row("Draft response", "Support", "Today")}${row("Approve exception", "Manager", "Sep 21")}${row("Close loop", "Requester", "Sep 22", true)}`,
      );
    },
  },
  {
    id: "tables-checklist",
    label: "Checklist table",
    category: "Tables & data",
    description: "A checklist with evidence and completion.",
    render: (p) => {
      const row = (done: boolean, task: string, evidence: string, last = false) =>
        `<tr><td width="38" valign="top" style="padding:12px 10px 12px 0;${last ? "" : `border-bottom:1px solid ${SOFT};`}"><span style="display:inline-block;width:24px;height:24px;line-height:22px;text-align:center;border:1px solid ${done ? p.base : LINE};border-radius:50%;background:${done ? p.base : "#ffffff"};color:${done ? p.onBase : BODY};font-size:14px;font-weight:700;">${done ? "✓" : ""}</span></td><td style="padding:12px 0;${last ? "" : `border-bottom:1px solid ${SOFT};`}"><div style="${PRIMARY}">${task}</div><div style="${SECONDARY}font-size:13px;margin-top:2px;">Evidence · ${evidence}</div></td></tr>`;
      return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="${BASE}border-collapse:collapse;border-top:3px solid ${p.base};border-bottom:1px solid ${LINE};"><tr><td colspan="2" style="padding:11px 0 6px;${META}color:${p.text};">Completion checks</td></tr>${row(true, "Identity verified", "Account note")}${row(false, "Approval recorded", "Pending", true)}</table>`;
    },
  },
  {
    id: "tables-key-value",
    label: "Details table",
    category: "Tables & data",
    description: "Strongly separated labels and values.",
    render: (p) => {
      const row = (key: string, value: string, last = false) =>
        `<tr><td width="34%" align="right" valign="top" style="padding:11px 14px;${META}color:${p.text};${last ? "" : `border-bottom:1px solid ${p.border};`}">${key}</td><td valign="top" style="padding:11px 14px;${PRIMARY}${last ? "" : `border-bottom:1px solid ${p.border};`}">${value}</td></tr>`;
      return framed(
        `${row("Request ID", "REQ-1048")}${row("Priority", "High")}${row("Next action", "Manager review", true)}`,
        `background:${p.bg};border-color:${p.border};`,
      );
    },
  },
  {
    id: "tables-directory",
    label: "Compact directory",
    category: "Tables & data",
    description: "Names, roles, and contact points.",
    render: (p) => {
      const row = (initials: string, name: string, role: string, contact: string, last = false) =>
        `<tr><td width="50" style="padding:13px 0 13px 14px;${last ? "" : `border-bottom:1px solid ${SOFT};`}"><div style="width:32px;height:32px;line-height:32px;text-align:center;border-radius:50%;background:${p.base};color:${p.onBase};font-size:13px;font-weight:700;">${initials}</div></td><td style="padding:13px 8px;${last ? "" : `border-bottom:1px solid ${SOFT};`}"><div style="${PRIMARY}">${name}</div><div style="${SECONDARY}font-size:13px;">${role}</div></td><td align="right" style="padding:13px 14px;${SECONDARY}color:${p.text};${last ? "" : `border-bottom:1px solid ${SOFT};`}">${contact}</td></tr>`;
      return framed(
        `${row("AM", "Alex Morgan", "Escalations", "#support-help")}${row("JL", "Jamie Lee", "Enablement", "Learning portal", true)}`,
      );
    },
  },
  {
    id: "tables-schedule",
    label: "Schedule table",
    category: "Tables & data",
    description: "A concise agenda or shift schedule.",
    render: (p) => {
      const row = (time: string, session: string, lead: string, last = false) =>
        `<tr><td width="76" valign="top" style="padding:12px 13px;background:${p.base};color:${p.onBase};${META}font-variant-numeric:tabular-nums;${last ? "" : `border-bottom:1px solid ${p.border};`}">${time}</td><td valign="top" style="padding:12px 15px;${last ? "" : `border-bottom:1px solid ${SOFT};`}"><div style="${PRIMARY}">${session}</div><div style="${SECONDARY}font-size:13px;margin-top:2px;">Lead · ${lead}</div></td></tr>`;
      return framed(
        `${row("9:00", "Daily review", "Support")}${row("11:30", "Case calibration", "Quality")}${row("2:00", "Office hours", "Enablement", true)}`,
      );
    },
  },
  {
    id: "tables-before-after",
    label: "Before and after",
    category: "Tables & data",
    description: "Compare a process change side by side.",
    render: (p) => {
      const items = (values: string[]) =>
        values
          .map(
            (value) =>
              `<div style="${SECONDARY}color:${INK};padding:7px 0;border-top:1px solid ${p.border};">${value}</div>`,
          )
          .join("");
      return framed(
        `<tr><td width="50%" valign="top" style="padding:15px 17px;background:${PAPER};border-right:2px solid ${INK};"><div style="${META}color:${BODY};margin-bottom:7px;">Before</div><div style="${PRIMARY}font-size:18px;margin-bottom:10px;">Manual process</div>${items(["Manual assignment", "End-of-day review", "Separate notes"])}</td><td width="50%" valign="top" style="padding:15px 17px;background:${p.bg};"><div style="${META}color:${p.text};margin-bottom:7px;">After</div><div style="${PRIMARY}font-size:18px;margin-bottom:10px;">Connected process</div>${items(["Routing rule", "Immediate alert", "Shared record"])}</td></tr>`,
      );
    },
  },
  {
    id: "tables-grouped-summary",
    label: "Grouped summary",
    category: "Tables & data",
    description: "Grouped rows with section headers.",
    render: (p) => {
      const section = (name: string) =>
        `<tr><td colspan="2" style="padding:12px 14px 6px;border-top:3px solid ${p.base};${META}color:${p.text};">${name}</td></tr>`;
      const row = (name: string, value: string) =>
        `<tr><td style="padding:8px 14px;${SECONDARY}color:${INK};">${name}</td><td align="right" style="padding:8px 14px;${SECONDARY}">${value}</td></tr>`;
      return framed(
        `${section("Customer actions")}${row("Verify account", "Complete")}${row("Confirm request", "Complete")}${section("Internal actions")}${row("Log decision", "Waiting")}<tr><td style="padding:11px 14px;border-top:1px solid ${LINE};${PRIMARY}">Summary</td><td align="right" style="padding:11px 14px;border-top:1px solid ${LINE};${PRIMARY}color:${p.text};">2 of 3 complete</td></tr>`,
      );
    },
  },
];
