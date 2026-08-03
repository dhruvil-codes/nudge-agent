"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  BookOpen, 
  Copy, 
  Check, 
  Menu, 
  X, 
  Terminal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GITHUB_URL, DOCS_URL } from "@/constants/content";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

const NAV_LINKS = [
  { label: "Demo", href: "#demo" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("Demo");
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCopyInstall = async () => {
    try {
      await navigator.clipboard.writeText("pip install nudge-agent");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, label: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      setActiveTab(label);
      const targetEl = document.querySelector(href);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth" });
        setMobileOpen(false);
      }
    }
  };

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-4 sm:top-5 inset-x-0 z-50 flex justify-center px-4 sm:px-6 pointer-events-none"
    >
      <div className="pointer-events-auto flex items-center justify-between gap-4 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white/80 dark:bg-[#161615]/85 backdrop-blur-2xl border border-stone-300/90 dark:border-stone-800 shadow-lg shadow-black/5 dark:shadow-black/40 w-full max-w-6xl transition-colors duration-300">
        
        {/* Left: Brand Logo + Version Tag */}
        <div className="flex items-center gap-3.5">
          <Link
            href="/"
            className="group flex items-center gap-1 select-none"
            style={{ fontFamily: "var(--font-space-mono), monospace" }}
          >
            <motion.span
              className="text-stone-400 dark:text-stone-500 text-base font-semibold"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              &gt;
            </motion.span>
            <span className="text-stone-900 dark:text-stone-100 text-base md:text-lg font-bold tracking-tight ml-1 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors">
              nudge
            </span>
            <motion.span
              className="text-emerald-600 dark:text-emerald-400 text-base font-semibold"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
            >
              _
            </motion.span>
          </Link>

          <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-stone-200/70 dark:bg-stone-800/80 text-stone-600 dark:text-stone-300 border border-stone-300/60 dark:border-stone-700/60">
            v0.1.0
          </span>
        </div>

        {/* Tubelight Nav Items (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 bg-stone-200/50 dark:bg-stone-800/50 p-1 rounded-full border border-stone-300/40 dark:border-stone-700/40">
          {NAV_LINKS.map(({ label, href }) => {
            const isActive = activeTab === label;
            const isHovered = hoveredTab === label;

            return (
              <a
                key={label}
                href={href}
                onClick={(e) => handleNavClick(e, href, label)}
                onMouseEnter={() => setHoveredTab(label)}
                onMouseLeave={() => setHoveredTab(null)}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-mono transition-colors duration-200 select-none ${
                  isActive || isHovered
                    ? "text-stone-900 dark:text-white font-semibold"
                    : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white"
                }`}
              >
                {/* Active / Hover Tubelight Glow Background */}
                {(isActive || isHovered) && (
                  <motion.div
                    layoutId="tubelight-glow"
                    className="absolute inset-0 rounded-full bg-white dark:bg-stone-900 shadow-xs border border-stone-200 dark:border-stone-700"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{label}</span>
              </a>
            );
          })}

          {/* External Docs Link */}
          <Link
            href={DOCS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
          >
            <span className="relative z-10">Docs</span>
            <BookOpen className="w-4 h-4 text-stone-400 dark:text-stone-500" />
          </Link>
        </nav>

        {/* Right Actions: Quick Install + GitHub + ThemeToggle */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Quick Install Copy Pill */}
          <button
            onClick={handleCopyInstall}
            className="group relative flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 font-mono text-xs sm:text-sm whitespace-nowrap flex-shrink-0 hover:bg-stone-800 dark:hover:bg-white transition-all duration-200 shadow-sm border border-stone-800 dark:border-stone-200"
            title="Click to copy install command"
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600 flex-shrink-0" />
            <span className="text-stone-400 dark:text-stone-600">$</span>
            <span className="font-semibold text-stone-100 dark:text-stone-900 whitespace-nowrap">pip install nudge-agent</span>
            <span className="ml-1 pl-2 border-l border-stone-700/80 dark:border-stone-300/80 flex items-center text-stone-400 dark:text-stone-600 group-hover:text-stone-200 dark:group-hover:text-stone-800 flex-shrink-0">
              {copied ? (
                <span className="flex items-center gap-1 text-emerald-400 dark:text-emerald-600 font-semibold text-xs whitespace-nowrap">
                  <Check className="w-3.5 h-3.5" />
                  Copied!
                </span>
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </span>
          </button>

          {/* GitHub Button */}
          <Link
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-stone-100 dark:bg-stone-800/90 hover:bg-stone-200/80 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-100 font-mono text-xs font-medium border border-stone-300/80 dark:border-stone-700 transition-colors"
          >
            <GithubIcon className="w-3.5 h-3.5 text-stone-800 dark:text-stone-100" />
            <span>⭐ Star</span>
          </Link>

          {/* Theme Switcher Toggle */}
          <ThemeToggle />
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />

          <button
            onClick={handleCopyInstall}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 font-mono text-[11px]"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>pip install</span>
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 rounded-full text-stone-700 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800/60 transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="pointer-events-auto absolute top-16 left-4 right-4 sm:left-6 sm:right-6 max-w-md mx-auto rounded-2xl bg-[#FAFAF8] dark:bg-[#161615] border border-stone-300/90 dark:border-stone-800 shadow-xl p-5 overflow-hidden"
          >
            <div className="flex flex-col gap-3">
              {NAV_LINKS.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  onClick={(e) => handleNavClick(e, href, label)}
                  className="font-mono text-sm text-stone-800 dark:text-stone-200 hover:text-stone-900 dark:hover:text-white py-1.5 px-3 rounded-lg hover:bg-stone-200/50 dark:hover:bg-stone-800/50 flex items-center justify-between transition-colors"
                >
                  {label}
                  <span className="text-stone-400 text-xs">&gt;</span>
                </a>
              ))}

              <Link
                href={DOCS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm text-stone-800 dark:text-stone-200 hover:text-stone-900 dark:hover:text-white py-1.5 px-3 rounded-lg hover:bg-stone-200/50 dark:hover:bg-stone-800/50 flex items-center justify-between transition-colors"
              >
                Documentation
                <BookOpen className="w-4 h-4 text-stone-400" />
              </Link>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={handleCopyInstall}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 font-mono text-xs font-medium"
                >
                  <Terminal className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
                  {copied ? "Copied: pip install nudge-agent!" : "$ pip install nudge-agent"}
                </button>

                <Link
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-stone-200/70 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono text-xs font-medium border border-stone-300/80 dark:border-stone-700"
                >
                  <GithubIcon className="w-4 h-4 text-stone-800 dark:text-stone-100" />
                  ⭐ Star on GitHub
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
