import { buildPalettes, type Palette } from "./snippet-colors";
import { TOOL_SNIPPETS } from "./snippets-tools";
import { EXTRA_SNIPPETS } from "./snippets-extra";
import { TABLE_SNIPPETS } from "./snippets-tables";
import { CARD_SNIPPETS } from "./snippets-cards";

export type SnippetCategory =
  | "Steps & lists"
  | "Cards & grids"
  | "Callouts"
  | "Headlines"
  | "Text & layout"
  | "Tables & data"
  | "Media & CTA"
  | "Tools & process";

export type Snippet = {
  id: string;
  label: string;
  category: SnippetCategory;
  description: string;
  /** `alt` holds the secondary/tertiary palettes; single-color blocks ignore it. */
  render: (p: Palette, alt: [Palette, Palette]) => string;
  multicolor?: boolean;
  /** Retains older blocks for saved stacks without listing them in the gallery. */
  gallery?: boolean;
};

/* ---------- one shared design scale so every block feels like one system ---------- */

const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const MONO = "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace";

const INK = "#0f172a";
const BODY = "#475569";
const MUTED = "#94a3b8";
const HAIRLINE = "#cbd5e1";
const PAPER = "#fbfcfe";
const RADIUS = "6px";
const GAP = "20px";
const PAD = "20px";

const BLOCK = `margin:0 0 ${GAP} 0;font-family:${FONT};border-collapse:separate;`;
const H = `font-family:${FONT};font-size:18px;line-height:1.35;font-weight:700;color:${INK};margin:0 0 7px 0;letter-spacing:0;`;
const H_BIG = `font-family:${FONT};font-size:24px;line-height:1.25;font-weight:700;color:${INK};margin:0 0 9px 0;letter-spacing:0;`;
const P = `font-family:${FONT};font-size:16px;line-height:1.55;color:${BODY};margin:0;`;
const P_SM = `font-family:${FONT};font-size:14px;line-height:1.5;color:${BODY};margin:0;`;
const LABEL = `font-family:${FONT};font-size:13px;line-height:1.25;letter-spacing:1px;text-transform:uppercase;font-weight:700;`;

const table = (extra: string, rows: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="${BLOCK}${extra}">
${rows}
</table>`;

const spacer = (h: number, cols = 1) =>
  `  <tr><td colspan="${cols}" style="height:${h}px;font-size:0;line-height:0;">&nbsp;</td></tr>`;

const pill = (p: Palette, text: string) =>
  `<span style="display:inline-block;font-family:${FONT};font-size:15px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:${p.text};background-color:${p.bg};border:1px solid ${p.border};border-radius:999px;padding:5px 11px;">${text}</span>`;

const dot = (p: Palette, glyph: string, size = 34) =>
  `<div style="width:${size}px;height:${size}px;line-height:${size}px;text-align:center;border-radius:${Math.round(size / 2)}px;background-color:${p.base};color:${p.onBase};font-family:${FONT};font-size:${Math.round(size * 0.42)}px;font-weight:700;">${glyph}</div>`;

const softDot = (p: Palette, glyph: string, size = 34) =>
  `<div style="width:${size}px;height:${size}px;line-height:${size}px;text-align:center;border-radius:10px;background-color:${p.bg};border:1px solid ${p.border};color:${p.text};font-family:${FONT};font-size:${Math.round(size * 0.42)}px;font-weight:700;">${glyph}</div>`;

/* ---------- shared composites ---------- */

function shell(p: Palette, inner: string, extra = "") {
  return table(
    `background-color:#ffffff;border:1px solid ${HAIRLINE};border-radius:${RADIUS};${extra}`,
    inner,
  );
}

function cardCell(
  p: Palette,
  opts: { width: string; eyebrow?: string; title: string; body: string; glyph?: string },
) {
  return `    <td valign="top" width="${opts.width}" style="padding:0 9px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="font-family:${FONT};border-collapse:separate;background-color:#ffffff;border:1px solid ${HAIRLINE};border-radius:${RADIUS};">
        <tr><td style="padding:18px;">
          ${opts.glyph ? `<div style="margin:0 0 14px 0;">${softDot(p, opts.glyph, 36)}</div>` : ""}
          ${opts.eyebrow ? `<div style="${LABEL}color:${p.base};margin:0 0 8px 0;">${opts.eyebrow}</div>` : ""}
          <div style="${H}">${opts.title}</div>
          <div style="${P_SM}">${opts.body}</div>
        </td></tr>
      </table>
    </td>`;
}

/** Bordered white card with one padded cell — the default container for any block. */
function boxed(inner: string, extra = "", pad = PAD) {
  return table(
    `background-color:#ffffff;border:1px solid ${HAIRLINE};border-radius:${RADIUS};${extra}`,
    `  <tr><td style="padding:${pad};">
${inner}
  </td></tr>`,
  );
}

/** Nested layout table for use inside a boxed() cell. */
const innerTable = (rows: string, extra = "") =>
  `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:separate;font-family:${FONT};${extra}">
${rows}
    </table>`;

function callout(p: Palette, glyph: string, title: string, body: string) {
  return table(
    `background-color:${p.bg};border:1px solid ${p.border};border-radius:${RADIUS};`,
    `  <tr>
    <td valign="top" style="width:58px;padding:22px 0 22px 20px;">${dot(p, glyph, 30)}</td>
    <td valign="top" style="padding:22px 24px 22px 14px;">
      <div style="${LABEL}color:${p.text};margin:0 0 6px 0;">${title}</div>
      <div style="${P}color:${INK};">${body}</div>
    </td>
  </tr>`,
  );
}

function stepRow(p: Palette, badge: string, title: string, body: string, last: boolean) {
  const pb = last ? "0" : "22px";
  return `  <tr>
    <td valign="top" style="width:54px;padding:0 18px ${pb} 0;">${dot(p, badge, 34)}</td>
    <td valign="top" style="padding:3px 0 ${pb} 0;">
      <div style="${H}margin:0 0 6px 0;">${title}</div>
      <div style="${P}">${body}</div>
    </td>
  </tr>`;
}

export const SNIPPETS: Snippet[] = [
  /* ============================ STEPS & LISTS ============================ */
  {
    id: "step-numbered",
    label: "Numbered step",
    category: "Steps & lists",
    description: "A single numbered step row.",
    render: (p) =>
      boxed(
        innerTable(
          stepRow(
            p,
            "1",
            "Step title goes here",
            "Describe exactly what the learner should do in this step.",
            true,
          ),
        ),
        "",
        "22px 24px",
      ),
  },
  {
    id: "step-card",
    label: "Numbered step card",
    category: "Steps & lists",
    description: "Step inside a bordered card.",
    render: (p) =>
      shell(
        p,
        `  <tr>
    <td valign="top" style="width:60px;padding:22px 0 22px 22px;">${dot(p, "1", 36)}</td>
    <td valign="top" style="padding:22px 24px 22px 16px;">
      <div style="${LABEL}color:${p.base};margin:0 0 6px 0;">Step one</div>
      <div style="${H}">Give this step a clear action title</div>
      <div style="${P}">One or two sentences describing exactly what to do and what success looks like.</div>
    </td>
  </tr>`,
      ),
  },
  {
    id: "step-timeline",
    label: "Timeline steps",
    category: "Steps & lists",
    description: "Connected vertical timeline.",
    render: (p) => {
      const row = (n: number, last: boolean) => `  <tr>
    <td valign="top" style="width:54px;padding:0 18px 0 0;">
      ${dot(p, String(n), 34)}
      ${last ? "" : `<div style="width:2px;height:34px;margin:6px 0 6px 16px;background-color:${p.border};font-size:0;line-height:0;">&nbsp;</div>`}
    </td>
    <td valign="top" style="padding:3px 0 ${last ? "0" : "18px"} 0;">
      <div style="${H}margin:0 0 5px 0;">Milestone ${n}</div>
      <div style="${P_SM}">What happens at this point in the process.</div>
    </td>
  </tr>`;
      return boxed(
        `    <div style="${LABEL}color:${p.base};margin:0 0 18px 0;">Timeline</div>
    ${innerTable([row(1, false), row(2, false), row(3, true)].join("\n"))}`,
      );
    },
  },
  {
    id: "step-stack",
    label: "Three-step stack",
    category: "Steps & lists",
    description: "Three numbered steps in one block.",
    render: (p) =>
      boxed(
        `    <div style="${LABEL}color:${p.base};margin:0 0 18px 0;">How it works</div>
    ${innerTable(
      [1, 2, 3]
        .map((n) =>
          stepRow(p, String(n), `Step ${n} title`, `Describe the action for step ${n}.`, n === 3),
        )
        .join("\n"),
    )}`,
      ),
  },
  {
    id: "step-lettered",
    label: "Lettered sub-step",
    category: "Steps & lists",
    description: "Sub-step row with a soft letter badge.",
    render: (p) =>
      boxed(
        innerTable(`  <tr>
        <td valign="top" style="width:48px;padding:0 14px 0 0;">${softDot(p, "A", 30)}</td>
        <td valign="top" style="padding:4px 0 0 0;">
          <div style="${P}"><strong style="color:${INK};font-weight:600;">Sub-step label.</strong> Add the supporting detail for this action here.</div>
        </td>
      </tr>`),
        "",
        "18px 20px",
      ),
  },
  {
    id: "checklist",
    label: "Checklist item",
    category: "Steps & lists",
    description: "Check-marked requirement row.",
    render: (p) =>
      table(
        `background-color:#ffffff;border:1px solid ${HAIRLINE};border-radius:${RADIUS};margin:0 0 12px 0;`,
        `  <tr>
    <td valign="top" style="width:56px;padding:16px 0 16px 18px;">
      <div style="width:24px;height:24px;line-height:24px;text-align:center;border-radius:7px;background-color:${p.base};color:${p.onBase};font-family:${FONT};font-size:15px;font-weight:700;">&#10003;</div>
    </td>
    <td valign="middle" style="${P}padding:16px 20px 16px 0;">Checklist item the learner must confirm before moving on.</td>
  </tr>`,
      ),
  },
  {
    id: "checklist-card",
    label: "Checklist card",
    category: "Steps & lists",
    description: "Boxed list of four checks.",
    render: (p) => {
      const item = (t: string, last: boolean) => `  <tr>
    <td valign="top" style="width:52px;padding:14px 0 14px 22px;border-top:${last ? "none" : "none"};">
      <div style="width:22px;height:22px;line-height:22px;text-align:center;border-radius:6px;background-color:${p.bg};border:1px solid ${p.border};color:${p.text};font-family:${FONT};font-size:15px;font-weight:700;">&#10003;</div>
    </td>
    <td valign="top" style="${P}padding:16px 24px 16px 0;${last ? "" : `border-bottom:1px solid ${HAIRLINE};`}">${t}</td>
  </tr>`;
      return shell(
        p,
        `  <tr><td colspan="2" style="padding:20px 22px 6px 22px;"><div style="${LABEL}color:${p.base};">Before you continue</div></td></tr>
${item("Confirm the account details are correct.", false)}
${item("Review the policy language with the customer.", false)}
${item("Log the interaction in the CRM.", true)}`,
      );
    },
  },
  {
    id: "bullet-list",
    label: "Icon bullet list",
    category: "Steps & lists",
    description: "Three accent-dot bullets.",
    render: (p) => {
      const li = (t: string, last: boolean) => `      <tr>
        <td valign="top" style="width:40px;padding:0 14px ${last ? "0" : "14px"} 0;">
          <div style="width:24px;height:24px;line-height:24px;text-align:center;border-radius:8px;background-color:${p.bg};border:1px solid ${p.border};color:${p.text};font-family:${FONT};font-size:15px;font-weight:700;">&#10003;</div>
        </td>
        <td valign="top" style="${P}padding:1px 0 ${last ? "0" : "14px"} 0;${last ? "" : `border-bottom:1px solid ${HAIRLINE};`}">${t}</td>
      </tr>${last ? "" : `\n${spacer(14, 2).replace("  <tr>", "      <tr>")}`}`;
      return boxed(
        `    <div style="${LABEL}color:${p.base};margin:0 0 18px 0;">Key points</div>
    ${innerTable(
      [
        li("First point the learner should retain from this section.", false),
        li("Second point, written as a short, scannable sentence.", false),
        li("Third point that closes out the idea.", true),
      ].join("\n"),
    )}`,
      );
    },
  },

  /* ============================ CARDS & GRIDS ============================ */
  {
    id: "grid-2x2",
    label: "2 × 2 card grid",
    category: "Cards & grids",
    description: "Four cards, two per row.",
    gallery: false,
    render: (p) =>
      table(
        "table-layout:fixed;",
        `  <tr>
${cardCell(p, { width: "50%", title: "Card one", body: "Short supporting copy for the first card." })}
${cardCell(p, { width: "50%", title: "Card two", body: "Short supporting copy for the second card." })}
  </tr>
${spacer(18, 2)}
  <tr>
${cardCell(p, { width: "50%", title: "Card three", body: "Short supporting copy for the third card." })}
${cardCell(p, { width: "50%", title: "Card four", body: "Short supporting copy for the fourth card." })}
  </tr>`,
      ),
  },
  {
    id: "grid-2x2-icons",
    label: "2 × 2 icon cards",
    category: "Cards & grids",
    description: "Four cards with icon badges.",
    gallery: false,
    render: (p) =>
      table(
        "table-layout:fixed;",
        `  <tr>
${cardCell(p, { width: "50%", glyph: "&#9679;", title: "Discover", body: "What the learner uncovers in this phase." })}
${cardCell(p, { width: "50%", glyph: "&#9670;", title: "Diagnose", body: "How to interpret what they found." })}
  </tr>
${spacer(18, 2)}
  <tr>
${cardCell(p, { width: "50%", glyph: "&#9632;", title: "Decide", body: "The call they need to make and why." })}
${cardCell(p, { width: "50%", glyph: "&#10003;", title: "Deliver", body: "How to close the loop with the customer." })}
  </tr>`,
      ),
  },
  {
    id: "grid-3x1",
    label: "3 × 1 card grid",
    category: "Cards & grids",
    description: "Three cards side by side.",
    gallery: false,
    render: (p) =>
      table(
        "table-layout:fixed;",
        `  <tr>
${cardCell(p, { width: "33.33%", eyebrow: "One", title: "Card one", body: "Short supporting copy for the first card." })}
${cardCell(p, { width: "33.33%", eyebrow: "Two", title: "Card two", body: "Short supporting copy for the second card." })}
${cardCell(p, { width: "33.33%", eyebrow: "Three", title: "Card three", body: "Short supporting copy for the third card." })}
  </tr>`,
      ),
  },
  {
    id: "grid-4x1",
    label: "4 × 1 mini cards",
    category: "Cards & grids",
    description: "Four compact tiles in a row.",
    gallery: false,
    render: (p) => {
      const cell = (
        g: string,
        t: string,
      ) => `    <td valign="top" width="25%" style="padding:0 7px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:separate;background-color:${p.bg};border:1px solid ${p.border};border-radius:${RADIUS};">
        <tr><td align="center" style="padding:20px 10px;">
          <div style="font-family:${FONT};font-size:20px;line-height:1;color:${p.base};margin:0 0 10px 0;">${g}</div>
          <div style="font-family:${FONT};font-size:15px;font-weight:600;color:${INK};">${t}</div>
        </td></tr>
      </table>
    </td>`;
      return table(
        "table-layout:fixed;",
        `  <tr>
${cell("&#9679;", "Prepare")}
${cell("&#9670;", "Engage")}
${cell("&#9632;", "Resolve")}
${cell("&#10003;", "Follow up")}
  </tr>`,
      );
    },
  },
  {
    id: "card-full",
    label: "Full-width card",
    category: "Cards & grids",
    description: "One wide card with accent rail.",
    render: (p) =>
      table(
        `background-color:#ffffff;border:1px solid ${HAIRLINE};border-left:4px solid ${p.base};border-radius:${RADIUS};`,
        `  <tr>
    <td style="padding:28px ${PAD};">
      <div style="${LABEL}color:${p.base};margin:0 0 10px 0;">Section</div>
      <div style="${H_BIG}">Full-width card heading</div>
      <div style="${P}">Use this block to frame a module, summarize a policy, or introduce the next section of the training.</div>
    </td>
  </tr>`,
      ),
  },
  {
    id: "card-split",
    label: "Split feature card",
    category: "Cards & grids",
    description: "Accent panel beside copy.",
    render: (p) =>
      table(
        `background-color:#ffffff;border:1px solid ${HAIRLINE};border-radius:${RADIUS};table-layout:fixed;`,
        `  <tr>
    <td valign="middle" width="34%" align="center" style="background-color:${p.base};border-radius:${RADIUS} 0 0 ${RADIUS};padding:36px 20px;">
      <div style="font-family:${FONT};font-size:30px;line-height:1.1;font-weight:700;color:${p.onBase};">01</div>
      <div style="${LABEL}color:${p.onBase};opacity:0.8;margin-top:8px;">Module</div>
    </td>
    <td valign="top" width="66%" style="padding:28px;">
      <div style="${H}">Feature or concept title</div>
      <div style="${P}">Explain the concept in two short sentences so the learner knows why this section matters.</div>
    </td>
  </tr>`,
      ),
  },
  {
    id: "card-banner",
    label: "Solid banner",
    category: "Cards & grids",
    description: "Solid accent banner for section intros.",
    render: (p) =>
      table(
        `background-color:${p.base};border-radius:${RADIUS};`,
        `  <tr>
    <td style="padding:30px;">
      <div style="${LABEL}color:${p.onBase};opacity:0.72;margin:0 0 12px 0;">Module 1</div>
      <div style="font-family:${FONT};font-size:26px;line-height:1.3;font-weight:700;color:${p.onBase};margin:0 0 10px 0;letter-spacing:-0.02em;">Banner headline for this section</div>
      <div style="${P}color:${p.onBase};opacity:0.88;">One or two sentences that set expectations for what follows.</div>
    </td>
  </tr>`,
      ),
  },
  {
    id: "card-soft-banner",
    label: "Soft banner",
    category: "Cards & grids",
    description: "Tinted intro banner with pill.",
    render: (p) =>
      table(
        `background-color:${p.bg};border:1px solid ${p.border};border-radius:${RADIUS};`,
        `  <tr>
    <td style="padding:28px;">
      <div style="margin:0 0 14px 0;">${pill(p, "New in this release")}</div>
      <div style="${H_BIG}">A calmer headline for softer sections</div>
      <div style="${P}">Use this when the banner should support the content instead of shouting over it.</div>
    </td>
  </tr>`,
      ),
  },
  {
    id: "card-profile",
    label: "Person card",
    category: "Cards & grids",
    description: "Avatar initials with role.",
    render: (p) =>
      shell(
        p,
        `  <tr>
    <td valign="top" style="width:78px;padding:22px 0 22px 22px;">${dot(p, "AB", 54)}</td>
    <td valign="top" style="padding:24px 24px 24px 16px;">
      <div style="${H}margin:0 0 4px 0;">Alex Bennett</div>
      <div style="${LABEL}color:${MUTED};margin:0 0 10px 0;">Senior Enablement Lead</div>
      <div style="${P_SM}">Short bio or the reason this person is relevant to the training.</div>
    </td>
  </tr>`,
      ),
  },
  {
    id: "accordion-look",
    label: "FAQ row",
    category: "Cards & grids",
    description: "Question and answer block.",
    render: (p) =>
      table(
        `background-color:${PAPER};border:1px solid ${HAIRLINE};border-radius:${RADIUS};`,
        `  <tr>
    <td valign="top" style="width:46px;padding:22px 0 22px 22px;font-family:${FONT};font-size:16px;font-weight:700;color:${p.base};">Q</td>
    <td valign="top" style="padding:22px 24px;">
      <div style="${H}margin:0 0 8px 0;">What question do learners ask most here?</div>
      <div style="${P}">Answer it plainly in two sentences, using the same language the learner would use.</div>
    </td>
  </tr>`,
      ),
  },

  /* ============================ CALLOUTS ============================ */
  {
    id: "callout-info",
    label: "Info callout",
    category: "Callouts",
    description: "Neutral note.",
    render: (p) =>
      callout(p, "i", "Good to know", "Add the context the learner needs before continuing."),
  },
  {
    id: "callout-tip",
    label: "Tip callout",
    category: "Callouts",
    description: "Best-practice tip.",
    render: (p) =>
      callout(
        p,
        "&#9733;",
        "Pro tip",
        "Share the shortcut or best practice experienced reps rely on.",
      ),
  },
  {
    id: "callout-warning",
    label: "Warning callout",
    category: "Callouts",
    description: "Caution block.",
    render: (p) =>
      callout(
        p,
        "!",
        "Heads up",
        "Call out the mistake to avoid and what happens if it is missed.",
      ),
  },
  {
    id: "callout-success",
    label: "Success callout",
    category: "Callouts",
    description: "Milestone confirmation.",
    render: (p) =>
      callout(
        p,
        "&#10003;",
        "You're all set",
        "Confirm what the learner has just completed and what comes next.",
      ),
  },
  {
    id: "callout-rail",
    label: "Left-rail note",
    category: "Callouts",
    description: "Minimal bar-only callout.",
    render: (p) =>
      table(
        `background-color:${PAPER};border:1px solid ${HAIRLINE};border-left:4px solid ${p.base};border-radius:${RADIUS};`,
        `  <tr><td style="padding:20px 24px;">
    <div style="${LABEL}color:${p.base};margin:0 0 6px 0;">Note</div>
    <div style="${P}color:${INK};">A quieter callout for asides that shouldn't interrupt the flow.</div>
  </td></tr>`,
      ),
  },
  {
    id: "callout-quote-tip",
    label: "Do / don't callout",
    category: "Callouts",
    description: "Green-light, red-flag pair.",
    render: (p) =>
      table(
        "table-layout:fixed;",
        `  <tr>
    <td valign="top" width="50%" style="padding:0 9px 0 0;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:separate;background-color:${p.bg};border:1px solid ${p.border};border-radius:${RADIUS};">
        <tr><td style="padding:20px 22px;">
          <div style="${LABEL}color:${p.text};margin:0 0 8px 0;">&#10003;&nbsp; Do this</div>
          <div style="${P_SM}color:${INK};">The recommended behavior with a concrete example.</div>
        </td></tr>
      </table>
    </td>
    <td valign="top" width="50%" style="padding:0 0 0 9px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:separate;background-color:#f8fafc;border:1px solid ${HAIRLINE};border-radius:${RADIUS};">
        <tr><td style="padding:20px 22px;">
          <div style="${LABEL}color:${MUTED};margin:0 0 8px 0;">&#10007;&nbsp; Not this</div>
          <div style="${P_SM}">The common mistake and why it causes problems.</div>
        </td></tr>
      </table>
    </td>
  </tr>`,
      ),
  },
  {
    id: "callout-key-takeaway",
    label: "Key takeaway",
    category: "Callouts",
    description: "Bold summary box.",
    render: (p) =>
      table(
        `background-color:${p.base};border-radius:${RADIUS};`,
        `  <tr><td style="padding:24px 26px;">
    <div style="${LABEL}color:${p.onBase};opacity:0.72;margin:0 0 10px 0;">Key takeaway</div>
    <div style="font-family:${FONT};font-size:18px;line-height:1.6;font-weight:600;color:${p.onBase};">The one sentence you want every learner to remember from this section.</div>
  </td></tr>`,
      ),
  },

  /* ============================ TEXT & LAYOUT ============================ */
  {
    id: "section-heading",
    label: "Section heading",
    category: "Text & layout",
    description: "Eyebrow, title, lead paragraph.",
    render: (p) =>
      boxed(
        `    <div style="margin:0 0 14px 0;">${pill(p, "Section 01")}</div>
    <div style="${H_BIG}margin:0 0 14px 0;">A clear heading for what comes next</div>
    <div style="width:52px;height:4px;border-radius:999px;background-color:${p.base};font-size:0;line-height:0;margin:0 0 16px 0;">&nbsp;</div>
    <div style="font-family:${FONT};font-size:16px;line-height:1.75;color:${BODY};margin:0;">A one-line lead that tells the learner what they'll be able to do by the end.</div>`,
      ),
  },
  {
    id: "blockquote",
    label: "Blockquote",
    category: "Text & layout",
    description: "Quote with attribution.",
    render: (p) =>
      table(
        `background-color:${p.bg};border:1px solid ${p.border};border-left:4px solid ${p.base};border-radius:${RADIUS};`,
        `  <tr>
    <td style="padding:24px 26px;">
      <div style="font-family:${FONT};font-size:30px;line-height:1;font-weight:700;color:${p.base};margin:0 0 6px 0;">&ldquo;</div>
      <div style="font-family:${FONT};font-size:18px;line-height:1.65;color:${INK};margin:0 0 16px 0;">Quote the customer, leader, or policy language you want learners to remember.</div>
      <div style="border-top:1px solid ${p.border};padding-top:14px;">
        <div style="font-family:${FONT};font-size:15px;font-weight:700;color:${INK};">Name</div>
        <div style="${LABEL}color:${p.text};margin-top:4px;">Title, Team</div>
      </div>
    </td>
  </tr>`,
      ),
  },
  {
    id: "quote-card",
    label: "Quote card",
    category: "Text & layout",
    description: "Quote with big quote mark.",
    render: (p) =>
      table(
        `background-color:${p.bg};border:1px solid ${p.border};border-radius:${RADIUS};`,
        `  <tr>
    <td valign="top" style="width:56px;padding:22px 0 22px 22px;font-family:Georgia,'Times New Roman',serif;font-size:38px;line-height:1;color:${p.base};">&ldquo;</td>
    <td valign="top" style="padding:28px 28px 26px 8px;">
      <div style="font-family:${FONT};font-size:17px;line-height:1.7;color:${INK};margin:0 0 14px 0;">The sentence a learner should be able to repeat back word for word.</div>
      <div style="${LABEL}color:${p.text};">Name &middot; Title</div>
    </td>
  </tr>`,
      ),
  },
  {
    id: "pull-quote",
    label: "Pull quote",
    category: "Text & layout",
    description: "Centered emphasis quote.",
    render: (p) =>
      table(
        `background-color:#ffffff;border:1px solid ${HAIRLINE};border-top:4px solid ${p.base};border-radius:${RADIUS};`,
        `  <tr>
    <td align="center" style="padding:30px 32px;">
      <div style="font-family:${FONT};font-size:22px;line-height:1.55;font-weight:600;color:${INK};letter-spacing:-0.01em;">&ldquo;The single idea you want learners to walk away repeating.&rdquo;</div>
      <div style="width:36px;height:3px;margin:18px auto 0 auto;border-radius:999px;background-color:${p.border};font-size:0;line-height:0;">&nbsp;</div>
    </td>
  </tr>`,
      ),
  },
  {
    id: "divider",
    label: "Labeled divider",
    category: "Text & layout",
    description: "Labeled rule between sections.",
    render: (p) =>
      table(
        `background-color:#ffffff;border:1px solid ${HAIRLINE};border-radius:${RADIUS};`,
        `  <tr>
    <td style="padding:24px 24px 0 24px;">
      <div style="${LABEL}color:${p.base};margin:0 0 10px 0;">Section label</div>
      <div style="border-top:1px solid ${HAIRLINE};font-size:0;line-height:0;height:0;">&nbsp;</div>
    </td>
  </tr>
  <tr><td style="height:20px;font-size:0;line-height:0;">&nbsp;</td></tr>`,
      ),
  },
  {
    id: "divider-dot",
    label: "Accent divider",
    category: "Text & layout",
    description: "Short centered accent rule.",
    render: (p) =>
      table(
        `background-color:#ffffff;border:1px solid ${HAIRLINE};border-radius:${RADIUS};`,
        `  <tr><td align="center" style="padding:24px;font-size:0;line-height:0;">
    <div style="display:inline-block;width:56px;height:3px;border-radius:2px;background-color:${p.base};">&nbsp;</div>
  </td></tr>`,
      ),
  },
  {
    id: "two-column",
    label: "Two-column text",
    category: "Text & layout",
    description: "Two labeled text columns.",
    render: (p) => {
      const col = (label: string, body: string, accent: string, tint: string, first: boolean) =>
        `    <td valign="top" width="50%" style="padding:0 ${first ? "9px" : "0"} 0 ${first ? "0" : "9px"};">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:separate;background-color:#ffffff;border:1px solid ${HAIRLINE};border-top:3px solid ${accent};border-radius:${RADIUS};">
        <tr><td style="padding:22px;">
          <div style="display:inline-block;${LABEL}color:${accent};background-color:${tint};border-radius:999px;padding:5px 11px;margin:0 0 12px 0;">${label}</div>
          <div style="${P_SM}">${body}</div>
        </td></tr>
      </table>
    </td>`;
      return table(
        "table-layout:fixed;",
        `  <tr>
${col("Do this", "Describe the recommended behavior with a concrete example.", p.base, p.bg, true)}
${col("Not this", "Describe the common mistake and why it causes problems.", BODY, "#f1f5f9", false)}
  </tr>`,
      );
    },
  },
  {
    id: "definition",
    label: "Definition block",
    category: "Text & layout",
    description: "Term with explanation.",
    render: (p) =>
      table(
        `background-color:#ffffff;border:1px solid ${HAIRLINE};border-radius:${RADIUS};`,
        `  <tr><td style="background-color:${p.bg};border-bottom:1px solid ${p.border};border-radius:${RADIUS} ${RADIUS} 0 0;padding:14px 24px;">
    <span style="font-family:${FONT};font-size:16px;font-weight:700;color:${p.text};">Term</span>
    <span style="font-family:${FONT};font-size:15px;color:${MUTED};font-style:italic;margin-left:8px;">noun</span>
  </td></tr>
  <tr><td style="padding:22px 24px;">
    <div style="${P}">The plain-language definition, written the way you'd explain it out loud.</div>
  </td></tr>`,
      ),
  },
  {
    id: "code-block",
    label: "Code / script block",
    category: "Text & layout",
    description: "Monospace snippet or talk track.",
    render: (p) =>
      table(
        `background-color:#0f172a;border-radius:${RADIUS};`,
        `  <tr><td style="padding:22px 24px;">
    <div style="${LABEL}color:${MUTED};margin:0 0 12px 0;">Say this</div>
    <div style="font-family:${MONO};font-size:14px;line-height:1.6;color:#e2e8f0;">"Thanks for holding &mdash; I've pulled up your account and I can see exactly what happened here."</div>
  </td></tr>`,
      ),
  },
  {
    id: "kv-list",
    label: "Key / value list",
    category: "Text & layout",
    description: "Label and value rows.",
    render: (p) => {
      const row = (k: string, v: string, last: boolean) => `  <tr>
    <td valign="top" width="34%" style="${LABEL}color:${p.text};background-color:${p.bg};padding:15px 16px 15px 22px;border-right:1px solid ${p.border};${last ? "" : `border-bottom:1px solid ${p.border};`}">${k}</td>
    <td valign="top" width="66%" style="${P_SM}color:${INK};padding:14px 22px;${last ? "" : `border-bottom:1px solid ${HAIRLINE};`}">${v}</td>
  </tr>`;
      return shell(
        p,
        `  <tr><td colspan="2" style="padding:15px 22px;border-bottom:1px solid ${HAIRLINE};">
    <div style="${LABEL}color:${p.base};">At a glance</div>
  </td></tr>
${[
  row("Owner", "Enablement team", false),
  row("Audience", "New hires, weeks 1–2", false),
  row("Time", "About 15 minutes", true),
].join("\n")}`,
        "table-layout:fixed;",
      );
    },
  },

  /* ============================ DATA & TABLES ============================ */
  {
    id: "fact-strip",
    label: "Stat strip",
    category: "Tables & data",
    description: "Three stats side by side.",
    render: (p) => {
      const cell = (v: string, l: string, last: boolean) =>
        `    <td align="center" valign="top" width="33.33%" style="padding:26px 16px;${last ? "" : `border-right:1px solid ${HAIRLINE};`}">
      <div style="font-family:${FONT};font-size:30px;line-height:1.15;font-weight:700;color:${p.base};letter-spacing:0;">${v}</div>
      <div style="${LABEL}color:${MUTED};margin-top:8px;">${l}</div>
    </td>`;
      return table(
        `background-color:#ffffff;border:1px solid ${HAIRLINE};border-radius:${RADIUS};table-layout:fixed;`,
        `  <tr>
${cell("92%", "Completion", false)}
${cell("15 min", "Average time", false)}
${cell("3", "Required steps", true)}
  </tr>`,
      );
    },
  },
  {
    id: "stat-tiles",
    label: "Stat tiles",
    category: "Tables & data",
    gallery: false,
    description: "Three tinted metric tiles.",
    render: (p) => {
      const tile = (
        v: string,
        l: string,
      ) => `    <td valign="top" width="33.33%" style="padding:0 8px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:separate;background-color:${p.bg};border:1px solid ${p.border};border-radius:${RADIUS};">
        <tr><td style="padding:22px;">
          <div style="font-family:${FONT};font-size:28px;line-height:1.1;font-weight:700;color:${p.text};letter-spacing:-0.02em;">${v}</div>
          <div style="${LABEL}color:${p.base};margin-top:10px;">${l}</div>
        </td></tr>
      </table>
    </td>`;
      return table(
        "table-layout:fixed;",
        `  <tr>\n${tile("4.8", "CSAT")}\n${tile("< 2h", "First reply")}\n${tile("+18%", "Retention")}\n  </tr>`,
      );
    },
  },
  {
    id: "table-simple",
    label: "Comparison table",
    category: "Tables & data",
    description: "Header row plus three rows.",
    render: (p) => {
      const th = (t: string, first: boolean) =>
        `      <td style="${LABEL}color:${p.onBase};padding:14px ${first ? "22px" : "16px"};background-color:${p.base};${first ? `border-radius:${RADIUS} 0 0 0;` : ""}">${t}</td>`;
      const td = (t: string, first: boolean, last: boolean) =>
        `      <td style="${P_SM}color:${INK};padding:14px ${first ? "22px" : "16px"};${last ? "" : `border-bottom:1px solid ${HAIRLINE};`}">${t}</td>`;
      const row = (a: string, b: string, c: string, last: boolean) =>
        `  <tr>\n${td(a, true, last)}\n${td(b, false, last)}\n${td(c, false, last)}\n  </tr>`;
      return table(
        `background-color:#ffffff;border:1px solid ${HAIRLINE};border-radius:${RADIUS};table-layout:fixed;`,
        `  <tr>
${th("Scenario", true)}
${th("What to say", false)}
${th("Escalate?", false)}
  </tr>
${row("Billing dispute", "Confirm the charge date first.", "No", false)}
${row("Outage report", "Acknowledge and set a callback.", "Yes", false)}
${row("Cancellation", "Ask the reason before offering.", "Sometimes", true)}`,
      );
    },
  },
  {
    id: "progress-bar",
    label: "Progress meter",
    category: "Tables & data",
    description: "Labeled percentage bar.",
    render: (p) =>
      shell(
        p,
        `  <tr><td style="padding:22px 24px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
      <tr>
        <td style="${LABEL}color:${MUTED};">Module progress</td>
        <td align="right" style="font-family:${FONT};font-size:15px;font-weight:700;color:${p.base};">70%</td>
      </tr>
    </table>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;margin-top:12px;background-color:${p.bg};border-radius:999px;">
      <tr>
        <td width="70%" style="height:10px;font-size:0;line-height:0;background-color:${p.base};border-radius:999px;">&nbsp;</td>
        <td width="30%" style="height:10px;font-size:0;line-height:0;">&nbsp;</td>
      </tr>
    </table>
  </td></tr>`,
      ),
  },
  {
    id: "scorecard",
    label: "Criteria scorecard",
    category: "Tables & data",
    description: "Rows with pass badges.",
    render: (p) => {
      const row = (t: string, v: string, last: boolean) => `  <tr>
    <td valign="middle" style="${P_SM}color:${INK};padding:14px 16px 14px 22px;${last ? "" : `border-bottom:1px solid ${HAIRLINE};`}">${t}</td>
    <td valign="middle" align="right" style="padding:12px 22px 12px 0;${last ? "" : `border-bottom:1px solid ${HAIRLINE};`}">${pill(p, v)}</td>
  </tr>`;
      return shell(
        p,
        `  <tr>
    <td style="${LABEL}color:${p.onBase};background-color:${p.base};padding:14px 22px;border-radius:${RADIUS} 0 0 0;">Criteria</td>
    <td align="right" style="${LABEL}color:${p.onBase};background-color:${p.base};padding:14px 22px;border-radius:0 ${RADIUS} 0 0;">Status</td>
  </tr>
${[
  row("Verified the customer identity", "Required", false),
  row("Summarized the resolution", "Required", false),
  row("Offered the follow-up survey", "Optional", true),
].join("\n")}`,
      );
    },
  },

  /* ============================ MEDIA & CTA ============================ */
  {
    id: "cta-button",
    label: "Button",
    category: "Media & CTA",
    description: "Single accent button.",
    render: (p) =>
      table(
        "",
        `  <tr><td>
    <a href="#" style="display:inline-block;font-family:${FONT};font-size:15px;font-weight:600;line-height:1;color:${p.onBase};background-color:${p.base};text-decoration:none;padding:14px 26px;border-radius:10px;">Open the resource</a>
  </td></tr>`,
      ),
  },
  {
    id: "cta-outline",
    label: "Outline button",
    category: "Media & CTA",
    description: "Secondary bordered button.",
    render: (p) =>
      table(
        "",
        `  <tr><td>
    <a href="#" style="display:inline-block;font-family:${FONT};font-size:15px;font-weight:600;line-height:1;color:${p.text};background-color:#ffffff;text-decoration:none;padding:13px 25px;border:1.5px solid ${p.base};border-radius:10px;">View the checklist</a>
  </td></tr>`,
      ),
  },
  {
    id: "cta-panel",
    label: "CTA panel",
    category: "Media & CTA",
    description: "Copy plus button in a card.",
    render: (p) =>
      table(
        `background-color:${p.bg};border:1px solid ${p.border};border-radius:${RADIUS};table-layout:fixed;`,
        `  <tr>
    <td valign="middle" width="64%" style="padding:26px 0 26px 26px;">
      <div style="${H}margin:0 0 6px 0;">Ready to put this into practice?</div>
      <div style="${P_SM}color:${INK};">Open the worksheet and complete it before the next section.</div>
    </td>
    <td valign="middle" width="36%" align="right" style="padding:26px 26px 26px 12px;">
      <a href="#" style="display:inline-block;font-family:${FONT};font-size:15px;font-weight:600;line-height:1;color:${p.onBase};background-color:${p.base};text-decoration:none;padding:13px 22px;border-radius:10px;">Start now</a>
    </td>
  </tr>`,
      ),
  },
  {
    id: "resource-link",
    label: "Resource link row",
    category: "Media & CTA",
    description: "Document link with meta.",
    render: (p) =>
      shell(
        p,
        `  <tr>
    <td valign="middle" style="width:64px;padding:18px 0 18px 20px;">${softDot(p, "&#8681;", 38)}</td>
    <td valign="middle" style="padding:18px 12px;">
      <div style="font-family:${FONT};font-size:15px;font-weight:600;color:${INK};margin:0 0 3px 0;">Objection handling one-pager</div>
      <div style="${LABEL}color:${MUTED};">PDF &middot; 2 pages</div>
    </td>
    <td valign="middle" align="right" style="padding:18px 22px 18px 0;">
      <a href="#" style="font-family:${FONT};font-size:15px;font-weight:600;color:${p.base};text-decoration:none;">Open &rarr;</a>
    </td>
  </tr>`,
      ),
  },
  {
    id: "video-placeholder",
    label: "Video placeholder",
    category: "Media & CTA",
    description: "Play-marked media frame.",
    render: (p) =>
      table(
        `background-color:#ffffff;border:1px solid ${HAIRLINE};border-radius:${RADIUS};`,
        `  <tr><td align="center" style="background-color:${p.text};border-radius:${RADIUS} ${RADIUS} 0 0;padding:44px 24px;">
    <div style="width:58px;height:58px;line-height:58px;margin:0 auto;text-align:center;border-radius:29px;background-color:${p.base};color:${p.onBase};font-family:${FONT};font-size:20px;">&#9654;</div>
  </td></tr>
  <tr><td style="padding:20px 24px;">
    <div style="${H}margin:0 0 6px 0;">Watch: handling the tough call</div>
    <div style="${LABEL}color:${p.base};">4 min &middot; Required</div>
  </td></tr>`,
      ),
  },
  {
    id: "image-caption",
    label: "Image with caption",
    category: "Media & CTA",
    description: "Image slot plus caption rule.",
    render: (p) =>
      table(
        `background-color:#ffffff;border:1px solid ${HAIRLINE};border-radius:${RADIUS};`,
        `  <tr><td style="padding:0;">
    <img src="https://placehold.co/1200x600/e2e8f0/64748b?text=Replace+this+image" alt="Describe the image" width="100%" style="display:block;width:100%;max-width:100%;border-radius:${RADIUS} ${RADIUS} 0 0;" />
  </td></tr>
  <tr><td style="padding:18px 22px;border-top:1px solid ${HAIRLINE};">
    <div style="${LABEL}color:${p.base};margin:0 0 6px 0;">Figure 1</div>
    <div style="${P_SM}">Caption explaining what the learner should notice in this image.</div>
  </td></tr>`,
      ),
  },

  /* ==================== DARK TITLE + PLAIN DESCRIPTION ==================== */
  {
    id: "darkhead-open",
    label: "Dark title + open text",
    category: "Cards & grids",
    description: "Solid dark header over plain body copy.",
    render: (p) =>
      table(
        `background-color:#ffffff;border:1px solid ${HAIRLINE};border-radius:${RADIUS};`,
        `  <tr><td style="background-color:${p.text};border-radius:${RADIUS} ${RADIUS} 0 0;padding:18px 24px;">
    <div style="font-family:${FONT};font-size:17px;font-weight:700;line-height:1.35;color:#ffffff;letter-spacing:-0.01em;">Handling the escalation</div>
  </td></tr>
  <tr><td style="padding:22px 24px;">
    <div style="${P}">Confirm what the customer has already tried, restate the issue in your own words, then explain the next step and the timeline. Keep the update short and specific.</div>
  </td></tr>`,
      ),
  },
  {
    id: "darkhead-boxed",
    label: "Dark title + outlined box",
    category: "Cards & grids",
    description: "Dark header bar joined to a hairline body box.",
    render: (p) =>
      table(
        `border:1px solid ${HAIRLINE};border-radius:${RADIUS};background-color:#ffffff;`,
        `  <tr><td style="background-color:${p.text};border-radius:${RADIUS} ${RADIUS} 0 0;padding:16px 24px;">
    <div style="${LABEL}color:${p.bg};margin:0 0 4px 0;">Section 02</div>
    <div style="font-family:${FONT};font-size:17px;font-weight:700;line-height:1.35;color:#ffffff;">What good looks like</div>
  </td></tr>
  <tr><td style="padding:22px 24px;">
    <div style="${P}">A strong response names the impact, gives one concrete next action, and ends with a check for understanding.</div>
  </td></tr>`,
      ),
  },
  {
    id: "darkhead-eyebrow",
    label: "Dark title + eyebrow",
    category: "Cards & grids",
    description: "Eyebrow label inside a dark header, open description below.",
    render: (p) =>
      table(
        `background-color:#ffffff;border:1px solid ${HAIRLINE};border-radius:${RADIUS};`,
        `  <tr><td style="background-color:${p.base};border-radius:${RADIUS} ${RADIUS} 0 0;padding:20px 24px;">
    <div style="${LABEL}color:${p.onBase};opacity:0.8;margin:0 0 6px 0;">Before you start</div>
    <div style="font-family:${FONT};font-size:20px;font-weight:700;line-height:1.3;color:${p.onBase};letter-spacing:-0.02em;">Set up your workspace</div>
  </td></tr>
  <tr><td style="padding:22px 24px;">
    <div style="${P}">Open the CRM, the knowledge base, and the call script side by side so you never leave the customer waiting while you search.</div>
  </td></tr>`,
      ),
  },
  {
    id: "darkhead-two-col",
    label: "Dark title + two columns",
    category: "Cards & grids",
    description: "Dark header over a two-column open description.",
    render: (p) =>
      table(
        `table-layout:fixed;background-color:#ffffff;border:1px solid ${HAIRLINE};border-radius:${RADIUS};`,
        `  <tr><td colspan="2" style="background-color:${p.text};border-radius:${RADIUS} ${RADIUS} 0 0;padding:18px 24px;">
    <div style="font-family:${FONT};font-size:17px;font-weight:700;line-height:1.35;color:#ffffff;">Policy overview</div>
  </td></tr>
  <tr>
    <td valign="top" width="50%" style="padding:22px 18px 22px 24px;border-right:1px solid ${HAIRLINE};"><div style="${P_SM}">Refunds inside 30 days are automatic and need no approval. Log the reason code so reporting stays clean.</div></td>
    <td valign="top" width="50%" style="padding:22px 24px 22px 18px;"><div style="${P_SM}">Anything past 30 days needs a manager review. Set expectations with the customer before you promise a date.</div></td>
  </tr>`,
      ),
  },
  {
    id: "darkhead-numbered",
    label: "Dark numbered section",
    category: "Cards & grids",
    description: "Numbered dark header with plain body text.",
    render: (p) =>
      table(
        `background-color:#ffffff;border:1px solid ${HAIRLINE};border-radius:${RADIUS};`,
        `  <tr><td style="background-color:${p.text};border-radius:${RADIUS} ${RADIUS} 0 0;padding:0;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
      <tr>
        <td valign="middle" width="72" style="padding:18px 0 18px 24px;font-family:${FONT};font-size:26px;font-weight:700;color:${p.base};letter-spacing:-0.03em;">01</td>
        <td valign="middle" style="padding:18px 24px 18px 0;font-family:${FONT};font-size:17px;font-weight:700;color:#ffffff;">Discovery call</td>
      </tr>
    </table>
  </td></tr>
  <tr><td style="padding:22px 24px;">
    <div style="${P}">Spend the first five minutes listening. Capture the customer's own words for the problem — you will reuse them in the proposal.</div>
  </td></tr>`,
      ),
  },

  /* ============================ HEADLINES ============================ */
  {
    id: "headline-underline",
    label: "Display headline",
    category: "Headlines",
    description: "Large headline card with an accent underline rule.",
    render: (p) =>
      table(
        `background-color:#ffffff;border:1px solid ${HAIRLINE};border-top:4px solid ${p.base};border-radius:${RADIUS};`,
        `  <tr><td style="padding:28px 26px;">
    <div style="font-family:${FONT};font-size:24px;line-height:1.25;font-weight:700;color:${INK};letter-spacing:0;margin:0 0 14px 0;">Coaching conversations that stick</div>
    <div style="width:64px;height:5px;font-size:0;line-height:0;background-color:${p.base};border-radius:999px;">&nbsp;</div>
  </td></tr>`,
      ),
  },
  {
    id: "headline-deck",
    label: "Eyebrow + headline + deck",
    category: "Headlines",
    description: "Label chip, headline and short intro paragraph in a card.",
    render: (p) =>
      boxed(
        `    <div style="margin:0 0 14px 0;">${pill(p, "Module 3")}</div>
    <div style="${H_BIG}margin:0 0 12px 0;">Turning objections into questions</div>
    <div style="${P}">By the end of this module you will be able to reframe the three most common objections without sounding defensive.</div>`,
        "",
        "30px 28px",
      ),
  },
  {
    id: "headline-centered",
    label: "Centered headline",
    category: "Headlines",
    description: "Centered title on a tinted card with accent rules.",
    render: (p) =>
      table(
        `background-color:${p.bg};border:1px solid ${p.border};border-radius:${RADIUS};`,
        `  <tr><td align="center" style="padding:30px 26px;">
    <div style="width:40px;height:3px;margin:0 auto 18px auto;font-size:0;line-height:0;background-color:${p.base};border-radius:999px;">&nbsp;</div>
    <div style="${H_BIG}">The three-part close</div>
    <div style="${LABEL}color:${p.text};margin-top:12px;">Practice section</div>
  </td></tr>`,
      ),
  },
  {
    id: "headline-bar",
    label: "Headline with accent bar",
    category: "Headlines",
    description: "Vertical accent bar down the edge of a bordered card.",
    render: (p) =>
      table(
        `background-color:#ffffff;border:1px solid ${HAIRLINE};border-left:6px solid ${p.base};border-radius:${RADIUS};`,
        `  <tr>
    <td style="padding:24px 26px;">
      <div style="${H_BIG}margin:0 0 8px 0;">What we cover today</div>
      <div style="${P_SM}">Four scenarios, one scorecard, and a short practice round with a partner.</div>
    </td>
  </tr>`,
      ),
  },
  {
    id: "headline-banner",
    label: "Dark headline banner",
    category: "Headlines",
    description: "Full-width dark banner headline.",
    render: (p) =>
      table(
        `background-color:${p.text};border:1px solid ${p.text};border-radius:${RADIUS};`,
        `  <tr><td style="padding:30px 26px;">
    <div style="${LABEL}color:${p.base};margin:0 0 10px 0;">Welcome</div>
    <div style="font-family:${FONT};font-size:24px;line-height:1.25;font-weight:700;color:#ffffff;letter-spacing:0;margin:0 0 12px 0;">Your first 30 days on support</div>
    <div style="font-family:${FONT};font-size:15px;line-height:1.7;color:#cbd5e1;margin:0;">What to expect each week, who to ask for help, and how you'll be certified.</div>
  </td></tr>`,
      ),
  },
  {
    id: "headline-kicker",
    label: "Section marker",
    category: "Headlines",
    description: "Numbered marker card that opens a new section.",
    render: (p) =>
      table(
        `background-color:#ffffff;border:1px solid ${HAIRLINE};border-radius:${RADIUS};`,
        `  <tr>
    <td valign="middle" style="width:74px;padding:20px 0 20px 22px;">${dot(p, "3", 40)}</td>
    <td valign="middle" style="padding:20px 24px 20px 16px;">
      <div style="${LABEL}color:${p.base};margin:0 0 5px 0;">In this section</div>
      <div style="font-family:${FONT};font-size:19px;line-height:1.3;font-weight:700;color:${INK};letter-spacing:0;">Escalation paths and timing</div>
    </td>
  </tr>`,
      ),
  },

  /* ============================ MORE TABLES ============================ */
  {
    id: "table-striped",
    label: "Striped table",
    category: "Tables & data",
    gallery: false,
    description: "Dark header row with zebra striping.",
    render: (p) => {
      const th = (t: string, first: boolean) =>
        `      <td style="${LABEL}color:#ffffff;padding:14px ${first ? "22px" : "16px"};background-color:${p.text};">${t}</td>`;
      const row = (cells: string[], i: number) =>
        `  <tr>${cells
          .map(
            (c, j) =>
              `<td style="${P_SM}color:${INK};padding:13px ${j === 0 ? "22px" : "16px"};background-color:${i % 2 ? "#ffffff" : PAPER};">${c}</td>`,
          )
          .join("")}</tr>`;
      return table(
        `background-color:#ffffff;border:1px solid ${HAIRLINE};border-radius:${RADIUS};table-layout:fixed;`,
        `  <tr>\n${th("Stage", true)}\n${th("Owner", false)}\n${th("Due", false)}\n  </tr>
${row(["Kickoff", "Manager", "Day 1"], 0)}
${row(["Shadowing", "Buddy", "Day 3"], 1)}
${row(["Certification", "Trainer", "Day 10"], 2)}`,
      );
    },
  },
  {
    id: "table-bordered",
    label: "Bordered grid table",
    category: "Tables & data",
    gallery: false,
    description: "Every cell outlined, tinted header.",
    render: (p) => {
      const cell = (t: string, head: boolean) =>
        `<td style="${head ? `${LABEL}color:${p.text};background-color:${p.bg};` : `${P_SM}color:${INK};`}padding:12px 16px;border:1px solid ${head ? p.border : HAIRLINE};">${t}</td>`;
      return table(
        "table-layout:fixed;border-collapse:collapse;",
        `  <tr>${cell("Metric", true)}${cell("Target", true)}${cell("Actual", true)}</tr>
  <tr>${cell("First response", false)}${cell("< 2h", false)}${cell("1h 40m", false)}</tr>
  <tr>${cell("Resolution", false)}${cell("< 24h", false)}${cell("21h", false)}</tr>
  <tr>${cell("CSAT", false)}${cell("4.5", false)}${cell("4.8", false)}</tr>`,
      );
    },
  },
  {
    id: "table-minimal",
    label: "Minimal rule table",
    category: "Tables & data",
    gallery: false,
    description: "Hairline row rules, no header fill.",
    render: (p) => {
      const row = (a: string, b: string, head = false) =>
        `  <tr>
    <td style="${head ? `${LABEL}color:${MUTED};` : `${P_SM}color:${INK};`}padding:13px 0;border-bottom:1px solid ${HAIRLINE};">${a}</td>
    <td align="right" style="${head ? `${LABEL}color:${MUTED};` : `font-family:${FONT};font-size:15px;font-weight:600;color:${p.base};`}padding:13px 0;border-bottom:1px solid ${HAIRLINE};">${b}</td>
  </tr>`;
      return table(
        "table-layout:fixed;border-collapse:collapse;",
        [
          row("Topic", "Time", true),
          row("Product tour", "15 min"),
          row("Live practice", "25 min"),
          row("Q&amp;A", "10 min"),
        ].join("\n"),
      );
    },
  },
  {
    id: "table-specs",
    label: "Spec table",
    category: "Tables & data",
    gallery: false,
    description: "Bold label column beside values.",
    render: (p) => {
      const row = (k: string, v: string, last: boolean) => `  <tr>
    <td valign="top" width="34%" style="${LABEL}color:${p.text};background-color:${p.bg};padding:14px 18px;${last ? `border-radius:0 0 0 ${RADIUS};` : `border-bottom:1px solid ${p.border};`}">${k}</td>
    <td valign="top" style="${P_SM}color:${INK};padding:14px 20px;${last ? "" : `border-bottom:1px solid ${HAIRLINE};`}">${v}</td>
  </tr>`;
      return table(
        `background-color:#ffffff;border:1px solid ${HAIRLINE};border-radius:${RADIUS};table-layout:fixed;`,
        [
          row("Audience", "New hires in their first two weeks", false),
          row("Format", "Self-paced with one live practice call", false),
          row("Assessment", "Scorecard signed off by a manager", true),
        ].join("\n"),
      );
    },
  },
  {
    id: "table-recommended",
    label: "Table with highlight column",
    category: "Tables & data",
    gallery: false,
    description: "One column marked as recommended.",
    render: (p) => {
      const head = (t: string, hi: boolean) =>
        `<td align="${hi ? "center" : "left"}" style="${LABEL}color:${hi ? p.onBase : MUTED};background-color:${hi ? p.base : "transparent"};padding:14px 16px;${hi ? `border-radius:${RADIUS} ${RADIUS} 0 0;` : ""}">${t}</td>`;
      const cell = (t: string, hi: boolean, last: boolean) =>
        `<td align="${hi ? "center" : "left"}" style="${P_SM}color:${INK};padding:13px 16px;background-color:${hi ? p.bg : "transparent"};${last ? "" : `border-bottom:1px solid ${HAIRLINE};`}">${t}</td>`;
      return table(
        "table-layout:fixed;border-collapse:collapse;",
        `  <tr>${head("Plan", false)}${head("Standard", false)}${head("Recommended", true)}</tr>
  <tr>${cell("Live coaching", false, false)}${cell("&mdash;", false, false)}${cell("Weekly", true, false)}</tr>
  <tr>${cell("Practice calls", false, false)}${cell("1", false, false)}${cell("4", true, false)}</tr>
  <tr>${cell("Certification", false, true)}${cell("Optional", false, true)}${cell("Included", true, true)}</tr>`,
      );
    },
  },

  /* ============================ MULTICOLOR ============================ */
  {
    id: "two-color-compare",
    label: "Two-color comparison",
    category: "Cards & grids",
    description: "Do / Don't panels in two different accents.",
    multicolor: true,
    render: (p, alt) => {
      const panel = (c: Palette, title: string, items: string[], side: "l" | "r") =>
        `    <td valign="top" width="50%" style="padding:0 ${side === "l" ? "9px" : "0"} 0 ${side === "l" ? "0" : "9px"};">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:separate;background-color:${c.bg};border:1px solid ${c.border};border-radius:${RADIUS};">
        <tr><td style="background-color:${c.base};border-radius:${RADIUS} ${RADIUS} 0 0;padding:12px 18px;"><div style="${LABEL}color:${c.onBase};">${title}</div></td></tr>
        <tr><td style="padding:16px 18px 18px 18px;">
          ${items.map((i) => `<div style="${P_SM}color:${INK};margin:0 0 8px 0;">&bull;&nbsp; ${i}</div>`).join("\n          ")}
        </td></tr>
      </table>
    </td>`;
      return table(
        "table-layout:fixed;",
        `  <tr>
${panel(p, "Do", ["Name the impact first", "Offer one clear next step", "Confirm understanding"], "l")}
${panel(alt[0], "Don't", ["Lead with policy language", "Stack three asks at once", "End without a recap"], "r")}
  </tr>`,
      );
    },
  },
  {
    id: "two-color-split-callout",
    label: "Two-color split callout",
    category: "Callouts",
    description: "Before / after halves in contrasting accents.",
    multicolor: true,
    render: (p, alt) => {
      const half = (c: Palette, label: string, body: string, first: boolean) =>
        `    <td valign="top" width="50%" style="background-color:${c.bg};border:1px solid ${c.border};${first ? `border-right:0;border-radius:${RADIUS} 0 0 ${RADIUS};` : `border-radius:0 ${RADIUS} ${RADIUS} 0;`}padding:20px 22px;">
      <div style="${LABEL}color:${c.text};margin:0 0 8px 0;">${label}</div>
      <div style="${P_SM}color:${INK};">${body}</div>
    </td>`;
      return table(
        "table-layout:fixed;border-collapse:collapse;",
        `  <tr>
${half(p, "Before", "\u201cI can't do anything about that, it's the policy.\u201d", true)}
${half(alt[0], "After", "\u201cHere's what I can do today, and what I'll escalate for you.\u201d", false)}
  </tr>`,
      );
    },
  },
  {
    id: "three-color-phases",
    label: "Three-color phase strip",
    category: "Steps & lists",
    description: "Three phases, each with its own accent.",
    multicolor: true,
    render: (p, alt) => {
      const phase = (c: Palette, n: string, title: string, body: string, pos: number) =>
        `    <td valign="top" width="33.33%" style="padding:0 ${pos === 2 ? "0" : "8px"} 0 ${pos === 0 ? "0" : "8px"};">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:separate;background-color:#ffffff;border:1px solid ${c.border};border-radius:${RADIUS};">
        <tr><td style="height:5px;font-size:0;line-height:0;background-color:${c.base};border-radius:${RADIUS} ${RADIUS} 0 0;">&nbsp;</td></tr>
        <tr><td style="padding:18px 18px 20px 18px;">
          <div style="${LABEL}color:${c.base};margin:0 0 8px 0;">Phase ${n}</div>
          <div style="${H}font-size:16px;">${title}</div>
          <div style="${P_SM}">${body}</div>
        </td></tr>
      </table>
    </td>`;
      return table(
        "table-layout:fixed;",
        `  <tr>
${phase(p, "1", "Learn", "Work through the module and take notes.", 0)}
${phase(alt[0], "2", "Practice", "Run two role plays with your buddy.", 1)}
${phase(alt[1], "3", "Apply", "Handle live calls with coaching support.", 2)}
  </tr>`,
      );
    },
  },
  {
    id: "two-color-stats",
    label: "Two-color stat pair",
    category: "Tables & data",
    description: "Two metrics in contrasting accents.",
    multicolor: true,
    render: (p, alt) => {
      const tile = (c: Palette, v: string, l: string, note: string, first: boolean) =>
        `    <td valign="top" width="50%" style="padding:0 ${first ? "9px" : "0"} 0 ${first ? "0" : "9px"};">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:separate;background-color:${c.bg};border:1px solid ${c.border};border-radius:${RADIUS};">
        <tr><td style="padding:24px;">
          <div style="font-family:${FONT};font-size:30px;line-height:1.1;font-weight:700;color:${c.text};letter-spacing:0;">${v}</div>
          <div style="${LABEL}color:${c.base};margin:12px 0 8px 0;">${l}</div>
          <div style="${P_SM}">${note}</div>
        </td></tr>
      </table>
    </td>`;
      return table(
        "table-layout:fixed;",
        `  <tr>
${tile(p, "92%", "Resolved first contact", "Up from 84% last quarter.", true)}
${tile(alt[0], "3.1", "Average handle time", "Target is under 4 minutes.", false)}
  </tr>`,
      );
    },
  },
  {
    id: "table-two-color-compare",
    label: "Two-color comparison table",
    category: "Tables & data",
    description: "Feature rows with two differently tinted option columns.",
    multicolor: true,
    render: (p, alt) => {
      const b = alt[0];
      if (!b) return "";
      const head = (t: string, c?: Palette) =>
        `<td align="${c ? "center" : "left"}" style="${LABEL}color:${c ? c.onBase : MUTED};background-color:${c ? c.base : "transparent"};padding:14px 16px;">${t}</td>`;
      const cell = (t: string, c?: Palette, last = false) =>
        `<td align="${c ? "center" : "left"}" style="${P_SM}color:${INK};background-color:${c ? c.bg : "transparent"};padding:13px 16px;${last ? "" : `border-bottom:1px solid ${c ? c.border : HAIRLINE};`}">${t}</td>`;
      return table(
        "table-layout:fixed;border-collapse:collapse;",
        `  <tr>${head("Capability")}${head("Self-serve", p)}${head("Guided", b)}</tr>
  <tr>${cell("Setup time")}${cell("1 day", p)}${cell("1 week", b)}</tr>
  <tr>${cell("Coaching")}${cell("Async only", p)}${cell("Live weekly", b)}</tr>
  <tr>${cell("Best for", undefined, true)}${cell("Experienced reps", p, true)}${cell("New hires", b, true)}</tr>`,
      );
    },
  },
  ...EXTRA_SNIPPETS,
  ...TABLE_SNIPPETS,
  ...CARD_SNIPPETS,
  ...TOOL_SNIPPETS,
];

export const CATEGORIES: SnippetCategory[] = [
  "Steps & lists",
  "Cards & grids",
  "Callouts",
  "Headlines",
  "Text & layout",
  "Tables & data",
  "Media & CTA",
  "Tools & process",
];

export function getSnippet(id: string) {
  return SNIPPETS.find((s) => s.id === id);
}

/** Stable catalog numbers so library blocks can be referenced by number. */
const CATALOG = new Map<string, string>(
  SNIPPETS.filter((s) => s.gallery !== false).map((s, i) => [
    s.id,
    `L-${String(i + 1).padStart(2, "0")}`,
  ]),
);

export function catalogRef(id: string): string | undefined {
  return CATALOG.get(id);
}

export function renderSnippet(id: string, colors: (string | undefined)[]): string {
  const s = getSnippet(id);
  if (!s) return "";
  const [primary, alt] = buildPalettes(colors);
  return s.render(primary, alt);
}
