"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  BrainCircuit,
  CheckCircle2,
  Code2,
  PenTool,
  Rocket,
  Search,
  type LucideIcon
} from "lucide-react";

type CanvasState = "idle" | "running" | "reduced";

type VisibleItems = {
  nodes: string[];
  connectors: string[];
  chips: string[];
  badge: boolean;
};

type WorkflowNode = {
  id: string;
  className: string;
  title: string;
  detail: string;
  chips: string[];
  icon: LucideIcon;
};

const buildChips = ["Frontend", "Backend", "APIs", "DB", "AI", "Tests"];

const workflowNodes: WorkflowNode[] = [
  {
    id: "discovery",
    className: "node-discovery",
    title: "Discovery",
    detail: "Problem, users, scope",
    chips: [],
    icon: Search
  },
  {
    id: "design",
    className: "node-system",
    title: "System Design",
    detail: "Architecture, data, APIs",
    chips: [],
    icon: BrainCircuit
  },
  {
    id: "ui",
    className: "node-design",
    title: "UI/UX Design",
    detail: "Flows, screens, interactions",
    chips: [],
    icon: PenTool
  },
  {
    id: "build",
    className: "node-build",
    title: "Build + Test",
    detail: "Production app engineering",
    chips: buildChips,
    icon: Code2
  },
  {
    id: "ship",
    className: "node-ship",
    title: "Ship",
    detail: "CI/CD, staging, rollout",
    chips: [],
    icon: Rocket
  }
];

const workflowConnectors = [
  { id: "discovery-to-system", source: "discovery", path: "M 233 78 L 397 78" },
  { id: "system-to-ui", source: "system", path: "M 602 78 H 622 V 255 H 526" },
  { id: "ui-to-build", source: "ui", path: "M 321 255 H 158 V 329" },
  { id: "build-to-ship", source: "build", path: "M 269 424 L 414 424" }
];

const emptyVisibleItems = (): VisibleItems => ({
  nodes: [],
  connectors: [],
  chips: [],
  badge: false
});

const allVisibleItems: VisibleItems = {
  nodes: workflowNodes.map((node) => node.id),
  connectors: workflowConnectors.map((connector) => connector.id),
  chips: buildChips,
  badge: true
};

const cardRevealMs = 520;
const lineRevealMs = 700;
const chipRevealMs = 260;
const stepGapMs = 180;
const chipGapMs = 140;
const loopHoldMs = 1800;
const loopResetGapMs = 350;

export default function WorkflowCanvasHero() {
  const maskIdPrefix = useId().replace(/:/g, "");
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const timersRef = useRef<number[]>([]);
  const [canvasState, setCanvasState] = useState<CanvasState>("idle");
  const [visibleItems, setVisibleItems] = useState<VisibleItems>(emptyVisibleItems);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | null = null;

    const observeCanvas = () => {
      observer?.disconnect();
      observer = new IntersectionObserver(
        ([entry]) => {
          setCanvasState(
            entry.isIntersecting && entry.intersectionRatio >= 0.35 ? "running" : "idle"
          );
        },
        { threshold: 0.35 }
      );
      observer.observe(canvas);

      const rect = canvas.getBoundingClientRect();
      const visibleHeight = Math.max(
        0,
        Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0)
      );
      setCanvasState(visibleHeight / rect.height >= 0.35 ? "running" : "idle");
    };

    const updateMotionPreference = () => {
      if (reducedMotion.matches) {
        observer?.disconnect();
        setCanvasState("reduced");
        return;
      }

      setCanvasState("idle");
      observeCanvas();
    };

    updateMotionPreference();
    reducedMotion.addEventListener("change", updateMotionPreference);

    return () => {
      observer?.disconnect();
      reducedMotion.removeEventListener("change", updateMotionPreference);
    };
  }, []);

  useEffect(() => {
    const clearTimers = () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
      timersRef.current = [];
    };

    clearTimers();

    if (canvasState === "reduced") {
      setVisibleItems(allVisibleItems);
      return clearTimers;
    }

    if (canvasState === "idle") {
      setVisibleItems(emptyVisibleItems());
      return clearTimers;
    }

    let active = true;

    const schedule = (callback: () => void, delay: number) => {
      const timer = window.setTimeout(() => {
        if (active) callback();
      }, delay);
      timersRef.current.push(timer);
    };

    const addNode = (id: string) => {
      setVisibleItems((current) => ({
        ...current,
        nodes: current.nodes.includes(id) ? current.nodes : [...current.nodes, id]
      }));
    };

    const addConnector = (id: string) => {
      setVisibleItems((current) => ({
        ...current,
        connectors: current.connectors.includes(id)
          ? current.connectors
          : [...current.connectors, id]
      }));
    };

    const addChip = (chip: string) => {
      setVisibleItems((current) => ({
        ...current,
        chips: current.chips.includes(chip) ? current.chips : [...current.chips, chip]
      }));
    };

    const runLoop = () => {
      setVisibleItems(emptyVisibleItems());

      let elapsed = 0;

      schedule(() => addNode("discovery"), elapsed);
      elapsed += cardRevealMs + stepGapMs;

      schedule(() => addConnector("discovery-to-system"), elapsed);
      elapsed += lineRevealMs + stepGapMs;

      schedule(() => addNode("design"), elapsed);
      elapsed += cardRevealMs + stepGapMs;

      schedule(() => addConnector("system-to-ui"), elapsed);
      elapsed += lineRevealMs + stepGapMs;

      schedule(() => addNode("ui"), elapsed);
      elapsed += cardRevealMs + stepGapMs;

      schedule(() => addConnector("ui-to-build"), elapsed);
      elapsed += lineRevealMs + stepGapMs;

      schedule(() => addNode("build"), elapsed);
      elapsed += cardRevealMs + stepGapMs;

      buildChips.forEach((chip, index) => {
        schedule(() => addChip(chip), elapsed + index * chipGapMs);
      });
      elapsed += (buildChips.length - 1) * chipGapMs + chipRevealMs + stepGapMs;

      schedule(() => addConnector("build-to-ship"), elapsed);
      elapsed += lineRevealMs + stepGapMs;

      schedule(() => addNode("ship"), elapsed);
      elapsed += cardRevealMs + stepGapMs;

      schedule(() => {
        setVisibleItems((current) => ({ ...current, badge: true }));
      }, elapsed);
      elapsed += cardRevealMs + loopHoldMs;

      schedule(() => {
        setVisibleItems(emptyVisibleItems());
        schedule(runLoop, loopResetGapMs);
      }, elapsed);
    };

    runLoop();

    return () => {
      active = false;
      clearTimers();
    };
  }, [canvasState]);

  return (
    <aside
      className="interaction-stage relative z-[1] grid w-full max-w-[540px] min-h-0 min-w-0 place-items-center justify-self-center overflow-clip lg:min-h-[540px] lg:justify-self-end"
      aria-label="Product delivery workflow"
    >
      <div
        ref={canvasRef}
        className={`workflow-canvas workflow-canvas--${canvasState}`}
      >
        <div className="workflow-canvas-bar" aria-hidden="true">
          <span className="workflow-window-dots"><i /><i /><i /></span>
          <code>build.pipeline</code>
          <span className="workflow-running"><i /> LIVE</span>
        </div>

        <svg
          className="connector-layer"
          viewBox="0 0 650 598"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            {workflowConnectors.map((connector) => (
              <mask
                id={`${maskIdPrefix}-connector-mask-${connector.id}`}
                key={connector.id}
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="650"
                height="598"
              >
                <path
                  className={`connector-mask-path ${
                    canvasState === "reduced" || visibleItems.connectors.includes(connector.id)
                      ? "is-visible"
                      : ""
                  }`}
                  d={connector.path}
                  pathLength="1"
                />
              </mask>
            ))}
          </defs>

          {workflowConnectors.map((connector) => (
            <path
              className={`connector-draw connector-draw--${connector.source}`}
              d={connector.path}
              key={connector.id}
              mask={`url(#${maskIdPrefix}-connector-mask-${connector.id})`}
            />
          ))}
        </svg>

        {workflowNodes.map((node) => {
          const Icon = node.icon;
          const isVisible =
            canvasState === "reduced" || visibleItems.nodes.includes(node.id);

          return (
            <article
              className={`workflow-node ${node.className} ${isVisible ? "is-visible" : ""}`}
              key={node.id}
            >
              <span className={`workflow-icon workflow-icon--${node.id}`}>
                <Icon aria-hidden="true" />
              </span>
              <div className="workflow-node-copy">
                <h3>{node.title}</h3>
                <p>{node.detail}</p>
                {node.chips.length > 0 && (
                  <div className="node-chips" aria-label="Build and test capabilities">
                    {node.chips.map((chip) => (
                      <small
                        className={
                          canvasState === "reduced" || visibleItems.chips.includes(chip)
                            ? "is-visible"
                            : ""
                        }
                        key={chip}
                      >
                        {chip}
                      </small>
                    ))}
                  </div>
                )}
              </div>
            </article>
          );
        })}

        <div
          className={`ship-status ${
            canvasState === "reduced" || visibleItems.badge ? "is-visible" : ""
          }`}
        >
          <CheckCircle2 aria-hidden="true" />
          Ready to ship
        </div>
      </div>
    </aside>
  );
}
