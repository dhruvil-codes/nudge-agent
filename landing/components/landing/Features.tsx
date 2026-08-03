"use client";

import { motion } from "framer-motion";
import { TerminalWindow } from "@/components/shared/TerminalWindow";
import { SectionLabel } from "@/components/shared/SectionLabel";
import { FEATURE_TERMINALS } from "@/constants/content";

export function Features() {
  return (
    <section id="features" className="py-32 border-t border-stone-200/80 dark:border-stone-800/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <SectionLabel text="FEATURES" />
          <h2
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-stone-900 dark:text-stone-100 leading-[1.08] max-w-2xl"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            Everything you need.
            <br />
            Nothing you don&apos;t.
          </h2>
        </motion.div>

        {/* Feature grid — artistic composition */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Large card — spans 2 cols */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-2"
          >
            <div className="mb-3 px-1">
              <p className="font-mono text-sm sm:text-base font-semibold text-stone-700 tracking-tight">
                01. {FEATURE_TERMINALS[0].heading}
              </p>
            </div>
            <TerminalWindow
              title={FEATURE_TERMINALS[0].title}
              lines={FEATURE_TERMINALS[0].lines}
            />
          </motion.div>

          {/* Normal card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            <div className="mb-3 px-1">
              <p className="font-mono text-sm sm:text-base font-semibold text-stone-700 tracking-tight">
                02. {FEATURE_TERMINALS[1].heading}
              </p>
            </div>
            <TerminalWindow
              title={FEATURE_TERMINALS[1].title}
              lines={FEATURE_TERMINALS[1].lines}
            />
          </motion.div>

          {/* Normal card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
          >
            <div className="mb-3 px-1">
              <p className="font-mono text-sm sm:text-base font-semibold text-stone-700 tracking-tight">
                03. {FEATURE_TERMINALS[2].heading}
              </p>
            </div>
            <TerminalWindow
              title={FEATURE_TERMINALS[2].title}
              lines={FEATURE_TERMINALS[2].lines}
            />
          </motion.div>

          {/* Normal card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            <div className="mb-3 px-1">
              <p className="font-mono text-sm sm:text-base font-semibold text-stone-700 tracking-tight">
                04. {FEATURE_TERMINALS[3].heading}
              </p>
            </div>
            <TerminalWindow
              title={FEATURE_TERMINALS[3].title}
              lines={FEATURE_TERMINALS[3].lines}
            />
          </motion.div>

          {/* Normal card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          >
            <div className="mb-3 px-1">
              <p className="font-mono text-sm sm:text-base font-semibold text-stone-700 tracking-tight">
                05. {FEATURE_TERMINALS[4].heading}
              </p>
            </div>
            <TerminalWindow
              title={FEATURE_TERMINALS[4].title}
              lines={FEATURE_TERMINALS[4].lines}
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
