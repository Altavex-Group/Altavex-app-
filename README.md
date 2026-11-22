# Altavex AI OS

A modular command centre for Altavex Group, built with Next.js and TypeScript.

## Frontend experience

- Responsive workspace shell with collapsible navigation.
- Home command centre with project, task, agent and activity summaries.
- AI Assistant preview interface.
- Agent registry and deploy-agent draft flow.
- Projects and task management screens.
- Documents and Knowledge Hub screens.
- Analytics overview.
- Agent and workflow Marketplace, including search, category filters, install/remove actions, templates and workflow cards.
- Dark Precision Layer 1 visual direction based on the recovered Altavex UI reference.
- Tasks and installed-agent selections persist in browser local storage for this frontend-only phase.

## Stack

- Next.js App Router + TypeScript
- React + Lucide icons
- Supabase: PostgreSQL, Auth, Row Level Security and Storage (planned, not connected)
- OpenAI API: server-side model reasoning and tool calling (planned, not connected)
- Vercel: hosting (project creation currently blocked by Vercel permissions)

## Current implementation status

The frontend screens and local interactions are committed to GitHub. The workspace is currently a frontend preview:
- No real authentication or multi-user access yet.
- No database persistence; local browser storage is used for tasks and installed agent selections.
- AI messages are preview responses, not connected to a live model.
- Agent deployment creates a local draft only.
- Document uploads, knowledge retrieval and workflow execution are not connected.
- Vercel deployment is pending account permissions.

## Security principles for backend phase

- Never expose OpenAI API keys or Supabase secret/service-role keys to the browser.
- Enable Row Level Security on every exposed application table.
- Scope user data by authenticated identity and workspace membership.
- Require explicit approval for consequential external actions.
