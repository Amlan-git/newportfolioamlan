"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

type Theme = "dark" | "light";
type Viewport = { width: number; height: number };

function EmptyShader() {
  return null;
}

const GrainGradient = dynamic(
  () =>
    import("@paper-design/shaders-react")
      .then((module) => module.GrainGradient)
      .catch(() => EmptyShader),
  { ssr: false }
);

const colors = ["#7300ff", "#eba8ff", "#00bfff", "#2b00ff"];

export default function GrainShaderBackground({ theme }: { theme: Theme }) {
  const colorBack = theme === "dark" ? "#000000" : "#f8f7f4";
  const [viewport, setViewport] = useState<Viewport | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [supportsWebGL, setSupportsWebGL] = useState(true);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const testCanvas = document.createElement("canvas");
    const updateViewport = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };
    const updateMotion = () => setReducedMotion(motionQuery.matches);

    setSupportsWebGL(
      Boolean(testCanvas.getContext("webgl2") || testCanvas.getContext("webgl"))
    );
    updateViewport();
    updateMotion();
    window.addEventListener("resize", updateViewport);
    motionQuery.addEventListener("change", updateMotion);

    return () => {
      window.removeEventListener("resize", updateViewport);
      motionQuery.removeEventListener("change", updateMotion);
    };
  }, []);

  return (
    <div className="grain-shader" aria-hidden="true">
      {supportsWebGL && viewport ? (
        <GrainGradient
          width={viewport.width}
          height={viewport.height}
          colors={colors}
          colorBack={colorBack}
          softness={0.5}
          intensity={0.5}
          noise={0.25}
          shape="corners"
          speed={reducedMotion ? 0 : 1}
          scale={1}
          rotation={0}
          offsetX={0}
          offsetY={0}
        />
      ) : null}
    </div>
  );
}
