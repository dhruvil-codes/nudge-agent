"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { SectionLabel } from "@/components/shared/SectionLabel";
import { BlinkingCursor } from "@/components/shared/BlinkingCursor";
import { FAQ_ITEMS } from "@/constants/content";

function FAQRow({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="border-b border-stone-700/40 last:border-b-0"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 px-0 text-left group"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm text-stone-400">&gt;</span>
          <span className="font-mono text-base sm:text-lg font-medium text-stone-200 group-hover:text-white transition-colors">
            {question}
          </span>
        </div>
        <div className="text-stone-400 flex-shrink-0 ml-4">
          {open ? (
            <Minus className="w-4 h-4" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-4 pl-6">
              <p className="font-mono text-xs sm:text-sm md:text-base text-stone-400 leading-relaxed">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  return (
    <section id="faq" className="py-32 border-t border-stone-200/80 dark:border-stone-800/80">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
          {/* Left */}
          <div className="lg:col-span-2">
            <SectionLabel text="FAQ" />
            <h2
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-stone-900 dark:text-stone-100 leading-[1.08]"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              Answers to
              <br />
              common
              <br />
              questions.
            </h2>
          </div>

          {/* Right — FAQ terminal */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-3"
          >
            <div className="rounded-xl border border-stone-700/50 bg-[#111110] overflow-hidden shadow-2xl shadow-black/20">
              {/* Title bar */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-stone-700/40 bg-[#0D0D0C]">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                </div>
                <span className="font-mono text-xs text-stone-500">Frequently Asked Questions</span>
                <div className="w-14" />
              </div>

              {/* Command line */}
              <div className="px-5 py-4 border-b border-stone-700/30">
                <div className="font-mono text-sm text-[#E8E8E4] flex items-center">
                  <span className="text-stone-500 mr-2">$</span>
                  nudge help
                  <BlinkingCursor className="text-emerald-400 ml-1" />
                </div>
              </div>

              {/* FAQ rows */}
              <div className="px-5 py-2">
                {FAQ_ITEMS.map((item) => (
                  <FAQRow key={item.question} question={item.question} answer={item.answer} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
