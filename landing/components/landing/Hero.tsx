"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, type Variants, AnimatePresence } from "framer-motion";
import { Copy, Check, Terminal } from "lucide-react";
import { BlinkingCursor } from "@/components/shared/BlinkingCursor";
import { GITHUB_URL } from "@/constants/content";
import { cn } from "@/lib/utils";
import { AnimatedGridPattern } from "@/registry/magicui/animated-grid-pattern";

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

/* ── Animation variants ── */
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export function Hero() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("pip install nudge-agent");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <section className="relative flex flex-col items-center justify-between overflow-hidden min-h-screen pt-20 md:pt-24 pb-8">
      {/* ── Background Animated Grid Pattern ── */}
      <AnimatedGridPattern
        numSquares={35}
        maxOpacity={0.08}
        duration={3}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)] mask-[radial-gradient(600px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-20%] h-[180%] skew-y-6"
        )}
      />

      {/* ── Main Container ── */}
      <div className="w-full max-w-5xl mx-auto px-6 md:px-12 relative z-10 text-center flex-1 flex flex-col items-center justify-start pt-4 sm:pt-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center justify-center mt-2 sm:mt-4"
        >
          {/* ── Eyebrow label ── */}
          <motion.div variants={fadeUpVariants} className="flex items-center justify-center mb-6">
            <div
              className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-stone-300/80 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 shadow-xs"
              style={{ backdropFilter: "blur(8px)" }}
            >
              <span
                className="inline-block w-2 h-2 rounded-full bg-emerald-500"
                style={{ animation: "pulse 2.5s ease-in-out infinite" }}
              />
              <span
                className="text-xs sm:text-sm tracking-[0.2em] text-stone-700 dark:text-stone-300 uppercase font-mono font-semibold"
              >
                AI Email Follow-up Agent
              </span>
            </div>
          </motion.div>

          {/* ── Centered Headline ── */}
          <motion.h1
            variants={fadeUpVariants}
            className="font-bold text-stone-900 dark:text-stone-100 mb-6 tracking-tight text-center max-w-4xl"
            style={{
              fontFamily: "var(--font-space-mono), monospace",
              fontSize: "clamp(2.6rem, 5.5vw, 4.8rem)",
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
            }}
          >
            Never lose an opportunity because you forgot to follow up.
            <BlinkingCursor className="text-stone-300 dark:text-stone-600 ml-1.5 inline-block" char="|" />
          </motion.h1>

          {/* ── Centered Supporting Description ── */}
          <motion.p
            variants={fadeUpVariants}
            className="text-stone-600 dark:text-stone-400 leading-relaxed mb-8 text-center max-w-2xl text-sm sm:text-base md:text-lg font-mono font-normal"
          >
            Nudge audits your Gmail conversations, finds missed follow-up opportunities, and drafts thoughtful responses directly from your terminal. Open source and privacy-first.
          </motion.p>

          {/* ── Centered CTA Area ── */}
          <motion.div
            variants={fadeUpVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-10 w-full max-w-2xl"
          >
            {/* Install command block */}
            <button
              onClick={handleCopy}
              aria-label="Copy install command"
              className="group relative flex items-center justify-between whitespace-nowrap rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-stone-900/10 bg-[#111110] dark:bg-[#161615] border border-stone-800 dark:border-stone-700 px-4.5 py-3 shadow-md"
            >
              <div className="flex items-center gap-2.5 whitespace-nowrap" style={{ fontFamily: "var(--font-ibm-mono), monospace" }}>
                <Terminal className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-emerald-400 text-xs sm:text-sm font-semibold">$</span>
                <span className="text-stone-100 text-xs sm:text-sm font-semibold tracking-tight whitespace-nowrap">pip install nudge-agent</span>
              </div>

              <div className="ml-3 pl-3 border-l border-stone-700/70 flex-shrink-0">
                <AnimatePresence mode="wait" initial={false}>
                  {copied ? (
                    <motion.div
                      key="check"
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.7 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-center gap-1 text-emerald-400 font-mono text-xs font-semibold"
                    >
                      <Check className="w-4 h-4" />
                      Copied!
                    </motion.div>
                  ) : (
                    <motion.div
                      key="copy"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center text-stone-400 group-hover:text-stone-200 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </button>

            {/* GitHub Button */}
            <Link
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap inline-flex items-center justify-center gap-2 px-4.5 py-3 rounded-xl bg-white/90 dark:bg-stone-900/90 hover:bg-white dark:hover:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono text-xs sm:text-sm font-semibold border border-stone-300 dark:border-stone-700 hover:border-stone-400 dark:hover:border-stone-600 shadow-xs hover:shadow-sm transition-all hover:-translate-y-0.5"
            >
              <GithubIcon className="w-4 h-4 text-stone-900 dark:text-stone-100 flex-shrink-0" />
              <span>⭐ Star on GitHub</span>
            </Link>
          </motion.div>

          {/* ── Centered Metadata Badges ── */}
          <motion.div
            variants={fadeUpVariants}
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 font-mono"
          >
            {["Open Source", "Built for Developers", "Privacy First"].map((badge, i, arr) => (
              <span key={badge} className="flex items-center gap-4 sm:gap-6">
                <span className="text-xs sm:text-sm tracking-[0.2em] text-stone-600 dark:text-stone-400 uppercase font-semibold">
                  {badge}
                </span>
                {i < arr.length - 1 && (
                  <span className="text-stone-300 dark:text-stone-700 text-sm select-none">·</span>
                )}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* ── Scroll breath indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="relative z-10 pt-4"
      >
        <motion.div
          animate={{ scaleY: [1, 1.5, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px bg-stone-400 mx-auto"
          style={{ height: "32px", transformOrigin: "top" }}
        />
      </motion.div>

      {/* Pulse keyframe style */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </section>
  );
}
