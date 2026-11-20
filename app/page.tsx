"use client";

import { useMemo, useState } from "react";
import {
  Activity, ArrowDownRight, ArrowUpRight, Bell, Bot, BriefcaseBusiness,
  Check, ChevronDown, CircleHelp, Command, FileText, FolderKanban,
  LayoutDashboard, ListTodo, Menu, MessageSquare, MoreHorizontal,
  Plus, Search, Send, Settings, ShieldCheck, Sparkles, Users, X,
  Zap, Clock3, PanelLeftClose, BrainCircuit
} from "lucide-react";

type Section = "Overview" | "AI Assistant" | "Agents" | "Projects" | "Tasks" | "Knowledge Hub" | "Activity" | "Settings";
const nav: { label: Section; icon: typeof LayoutDashboard }[] = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "AI Assistant", icon: MessageSquare },
  { label: "Agents", icon: Bot },
  { label: "Projects", icon: FolderKanban },
  { label: "Tasks", icon: ListTodo },
  { label: "Knowledge Hub", icon: FileText },
  { label: "Activity", icon: Activity },
];
const initialTasks = [
  { title: "Define the Altavex AI OS architecture", project: "Altavex AI OS", status: "In progress", due: "Today" },
  { title: "Prepare MagTrans digital operations brief", project: "MagTrans", status: "Planned", due: "Tomorrow" },
  { title: "Review Quillrill service portfolio", project: "Quillrill", status: "Planned", due: "This week" },
];
const projects = [
  { name: "Altavex AI OS", division: "Group technology", progress: 24, status: "In progress", initials: "AI" },
  { name: "MagTrans platform", division: "Transport & tourism", progress: 18, status: "Planning", initials: "MT" },
  { name: "Quillrill services", division: "Software & digital", progress: 42, status: "In progress", initials: "QR" },
  { name: "Ordexa", division: "Online shopping agency", progress: 35, status: "In progress", initials: "OR" },
];
const agents = [
  { name: "Research Agent", role: "Market intelligence & research", status: "Planned", icon: Search },
  { name: "Business Agent", role: "Business planning & analysis", status: "Planned", icon: BriefcaseBusiness },
  { name: "Marketing Agent", role: "Content & campaign support", status: "Planned", icon: Sparkles },
  { name: "Software Agent", role: "Development & technical support", status: "Planned", icon: BrainCircuit },
];

export default function Home() {
  const [section, setSection] = useState<Section>("Overview");
  const [tasks, setTasks] = useState(initialTasks);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{role:"assistant"|"user"; text:string}[]>([
    { role: "assistant", text: "Welcome to Altavex AI OS. I'm your central assistant. I can help organise projects, plan work and answer questions. AI model connection is the next integration step." }
  ]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [taskModal, setTaskModal] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [selectedProject, setSelectedProject] = useState("All projects");

  const completed = tasks.filter(t => t.status === "Done").length;
  const visibleTasks = useMemo(() => tasks.filter(t => (selectedProject === "All projects" || t.project === selectedProject) && t.title.toLowerCase().includes(search.toLowerCase())), [tasks, selectedProject, search]);

  function addTask() {
    if (!newTask.trim()) return;
    setTasks([{ title: newTask.trim(), project: "Altavex AI OS", status: "Planned", due: "Unscheduled" }, ...tasks]);
    setNewTask(""); setTaskModal(false); setNotice("Task added to your workspace.");
  }
  function sendMessage() {
    if (!message.trim()) return;
    const text = message.trim();
    setMessages([...messages, { role: "user", text }, { role: "assistant", text: "I have received your request. The live AI connection is not configured yet. Once the OpenAI API and secure server route are connected, I will be able to reason over your workspace and use approved tools." }]);
    setMessage("");
  }
  function toggleTask(title: string) {
    setTasks(tasks.map(t => t.title === title ? { ...t, status: t.status === "Done" ? "Planned" : "Done" } : t));
  }

  return (
    <main className="shell">
      {sidebarOpen && <aside className="sidebar">
        <div className="brand"><div className="brand-mark"><Command size={21}/></div><div><strong>ALTAVEX</strong><span>AI OPERATING SYSTEM</span></div><button className="icon-btn close-side" onClick={() => setSidebarOpen(false)} aria-label="Collapse sidebar"><PanelLeftClose size={17}/></button></div>
        <div className="workspace-switch"><div className="workspace-avatar">A</div><div className="workspace-copy"><strong>Altavex Group</strong><span>Founder workspace</span></div><ChevronDown size={15}/></div>
        <div className="nav-label">WORKSPACE</div>
        <nav>{nav.map(item => { const Icon = item.icon; return <button key={item.label} className={section === item.label ? "nav-item active" : "nav-item"} onClick={() => setSection(item.label)}><Icon size={17}/><span>{item.label}</span>{item.label === "Tasks" && <small>{tasks.filter(t=>t.status!=="Done").length}</small>}</button>; })}</nav>
        <div className="sidebar-bottom"><div className="secure-note"><ShieldCheck size={17}/><div><strong>Private workspace</strong><span>Access controls enabled</span></div></div><button className={section === "Settings" ? "nav-item active" : "nav-item"} onClick={() => setSection("Settings")}><Settings size={17}/><span>Settings</span></button><div className="profile"><div className="profile-avatar">K</div><div><strong>Kevin Museny</strong><span>Workspace owner</span></div><MoreHorizontal size={18}/></div></div>
      </aside>}
      <section className="main-area">
        <header className="topbar">
          <div className="crumbs">{!sidebarOpen && <button className="icon-btn" onClick={() => setSidebarOpen(true)}><Menu size={18}/></button>}<span>Altavex Group</span><span className="slash">/</span><strong>{section}</strong></div>
          <div className="top-actions"><div className="system-status"><i/> System workspace</div><button className="icon-btn" aria-label="Notifications" onClick={() => setNotice("You're all caught up.")}><Bell size={18}/></button><button className="help-btn" onClick={() => setNotice("Help centre will be available in a later release.")}><CircleHelp size={17}/><span>Help</span></button></div>
        </header>
        <div className="content">
          {notice && <div className="notice"><Check size={15}/>{notice}<button onClick={() => setNotice("")}><X size={14}/></button></div>}
          {section === "Overview" && <>
            <div className="welcome-row"><div><div className="eyebrow"><span className="gold-dot"/> THURSDAY, NOVEMBER 20, 2026</div><h1>Good afternoon, Kevin.</h1><p className="subheading">Here's what's happening across your workspace.</p></div><button className="primary-btn" onClick={() => setTaskModal(true)}><Plus size={16}/> New task</button></div>
            <div className="hero-card"><div className="hero-glow"/><div className="hero-copy"><div className="hero-kicker"><Sparkles size={14}/> YOUR INTELLIGENT COMMAND CENTRE</div><h2>Build with clarity.<br/><em>Move with purpose.</em></h2><p>One place to think, plan and coordinate the work behind Altavex Group.</p><button className="hero-btn" onClick={() => setSection("AI Assistant")}>Open AI assistant <ArrowUpRight size={15}/></button></div><div className="hero-orbit"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="orbit-core"><Command size={35}/></div><span className="orbit-node node-a"><BrainCircuit size={17}/></span><span className="orbit-node node-b"><Bot size={17}/></span><span className="orbit-node node-c"><Zap size={17}/></span></div></div>
            <div className="metrics"><Metric label="Active projects" value="4" change="Across your workspace" icon={<FolderKanban size={17}/>} /><Metric label="Open tasks" value={String(tasks.filter(t=>t.status!=="Done").length).padStart(2,"0")} change="Keep momentum moving" icon={<ListTodo size={17}/>} /><Metric label="Active AI agents" value="00" change="Agent deployment pending" icon={<Bot size={17}/>} /><Metric label="Tasks completed" value={String(completed).padStart(2,"0")} change="In this workspace" icon={<Check size={17}/>} /></div>
            <div className="section-grid"><div className="panel"><div className="panel-head"><div><h3>Priority tasks</h3><p>Your next actions</p></div><button className="text-btn" onClick={() => setSection("Tasks")}>View all <ArrowUpRight size={14}/></button></div><div className="task-list">{tasks.slice(0,4).map((t,i)=><div className="task-row" key={t.title}><button className={t.status==="Done"?"task-check checked":"task-check"} onClick={()=>toggleTask(t.title)}>{t.status==="Done"&&<Check size={12}/>}</button><div className="task-info"><strong className={t.status==="Done"?"done":""}>{t.title}</strong><span>{t.project}</span></div><span className="task-due">{t.due}</span></div>)}</div></div><div className="panel"><div className="panel-head"><div><h3>Project overview</h3><p>Progress across divisions</p></div><button className="text-btn" onClick={()=>setSection("Projects")}>View all <ArrowUpRight size={14}/></button></div><div className="project-list">{projects.slice(0,3).map(p=><div className="project-row" key={p.name}><div className="project-avatar">{p.initials}</div><div className="project-main"><div className="project-title"><strong>{p.name}</strong><span>{p.progress}%</span></div><div className="progress-track"><i style={{width:p.progress+"%"}}/></div><small>{p.division}</small></div></div>)}</div></div></div>
            <div className="bottom-grid"><div className="panel assistant-panel"><div className="assistant-icon"><Sparkles size={19}/></div><div><h3>Start with your AI assistant</h3><p>Ask questions, organise ideas or plan the next move for any Altavex project.</p><button className="text-btn" onClick={()=>setSection("AI Assistant")}>Start a conversation <ArrowUpRight size={14}/></button></div></div><div className="panel activity-panel"><div className="panel-head"><div><h3>Recent activity</h3><p>Workspace updates</p></div><button className="text-btn" onClick={()=>setSection("Activity")}>See activity <ArrowUpRight size={14}/></button></div><div className="activity-line"><span className="activity-icon"><Check size={14}/></span><div><strong>Workspace foundation created</strong><small>Initial application scaffold · Just now</small></div></div><div className="activity-line"><span className="activity-icon muted"><ShieldCheck size={14}/></span><div><strong>Security-first architecture selected</strong><small>Supabase Auth and RLS planned · Today</small></div></div></div></div>
          </>}
          {section === "AI Assistant" && <div className="workspace-page"><div className="page-heading"><div className="eyebrow"><span className="gold-dot"/> ALTAVEX INTELLIGENCE</div><h1>AI Assistant</h1><p className="subheading">Your central point of contact for thinking, planning and getting work done.</p></div><div className="chat-panel"><div className="chat-top"><div className="assistant-icon"><Sparkles size={18}/></div><div><strong>Altavex Assistant</strong><span><i/> Workspace assistant · Preview mode</span></div><span className="preview-pill">MVP PREVIEW</span></div><div className="chat-messages">{messages.map((m,i)=><div key={i} className={m.role==="user"?"message user-message":"message"}><div className="message-avatar">{m.role==="user"?"K":<Sparkles size={15}/>}</div><p>{m.text}</p></div>)}</div><div className="chat-compose"><textarea value={message} onChange={e=>setMessage(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage();}}} placeholder="Ask Altavex anything..." rows={2}/><button className="send-btn" onClick={sendMessage} aria-label="Send message"><Send size={17}/></button></div><div className="chat-hint">AI responses are in preview mode until the model connection is configured.</div></div></div>}
          {section === "Agents" && <div className="workspace-page"><div className="page-heading"><div className="eyebrow"><span className="gold-dot"/> AGENT MANAGEMENT</div><h1>Agent workspace</h1><p className="subheading">Specialised AI roles will work together under a central orchestrator.</p></div><div className="agent-banner"><Bot size={22}/><div><strong>Orchestrator · Planned</strong><p>Coordinates requests, selects specialist agents and tracks task outcomes.</p></div><span className="status-pill">Not connected</span></div><div className="agent-grid">{agents.map(a=>{const Icon=a.icon;return <div className="agent-card" key={a.name}><div className="agent-card-icon"><Icon size={20}/></div><span className="status-pill">{a.status}</span><h3>{a.name}</h3><p>{a.role}</p><button className="text-btn" onClick={()=>setNotice(a.name+" will be configured in a later build phase.")}>Configure <ArrowUpRight size={14}/></button></div>})}</div></div>}
          {section === "Projects" && <div className="workspace-page"><div className="page-heading row-heading"><div><div className="eyebrow"><span className="gold-dot"/> WORK MANAGEMENT</div><h1>Projects</h1><p className="subheading">A shared view of initiatives across Altavex Group.</p></div><button className="primary-btn" onClick={()=>setNotice("Project creation will be connected to Supabase in the next integration step.")}><Plus size={16}/> New project</button></div><div className="project-cards">{projects.map(p=><div className="project-card" key={p.name}><div className="project-card-top"><div className="project-avatar large">{p.initials}</div><span className="status-pill">{p.status}</span></div><h3>{p.name}</h3><p>{p.division}</p><div className="progress-label"><span>Progress</span><strong>{p.progress}%</strong></div><div className="progress-track"><i style={{width:p.progress+"%"}}/></div></div>)}</div></div>}
          {section === "Tasks" && <div className="workspace-page"><div className="page-heading row-heading"><div><div className="eyebrow"><span className="gold-dot"/> WORK MANAGEMENT</div><h1>Tasks</h1><p className="subheading">Keep priorities visible and move work forward.</p></div><button className="primary-btn" onClick={()=>setTaskModal(true)}><Plus size={16}/> New task</button></div><div className="filter-row"><div className="search-box"><Search size={16}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search tasks"/></div><select value={selectedProject} onChange={e=>setSelectedProject(e.target.value)}><option>All projects</option>{projects.map(p=><option key={p.name}>{p.name}</option>)}</select></div><div className="panel task-panel"><div className="task-list">{visibleTasks.map(t=><div className="task-row" key={t.title}><button className={t.status==="Done"?"task-check checked":"task-check"} onClick={()=>toggleTask(t.title)}>{t.status==="Done"&&<Check size={12}/>}</button><div className="task-info"><strong className={t.status==="Done"?"done":""}>{t.title}</strong><span>{t.project}</span></div><span className={t.status==="Done"?"status-pill done-pill":"status-pill"}>{t.status}</span><span className="task-due">{t.due}</span></div>)}</div>{visibleTasks.length===0&&<div className="empty-state">No matching tasks. Try another search or add a task.</div>}</div></div>}
          {section === "Knowledge Hub" && <div className="workspace-page"><div className="page-heading"><div className="eyebrow"><span className="gold-dot"/> SHARED KNOWLEDGE</div><h1>Knowledge hub</h1><p className="subheading">A secure home for company documents, decisions and reference material.</p></div><div className="empty-card"><div className="empty-icon"><FileText size={25}/></div><h3>Your knowledge base starts here</h3><p>Document upload, search and AI retrieval will be connected after Supabase Storage and access policies are configured.</p><button className="secondary-btn" onClick={()=>setNotice("Knowledge Hub storage is planned for the next integration step.")}><Plus size={15}/> Add a document</button></div></div>}
          {section === "Activity" && <div className="workspace-page"><div className="page-heading"><div className="eyebrow"><span className="gold-dot"/> AUDIT TRAIL</div><h1>Activity</h1><p className="subheading">A record of important actions across your workspace.</p></div><div className="panel activity-full"><div className="activity-line"><span className="activity-icon"><Check size={14}/></span><div><strong>Altavex AI OS repository initialised</strong><small>GitHub · Today</small></div></div><div className="activity-line"><span className="activity-icon"><ShieldCheck size={14}/></span><div><strong>Security-first architecture defined</strong><small>Platform planning · Today</small></div></div><div className="activity-line"><span className="activity-icon muted"><Clock3 size={14}/></span><div><strong>Supabase and Vercel integration pending</strong><small>Infrastructure · Waiting for setup</small></div></div></div></div>}
          {section === "Settings" && <div className="workspace-page"><div className="page-heading"><div className="eyebrow"><span className="gold-dot"/> PREFERENCES</div><h1>Settings</h1><p className="subheading">Workspace identity, security and connected services.</p></div><div className="settings-list"><Setting title="Workspace" detail="Altavex Group · Founder workspace" tag="Configured"/><Setting title="Authentication" detail="Supabase Auth and protected routes" tag="Pending"/><Setting title="AI provider" detail="OpenAI API connection" tag="Pending"/><Setting title="Deployment" detail="Vercel production environment" tag="Pending"/><Setting title="Brand identity" detail="Gold, deep brown and cream palette" tag="Configured"/></div></div>}
          <footer className="footer"><span>ALTAVEX AI OS <b>·</b> VERSION 0.1.0</span><span>Built for thoughtful progress.</span></footer>
        </div>
      </section>
      {taskModal && <div className="modal-backdrop" onClick={()=>setTaskModal(false)}><div className="modal" onClick={e=>e.stopPropagation()}><div className="modal-head"><div><h3>Create a task</h3><p>Add a new action to your workspace.</p></div><button className="icon-btn" onClick={()=>setTaskModal(false)}><X size={18}/></button></div><label>Task name</label><input autoFocus value={newTask} onChange={e=>setNewTask(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addTask()} placeholder="What needs to get done?"/><div className="modal-actions"><button className="secondary-btn" onClick={()=>setTaskModal(false)}>Cancel</button><button className="primary-btn" onClick={addTask}><Plus size={15}/> Create task</button></div></div></div>}
    </main>
  );
}

function Metric({label,value,change,icon}:{label:string;value:string;change:string;icon:React.ReactNode}) {
  return <div className="metric-card"><div className="metric-top"><span>{label}</span><i>{icon}</i></div><strong>{value}</strong><small>{change}</small></div>;
}
function Setting({title,detail,tag}:{title:string;detail:string;tag:string}) {
  return <div className="setting-row"><div><strong>{title}</strong><span>{detail}</span></div><span className={tag==="Configured"?"configured-pill":"status-pill"}>{tag}</span></div>;
}
