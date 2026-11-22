"use client";

import { useMemo, useState, useEffect } from "react";
import {
  Activity, ArrowDownRight, ArrowUpRight, Bell, Bot, BriefcaseBusiness,
  Check, ChevronDown, CircleHelp, Command, FileText, FolderKanban,
  LayoutDashboard, ListTodo, Menu, MessageSquare, MoreHorizontal,
  Plus, Search, Send, Settings, ShieldCheck, Sparkles, Users, X,
  Zap, Clock3, PanelLeftClose, BrainCircuit
} from "lucide-react";

type Section = "Overview" | "AI Assistant" | "Agents" | "Projects" | "Tasks" | "Documents" | "Knowledge Hub" | "Analytics" | "Marketplace" | "Activity" | "Settings";
const nav: { label: Section; icon: typeof LayoutDashboard }[] = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "AI Assistant", icon: MessageSquare },
  { label: "Agents", icon: Bot },
  { label: "Projects", icon: FolderKanban },
  { label: "Tasks", icon: ListTodo },
  { label: "Documents", icon: FileText },
  { label: "Knowledge Hub", icon: BrainCircuit },
  { label: "Analytics", icon: Activity },
  { label: "Marketplace", icon: BriefcaseBusiness },
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
  const [installedAgents, setInstalledAgents] = useState<string[]>([]);
  const [storageReady, setStorageReady] = useState(false);
  const [marketSearch, setMarketSearch] = useState("");
  const [marketCategory, setMarketCategory] = useState("All");
  const [marketCart, setMarketCart] = useState(false);
  const [deployModal, setDeployModal] = useState(false);
  const [deployName, setDeployName] = useState("");
  const [deployRole, setDeployRole] = useState("General assistant");

  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem("altavex-tasks");
      const savedAgents = localStorage.getItem("altavex-installed-agents");
      if (savedTasks) setTasks(JSON.parse(savedTasks));
      if (savedAgents) setInstalledAgents(JSON.parse(savedAgents));
    } catch { /* keep the starter workspace state */ }
    setStorageReady(true);
  }, []);
  useEffect(() => { if (storageReady) localStorage.setItem("altavex-tasks", JSON.stringify(tasks)); }, [tasks, storageReady]);
  useEffect(() => { if (storageReady) localStorage.setItem("altavex-installed-agents", JSON.stringify(installedAgents)); }, [installedAgents, storageReady]);

  const filteredMarketplaceAgents = marketplaceAgents.filter(a =>
    (marketCategory === "All" || a.category === marketCategory) &&
    (a.name + " " + a.description + " " + a.category).toLowerCase().includes(marketSearch.toLowerCase())
  );
  function toggleAgent(id: string) {
    setInstalledAgents(current => current.includes(id) ? current.filter(x => x !== id) : [...current, id]);
    const selected = marketplaceAgents.find(a => a.id === id);
    setNotice(selected ? (installedAgents.includes(id) ? selected.name + " removed from your OS." : selected.name + " added to your OS preview.") : "Agent updated.");
  }
  function deployAgent() {
    if (!deployName.trim()) return;
    setNotice(deployName.trim() + " saved as a local agent draft. Runtime deployment will be enabled after backend setup.");
    setDeployName(""); setDeployModal(false);
  }

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
        <div className="sidebar-bottom"><button className="deploy-agent-btn" onClick={()=>setDeployModal(true)}><Plus size={15}/> Deploy Agent</button><div className="secure-note"><ShieldCheck size={17}/><div><strong>Private workspace</strong><span>Access controls enabled</span></div></div><button className={section === "Settings" ? "nav-item active" : "nav-item"} onClick={() => setSection("Settings")}><Settings size={17}/><span>Settings</span></button><div className="profile"><div className="profile-avatar">K</div><div><strong>Kevin Museny</strong><span>Workspace owner</span></div><MoreHorizontal size={18}/></div></div>
      </aside>}
      <section className="main-area">
        <header className="topbar">
          <div className="crumbs">{!sidebarOpen && <button className="icon-btn" onClick={() => setSidebarOpen(true)}><Menu size={18}/></button>}<span>Altavex Group</span><span className="slash">/</span><strong>{section}</strong></div>
          <div className="top-actions"><div className="system-status"><i/> System workspace</div><button className="icon-btn" aria-label="Notifications" onClick={() => setNotice("You're all caught up.")}><Bell size={18}/></button><button className="help-btn" onClick={() => setNotice("Help centre will be available in a later release.")}><CircleHelp size={17}/><span>Help</span></button></div>
        </header>
        <div className="content">
          {notice && <div className="notice"><Check size={15}/>{notice}<button onClick={() => setNotice("")}><X size={14}/></button></div>}
          {section === "Overview" && <>
            <div className="welcome-row"><div><div className="eyebrow"><span className="gold-dot"/> SUNDAY, NOVEMBER 22, 2026</div><h1>Good afternoon, Kevin.</h1><p className="subheading">Here's what's happening across your workspace.</p></div><button className="primary-btn" onClick={() => setTaskModal(true)}><Plus size={16}/> New task</button></div>
            <div className="hero-card"><div className="hero-glow"/><div className="hero-copy"><div className="hero-kicker"><Sparkles size={14}/> YOUR INTELLIGENT COMMAND CENTRE</div><h2>Build with clarity.<br/><em>Move with purpose.</em></h2><p>One place to think, plan and coordinate the work behind Altavex Group.</p><button className="hero-btn" onClick={() => setSection("AI Assistant")}>Open AI assistant <ArrowUpRight size={15}/></button></div><div className="hero-orbit"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="orbit-core"><Command size={35}/></div><span className="orbit-node node-a"><BrainCircuit size={17}/></span><span className="orbit-node node-b"><Bot size={17}/></span><span className="orbit-node node-c"><Zap size={17}/></span></div></div>
            <div className="metrics"><Metric label="Active projects" value="4" change="Across your workspace" icon={<FolderKanban size={17}/>} /><Metric label="Open tasks" value={String(tasks.filter(t=>t.status!=="Done").length).padStart(2,"0")} change="Keep momentum moving" icon={<ListTodo size={17}/>} /><Metric label="Active AI agents" value="00" change="Agent deployment pending" icon={<Bot size={17}/>} /><Metric label="Tasks completed" value={String(completed).padStart(2,"0")} change="In this workspace" icon={<Check size={17}/>} /></div>
            <div className="section-grid"><div className="panel"><div className="panel-head"><div><h3>Priority tasks</h3><p>Your next actions</p></div><button className="text-btn" onClick={() => setSection("Tasks")}>View all <ArrowUpRight size={14}/></button></div><div className="task-list">{tasks.slice(0,4).map((t,i)=><div className="task-row" key={t.title}><button className={t.status==="Done"?"task-check checked":"task-check"} onClick={()=>toggleTask(t.title)}>{t.status==="Done"&&<Check size={12}/>}</button><div className="task-info"><strong className={t.status==="Done"?"done":""}>{t.title}</strong><span>{t.project}</span></div><span className="task-due">{t.due}</span></div>)}</div></div><div className="panel"><div className="panel-head"><div><h3>Project overview</h3><p>Progress across divisions</p></div><button className="text-btn" onClick={()=>setSection("Projects")}>View all <ArrowUpRight size={14}/></button></div><div className="project-list">{projects.slice(0,3).map(p=><div className="project-row" key={p.name}><div className="project-avatar">{p.initials}</div><div className="project-main"><div className="project-title"><strong>{p.name}</strong><span>{p.progress}%</span></div><div className="progress-track"><i style={{width:p.progress+"%"}}/></div><small>{p.division}</small></div></div>)}</div></div></div>
            <div className="bottom-grid"><div className="panel assistant-panel"><div className="assistant-icon"><Sparkles size={19}/></div><div><h3>Start with your AI assistant</h3><p>Ask questions, organise ideas or plan the next move for any Altavex project.</p><button className="text-btn" onClick={()=>setSection("AI Assistant")}>Start a conversation <ArrowUpRight size={14}/></button></div></div><div className="panel activity-panel"><div className="panel-head"><div><h3>Recent activity</h3><p>Workspace updates</p></div><button className="text-btn" onClick={()=>setSection("Activity")}>See activity <ArrowUpRight size={14}/></button></div><div className="activity-line"><span className="activity-icon"><Check size={14}/></span><div><strong>Workspace foundation created</strong><small>Initial application scaffold · Just now</small></div></div><div className="activity-line"><span className="activity-icon muted"><ShieldCheck size={14}/></span><div><strong>Security-first architecture selected</strong><small>Supabase Auth and RLS planned · Today</small></div></div></div></div>
          </>}
          {section === "AI Assistant" && <div className="workspace-page"><div className="page-heading"><div className="eyebrow"><span className="gold-dot"/> ALTAVEX INTELLIGENCE</div><h1>AI Assistant</h1><p className="subheading">Your central point of contact for thinking, planning and getting work done.</p></div><div className="chat-panel"><div className="chat-top"><div className="assistant-icon"><Sparkles size={18}/></div><div><strong>Altavex Assistant</strong><span><i/> Workspace assistant · Preview mode</span></div><span className="preview-pill">MVP PREVIEW</span></div><div className="chat-messages">{messages.map((m,i)=><div key={i} className={m.role==="user"?"message user-message":"message"}><div className="message-avatar">{m.role==="user"?"K":<Sparkles size={15}/>}</div><p>{m.text}</p></div>)}</div><div className="chat-compose"><textarea value={message} onChange={e=>setMessage(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage();}}} placeholder="Ask Altavex anything..." rows={2}/><button className="send-btn" onClick={sendMessage} aria-label="Send message"><Send size={17}/></button></div><div className="chat-hint">AI responses are in preview mode until the model connection is configured.</div></div></div>}
          {section === "Agents" && <div className="workspace-page"><div className="page-heading"><div className="eyebrow"><span className="gold-dot"/> AGENT MANAGEMENT</div><h1>Agent workspace</h1><p className="subheading">Specialised AI roles will work together under a central orchestrator.</p></div><div className="agent-banner"><Bot size={22}/><div><strong>Orchestrator · Planned</strong><p>Coordinates requests, selects specialist agents and tracks task outcomes.</p></div><span className="status-pill">Not connected</span></div><div className="agent-grid">{agents.map(a=>{const Icon=a.icon;return <div className="agent-card" key={a.name}><div className="agent-card-icon"><Icon size={20}/></div><span className="status-pill">{a.status}</span><h3>{a.name}</h3><p>{a.role}</p><button className="text-btn" onClick={()=>setNotice(a.name+" will be configured in a later build phase.")}>Configure <ArrowUpRight size={14}/></button></div>})}</div></div>}
          {section === "Projects" && <div className="workspace-page"><div className="page-heading row-heading"><div><div className="eyebrow"><span className="gold-dot"/> WORK MANAGEMENT</div><h1>Projects</h1><p className="subheading">A shared view of initiatives across Altavex Group.</p></div><button className="primary-btn" onClick={()=>setNotice("Project creation will be connected to Supabase in the next integration step.")}><Plus size={16}/> New project</button></div><div className="project-cards">{projects.map(p=><div className="project-card" key={p.name}><div className="project-card-top"><div className="project-avatar large">{p.initials}</div><span className="status-pill">{p.status}</span></div><h3>{p.name}</h3><p>{p.division}</p><div className="progress-label"><span>Progress</span><strong>{p.progress}%</strong></div><div className="progress-track"><i style={{width:p.progress+"%"}}/></div></div>)}</div></div>}
          {section === "Tasks" && <div className="workspace-page"><div className="page-heading row-heading"><div><div className="eyebrow"><span className="gold-dot"/> WORK MANAGEMENT</div><h1>Tasks</h1><p className="subheading">Keep priorities visible and move work forward.</p></div><button className="primary-btn" onClick={()=>setTaskModal(true)}><Plus size={16}/> New task</button></div><div className="filter-row"><div className="search-box"><Search size={16}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search tasks"/></div><select value={selectedProject} onChange={e=>setSelectedProject(e.target.value)}><option>All projects</option>{projects.map(p=><option key={p.name}>{p.name}</option>)}</select></div><div className="panel task-panel"><div className="task-list">{visibleTasks.map(t=><div className="task-row" key={t.title}><button className={t.status==="Done"?"task-check checked":"task-check"} onClick={()=>toggleTask(t.title)}>{t.status==="Done"&&<Check size={12}/>}</button><div className="task-info"><strong className={t.status==="Done"?"done":""}>{t.title}</strong><span>{t.project}</span></div><span className={t.status==="Done"?"status-pill done-pill":"status-pill"}>{t.status}</span><span className="task-due">{t.due}</span></div>)}</div>{visibleTasks.length===0&&<div className="empty-state">No matching tasks. Try another search or add a task.</div>}</div></div>}
          {section === "Marketplace" && <div className="marketplace-page">
            <div className="market-hero">
              <div className="market-hero-copy"><span className="market-release">NEW RELEASE · PRECISION LAYER 1</span><h1>SEO Master Agent</h1><p>Dominate the search landscape with real-time backlink analysis, semantic content generation and competitor tracking, all in one specialist agent.</p><div className="market-hero-actions"><button className="market-primary" onClick={() => toggleAgent("seo")}>{installedAgents.includes("seo") ? "Installed ✓" : "Install Now"} <ArrowUpRight size={16}/></button><button className="market-secondary" onClick={() => setNotice("SEO Master Agent: semantic indexing, content optimisation and competitor tracking. Runtime connection is pending.")}>View Details</button></div></div>
              <div className="market-hero-art"><div className="market-chart"><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/></div><div className="market-chip">SEARCH INTELLIGENCE <b>LIVE PREVIEW</b></div></div>
            </div>
            <div className="market-section-head"><h2><Bot size={21}/> Powerful Agents</h2><button className="market-link" onClick={() => {setMarketCategory("All");setMarketSearch("");}}>Explore all Agents <ArrowUpRight size={14}/></button></div>
            <div className="market-controls"><div className="market-search"><Search size={16}/><input value={marketSearch} onChange={e=>setMarketSearch(e.target.value)} placeholder="Search agents, templates, or workflows..."/></div><select value={marketCategory} onChange={e=>setMarketCategory(e.target.value)}><option>All</option><option>Marketing</option><option>Business</option><option>Specialist</option><option>Research</option><option>Finance</option><option>Operations</option></select></div>
            <div className="market-agent-grid">{filteredMarketplaceAgents.map(a=>{const Icon=a.icon;const installed=installedAgents.includes(a.id);return <article className="market-agent-card" key={a.id}><div className={"market-agent-icon "+a.tone}><Icon size={23}/></div><span className="market-category">{a.category}</span><h3>{a.name}</h3><p>{a.description}</p><div className="market-card-foot"><strong>{a.price}<small>/mo</small></strong><button onClick={()=>toggleAgent(a.id)}>{installed ? "Added ✓" : "Add to OS ⊕"}</button></div></article>})}</div>
            <div className="market-lower-grid"><div><div className="market-section-head"><h2>OS Templates</h2><button className="market-link" onClick={()=>setNotice("More OS templates will appear here as the catalogue expands.")}>See all</button></div><div className="market-template-list">{marketplaceTemplates.map(t=><div className="market-template" key={t.name}><div className="template-thumb">{t.icon}</div><div><strong>{t.name}</strong><p>{t.detail}</p></div><span>{t.price}</span></div>)}</div></div><div><div className="market-section-head"><h2>Popular Workflows</h2><button className="market-link" onClick={()=>setNotice("Workflow catalogue is ready for backend integration.")}>See all</button></div><div className="market-workflow-list">{marketplaceWorkflows.map(w=><button className="market-workflow" key={w.name} onClick={()=>setNotice(w.name + " workflow selected. Connect integrations to activate it.")}><span className="workflow-symbol">{w.icon}</span><span><strong>{w.name}</strong><small>{w.detail}</small></span><em>☆ {w.rating}</em></button>)}</div></div></div>
            <div className="market-stats"><div><strong>2,400+</strong><span>VERIFIED AGENTS</span></div><div><strong>12M+</strong><span>TASKS AUTOMATED</span></div><div><strong>99.9%</strong><span>UPTIME GUARANTEE</span></div></div>
            <button className="market-cart" onClick={()=>setMarketCart(!marketCart)} aria-label="View installed agents"><BriefcaseBusiness size={21}/><b>{installedAgents.length}</b></button>
            {marketCart && <div className="market-cart-pop"><strong>Your OS collection</strong><p>{installedAgents.length ? installedAgents.map(id=>marketplaceAgents.find(a=>a.id===id)?.name).join(", ") : "No agents added yet."}</p><button onClick={()=>setMarketCart(false)}>Close</button></div>}
          </div>}
          {section === "Documents" && <div className="workspace-page"><div className="page-heading"><div className="eyebrow"><span className="gold-dot"/> FILE MANAGEMENT</div><h1>Documents</h1><p className="subheading">A central place for operating documents, briefs and project files.</p></div><div className="empty-card"><div className="empty-icon"><FileText size={25}/></div><h3>Document workspace</h3><p>Folders, previews, version history and secure file sharing will be connected when storage is configured.</p><button className="secondary-btn" onClick={()=>setNotice("Document storage will be enabled after backend integration.")}><Plus size={15}/> Upload document</button></div></div>}
          {section === "Analytics" && <div className="workspace-page"><div className="page-heading"><div className="eyebrow"><span className="gold-dot"/> PERFORMANCE INTELLIGENCE</div><h1>Analytics</h1><p className="subheading">A live view of progress across projects, tasks and agent activity.</p></div><div className="metrics"><Metric label="Projects tracked" value={String(projects.length)} change="Starter workspace" icon={<FolderKanban size={17}/>} /><Metric label="Tasks created" value={String(tasks.length)} change="Stored in this browser" icon={<ListTodo size={17}/>} /><Metric label="Tasks completed" value={String(completed)} change="Marked as done" icon={<Check size={17}/>} /><Metric label="Agents installed" value={String(installedAgents.length)} change="Local preview only" icon={<Bot size={17}/>} /></div><div className="panel analytics-panel"><div className="panel-head"><div><h3>Workspace activity</h3><p>Task completion snapshot</p></div></div><div className="analytics-bars">{[["Projects",projects.length,5],["Open tasks",tasks.filter(t=>t.status!=="Done").length,8],["Completed",completed,8],["Agents",installedAgents.length,6]].map(([label,value,max])=><div className="analytics-bar" key={String(label)}><span>{label}</span><div><i style={{width:Math.min(100,Number(value)/Number(max)*100)+"%"}}/></div><b>{value}</b></div>)}</div></div></div>}
          {section === "Knowledge Hub" && <div className="workspace-page"><div className="page-heading"><div className="eyebrow"><span className="gold-dot"/> SHARED KNOWLEDGE</div><h1>Knowledge hub</h1><p className="subheading">A secure home for company documents, decisions and reference material.</p></div><div className="empty-card"><div className="empty-icon"><FileText size={25}/></div><h3>Your knowledge base starts here</h3><p>Document upload, search and AI retrieval will be connected after Supabase Storage and access policies are configured.</p><button className="secondary-btn" onClick={()=>setNotice("Knowledge Hub storage is planned for the next integration step.")}><Plus size={15}/> Add a document</button></div></div>}
          {section === "Activity" && <div className="workspace-page"><div className="page-heading"><div className="eyebrow"><span className="gold-dot"/> AUDIT TRAIL</div><h1>Activity</h1><p className="subheading">A record of important actions across your workspace.</p></div><div className="panel activity-full"><div className="activity-line"><span className="activity-icon"><Check size={14}/></span><div><strong>Altavex AI OS repository initialised</strong><small>GitHub · Today</small></div></div><div className="activity-line"><span className="activity-icon"><ShieldCheck size={14}/></span><div><strong>Security-first architecture defined</strong><small>Platform planning · Today</small></div></div><div className="activity-line"><span className="activity-icon muted"><Clock3 size={14}/></span><div><strong>Supabase and Vercel integration pending</strong><small>Infrastructure · Waiting for setup</small></div></div></div></div>}
          {section === "Settings" && <div className="workspace-page"><div className="page-heading"><div className="eyebrow"><span className="gold-dot"/> PREFERENCES</div><h1>Settings</h1><p className="subheading">Workspace identity, security and connected services.</p></div><div className="settings-list"><Setting title="Workspace" detail="Altavex Group · Founder workspace" tag="Configured"/><Setting title="Authentication" detail="Supabase Auth and protected routes" tag="Pending"/><Setting title="AI provider" detail="OpenAI API connection" tag="Pending"/><Setting title="Deployment" detail="Vercel production environment" tag="Pending"/><Setting title="Brand identity" detail="Gold, deep brown and cream palette" tag="Configured"/></div></div>}
          <footer className="footer"><span>ALTAVEX AI OS <b>·</b> VERSION 0.1.0</span><span>Built for thoughtful progress.</span></footer>
        </div>
      </section>
      {deployModal && <div className="modal-backdrop" onClick={()=>setDeployModal(false)}><div className="modal" onClick={e=>e.stopPropagation()}><div className="modal-head"><div><h3>Deploy an agent</h3><p>Create a specialist agent draft for your workspace.</p></div><button className="icon-btn" onClick={()=>setDeployModal(false)}><X size={18}/></button></div><label>Agent name</label><input autoFocus value={deployName} onChange={e=>setDeployName(e.target.value)} placeholder="e.g. Operations Coordinator"/><label>Agent role</label><select value={deployRole} onChange={e=>setDeployRole(e.target.value)}><option>General assistant</option><option>Research and analysis</option><option>Marketing and content</option><option>Software development</option><option>Business operations</option></select><div className="modal-actions"><button className="secondary-btn" onClick={()=>setDeployModal(false)}>Cancel</button><button className="primary-btn" onClick={deployAgent}><Plus size={15}/> Save draft</button></div></div></div>}
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
