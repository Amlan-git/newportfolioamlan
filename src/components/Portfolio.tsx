"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  CalendarDays,
  Code2,
  Database,
  Github,
  Linkedin,
  Mail,
  Moon,
  Radio,
  Sparkles,
  Sun,
  TerminalSquare,
  X
} from "lucide-react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import GrainShaderBackground from "./GrainShaderBackground";
import WorkflowCanvasHero from "./WorkflowCanvasHero";

type Project = {
  id: string;
  title: string;
  label: string;
  description: string;
  stack: string[];
  features: string[];
  proof: string;
  live: string;
  github: string;
  architecture: string[];
  accent: string;
  image?: string;
};

type Tab = "Overview" | "Architecture" | "Features" | "Links";

const navItems = ["Projects", "Skills", "Experience", "Research", "Blog"];
const pendingUrl = "javascript:void(0)";
const scheduleUrl = "https://cal.com/amlan-bora";
const loaderWord = "AMLAN.LIVE";

const projects: Project[] = [
  {
    id: "query-ai",
    title: "Query AI",
    label: "Conversational AI search engine with live web retrieval and citations",
    description:
      "A full-stack AI search platform with streamed LLM answers, source cards, follow-up prompts, protected routes, and persistent conversation history.",
    stack: [
      "TypeScript",
      "React",
      "Express",
      "Supabase Auth",
      "PostgreSQL",
      "Prisma",
      "Tavily",
      "Gemini",
      "Vercel AI SDK",
      "Bun"
    ],
    features: [
      "streamed LLM answers with inline citations",
      "real-time web retrieval and source cards",
      "protected APIs, rate limiting, and persisted history",
      "responsive AI search UX with sidebar conversations"
    ],
    proof:
      "Designed the Bun/Express backend, auth, Prisma persistence, Tavily retrieval, Gemini answer generation, and live answer rendering pipeline.",
    live: "https://query-ai-search.vercel.app/",
    github: "https://github.com/Amlan-git/query-AI",
    architecture: ["Query", "Search", "Rank", "Stream", "Persist"],
    accent: "AI Search",
    image: "/assets/projects/query-ai.png"
  },
  {
    id: "drawly",
    title: "Drawly",
    label: "Collaborative whiteboard with realtime rooms, auth, and cloud-saved diagrams",
    description:
      "A canvas-first whiteboard for anonymous drawing, authenticated cloud diagrams, realtime rooms, read-only sharing, and PNG/SVG export.",
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Supabase",
      "PostgreSQL",
      "Yjs",
      "Hocuspocus",
      "WebSockets",
      "Google OAuth"
    ],
    features: [
      "anonymous local diagrams and authenticated cloud saves",
      "room-based realtime collaboration",
      "read-only sharing and browser-side exports",
      "connection-state handling and loop prevention"
    ],
    proof:
      "Built hybrid persistence across LocalStorage and Supabase RLS while synchronizing canvas state through Yjs, Hocuspocus, and WebSockets.",
    live: "https://drawlyy.vercel.app/",
    github: "https://github.com/Amlan-git/drawly",
    architecture: ["Canvas", "Yjs", "Room", "RLS", "Export"],
    accent: "Realtime",
    image: "/assets/projects/drawly.png"
  },
  {
    id: "waggle",
    title: "Waggle MCP",
    label: "External memory layer for AI agents",
    description:
      "Open-source MCP infrastructure that gives AI agents persistent memory through local storage, knowledge graphs, embeddings, and retrieval.",
    stack: [
      "Python",
      "MCP",
      "SQLite",
      "Knowledge Graphs",
      "Embeddings",
      "Docker",
      "Kubernetes"
    ],
    features: [
      "persistent external memory for agents",
      "local embeddings and knowledge graph storage",
      "MCP-compatible server interface",
      "containerized deployment path"
    ],
    proof:
      "Co-maintained infrastructure that makes AI agent memory explicit, inspectable, and portable beyond a single chat session.",
    live: "https://github.com/Abhigyan-Shekhar/Waggle-mcp",
    github: "https://github.com/Abhigyan-Shekhar/Waggle-mcp",
    architecture: ["Agent", "MCP", "Memory", "Graph", "Recall"],
    accent: "Open Source",
    image: "/assets/projects/waggle-mcp.png"
  }
];

const skillPillars = [
  {
    title: "Full-stack Web Apps",
    body: "React and Next.js interfaces, APIs, auth, dashboards, and production product flows.",
    icon: Code2
  },
  {
    title: "AI Product & Engineering",
    body: "LLM apps, RAG, agents, AI search, streaming UX, embeddings, vector DBs, and MCP.",
    icon: Sparkles
  },
  {
    title: "Backend Systems",
    body: "Node.js, Express, Bun, Hono, Prisma, Drizzle, PostgreSQL, and Supabase.",
    icon: Database
  },
  {
    title: "Design Engineering",
    body: "UI/UX and product design, user flows, interaction and visual systems, rapid prototyping, and polished responsive interfaces.",
    icon: Radio
  },
  {
    title: "Deployment & Tooling",
    body: "Vercel, Docker, AWS, GitHub workflows, environment design, and production readiness.",
    icon: TerminalSquare
  }
];

const stackMatrix = [
  ["Languages", "Java", "JavaScript", "TypeScript", "Python", "SQL"],
  ["Frontend", "React", "Next.js", "Tailwind CSS"],
  ["Backend", "Node.js", "Express.js", "Bun"],
  ["Databases", "PostgreSQL", "MySQL", "MongoDB", "Supabase", "Prisma"],
  ["AI / GenAI", "LLM Apps", "RAG", "AI Agents", "Vercel AI SDK", "MCP", "Embeddings", "Vector DBs"],
  ["Tools", "Git", "GitHub", "Docker", "Vercel", "AWS", "n8n"]
];

function MagneticButton({
  children,
  href,
  onClick,
  variant = "primary",
  className = ""
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
}) {
  const classes = `magnetic ${variant} ${className}`;

  if (href) {
    const isExternal = href.startsWith("http");
    return (
      <a
        className={classes}
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noreferrer" : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={classes} onClick={onClick}>
      {children}
    </button>
  );
}

function useTelemetry() {
  const [stats, setStats] = useState({
    active: "-",
    visits: "-",
    topProject: "collecting"
  });

  const getSupabase = (): SupabaseClient | null => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    return url && key ? createClient(url, key) : null;
  };

  useEffect(() => {
    const supabase = getSupabase();

    if (!supabase) {
      const visits = Number(localStorage.getItem("amlan-visits") || "0") + 1;
      localStorage.setItem("amlan-visits", String(visits));
      setStats({ active: "1", visits: String(visits), topProject: "Query AI" });
      return;
    }

    const sessionId =
      sessionStorage.getItem("amlan-session") || crypto.randomUUID();
    sessionStorage.setItem("amlan-session", sessionId);

    void supabase
      .from("portfolio_events")
      .insert({
        session_id: sessionId,
        event_type: "visit",
        path: "/"
      })
      .then(({ error }) => {
        if (error) console.warn("Telemetry visit skipped:", error.message);
      });

    supabase
      .from("portfolio_events")
      .select("event_type, project_id")
      .then(({ data }) => {
          const visits = data?.filter((event) => event.event_type === "visit").length ?? 1;
          const projectCounts = new Map<string, number>();
          data
            ?.filter((event) => event.event_type === "project_open" && event.project_id)
            .forEach((event) => {
              projectCounts.set(event.project_id!, (projectCounts.get(event.project_id!) || 0) + 1);
            });
          const top = [...projectCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
          setStats({
            active: "live",
            visits: String(visits),
            topProject: projects.find((project) => project.id === top)?.title || "Query AI"
          });
        },
        (error: Error) => {
        console.warn("Telemetry read skipped:", error.message);
      });
  }, []);

  const track = (event_type: string, project_id?: string) => {
    const supabase = getSupabase();
    if (!supabase) return;

    void supabase
      .from("portfolio_events")
      .insert({
        session_id: sessionStorage.getItem("amlan-session") || crypto.randomUUID(),
        event_type,
        project_id,
        path: "/"
      })
      .then(({ error }) => {
        if (error) console.warn("Telemetry event skipped:", error.message);
      });
  };

  return { stats, track };
}

export default function Portfolio() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [loaded, setLoaded] = useState(false);
  const [typedLoaderWord, setTypedLoaderWord] = useState("");
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [activeSection, setActiveSection] = useState("Projects");
  const [istTime, setIstTime] = useState("--:--:--");
  const [istDateTime, setIstDateTime] = useState("");
  const { stats, track } = useTelemetry();

  const contactLinks = useMemo(
    () => [
      { label: "Email", href: "mailto:amlan4391@gmail.com", icon: Mail },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/amlanjyoti-bora/", icon: Linkedin },
      { label: "30 min", href: scheduleUrl, icon: CalendarDays }
    ],
    []
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    });
    const updateIstTime = () => {
      const now = new Date();
      setIstTime(formatter.format(now));
      setIstDateTime(now.toISOString());
    };

    updateIstTime();
    const timer = window.setInterval(updateIstTime, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const characterTimers = loaderWord.split("").map((_, index) =>
      window.setTimeout(
        () => setTypedLoaderWord(loaderWord.slice(0, index + 1)),
        100 + index * (1100 / 9)
      )
    );
    const timer = window.setTimeout(() => setLoaded(true), 2450);
    return () => {
      characterTimers.forEach((characterTimer) => window.clearTimeout(characterTimer));
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const revealItems = gsap.utils.toArray<HTMLElement>(".reveal");
    revealItems.forEach((item) => {
      gsap.fromTo(
        item,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: item,
            start: "top 88%"
          }
        }
      );
    });

    const projectSection = document.getElementById("projects");
    if (projectSection) {
      gsap.fromTo(
        ".projects-section .section-intro",
        { y: 34, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: projectSection,
            start: "top 78%"
          }
        }
      );
    }

    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const stack = document.querySelector<HTMLElement>(".projects-stack");
      const stackItems = gsap.utils.toArray<HTMLElement>(".project-stack-item");

      if (!stack) return;

      gsap.set(stackItems, { transformPerspective: 1200 });

      stackItems.slice(0, -1).forEach((card, index) => {
        const scale = 1 - (stackItems.length - index - 1) * 0.05;

        gsap.to(card, {
          scale,
          ease: "none",
          scrollTrigger: {
            trigger: stack,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.65,
            invalidateOnRefresh: true
          }
        });
      });
    });

    const sections = navItems.map((item) => document.getElementById(item.toLowerCase()));
    sections.forEach((section, index) => {
      if (!section) return;
      ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActiveSection(navItems[index]),
        onEnterBack: () => setActiveSection(navItems[index])
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      media.revert();
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    const root = document.documentElement;
    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const viewTransitionDocument = document as Document & {
      startViewTransition?: (callback: () => void) => void;
    };

    if (!viewTransitionDocument.startViewTransition) {
      setTheme(nextTheme);
      return;
    }

    viewTransitionDocument.startViewTransition(() => setTheme(nextTheme));
    root.animate(
      {
        clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]
      },
      {
        duration: 650,
        easing: "cubic-bezier(.2,.8,.2,1)",
        pseudoElement: "::view-transition-new(root)"
      }
    );
  };

  const openProject = (project: Project) => {
    setActiveProject(project);
    setActiveTab("Overview");
    track("project_open", project.id);
  };

  return (
    <main>
      <GrainShaderBackground theme={theme} />

      {!loaded && (
        <div className="loader">
          <div className="loader-mark">
            <span className="loader-word-frame">
              <span className="loader-word-spacer" aria-hidden="true">{loaderWord}</span>
              <span className="loader-word" role="status" aria-label={loaderWord}>
                <span aria-hidden="true">{typedLoaderWord}</span>
              </span>
            </span>
            <i />
          </div>
          <div className="loader-lines">
            <span>initializing product systems</span>
            <span>syncing projects</span>
            <span>entering workspace</span>
          </div>
        </div>
      )}

      <div className="scroll-progress" />

      <header className="site-header">
        <a href="#home" className="brand" aria-label="Amlan live home">
          <span>amlan.live</span>
          <span>Amlan</span>
        </a>
        <nav aria-label="Main navigation">
          {navItems.map((item) => (
            <a
              key={item}
              className={activeSection === item ? "active" : ""}
              href={`#${item.toLowerCase()}`}
            >
              {item}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <MagneticButton href={scheduleUrl} className="nav-call-button">
            <CalendarDays size={15} />
            <span className="nav-call-full">Schedule Call</span>
            <span className="nav-call-short">Call</span>
          </MagneticButton>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      <section
        id="home"
        className="hero hero-wide-shell section-shell grid grid-cols-1 items-center gap-y-10 pt-[140px] pb-14 lg:min-h-[min(820px,100svh)] lg:grid-cols-2 lg:gap-x-12 lg:gap-y-0 lg:pt-[124px] xl:gap-x-16"
      >
        <div className="hero-ambient-glow" aria-hidden="true" />
        <header className="hero-copy relative z-[1] flex w-full max-w-[540px] min-h-0 lg:min-h-[540px] flex-col justify-center justify-self-center lg:justify-self-start">
          <div className="hero-message flex w-full flex-col">
            <div className="hero-identity">
              <span className="hero-avatar-frame">
                <Image
                  src="/assets/profilephoto-avatar.webp"
                  alt="Portrait of Amlan"
                  width={72}
                  height={72}
                  sizes="(max-width: 640px) 60px, 72px"
                  className="hero-avatar hero-avatar--identity"
                  priority
                />
              </span>
              <div className="hero-identity-copy">
                <strong>Amlan Bora</strong>
                <p className="eyebrow hero-role-line">
                  <span className="hero-code-symbol" aria-hidden="true">&gt;_</span>
                  <span
                    className="hero-role-typing"
                    data-text="FULL-STACK AI ENGINEER"
                    aria-label="FULL-STACK AI ENGINEER"
                  >
                    <span aria-hidden="true">FULL-STACK AI ENGINEER</span>
                  </span>
                </p>
              </div>
            </div>
            <h1 className="hero-headline">
              <span className="mask"><span className="reveal">Turning ideas into</span></span>
              <span className="mask"><span className="reveal">products that <span className="serif-emphasis">ship</span></span></span>
            </h1>
          </div>
          <p className="hero-sub">
            I collaborate with founders and product teams to design and build
            full-stack and AI-powered products, from early concepts through launch.
          </p>
          <div className="hero-actions max-sm:flex-col max-sm:items-start">
            <MagneticButton href={scheduleUrl} className="hero-call-button">
              Book a free build call <CalendarDays size={19} />
            </MagneticButton>
            <MagneticButton href="#projects" variant="secondary" className="hero-work-button">
              See recent work <ArrowUpRight size={18} />
            </MagneticButton>
          </div>
          <div className="hero-proof" aria-label="Core strengths">
            <span>web apps</span>
            <span>SaaS MVPs</span>
            <span>AI apps</span>
          </div>
          <div className="hero-status-strip" aria-label="Current status">
            <span>
              <i aria-hidden="true" />
              <span className="hero-status-label">Available</span>
              <time
                className="hero-status-time"
                dateTime={istDateTime}
                suppressHydrationWarning
              >
                {istTime} IST
              </time>
            </span>
          </div>
        </header>
        <WorkflowCanvasHero />
      </section>

      <section className="openflow section-shell">
        <div>
          <p className="eyebrow">Currently building</p>
          <h2><span className="mask"><span className="reveal">Openflow</span></span></h2>
          <p>A free AI voice writing assistant for turning spoken thoughts into polished text.</p>
        </div>
        <div className="voice-card">
          <div className="waveform" aria-hidden="true">
            {Array.from({ length: 24 }).map((_, index) => <span key={index} />)}
          </div>
          <div className="refined-text">
            <code>voice.raw</code>
            <p>Turn this rough thought into clear, ready-to-send writing.</p>
          </div>
          <MagneticButton href={pendingUrl} variant="secondary">Preview Openflow <ArrowUpRight size={16} /></MagneticButton>
        </div>
      </section>

      <section id="projects" className="projects-section">
        <div className="section-intro section-shell">
          <p className="eyebrow">Selected work</p>
          <h2><span className="mask"><span className="reveal">Some of my recent personal projects.</span></span></h2>
          <p className="projects-kicker">
            <span>Scroll through some of my recent work.</span>
            <span>Some client projects aren&apos;t showcased here.</span>
          </p>
        </div>
        <div className="projects-stack section-shell">
          {projects.map((project, index) => (
            <div
              className="project-stack-item"
              key={project.id}
              style={{ "--stack-index": index } as React.CSSProperties}
            >
              <article className="project-panel">
                <div className="project-visual">
                  <div className="visual-topline">
                    <span className="project-index">0{index + 1}</span>
                    <span>{project.accent}</span>
                    <code>{project.id}</code>
                  </div>
                  <h3 className="project-image-title">{project.title}</h3>
                  {project.image ? (
                    <div className="project-image-wrap">
                      <Image
                        src={project.image}
                        alt={`${project.title} project screenshot`}
                        fill
                        sizes="(max-width: 980px) 100vw, 40vw"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="visual-grid">
                        {project.architecture.map((item) => <span key={item}>{item}</span>)}
                      </div>
                      <div className="visual-signal" aria-hidden="true">
                        <span />
                        <span />
                        <span />
                      </div>
                    </>
                  )}
                </div>
                <div className="project-copy">
                  <p className="project-outcome">{project.label}</p>
                  <div className="project-stack-preview" aria-label={`${project.title} tech stack preview`}>
                    {project.stack.slice(0, 4).map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                    {project.stack.length > 4 ? (
                      <span className="project-stack-more">+{project.stack.length - 4}</span>
                    ) : null}
                  </div>
                  <ul className="project-feature-preview">
                    {project.features.slice(0, 3).map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                  <div className="project-card-actions">
                    <MagneticButton onClick={() => openProject(project)} variant="secondary">Details</MagneticButton>
                    <MagneticButton href={project.live} variant="ghost">Live <ArrowUpRight size={14} /></MagneticButton>
                    <MagneticButton href={project.github} variant="ghost">GitHub <Github size={14} /></MagneticButton>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
        <div className="projects-stack-footer section-shell">
          <aside className="project-stack-end project-reel-end" aria-label="Project stack call to action">
            <span>Next build</span>
            <strong>Have an idea worth shipping?</strong>
            <p>Bring the messy first version. I&apos;ll help turn it into a product users can try.</p>
            <MagneticButton href={scheduleUrl}>Schedule call <CalendarDays size={16} /></MagneticButton>
          </aside>
        </div>
      </section>

      <section id="skills" className="skills section-shell">
        <div className="section-intro">
          <p className="eyebrow">Skills & Services</p>
          <h2><span className="mask"><span className="reveal">Product instincts on top of full-stack execution.</span></span></h2>
        </div>
        <div className="pillar-grid">
          {skillPillars.map(({ title, body, icon: Icon }) => (
            <article className="pillar" key={title}>
              <Icon size={22} />
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
        <div className="stack-matrix">
          {stackMatrix.map(([category, ...items]) => (
            <div key={category} className="stack-row">
              <strong>{category}</strong>
              <div>{items.map((item) => <span key={item}>{item}</span>)}</div>
            </div>
          ))}
        </div>
        <div className="contact-strip">
          <MagneticButton href="#contact">Let&apos;s build something <ArrowUpRight size={18} /></MagneticButton>
          <div className="contact-links">
            {contactLinks.map(({ label, href, icon: Icon }) => (
              <a href={href} key={label} onClick={() => track("cta_click")}>
                <Icon size={16} /> {label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="experience" className="experience section-shell">
        <div className="section-intro">
          <p className="eyebrow">Experience</p>
          <h2><span className="mask"><span className="reveal">A short timeline of my experience.</span></span></h2>
        </div>
        <ol className="timeline" aria-label="Professional experience">
          <li className="timeline-item">
            <span className="timeline-marker" aria-hidden="true" />
            <div className="timeline-content">
              <time dateTime="2022-07/2023-09">July 2022 — September 2023</time>
              <h3>Cybersecurity Engineer <span>· Microland Ltd</span></h3>
              <p>Strengthened security operations by improving alert quality, accelerating incident response, and advancing vulnerability management to prioritize critical risks.</p>
            </div>
          </li>
          <li className="timeline-item">
            <span className="timeline-marker" aria-hidden="true" />
            <div className="timeline-content">
              <time dateTime="2021-05/2021-07">May 2021 — July 2021</time>
              <h3>Software Engineer <span>· TheFlak Group / APRIC</span></h3>
              <p>Built product features across web, data, and conversational AI, including a geospatial module, CRM segmentation model, and React chatbot.</p>
            </div>
          </li>
        </ol>
        <div className="education">
          <div className="education-heading">
            <h3>Educational Background</h3>
          </div>
          <ol className="timeline education-timeline" aria-label="Education">
            <li className="timeline-item">
              <span className="timeline-marker" aria-hidden="true" />
              <div className="timeline-content">
                <time dateTime="2022">2022</time>
                <h3>Bachelor of Technology in Computer Science and Engineering</h3>
                <p>Amity University</p>
              </div>
            </li>
            <li className="timeline-item">
              <span className="timeline-marker" aria-hidden="true" />
              <div className="timeline-content">
                <time dateTime="2025">2025</time>
                <h3>Full-stack Development · AI Engineering · System Design · Product Management</h3>
                <p>Scaler Academy</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section id="research" className="research section-shell">
        <div>
          <p className="eyebrow">Research</p>
          <h2><span className="mask"><span className="reveal">Applied ML credibility beyond product interfaces.</span></span></h2>
        </div>
        <article className="research-card">
          <span>Published · 2023</span>
          <h3><a href="https://pubs.aip.org/aip/acp/article-abstract/2771/1/020014/2908769/Solving-handwritten-equations-using-convolutional?redirectedFrom=fulltext" target="_blank" rel="noreferrer">Solving Handwritten Equations Using Convolutional Neural Network</a></h3>
          <p>Published in IDVRP Conference Journal. A compact signal of early AI/ML work with computer vision and model-driven problem solving.</p>
        </article>
      </section>

      <section id="blog" className="blog section-shell">
        <div>
          <p className="eyebrow">Blog</p>
          <h2><span className="mask"><span className="reveal">Notes from the build path.</span></span></h2>
        </div>
        <article className="blog-card">
          <div>
            <span>Dev.to</span>
            <h3>Featured technical post</h3>
            <p>One published article will appear here with its Dev.to link once the URL is added.</p>
          </div>
          <span className="pending-link" aria-disabled="true">Link pending</span>
        </article>
      </section>

      <section id="contact" className="footer section-shell">
        <div className="telemetry-panel">
          <div>
            <small>Active now</small>
            <strong><span className="online-dot" aria-hidden="true" />{stats.active}</strong>
          </div>
          <div><small>Visits in the last 30 days</small><strong>{stats.visits}</strong></div>
        </div>
        <div>
          <h2>Let&apos;s build something precise.</h2>
          <p>Email, LinkedIn, or a 30-minute Calendly call when you&apos;re ready.</p>
          <div className="footer-links">
            {contactLinks.map(({ label, href, icon: Icon }) => (
              <a href={href} key={label}><Icon size={17} /> {label}</a>
            ))}
          </div>
        </div>
      </section>

      {activeProject && (
        <div className="overlay" role="dialog" aria-modal="true" aria-label={`${activeProject.title} project details`}>
          <div className="overlay-panel">
            <button className="overlay-close" onClick={() => setActiveProject(null)} aria-label="Close project details">
              <X size={18} />
            </button>
            <div className="overlay-head">
              <span>{activeProject.accent}</span>
              <h2>{activeProject.title}</h2>
              <p>{activeProject.label}</p>
            </div>
            <div className="tabs" role="tablist">
              {(["Overview", "Architecture", "Features", "Links"] as Tab[]).map((tab) => (
                <button
                  key={tab}
                  className={activeTab === tab ? "active" : ""}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="tab-body">
              {activeTab === "Overview" && (
                <>
                  <div className="project-visual expanded">
                    <div className="visual-topline"><span>{activeProject.accent}</span><code>{activeProject.id}</code></div>
                    {activeProject.image ? (
                      <div className="project-image-wrap">
                        <Image
                          src={activeProject.image}
                          alt={`${activeProject.title} project screenshot`}
                          fill
                          sizes="(max-width: 980px) 100vw, 780px"
                        />
                      </div>
                    ) : (
                      <div className="visual-grid">{activeProject.architecture.map((item) => <span key={item}>{item}</span>)}</div>
                    )}
                  </div>
                  <p>{activeProject.description}</p>
                  <p className="proof">{activeProject.proof}</p>
                </>
              )}
              {activeTab === "Architecture" && (
                <>
                  <div className="architecture-flow">
                    {activeProject.architecture.map((item) => <span key={item}>{item}</span>)}
                  </div>
                  <p>{activeProject.proof}</p>
                </>
              )}
              {activeTab === "Features" && (
                <ul>{activeProject.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
              )}
              {activeTab === "Links" && (
                <div className="links-tab">
                  <div className="stack-list">{activeProject.stack.map((item) => <span key={item}>{item}</span>)}</div>
                  <div className="project-actions">
                    <MagneticButton href={activeProject.live} variant="secondary">Live <ArrowUpRight size={15} /></MagneticButton>
                    <MagneticButton href={activeProject.github} variant="ghost">GitHub <Github size={15} /></MagneticButton>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
