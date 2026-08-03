"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BlinkingCursorProps {
  className?: string;
  char?: string;
}

export function BlinkingCursor({ className, char = "|" }: BlinkingCursorProps) {
  return (
    <motion.span
      className={cn("inline-block", className)}
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      {char}
    </motion.span>
  );
}
