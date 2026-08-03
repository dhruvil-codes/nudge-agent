"use client";

import { motion } from "framer-motion";
import { Terminal, Briefcase, Search, Lock } from "lucide-react";
import { SectionLabel } from "@/components/shared/SectionLabel";
import { BUILT_FOR_ITEMS } from "@/constants/content";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  terminal: Terminal,
  briefcase: Briefcase,
  search: Search,
  lock: Lock,
};

export function BuiltFor() {
  return (
    <section className="py-32 border-t border-stone-200/80 dark:border-stone-800/80">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Header — centered */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <SectionLabel text="BUILT FOR PEOPLE WHO" className="justify-center flex" />
          <h2
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-stone-900 dark:text-stone-100 leading-[1.08] max-w-3xl mx-auto"
            style={{ fontFamily: "var(--font-space-mono), monospace" }}
          >
            Built for people who
            <br />
            don&apos;t let opportunities slip.
          </h2>
        </motion.div>

        {/* Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0">
          {BUILT_FOR_ITEMS.map((item, i) => {
            const Icon = ICONS[item.icon] ?? Terminal;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.1 }}
                className={`px-6 sm:px-8 py-8 sm:py-10 ${
                  i < BUILT_FOR_ITEMS.length - 1
                    ? "border-b lg:border-b-0 lg:border-r border-stone-200 dark:border-stone-800"
                    : ""
                } first:pl-0 last:pr-0`}
              >
                <div className="mb-5">
                  <Icon className="w-7 h-7 text-stone-700 dark:text-stone-300 stroke-[1.5]" />
                </div>
                <h3
                  className="text-base sm:text-lg md:text-xl font-bold text-stone-900 dark:text-stone-100 mb-3 tracking-tight"
                  style={{ fontFamily: "var(--font-space-mono), monospace" }}
                >
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-stone-600 dark:text-stone-400 leading-relaxed font-mono">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
