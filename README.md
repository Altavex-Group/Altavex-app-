# Altavex AI OS

A modular AI-enabled operating system for Altavex Group.

## Architecture
- Next.js App Router + TypeScript: web application and server-side API routes.
- Supabase: PostgreSQL, Auth, Row Level Security, and Storage.
- OpenAI API: model reasoning and tool calling, accessed only from server-side routes.
- Vercel: hosting and deployment.

## MVP scope
1. Authentication and protected workspace.
2. Command-centre dashboard.
3. Projects and tasks.
4. AI assistant with permissioned tools.
5. Agent registry, knowledge hub, and activity audit trail.

## Security principles
- Never expose OpenAI API keys or Supabase secret/service-role keys to the browser.
- Enable RLS on every exposed application table.
- Scope user data by authenticated identity and workspace membership.
- Require explicit approval for consequential external actions.

## Status
Architecture defined. Initial application scaffold is being prepared. Supabase project connection and production deployment are pending configuration.
