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
- Tasks and installed-agent selections persist in browser local storage for this frontend phase.

## Altavex Orchestrator

A server-side AI endpoint is implemented at `POST /api/agent`.

- Uses the OpenAI Chat Completions API through the official `openai` SDK.
- Model defaults to `gpt-4.1-mini`; override with `OPENAI_MODEL`.
- Routes natural-language requests through a central Orchestrator.
- Can assign bounded work to Product Manager, Research Analyst, Designer, Software Engineer, QA Engineer and Operations Agent specialists.
- Specialist assignments are executed sequentially as separate model calls during the same request. Later specialists receive earlier specialist results as handoff context.
- The Orchestrator synthesizes the specialist outputs into one response.
- Can draft follow-up tasks and flag consequential actions for explicit approval.
- AI Assistant and Agent Hub both call the same server endpoint.
- API keys are read only on the server and must never use a `NEXT_PUBLIC_` prefix.

### Enable the live model

1. Copy `.env.example` to `.env.local`.
2. Set `OPENAI_API_KEY` to your own OpenAI API key.
3. Optionally set `OPENAI_MODEL`.
4. Restart the Next.js server.

Without the key, the API returns a clear setup message and does not expose secrets.

## Current capability boundaries

This is a synchronous, human-supervised orchestration MVP, not yet a fully autonomous multi-agent platform.

- Specialist reasoning runs during the user's API request. There are no persistent background workers or scheduled jobs.
- Task drafts and approval requests are returned to the user; they are not saved to a database yet.
- Approval requests do not execute external actions.
- No persistent conversation memory or workspace context database is connected.
- Tasks and installed-agent selections use browser local storage.
- Authentication, multi-user access, file uploads, knowledge retrieval, integrations and durable workflow execution are not connected.
- Vercel deployment remains pending account permissions.

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
