"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  Bot,
  CalendarDays,
  Code2,
  Database,
  Github,
  Lightbulb,
  Linkedin,
  LayoutTemplate,
  Mail,
  Moon,
  Radio,
  Rocket,
  ServerCog,
  Sparkles,
  Sun,
  TerminalSquare,
  X
} from "lucide-react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

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
    body: "Node, Express, Bun, Prisma, PostgreSQL, Supabase, rate limits, and protected APIs.",
    icon: Database
  },
  {
    title: "UI Engineering",
    body: "Responsive product interfaces, interaction systems, animation polish, and design taste.",
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

const workflowSteps = [
  {
    title: "Brief",
    summary: "Turn the rough idea into product intent.",
    detail: "Audience, promise, constraints",
    artifact: "Product brief",
    meta: "01 / Strategy",
    step: 1,
    icon: Lightbulb
  },
  {
    title: "Flow",
    summary: "Map the path a real user takes.",
    detail: "Screens, states, decisions",
    artifact: "UX map",
    meta: "02 / Experience",
    step: 2,
    icon: LayoutTemplate
  },
  {
    title: "Interface",
    summary: "Design the product surface people trust.",
    detail: "Responsive UI, motion, polish",
    artifact: "Product screen",
    meta: "03 / UI",
    step: 3,
    icon: Code2
  },
  {
    title: "Systems",
    summary: "Connect auth, APIs, data, and business logic.",
    detail: "Node, Postgres, Supabase",
    artifact: "Reliable backend",
    meta: "04 / Engineering",
    step: 4,
    icon: ServerCog
  },
  {
    title: "AI",
    summary: "Add the workflows that make the product feel smart.",
    detail: "Agents, RAG, streaming UX",
    artifact: "AI workflow",
    meta: "05 / Intelligence",
    step: 5,
    icon: Bot
  },
  {
    title: "Launch",
    summary: "Ship a usable product with production signals.",
    detail: "Deploy, observe, improve",
    artifact: "Live product",
    meta: "06 / Production",
    step: 6,
    icon: Rocket
  }
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
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (
      !el ||
      matchMedia("(pointer: coarse)").matches ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let bounds = el.getBoundingClientRect();
    const xTo = gsap.quickTo(el, "x", { duration: 0.28, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.28, ease: "power3.out" });

    const onEnter = () => {
      bounds = el.getBoundingClientRect();
      el.classList.add("is-magnetic");
    };

    const onMove: EventListener = (event) => {
      const pointerEvent = event as PointerEvent;
      const x = pointerEvent.clientX - bounds.left - bounds.width / 2;
      const y = pointerEvent.clientY - bounds.top - bounds.height / 2;
      xTo(x * 0.22);
      yTo(y * 0.22);
    };

    const onLeave = () => {
      el.classList.remove("is-magnetic");
      xTo(0);
      yTo(0);
    };

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const classes = `magnetic ${variant} ${className}`;

  if (href) {
    const isExternal = href.startsWith("http");
    return (
      <a
        ref={ref as React.MutableRefObject<HTMLAnchorElement>}
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
    <button ref={ref as React.MutableRefObject<HTMLButtonElement>} className={classes} onClick={onClick}>
      {children}
    </button>
  );
}

function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = matchMedia("(pointer: coarse)");

    if (reducedMotion.matches || coarsePointer.matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.documentElement.classList.add("custom-cursor-enabled");

    gsap.set([dot, ring], { x: -100, y: -100, xPercent: -50, yPercent: -50, opacity: 1 });
    const dotX = gsap.quickSetter(dot, "x", "px");
    const dotY = gsap.quickSetter(dot, "y", "px");
    const ringX = gsap.quickTo(ring, "x", { duration: 0.18, ease: "power2.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.18, ease: "power2.out" });

    const move = (event: PointerEvent) => {
      dotX(event.clientX);
      dotY(event.clientY);
      ringX(event.clientX);
      ringY(event.clientY);
    };

    const setHover = (event: PointerEvent) => {
      const targetElement = event.target as Element | null;
      const hovering = !!targetElement?.closest("button, a, [data-cursor='hover']");
      dot.classList.toggle("hovering", hovering);
      ring.classList.toggle("hovering", hovering);
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", setHover, { passive: true });

    return () => {
      document.documentElement.classList.remove("custom-cursor-enabled");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", setHover);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
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
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [activeSection, setActiveSection] = useState("Projects");
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(1);
  const heroSystemRef = useRef<HTMLDivElement | null>(null);
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
    const timer = window.setTimeout(() => setLoaded(true), 1200);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      setActiveWorkflowStep((step) => (step % workflowSteps.length) + 1);
    }, 2200);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
      const el = heroSystemRef.current;
    if (
      !el ||
      matchMedia("(pointer: coarse)").matches ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let frame = 0;

    const resetDepth = () => {
      cancelAnimationFrame(frame);
      el.classList.remove("is-interacting");
      el.style.setProperty("--tilt-x", "0deg");
      el.style.setProperty("--tilt-y", "0deg");
      el.style.setProperty("--drift-x", "0px");
      el.style.setProperty("--drift-y", "0px");
      el.style.setProperty("--spot-x", "74%");
      el.style.setProperty("--spot-y", "30%");
    };

    const onMove: EventListener = (event) => {
      const pointerEvent = event as PointerEvent;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const px = (pointerEvent.clientX - rect.left) / rect.width;
        const py = (pointerEvent.clientY - rect.top) / rect.height;
        const clampedX = Math.min(Math.max(px, 0), 1);
        const clampedY = Math.min(Math.max(py, 0), 1);
        const tiltY = (clampedX - 0.5) * 16;
        const tiltX = (0.5 - clampedY) * 12;

        el.classList.add("is-interacting");
        el.style.setProperty("--tilt-x", `${tiltX.toFixed(2)}deg`);
        el.style.setProperty("--tilt-y", `${tiltY.toFixed(2)}deg`);
        el.style.setProperty("--drift-x", `${((clampedX - 0.5) * 10).toFixed(2)}px`);
        el.style.setProperty("--drift-y", `${((clampedY - 0.5) * 8).toFixed(2)}px`);
        el.style.setProperty("--spot-x", `${(clampedX * 100).toFixed(1)}%`);
        el.style.setProperty("--spot-y", `${(clampedY * 100).toFixed(1)}%`);
      });
    };

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", resetDepth);

    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", resetDepth);
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

    const cards = gsap.utils.toArray<HTMLElement>(".project-panel");
    gsap.fromTo(
      cards,
      { y: 46, opacity: 0, rotateX: 4, scale: 0.97 },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        scale: 1,
        duration: 0.82,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: projectSection,
          start: "top 74%",
          once: true
        }
      }
    );

    const media = gsap.matchMedia();
    media.add("(min-width: 981px) and (prefers-reduced-motion: no-preference)", () => {
      const section = document.querySelector<HTMLElement>(".projects-section");
      const sticky = document.querySelector<HTMLElement>(".projects-sticky");
      const track = document.querySelector<HTMLElement>(".projects-track");

      if (!section || !sticky || !track) return;

      const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth + 48);

      gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: sticky,
          start: "top top",
          end: () => `+=${getDistance() + window.innerHeight * 0.5}`,
          pin: sticky,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
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

    const transition = (document as Document & { startViewTransition?: (callback: () => void) => void })
      .startViewTransition;

    if (!transition) {
      setTheme(nextTheme);
      return;
    }

    transition(() => setTheme(nextTheme));
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

  const activeWorkflow =
    workflowSteps.find((step) => step.step === activeWorkflowStep) || workflowSteps[0];
  const ActiveWorkflowIcon = activeWorkflow.icon;

  return (
    <main>
      <CustomCursor />

      {!loaded && (
        <div className="loader">
          <div className="loader-mark">
            <span>AMLAN.LIVE</span>
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

      <section id="home" className="hero section-shell">
        <div className="hero-studio-backdrop" aria-hidden="true" />
        <div className="hero-ambient-glow" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow hero-role-line">
            <span className="role-token role-token-1">
              <span className="mask"><span className="reveal">Full-stack AI developer</span></span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="role-token role-token-2">
              <span className="mask"><span className="reveal">Software Engineer</span></span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="role-token role-token-3">
              <span className="mask"><span className="reveal">Indie Hacker</span></span>
            </span>
          </p>
          <h1>
            <span className="mask"><span className="reveal">I build full stack products</span></span>
            <span className="mask"><span className="reveal">that are ready to <span className="serif-emphasis">ship</span>.</span></span>
          </h1>
          <p className="hero-sub">
            I turn ambiguous product ideas into polished interfaces, reliable backends, and
            AI-powered workflows using Next.js, React, Node, PostgreSQL, Supabase, and modern LLM tooling.
          </p>
          <div className="hero-actions">
            <MagneticButton href={scheduleUrl} className="hero-call-button">
              Schedule call with me <CalendarDays size={19} />
            </MagneticButton>
            <MagneticButton href="#projects" variant="secondary">
              View Work <ArrowUpRight size={18} />
            </MagneticButton>
            <div className="hero-proof" aria-label="Core strengths">
              <span>AI apps</span>
              <span>Realtime systems</span>
              <span>SaaS MVPs</span>
            </div>
          </div>
          <div className="hero-status-strip" aria-label="Current status">
            <span><i aria-hidden="true" /> Available · 2026</span>
            <span>Guwahati, IN</span>
            {/* TODO: Wire this to the GitHub events API once public activity is connected. */}
            <span>Last shipped · 2 days ago</span>
            <span>v3.0</span>
          </div>
        </div>

        <div ref={heroSystemRef} className="hero-system" aria-label="Interactive idea to product console">
          <div className="product-console">
            <div className="console-topbar">
              <div>
                <span className="online-dot" />
                <code>idea-to-product.console</code>
              </div>
              <strong>{activeWorkflow.artifact}</strong>
            </div>

            <div className="console-workspace">
              <div className="console-stage-strip" aria-label="Workflow stages">
                {workflowSteps.map((step) => {
                  const Icon = step.icon;
                  const isActive = activeWorkflowStep === step.step;

                  return (
                    <button
                      className={`console-step ${isActive ? "is-active" : ""}`}
                      key={step.title}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setActiveWorkflowStep(step.step)}
                      data-cursor="hover"
                    >
                      <span><Icon size={15} /></span>
                      <strong>{step.title}</strong>
                    </button>
                  );
                })}
              </div>

              <div className="console-product" data-active-step={activeWorkflowStep}>
                <div className="console-product-glow" aria-hidden="true" />
                <div className="console-journey">
                  <div className="console-idea">
                    <span>Raw idea</span>
                    <p>“I need an AI product people can understand, trust, and actually use.”</p>
                  </div>

                  <div className="console-product-mark" aria-hidden="true">
                    <span><ActiveWorkflowIcon size={22} /></span>
                    <i />
                  </div>

                  <div className="console-screen">
                    <div className="console-screen-top">
                      <span />
                      <span />
                      <span />
                      <strong>Live surface</strong>
                    </div>
                    <div className="console-screen-body">
                      <div className="console-main">
                        <div className="console-preview-head">
                          <span>{activeWorkflow.meta}</span>
                          <strong>{activeWorkflow.title}</strong>
                          <p>{activeWorkflow.summary}</p>
                        </div>
                        <div className="console-ui-row is-primary">
                          <i />
                          <div>
                            <strong>{activeWorkflow.artifact}</strong>
                            <span>{activeWorkflow.detail}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="console-status">
                  <span>Idea</span>
                  <i />
                  <span>System</span>
                  <i />
                  <span>Live</span>
                </div>
              </div>
            </div>
          </div>
        </div>
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
          <h2><span className="mask"><span className="reveal">Three builds across AI search, realtime systems, and agent infrastructure.</span></span></h2>
          <p className="projects-kicker">Scroll through a reel of production-minded builds, from live AI search to realtime collaboration and agent memory infrastructure.</p>
        </div>
        <div className="projects-reel">
          <div className="projects-sticky">
            <div className="projects-track">
          {projects.map((project, index) => (
            <article
              className="project-panel"
              key={project.id}
            >
              <div className="project-index">0{index + 1}</div>
              <div className="project-visual">
                <div className="visual-topline">
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
                <p className="eyebrow">{project.accent}</p>
                <p>{project.label}</p>
                <div className="project-stack-preview" aria-label={`${project.title} tech stack preview`}>
                  {project.stack.slice(0, 6).map((item) => (
                    <span key={item}>{item}</span>
                  ))}
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
          ))}
              <aside className="project-reel-end" aria-label="Project reel call to action">
                <span>Next build</span>
                <strong>Have an idea worth shipping?</strong>
                <p>Bring the messy first version. I&apos;ll help turn it into a product users can try.</p>
                <MagneticButton href={scheduleUrl}>Schedule call <CalendarDays size={16} /></MagneticButton>
              </aside>
            </div>
          </div>
        </div>
        <div className="project-scroll-hint section-shell" aria-hidden="true">
          <span>Vertical scroll drives the reel</span>
          <i />
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
          <h2><span className="mask"><span className="reveal">Security-aware systems thinking, now applied to full-stack AI products.</span></span></h2>
        </div>
        <div className="timeline">
          <article>
            <span>July 2022 - September 2023</span>
            <h3>Cybersecurity Analyst · Microland Ltd</h3>
            <p>Reduced false-positive SOC alerts by 25% through SIEM tuning across Securonix, Microsoft Defender, and AlienVault.</p>
            <p>Led log analysis and incident response work that reduced MTTD/MTTR by 20%.</p>
            <p>Used Qualys vulnerability data to prioritize high-impact security gaps and strengthen posture.</p>
          </article>
          <article>
            <span>May 2021 - July 2021</span>
            <h3>Software Engineer Intern · TheFlak Group / APRIC</h3>
            <p>Designed scalable components, data models, and MVP feature flows for Flakmart.</p>
            <p>Built a geospatial web module and Python ML model for CRM segmentation.</p>
            <p>Developed an interactive React chatbot to reduce manual query load.</p>
          </article>
        </div>
        <div className="education">
          <h3>Education</h3>
          <div>
            <strong>Amity University</strong>
            <span>B.Tech Computer Science Engineering · GGPA 8.03 · 2018-2022</span>
          </div>
          <div>
            <strong>Scaler Academy</strong>
            <span>Software Engineering specialization, Full-stack Development, System Design & Product Management · 2025-2026</span>
          </div>
        </div>
      </section>

      <section id="research" className="research section-shell">
        <div>
          <p className="eyebrow">Research</p>
          <h2><span className="mask"><span className="reveal">Applied ML credibility beyond product interfaces.</span></span></h2>
        </div>
        <article className="research-card">
          <span>Published · 2022</span>
          <h3>Solving Handwritten Equations Using Convolutional Neural Network</h3>
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
          <span className="online-dot" />
          <div><small>Status</small><strong>Online</strong></div>
          <div><small>Active now</small><strong>{stats.active}</strong></div>
          <div><small>Total visits</small><strong>{stats.visits}</strong></div>
          <div><small>Top project</small><strong>{stats.topProject}</strong></div>
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
