import type { Palette } from "./snippet-colors";
import type { Snippet } from "./snippets";

const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const INK = "#0f172a";
const BODY = "#475569";
const LINE = "#94a3b8";
const SOFT = "#cbd5e1";
const block = (style: string, content: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 20px;font-family:${FONT};border-collapse:separate;${style}"><tr><td>${content}</td></tr></table>`;
const title = (text: string, size = 18) =>
  `<div style="font-size:${size}px;line-height:1.3;font-weight:700;color:${INK};">${text}</div>`;
const body = (text: string, top = 6) =>
  `<div style="font-size:16px;line-height:1.55;color:${BODY};margin-top:${top}px;">${text}</div>`;
const label = (text: string, color: string) =>
  `<div style="font-size:13px;line-height:1.25;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${color};margin-bottom:7px;">${text}</div>`;

export const CARD_SNIPPETS: Snippet[] = [
  {
    id: "card-article",
    label: "Article card",
    category: "Cards & grids",
    description: "Article summary with topic and reading time.",
    render: (p) =>
      block(
        `border-top:3px solid ${p.base};border-bottom:1px solid ${SOFT};`,
        `<div style="padding:16px 2px 14px;">${label("Customer conversations", p.base)}${title("How to lead a productive discovery call", 22)}${body("A concise summary that helps learners decide whether this resource is relevant.")}<div style="font-size:14px;color:${BODY};margin-top:12px;">6 min read &nbsp;&middot;&nbsp; Updated recently</div></div>`,
      ),
  },
  {
    id: "card-resource",
    label: "Resource card",
    category: "Cards & grids",
    description: "A useful resource with format and action.",
    render: (p) =>
      block(
        `border:1px solid ${SOFT};border-left:5px solid ${p.base};`,
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td width="54" style="padding:16px 0 16px 16px;color:${p.base};font-size:24px;" valign="top">↗</td><td style="padding:16px 18px 16px 0;">${title("Open the coaching guide")}${body("Use this reference during live practice and manager reviews.")}<div style="font-size:14px;font-weight:700;color:${p.base};margin-top:9px;">PDF &middot; Open resource</div></td></tr></table>`,
      ),
  },
  {
    id: "card-status",
    label: "Status card",
    category: "Cards & grids",
    description: "A status, owner, and next-action summary.",
    render: (p) =>
      block(
        `border:2px solid ${INK};`,
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td width="112" style="background:${p.bg};border-right:2px solid ${INK};padding:16px;">${label("In review", p.text)}<div style="font-size:14px;font-weight:700;color:${INK};">Due Friday</div></td><td style="padding:16px 18px;">${title("Manager approval")}${body("Review the exception and record a decision.")}</td></tr></table>`,
      ),
  },
  {
    id: "card-owner",
    label: "Owner card",
    category: "Cards & grids",
    description: "Person, responsibility, and contact point.",
    render: (p) =>
      block(
        `border-bottom:2px solid ${p.base};`,
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td width="52" style="padding:10px 0 14px;" valign="top"><div style="width:40px;height:40px;line-height:40px;text-align:center;border-radius:50%;background:${p.base};color:${p.onBase};font-size:15px;font-weight:700;">JL</div></td><td style="padding:9px 0 14px 10px;">${title("Jordan Lee")}<div style="font-size:14px;color:${BODY};margin-top:2px;">Escalation owner</div></td><td align="right" valign="middle" style="padding:10px 0 14px;font-size:14px;color:${BODY};">Policy exceptions<br/>Urgent approvals</td></tr></table>`,
      ),
  },
  {
    id: "card-contact-pair",
    label: "Contact pair",
    category: "Cards & grids",
    description: "Two contacts with distinct responsibilities.",
    render: (p) =>
      block(
        `border:1px solid ${LINE};`,
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td width="50%" valign="top" style="padding:16px 18px;border-right:1px solid ${LINE};">${label("Primary", p.base)}${title("Support lead")}${body("Owns active escalations and customer updates.")}</td><td width="50%" valign="top" style="padding:16px 18px;">${label("Backup", BODY)}${title("Duty manager")}${body("Handles exceptions and after-hours decisions.")}</td></tr></table>`,
      ),
  },
  {
    id: "card-resource-collection",
    label: "Resource collection",
    category: "Cards & grids",
    description: "A compact list of related resources.",
    render: (p) => {
      const row = (name: string, meta: string, last = false) =>
        `<tr><td style="padding:11px 0;${last ? "" : `border-bottom:1px solid ${SOFT};`}"><span style="font-size:16px;font-weight:700;color:${INK};">${name}</span><span style="font-size:14px;color:${BODY};"> &nbsp;${meta}</span></td><td width="24" align="right" style="color:${p.base};${last ? "" : `border-bottom:1px solid ${SOFT};`}">→</td></tr>`;
      return block(
        `background:#ffffff;border:1px solid ${LINE};border-radius:6px;padding:16px;`,
        `${label("Resources", p.base)}<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:2px solid ${INK};border-bottom:2px solid ${INK};">${row("Conversation guide", "PDF · 6 min")}${row("Approval matrix", "Reference · Updated")}${row("Practice scenario", "Exercise · 10 min", true)}</table>`,
      );
    },
  },
  {
    id: "card-option-pair",
    label: "Two-option choice",
    category: "Cards & grids",
    description: "Two clearly differentiated choices.",
    render: (p) =>
      block(
        `background:#ffffff;border:1px solid ${LINE};border-radius:6px;`,
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td width="50%" valign="top" style="padding:16px 18px;background:${p.base};color:${p.onBase};">${label("Option A", p.onBase)}<div style="font-size:18px;font-weight:700;">Resolve now</div><div style="font-size:15px;line-height:1.5;margin-top:6px;">Use when standard policy applies.</div></td><td width="50%" valign="top" style="padding:15px 18px;border:1px solid ${LINE};">${label("Option B", BODY)}${title("Request review")}${body("Use when an exception needs approval.")}</td></tr></table>`,
      ),
  },
  {
    id: "card-before-after",
    label: "Before and after cards",
    category: "Cards & grids",
    description: "A change shown as two balanced cards.",
    render: (p) =>
      block(
        `background:#ffffff;border:1px solid ${LINE};border-radius:6px;`,
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td colspan="2" style="padding:10px 16px;background:${INK};color:#ffffff;font-size:13px;font-weight:700;letter-spacing:1px;">PROCESS CHANGE</td></tr><tr><td width="50%" valign="top" style="padding:16px;border-right:1px solid ${LINE};">${label("Before", BODY)}${title("Manual assignment")}${body("A coordinator routes each request.")}</td><td width="50%" valign="top" style="padding:16px;background:${p.bg};">${label("After", p.text)}${title("Rules-based routing")}${body("Qualified requests reach the right owner.")}</td></tr></table>`,
      ),
  },
  {
    id: "card-three-options",
    label: "Three-option comparison",
    category: "Cards & grids",
    description: "Three compact options with one recommendation.",
    render: (p) => {
      const row = (name: string, copy: string, selected = false) =>
        `<tr><td width="120" style="padding:11px 14px;border-bottom:1px solid ${SOFT};${selected ? `border-left:4px solid ${p.base};background:${p.bg};` : ""}"><div style="font-size:16px;font-weight:700;color:${INK};">${name}</div></td><td style="padding:11px 14px;border-bottom:1px solid ${SOFT};font-size:15px;line-height:1.5;color:${BODY};">${copy}</td></tr>`;
      return block(
        `background:#ffffff;border:1px solid ${LINE};border-radius:6px;padding:16px;`,
        `${label("Choose a route", p.base)}<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:2px solid ${INK};">${row("Self-serve", "Familiar, low-risk work.")}${row("Guided", "New or complex work.", true)}${row("Escalated", "Urgent or high-risk work.")}</table>`,
      );
    },
  },
  {
    id: "card-milestones",
    label: "Milestone cards",
    category: "Cards & grids",
    description: "Three milestones with clear outcomes.",
    render: (p) =>
      block(
        `background:#ffffff;border:1px solid ${LINE};border-radius:6px;padding:16px;`,
        `${label("Milestones", p.base)}<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>${[
          ["1", "Prepare", "Gather the source."],
          ["2", "Complete", "Take the action."],
          ["3", "Confirm", "Record the result."],
        ]
          .map(
            ([n, h, copy], i) =>
              `<td width="33.33%" valign="top" style="padding:${i ? "0 0 0 14px" : "0"};border-top:3px solid ${i === 1 ? p.base : LINE};"><div style="font-size:14px;font-weight:700;color:${i === 1 ? p.base : BODY};margin-top:10px;">${n}</div><div style="font-size:18px;font-weight:700;color:${INK};margin-top:5px;">${h}</div><div style="font-size:14px;color:${BODY};margin-top:4px;">${copy}</div></td>`,
          )
          .join("")}</tr></table>`,
      ),
  },
  {
    id: "card-handoff",
    label: "Handoff cards",
    category: "Cards & grids",
    description: "A responsibility handoff between two owners.",
    render: (p) =>
      block(
        `border:2px solid ${INK};`,
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td width="42%" style="padding:15px 18px;">${label("From", BODY)}${title("Support")}${body("Summarize the issue and evidence.")}</td><td width="16%" align="center" style="background:${p.base};color:${p.onBase};font-size:24px;">→</td><td width="42%" style="padding:15px 18px;">${label("To", p.base)}${title("Operations")}${body("Confirm ownership and timing.")}</td></tr></table>`,
      ),
  },
  {
    id: "card-decision",
    label: "Decision cards",
    category: "Cards & grids",
    description: "A simple condition and next-action pair.",
    render: (p) =>
      block(
        `border-left:5px solid ${p.base};background:${p.bg};`,
        `<div style="padding:16px 18px;">${label("Decision point", p.text)}${title("Is the request covered by policy?")}<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;border-top:1px solid ${p.border};"><tr><td width="50%" style="padding:10px 12px 0 0;border-right:1px solid ${p.border};"><div style="font-size:16px;font-weight:700;color:${INK};">Yes</div><div style="font-size:14px;color:${BODY};margin-top:3px;">Complete the request.</div></td><td width="50%" style="padding:10px 0 0 12px;"><div style="font-size:16px;font-weight:700;color:${INK};">No</div><div style="font-size:14px;color:${BODY};margin-top:3px;">Request an exception.</div></td></tr></table></div>`,
      ),
  },
];
