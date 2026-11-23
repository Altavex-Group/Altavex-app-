# Altavex AI OS

A modular command centre for Altavex Group, built with Next.js and TypeScript.

## Frontend experience

- Responsive workspace shell with navigation.
- Home command centre, projects and task screens.
- AI Assistant and Agent Hub conversation interfaces.
- Agent registry and deploy-agent draft flow.
- Documents and Knowledge Hub screens.
- Analytics overview.
- Agent and workflow Marketplace.
- Tasks and installed-agent selections persist in browser local storage for this frontend-only phase.

## Altavex Orchestrator

A server-side AI endpoint is implemented at `POST /api/agent`.

- Uses the OpenAI Chat Completions API through the official `openai` SDK.
- Model defaults to `gpt-4.1-mini`; override with `OPENAI_MODEL`.
- Routes natural-language requests through a central Orchestrator.
- Can prepare specialist assignments for Product Manager, Research Analyst, Designer, Software Engineer, QA Engineer and Operations Agent.
- Can draft follow-up tasks and mark consequential actions as requiring approval.
- AI Assistant and Agent Hub both call the same server endpoint.
- API key is read only on the server and must never use a `NEXT_PUBLIC_` prefix.

### Enable the live model

1. Copy `.env.example` to `.env.local`.
2. Set `OPENAI_API_KEY` to your own OpenAI API key.
3. Optionally set `OPENAI_MODEL`.
4. Restart the Next.js server.

Without the key, the API returns a clear setup message and does not expose secrets.

## Important capability boundaries

This is the first supervised Orchestrator runtime, not a fully autonomous multi-agent platform.

- Specialist delegation is currently a structured proposal returned by the Orchestrator. No background workers execute the assignments.
- Task proposals are not saved to a database yet.
- Approval requests are surfaced as proposals only; no external action is performed.
- No persistent conversation memory or workspace context database is connected.
- No database persistence; local browser storage is used for tasks and installed-agent selections.
- Authentication, multi-user access, file uploads, knowledge retrieval, integrations and workflow execution are not connected.
- Vercel deployment is pending account permissions.

## Stack

- Next.js App Router + TypeScript
- OpenAI SDK for server-side model requests
- Supabase PostgreSQL, Auth, Row Level Security and Storage (planned, not connected)
- Vercel hosting (pending)

## Security principles

- Never expose OpenAI API keys or Supabase secret/service-role keys to the browser.
- Enable Row Level Security on every exposed application table.
- Scope user data by authenticated identity and workspace membership.
- Require explicit approval for consequential external actions.
