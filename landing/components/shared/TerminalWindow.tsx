"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { TerminalLine } from "@/types";
import { BlinkingCursor } from "./BlinkingCursor";

interface TerminalWindowProps {
  title?: string;
  lines: TerminalLine[];
  className?: string;
  large?: boolean;
  noParallax?: boolean;
}

function renderLine(line: TerminalLine, index: number) {
  if (line.type === "blank") return <div key={index} className="h-3" />;

  const colorMap: Record<TerminalLine["type"], string> = {
    command: "text-[#E8E8E4]",
    output: "text-stone-400",
    success: "text-emerald-400",
    cursor: "text-[#E8E8E4]",
    blank: "",
  };

  if (line.type === "cursor") {
    return (
      <div
        key={index}
        className={cn("flex items-center text-sm leading-6", colorMap.command)}
        style={{ fontFamily: "var(--font-ibm-mono), monospace" }}
      >
        <span>{line.content}</span>
        <BlinkingCursor className="text-emerald-400 ml-0.5" />
      </div>
    );
  }

  return (
    <div
      key={index}
      className={cn("text-sm leading-6 whitespace-pre-wrap", colorMap[line.type])}
      style={{ fontFamily: "var(--font-ibm-mono), monospace" }}
    >
      {line.content}
    </div>
  );
}

// Parallax sub-component — only mounts on client after hydration
function ParallaxWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  // Only enable scroll tracking after client hydration
  useEffect(() => {
    setReady(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ready ? ref : undefined,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [15, -15]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

// Terminal chrome — pure server-safe markup
function TerminalChrome({
  title,
  lines,
  large,
  className,
}: {
  title?: string;
  lines: TerminalLine[];
  large?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-stone-700/50 bg-[#111110] shadow-2xl shadow-black/20 overflow-hidden",
        className
      )}
    >
      {/* macOS title bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-stone-700/40 bg-[#0D0D0C]">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
        </div>
        {title && (
          <span
            className="text-xs text-stone-500"
            style={{ fontFamily: "var(--font-ibm-mono), monospace" }}
          >
            {title}
          </span>
        )}
        <div className="w-14" />
      </div>

      {/* Content */}
      <div className={cn("p-5 space-y-0.5", large && "p-6")}>
        {lines.map((line, index) => renderLine(line, index))}
      </div>
    </div>
  );
}

export function TerminalWindow({
  title,
  lines,
  className,
  large = false,
  noParallax = false,
}: TerminalWindowProps) {
  if (noParallax) {
    return (
      <TerminalChrome
        title={title}
        lines={lines}
        large={large}
        className={className}
      />
    );
  }

  return (
    <ParallaxWrapper>
      <TerminalChrome
        title={title}
        lines={lines}
        large={large}
        className={className}
      />
    </ParallaxWrapper>
  );
}
