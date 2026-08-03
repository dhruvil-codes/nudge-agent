"use client";

import { motion } from "framer-motion";
import { Terminal, Key, Search, Edit3, Send, ArrowRight } from "lucide-react";
import { SectionLabel } from "@/components/shared/SectionLabel";
import { HOW_IT_WORKS_STEPS } from "@/constants/content";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  terminal: Terminal,
  key: Key,
  search: Search,
  edit: Edit3,
  send: Send,
};

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 sm:py-40 border-t border-stone-200/80 dark:border-stone-800/80">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Section Header */}
        <div className="mb-16 sm:mb-20">
          <SectionLabel text="HOW IT WORKS" />
          <h2
            className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-stone-900 dark:text-stone-100 leading-[1.05]"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            Five simple steps.
          </h2>
        </div>

        {/* Spacious 5-Step Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {HOW_IT_WORKS_STEPS.map((step, i) => {
            const Icon = ICONS[step.icon] ?? Terminal;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative flex flex-col justify-between rounded-2xl border border-stone-300/80 dark:border-stone-800 bg-white/80 dark:bg-stone-900/60 p-6 sm:p-7 shadow-xs hover:shadow-lg hover:border-stone-400 dark:hover:border-stone-700 transition-all duration-300 hover:-translate-y-1 backdrop-blur-md"
              >
                <div>
                  {/* Number Badge + Icon Row */}
                  <div className="flex items-center justify-between gap-3 mb-6">
                    <span className="font-mono text-xs sm:text-sm font-bold tracking-[0.2em] text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      {step.number}
                    </span>
                    <div className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 group-hover:bg-emerald-500/10 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      <Icon className="w-6 h-6 stroke-[1.75]" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 mb-3 tracking-tight"
                    style={{ fontFamily: "'Space Mono', monospace" }}
                  >
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="font-mono text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
