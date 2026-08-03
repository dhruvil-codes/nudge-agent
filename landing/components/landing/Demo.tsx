"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SectionLabel } from "@/components/shared/SectionLabel";
import { TerminalWindow } from "@/components/shared/TerminalWindow";
import { DEMO_TERMINAL_LINES } from "@/constants/content";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export function Demo() {
  return (
    <section id="demo" className="py-32 border-t border-stone-200/80 dark:border-stone-800/80">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-center">

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="lg:col-span-2"
          >
            <motion.div variants={fadeUp}>
              <SectionLabel text="DEMO" />
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-stone-900 dark:text-stone-100 leading-[1.08] mb-6"
              style={{ fontFamily: "var(--font-space-mono), monospace" }}
            >
              See Nudge
              <br />
              in action.
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="text-sm sm:text-base md:text-lg text-stone-600 dark:text-stone-400 leading-relaxed mb-8 max-w-sm font-mono"
            >
              From scanning your inbox to drafting the perfect
              follow-up. One command is all it takes.
            </motion.p>
          </motion.div>

          {/* Right — terminal */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <TerminalWindow
              title="nudge audit"
              lines={DEMO_TERMINAL_LINES}
              large
              noParallax
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
