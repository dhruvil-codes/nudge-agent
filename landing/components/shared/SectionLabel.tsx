import { cn } from "@/lib/utils";

interface SectionLabelProps {
  text: string;
  className?: string;
}

export function SectionLabel({ text, className }: SectionLabelProps) {
  return (
    <p
      className={cn(
        "font-mono text-xs sm:text-sm font-semibold tracking-[0.22em] text-stone-500 uppercase mb-6",
        className
      )}
    >
      // {text}
    </p>
  );
}
