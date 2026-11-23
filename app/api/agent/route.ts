import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const specialistAgents = [
  { name: "Product Manager", focus: "requirements, scope, user stories, prioritisation and delivery plans" },
  { name: "Research Analyst", focus: "market research, competitor analysis, source evaluation and decision briefs" },
  { name: "Designer", focus: "UX flows, interface structure, design systems and accessibility" },
  { name: "Software Engineer", focus: "technical architecture, implementation plans, code and debugging" },
  { name: "QA Engineer", focus: "test plans, edge cases, acceptance criteria and release readiness" },
  { name: "Operations Agent", focus: "business processes, project coordination, SOPs and execution tracking" },
];

const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "delegate_to_specialist",
      description: "Prepare a specialist work assignment. This creates a proposed delegation for the user to review; it does not launch an autonomous background process.",
      parameters: {
        type: "object",
        additionalProperties: false,
        properties: {
          agent: { type: "string", enum: specialistAgents.map((agent) => agent.name) },
          objective: { type: "string" },
          expected_output: { type: "string" },
        },
        required: ["agent", "objective", "expected_output"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_task_draft",
      description: "Create a task proposal in the response for the user to review. It does not save to a database yet.",
      parameters: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: { type: "string" },
          priority: { type: "string", enum: ["Low", "Medium", "High", "Urgent"] },
          reason: { type: "string" },
        },
        required: ["title", "priority", "reason"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "request_approval",
      description: "Mark a consequential action as requiring explicit user approval. Never perform the action.",
      parameters: {
        type: "object",
        additionalProperties: false,
        properties: {
          action: { type: "string" },
          impact: { type: "string" },
        },
        required: ["action", "impact"],
      },
    },
  },
];

type AgentMessage = { role: "user" | "assistant"; content: string };

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "The Altavex Orchestrator is built, but it needs OPENAI_API_KEY in the server environment before it can run." },
      { status: 503 },
    );
  }

  try {
    const body = await request.json();
    const incoming = Array.isArray(body.messages) ? body.messages : [];
    const messages: AgentMessage[] = incoming
      .filter((item: unknown): item is AgentMessage =>
        !!item &&
        typeof item === "object" &&
        "role" in item &&
        "content" in item &&
        ((item as AgentMessage).role === "user" || (item as AgentMessage).role === "assistant") &&
        typeof (item as AgentMessage).content === "string",
      )
      .slice(-16);

    if (!messages.length || !messages.some((item) => item.role === "user")) {
      return NextResponse.json({ error: "Send a message to start a task." }, { status: 400 });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
    const system = `You are the Altavex Orchestrator, the central intelligence of Altavex AI OS.
You coordinate a human-supervised team of specialist agents for Altavex Group.
Be practical, clear and concise. Understand the requested outcome, break complex work into steps, and delegate to the relevant specialists using delegate_to_specialist. Use create_task_draft when a concrete follow-up task would help. Use request_approval for consequential actions such as publishing, sending messages, spending money, deleting data, changing access, deploying to production, or modifying live systems.
Available specialists: ${specialistAgents.map((agent) => `${agent.name}: ${agent.focus}`).join("; ")}.
Important capability boundaries: specialist assignments are proposals only. There is no autonomous background worker, database persistence, file access, browser access, email sending, deployment, or external action execution connected yet. Never claim that a task was completed, a specialist actually ran, or data was saved. Never invent research or pretend to have inspected files. State what is a proposal and what needs a connected tool or human approval.
When you use tools, summarise the proposed assignments, task drafts and approval gates in your final answer. Do not expose API keys or secrets.
Workspace: Altavex Group. Current product: Altavex AI OS.`;

    const completion = await client.chat.completions.create({
      model,
      temperature: 0.3,
      messages: [{ role: "system", content: system }, ...messages],
      tools,
      tool_choice: "auto",
    });

    const choice = completion.choices[0];
    const proposedActions: Array<{ type: string; data: Record<string, unknown> }> = [];
    for (const call of choice.message.tool_calls ?? []) {
      if (call.type !== "function") continue;
      let data: Record<string, unknown> = {};
      try { data = JSON.parse(call.function.arguments) as Record<string, unknown>; } catch { /* malformed model arguments are ignored */ }
      proposedActions.push({ type: call.function.name, data });
    }

    let reply = choice.message.content?.trim() || "";
    if (proposedActions.length) {
      const summaries = proposedActions.map((action) => {
        const d = action.data;
        if (action.type === "delegate_to_specialist") return `• ${String(d.agent)}: ${String(d.objective)} (deliverable: ${String(d.expected_output)})`;
        if (action.type === "create_task_draft") return `• Task draft: ${String(d.title)} | Priority: ${String(d.priority)} | ${String(d.reason)}`;
        if (action.type === "request_approval") return `• Approval required: ${String(d.action)} | Impact: ${String(d.impact)}`;
        return "";
      }).filter(Boolean);
      reply = [reply, summaries.length ? "Proposed actions for your review:\n" + summaries.join("\n") : ""].filter(Boolean).join("\n\n");
    }

    return NextResponse.json({
      reply: reply || "I couldn't produce a response. Please try again.",
      proposedActions,
      model,
      mode: "supervised-preview",
    });
  } catch (error) {
    console.error("Altavex Orchestrator error:", error);
    return NextResponse.json(
      { error: "The Orchestrator could not complete that request. Check the server configuration and try again." },
      { status: 500 },
    );
  }
}
