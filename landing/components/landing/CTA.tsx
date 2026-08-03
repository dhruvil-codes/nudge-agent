"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Copy } from "lucide-react";
import { BlinkingCursor } from "@/components/shared/BlinkingCursor";
import { GITHUB_URL } from "@/constants/content";

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export function CTA() {
  const handleCopy = () => {
    navigator.clipboard.writeText("pip install nudge-agent");
  };

  return (
    <section className="py-40 border-t border-stone-200/80 dark:border-stone-800/80">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col items-center text-center"
        >
          {/* Label */}
          <p className="font-mono text-xs sm:text-sm font-semibold tracking-[0.25em] text-stone-400 dark:text-stone-500 uppercase mb-8">
            // GET STARTED
          </p>

          {/* Heading */}
          <h2
            className="text-4xl md:text-6xl font-bold tracking-tight text-stone-900 dark:text-stone-100 leading-[1.05] mb-12 max-w-2xl"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            Ready when
            <br />
            you are.
          </h2>

          {/* Install command terminal block */}
          <div className="w-full max-w-lg mb-8">
            <div className="rounded-xl border border-stone-700/50 bg-[#111110] dark:bg-[#161615] overflow-hidden shadow-2xl shadow-black/20">
              <div className="flex items-center justify-between px-5 py-3 border-b border-stone-700/40 bg-[#0D0D0C]">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                </div>
                <span className="font-mono text-xs text-stone-500">terminal</span>
                <div className="w-14" />
              </div>
              <div className="px-5 py-5 flex items-center justify-between group">
                <div className="font-mono text-sm text-[#E8E8E4] flex items-center gap-2">
                  <span className="text-stone-500">$</span>
                  pip install nudge-agent
                  <BlinkingCursor className="text-emerald-400" />
                </div>
                <button
                  onClick={handleCopy}
                  title="Copy install command"
                  className="text-stone-600 hover:text-stone-300 transition-colors ml-4"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Sub-labels */}
          <p className="font-mono text-xs sm:text-sm text-stone-400 dark:text-stone-500 mb-8 flex items-center gap-2">
            <span>Open Source</span>
            <span className="text-stone-300 dark:text-stone-700">•</span>
            <span>MIT Licensed</span>
            <span className="text-stone-300 dark:text-stone-700">•</span>
            <Link
              href="https://x.com/bydhruvil"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-stone-700 dark:hover:text-stone-300 underline underline-offset-2 transition-colors"
            >
              Built by @bydhruvil
            </Link>
          </p>

          {/* Star on GitHub */}
          <Link
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-200 font-mono text-sm px-6 py-3 rounded-lg hover:border-stone-900 dark:hover:border-stone-100 hover:text-stone-900 dark:hover:text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <GithubIcon className="w-4 h-4 text-stone-800 dark:text-stone-100" />
            ⭐ Star on GitHub
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
