import type { Palette } from "./snippet-colors";
import type { Snippet } from "./snippets";

const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const INK = "#0f172a";
const BODY = "#475569";
const LINE = "#94a3b8";
const table = (style: string, body: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 20px;font-family:${FONT};border-collapse:separate;${style}">${body}</table>`;
const title = (text: string) =>
  `<div style="font-size:22px;line-height:1.3;font-weight:700;color:${INK};">${text}</div>`;
const body = (text: string) =>
  `<div style="font-size:15px;line-height:1.7;color:${BODY};margin-top:8px;">${text}</div>`;
const button = (p: Palette, text: string, outline = false) =>
  `<span style="display:inline-block;padding:12px 18px;border:2px solid ${p.base};border-radius:6px;background:${outline ? "#ffffff" : p.base};color:${outline ? p.text : p.onBase};font-size:15px;font-weight:700;">${text}</span>`;

export const EXTRA_SNIPPETS: Snippet[] = [
  {
    id: "step-icon-list",
    label: "Icon step list",
    category: "Steps & lists",
    description: "Three clear actions marked by simple symbols.",
    render: (p) =>
      table(
        `background:#ffffff;border:1px solid ${LINE};border-radius:6px;`,
        `<tr>${["Prepare", "Complete", "Confirm"].map((text, i) => `<td width="33%" style="padding:16px;${i < 2 ? `border-right:1px solid ${LINE};` : ""}"><span style="display:inline-block;width:30px;height:30px;line-height:30px;text-align:center;background:${p.base};color:${p.onBase};font-weight:700;border-radius:15px;">${["+", "→", "✓"][i]}</span><div style="font-size:18px;font-weight:700;color:${INK};margin-top:9px;">${text}</div><div style="font-size:14px;line-height:1.5;color:${BODY};margin-top:4px;">Add one short instruction.</div></td>`).join("")}</tr>`,
      ),
  },
  {
    id: "callout-accent-top",
    label: "Strong top-border note",
    category: "Callouts",
    description: "A plain note anchored by a strong top edge.",
    render: (p) =>
      table(
        `background:#ffffff;border:1px solid ${LINE};border-top:5px solid ${p.base};`,
        `<tr><td style="padding:18px 20px;">${title("Important to know")}${body("Add the instruction, exception, or reminder learners need here.")}</td></tr>`,
      ),
  },
  {
    id: "callout-filled-panel",
    label: "Filled emphasis panel",
    category: "Callouts",
    description: "A solid high-contrast panel for a short message.",
    render: (p) =>
      table(
        `background:${p.bg};border-left:5px solid ${p.base};`,
        `<tr><td style="padding:18px 20px;"><div style="font-size:13px;font-weight:700;color:${p.text};text-transform:uppercase;letter-spacing:1px;">Remember</div><div style="font-size:20px;line-height:1.4;font-weight:700;color:${INK};margin-top:7px;">Put the most important instruction in one clear sentence.</div></td></tr>`,
      ),
  },
  {
    id: "headline-chapter-number",
    label: "Chapter sequence",
    category: "Headlines",
    description: "Three numbered chapters in a clear sequence.",
    render: (p) => {
      const row = (number: string, heading: string, copy: string, last: boolean) =>
        `<tr><td width="76" valign="top" style="font-size:30px;line-height:1;font-weight:700;color:${p.base};border-right:3px solid ${p.base};padding:${last ? "16px 0 0" : "16px 0"};">${number}</td><td valign="top" style="padding:${last ? "16px 0 0 20px" : "16px 0 16px 20px"};${last ? "" : `border-bottom:1px solid ${LINE};`}">${title(heading)}${body(copy)}</td></tr>`;
      return table(
        "",
        row("01", "Prepare", "Review the goal and gather what you need.", false) +
          row("02", "Practice", "Work through the action with guidance.", false) +
          row("03", "Apply", "Complete the task and confirm the result.", true),
      );
    },
  },
  {
    id: "headline-split-summary",
    label: "Split heading and summary",
    category: "Headlines",
    description: "Title and summary divided into balanced columns.",
    render: () =>
      table(
        `background:#ffffff;border-top:2px solid ${INK};border-bottom:2px solid ${INK};`,
        `<tr><td width="48%" style="padding:16px 18px;border-right:1px solid ${LINE};">${title("Section heading")}</td><td style="padding:16px 18px;">${body("Use two concise lines to explain what comes next.")}</td></tr>`,
      ),
  },
  {
    id: "headline-status-stack",
    label: "Status label heading",
    category: "Headlines",
    description: "A compact status label above a strong title.",
    render: (p) =>
      table(
        `background:${p.bg};border-left:6px solid ${p.base};`,
        `<tr><td style="padding:18px 20px;"><div style="font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${p.text};">Next up &middot; 5 minutes</div><div style="font-size:24px;line-height:1.25;font-weight:700;color:${INK};margin-top:7px;">Put the section title here</div></td></tr>`,
      ),
  },
  {
    id: "headline-bracketed",
    label: "Bracketed section title",
    category: "Headlines",
    description: "A centered title held by two strong accent bars.",
    render: (p) =>
      table(
        "",
        `<tr><td width="12" style="background:${p.base};"></td><td style="padding:18px 24px;text-align:center;">${title("A focused section title")}</td><td width="12" style="background:${p.base};"></td></tr>`,
      ),
  },
  {
    id: "cta-button-pair",
    label: "Primary and secondary actions",
    category: "Media & CTA",
    description: "Two clearly ranked actions with supporting copy.",
    render: (p) =>
      table(
        `background:#ffffff;border:2px solid ${LINE};border-radius:6px;`,
        `<tr><td style="padding:22px;">${title("Ready to continue?")}${body("Choose the main action or open the supporting resource.")}<div style="margin-top:16px;">${button(p, "Start now")} &nbsp; ${button(p, "View guide", true)}</div></td></tr>`,
      ),
  },
  {
    id: "cta-icon-card",
    label: "Icon-capped action",
    category: "Media & CTA",
    description: "A centered action card with one simple symbol.",
    render: (p) =>
      table(
        `background:${p.bg};border:2px solid ${p.border};border-radius:6px;text-align:center;`,
        `<tr><td style="padding:22px;"><div style="font-size:28px;color:${p.base};">↗</div>${title("Open the resource")}<div style="margin-top:14px;">${button(p, "Open")}</div></td></tr>`,
      ),
  },
  {
    id: "media-audio-player",
    label: "Audio player",
    category: "Media & CTA",
    description: "A simple audio or voiceover reference block.",
    render: (p) =>
      table(
        `background:#ffffff;border:2px solid ${LINE};border-radius:6px;`,
        `<tr><td width="76" style="padding:18px;text-align:center;background:${p.base};color:${p.onBase};font-size:24px;">▶</td><td style="padding:18px 20px;">${title("Listen: customer example")}<div style="font-size:14px;color:${BODY};margin-top:6px;">3:24 &nbsp; ▂▄▆▃▇▅▂▄</div></td></tr>`,
      ),
  },
  {
    id: "media-triple-gallery",
    label: "Three-image gallery",
    category: "Media & CTA",
    description: "Three equal visual placeholders with one caption.",
    render: (p) =>
      table(
        "",
        `<tr>${["Example 1", "Example 2", "Example 3"].map((text, i) => `<td width="33%" style="padding:${i === 1 ? "0 7px" : "0"};"><div style="height:88px;background:${i === 1 ? p.bgStrong : p.bg};border:1px solid ${p.border};text-align:center;line-height:88px;font-size:14px;font-weight:700;color:${p.text};">${text}</div></td>`).join("")}</tr><tr><td colspan="3" style="padding-top:11px;font-size:15px;line-height:1.55;color:${BODY};">Add one caption that explains what learners should compare.</td></tr>`,
      ),
  },
];
