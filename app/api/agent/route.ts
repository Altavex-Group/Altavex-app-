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
      description: "Assign a bounded part of the user's request to a specialist. The server will run the specialist synchronously during this request. This is not a persistent background worker.",
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
      description: "Prepare a task draft for the user to review. It is not saved to a database yet.",
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
      description: "Flag a consequential action that requires explicit user approval. Never perform the action.",
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
type ProposedAction = { type: string; data: Record<string, unknown> };

function parseToolArguments(raw: string): Record<string, unknown> {
  try {
    const value: unknown = JSON.parse(raw);
    return value && typeof value === "object" && !Array.isArray(value)
      ? value as Record<string, unknown>
      : {};
  } catch {
    return {};
  }
}

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "The Altavex Orchestrator needs OPENAI_API_KEY in the server environment before it can run." },
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
      .map((item) => ({ ...item, content: item.content.slice(0, 6000) }))
      .slice(-16);

    if (!messages.length || !messages.some((item) => item.role === "user")) {
      return NextResponse.json({ error: "Send a message to start a task." }, { status: 400 });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
    const system = `You are the Altavex Orchestrator, the central intelligence of Altavex AI OS.
Coordinate a human-supervised specialist team for Altavex Group. Understand the outcome, break complex work into bounded pieces, and delegate only when specialist work materially improves the result.
Available specialists: ${specialistAgents.map((agent) => `${agent.name}: ${agent.focus}`).join("; ")}.
Use no more than three specialist assignments per request. Use create_task_draft only for useful follow-up work. Use request_approval for publishing, sending messages, spending money, deleting data, changing access, deploying to production, or modifying live systems.
The server can execute specialist reasoning during this request, but has no persistent background workers, database persistence, browser access, file access, email sending, deployment, or external action execution connected. Never claim those actions occurred. Clearly distinguish completed analysis from proposed external actions.
Workspace: Altavex Group. Product: Altavex AI OS.`;

    const plan = await client.chat.completions.create({
      model,
      temperature: 0.2,
      messages: [{ role: "system", content: system }, ...messages],
      tools,
      tool_choice: "auto",
    });

    const proposedActions: ProposedAction[] = [];
    for (const call of plan.choices[0]?.message.tool_calls ?? []) {
      if (call.type !== "function") continue;
      proposedActions.push({
        type: call.function.name,
        data: parseToolArguments(call.function.arguments),
      });
    }

    const assignments = proposedActions
      .filter((action) => action.type === "delegate_to_specialist")
      .slice(0, 3);
    const executedAgents: Array<{ agent: string; objective: string; output: string }> = [];

    // Run specialist reasoning one at a time so each handoff can use the previous result.
    for (const [index, assignment] of assignments.entries()) {
      const agentName = String(assignment.data.agent || "Specialist");
      const agent = specialistAgents.find((item) => item.name === agentName);
      if (!agent) continue;

      const previousWork = executedAgents
        .map((item) => `\n\n[${item.agent} result]\n${item.output}`)
        .join("");
      const specialist = await client.chat.completions.create({
        model,
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content: `You are the ${agent.name} inside Altavex AI OS. Your sole responsibility is ${agent.focus}. Complete only the assigned objective. Be concrete, state assumptions, and do not claim external actions or research you did not perform. This is specialist ${index + 1} of ${assignments.length}. Previous specialist handoffs are context, not verified facts.`,
          },
          {
            role: "user",
            content: `Overall user request: ${messages.filter((item) => item.role === "user").at(-1)?.content || ""}

Your assigned objective: ${String(assignment.data.objective || "")}
Expected output: ${String(assignment.data.expected_output || "")}
${previousWork}`,
          },
        ],
      });
      executedAgents.push({
        agent: agent.name,
        objective: String(assignment.data.objective || ""),
        output: specialist.choices[0]?.message.content?.trim() || "No usable specialist output was returned.",
      });
    }

    const nonDelegationActions = proposedActions.filter((action) => action.type !== "delegate_to_specialist");
    let reply = plan.choices[0]?.message.content?.trim() || "";

    if (executedAgents.length) {
      const handoff = executedAgents
        .map((item) => `### ${item.agent}\nAssignment: ${item.objective}\n\n${item.output}`)
        .join("\n\n");
      const synthesis = await client.chat.completions.create({
        model,
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content: "You are the Altavex Orchestrator. Synthesize the user's request and the specialist results into one useful response. State which specialist analyses actually ran. Do not claim external actions, persistence, or background work. Highlight unresolved assumptions and decisions.",
          },
          {
            role: "user",
            content: `User request: ${messages.filter((item) => item.role === "user").at(-1)?.content || ""}

Initial orchestration note: ${reply}

Specialist results:
${handoff}

Prepare the final response. Keep it clear and actionable.`,
          },
        ],
      });
      reply = synthesis.choices[0]?.message.content?.trim() || handoff;
    }

    const actionSummaries = nonDelegationActions.map((action) => {
      const data = action.data;
      if (action.type === "create_task_draft") {
        return `• Task draft: ${String(data.title)} | Priority: ${String(data.priority)} | ${String(data.reason)}`;
      }
      if (action.type === "request_approval") {
        return `• Approval required: ${String(data.action)} | Impact: ${String(data.impact)}`;
      }
      return "";
    }).filter(Boolean);

    if (actionSummaries.length) {
      reply = [reply, "Items requiring your review:\n" + actionSummaries.join("\n")].filter(Boolean).join("\n\n");
    }

    return NextResponse.json({
      reply: reply || "I couldn't produce a response. Please try again.",
      proposedActions,
      executedAgents,
      model,
      mode: "synchronous-supervised-orchestration",
    });
  } catch (error) {
    console.error("Altavex Orchestrator error:", error);
    return NextResponse.json(
      { error: "The Orchestrator could not complete that request. Check the server configuration and try again." },
      { status: 500 },
    );
  }
}
