# Process Canvas

Project Outline: Local-First Process Mapping & Mockup PWAA zero-build, local-first Progressive Web App (PWA) designed to visually plan, map, and document customer support operations and communication workflows. It combines visual mockup editors for Zendesk and Slack with structured operational rules, generic instruction checklists, and logic-branching nodes, saving progress directly to local folders as portable Markdown files.1. Core Architecture & Technology StackTo ensure security, offline capability, high performance, and zero dependency build steps, the app is engineered purely around modern web standards:Frontend Core: Vanilla HTML5, CSS3, and JavaScript (ES6+).Component Model: Vanilla Web Components (without Shadow DOM to ensure global stylesheet utility integration).CSS Engine:Tailwind CSS (via CDN): Used for layout alignment, app chrome, workspace panels, and utility alignment.Zendesk Garden CSS Components: Official @zendeskgarden/css-components loaded via unpkg to render native-looking tickets, tags, triggers, and forms.Slack Community CSS Styles: Custom embedded stylesheets to replicate Slack's exact message layout, margins, and typography.Local Storage & Syncing: File System Access API (showDirectoryPicker()) for direct local folder reading and writing of Markdown files.Build/Compilation Step: None. The PWA runs directly from browser execution.2. Workspace Modes & User Interface LayoutThe workspace is split into a multi-panel layout operating on a tri-state configuration toggle.App Shell StructureLeft Sidebar: Directory Tree Explorer (lists .md files in the loaded folder) + Slack JSON Import Drop Zone.Central Canvas: The living document container where components are rendered, ordered, and modified.Right Control Drawer: Block Palette containing draggable/clickable cards ([+ Zendesk Ticket], [+ Slack Message], [+ Manual Instruction], [+ Logic Decision], etc.) to append blocks to the canvas.Top Bar: File Name banner, Sync Status indicators, Workspace Mode Switcher (Edit / View / Run), and the Export Menu.Workspace ModesEdit Mode:The Block Palette is fully visible.Interactive canvas components show design-time dashed borders and hover action controls (Delete, Move Up, Move Down).All text zones within the blocks have contenteditable="true" active, letting the user type directly onto the mockups and instructions.View Mode (Presentation Mode):All design-time frames, drawers, and buttons disappear.The canvas renders as a polished, read-only operational manual.All components show their fully expanded layout forms for standard reading.Run Mode (Interactive Checklist & Simulation Mode):The document operates as a functional playbook.Standard instruction nodes show interactive checklists that agents can check off as they complete tasks.Logic Decision nodes act as interactive gateways: selecting an option dynamically displays the respective logical path and hides unrelated downstream steps, allowing users to visually simulate the entire operational run.3. Mockup Components Design StandardsTo make process maps visually distinct, elements are divided into platform-specific mockups and platform-agnostic logical steps.A. Platform-Agnostic / Core Process BlocksManual Instruction Node (<core-instruction>):Visuals: Clean white card with a left-aligned green border, checklist icons, and bullet alignments.Behavior: For human-driven steps (e.g., "Verify customer ID in admin console"). Supports interactive checkbox tracking in Run mode.Logical Decision Split (<logic-decision>):Visuals: A split-branch card with a bright purple accent. Displays a clear conditional question at the top (e.g., "Is the database offline?") and multiple visual action pathways below.Behavior: In Run mode, clicking a branch (e.g., "YES" or "NO") highlights the active operational path and hides unrelated workflow steps.External Integration Webhook (<external-action>):Visuals: Compact slate-gray terminal card showing an outgoing endpoint (e.g., POST https://api.jira.com/v1/issue) or secondary tool name (e.g., PagerDuty, Salesforce).Behavior: Standardizes system handoffs outside Zendesk and Slack.B. Zendesk Garden ElementsZendesk Ticket: Emulates the agent interface with a tab structure, status dropdowns, priority markers, and requester headers.Zendesk Internal Note: Highlighted by a signature light yellow background (#fff9e6) and a gold-tinted left border flag to visually separate internally documented steps from customer replies.Zendesk Trigger / Automation: Layout blocks displaying WHEN/IF conditions on the left and automated THEN actions on the right, wrapped in a light-blue border (#edf7ed / #1f73b7).Zendesk Macro: Dashed border container displaying automated ticket modifications (e.g., setting a status or applying specific rounded tag pills).C. Slack Block Kit ElementsSlack Message: Standard white chat box with #1d1c1d text and a left-aligned custom avatar. Spacing is strictly set to Slack's $16\text{px}$ padding and $8\text{px}$ margin rhythms.Slack Thread Wrapper: A nested, indented timeline container displaying responses linked underneath a primary message card.Interactive Slack Actions: Mimics official Block Kit action elements including buttons, date-pickers, and static dropdowns that respond to clicks.4. Key Feature Implementation SpecificationsFeature A: Local-First Version Control TimelineObjective: Track visual changes without a backend database.Implementation: Whenever the user saves a file, the system runs a fast line-by-line diff algorithm against the existing local disk file. Instead of overwriting history, the app appends the calculated delta snapshots as JSON strings inside a hidden front matter array key: _history: [...].User Interface: A history slider is made available in the drawer. Moving the slider dynamically renders past versions of the canvas components to let users visually see what was edited, deleted, or added over time.Feature B: Interactive Run Mode (Checklist & Simulation Engine)Objective: Turn static documentation into an actionable simulation tool.Implementation: In Run Mode, state variables control node visibility. Connecting metadata properties (such as target IDs) bind interactive steps.User Experience: Clicking an interactive choice button (e.g., "Mark Ticket as Spam" inside a Zendesk Macro, or "Acknowledge" inside a Slack Block Kit mockup) triggers structural transitions on the canvas—revealing the specific designated logical child step and dimming out unused alternative routes. Checklist boxes maintain transient execution states that reset when Run Mode is restarted.Feature C: Slack Workflow JSON ImporterObjective: Skip manual creation by converting native Slack files.Implementation: The left sidebar features a drop zone. Dropping an exported Slack Workflow Builder JSON file prompts a parser loop. The parser searches the payload sequence (e.g., send_message, open_form) and maps them directly into respective HTML components on the canvas.Feature D: Dual-Export EngineSingle File Export: Bundles the selected visual workspace layout into an all-in-one standalone HTML document.Master Operations Export: Reads the entire loaded local directory of Markdown files and compiles them into a single, offline-ready mini-portal.Master Export Layout:Sidebar: Dynamic list of all processes compiled into a sidebar menu with an offline, client-side, global search engine searching titles and block content instantly.Assets: CSS, fonts, and logic scripts are embedded inline, ensuring the compiled file ($< 500\text{KB}$) works entirely offline on any browser.5. File System & Markdown Storage SchemaBecause files are stored as plain Markdown, they remain fully readable by standard editors like Obsidian or VS Code. Custom canvas components are written as clean, serialized inline tags inside the Markdown body.Saved Markdown File Example:---

id: system-incident-escalation

title: Critical System Incident Flow

updated: 2026-06-24

_history: [

"{\"timestamp\": \"2026-06-24T00:00:00Z\", \"diff\": ...}"

]

---

# Process Overview

This manual directs Tier 1 support on handling high priority server outages.

<core-instruction>

### Checklist for Support Engineers:

- [ ] Check AWS Status dashboard to confirm service disruption.

- [ ] Locate on-call team roster for the day.

</core-instruction>

<logic-decision question="Is the AWS Outage confirmed?">

  <div slot="option-yes">Notify channels and escalate ticket</div>

  <div slot="option-no">Mark as localized incident and troubleshoot locally</div>

</logic-decision>

<zd-trigger name="Urgent Priority Check">

  <div slot="conditions">Ticket priority == Urgent</div>

  <div slot="actions">Notify engineering Slack channel</div>

</zd-trigger>

<zd-internal-note>

**Important Note for Support Engineers:** Always ensure the server status page is updated prior to notifying engineering teams.

</zd-internal-note>

<slack-message bot-name="Incident Bot">

:alert: _P0 Incident Detected:_ {{ticket_subject}} (ID: #{{ticket_id}})

<slack-button action="escalate" style="primary">Acknowledge</slack-button>

</slack-message>

<external-action system="PagerDuty" endpoint="POST /v2/enqueue">

**Payload details:** Escalating high-priority alert on behalf of customer: {{user}}

</external-action>

6. Directory Structure├── index.html # Core application shell and layout grids

├── styles.css # Custom application overrides and platform layout styles

├── app.js # Central state coordinator and File System picker

├── js/

│ ├── components/

│ │ ├── core-blocks.js # Custom element definitions for Instructions, Decisions, and External integrations

│ │ ├── zendesk-blocks.js # Custom element definitions for Zendesk Garden

│ │ └── slack-blocks.js # Custom element definitions for Slack Block Kit

│ └── utils/

│ ├── slack-importer.js # Slack Workflow Builder JSON parser

│ ├── diff-engine.js # Versioning, diff, and front matter snapshot manager

│ └── export-engine.js # Single & Master HTML compilations

├── manifest.json # PWA configuration manifest

└── sw.js

              # Service Worker for offline operations

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://process-mapper-tool.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f29980b4-b0f3-4104-bbd8-2a9fcfea2987).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
