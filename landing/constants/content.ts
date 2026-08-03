import { FAQItem, FeatureTerminal, TerminalLine } from "@/types";

export const GITHUB_URL = "https://github.com/dhruvil-codes/nudge-agent";
export const DOCS_URL = "https://github.com/dhruvil-codes/nudge-agent#readme";
export const INSTALL_COMMAND = "pip install nudgeagents";

export const DEMO_TERMINAL_LINES: TerminalLine[] = [
  { type: "command", content: "$ nudge audit" },
  { type: "output", content: "Scanning Gmail..." },
  { type: "blank", content: "" },
  { type: "success", content: "✓ 12 conversations scanned" },
  { type: "success", content: "✓ 4 opportunities found" },
  { type: "success", content: "✓ 4 follow-ups drafted" },
  { type: "blank", content: "" },
  { type: "output", content: "Next step: nudge draft --list" },
  { type: "cursor", content: "$ " },
];

export const BUILT_FOR_ITEMS = [
  {
    title: "Developers",
    description: "CLI-first experience that fits your workflow.",
    icon: "terminal",
  },
  {
    title: "Founders & Freelancers",
    description: "Keep conversations warm and close more deals.",
    icon: "briefcase",
  },
  {
    title: "Busy Professionals",
    description: "Let AI handle follow-ups while you focus on impact.",
    icon: "search",
  },
  {
    title: "Privacy Conscious",
    description: "Your data stays on your machine.",
    icon: "lock",
  },
];

export const HOW_IT_WORKS_STEPS = [
  {
    number: "01",
    title: "Install",
    description: "Get Nudge with one command.",
    icon: "terminal",
  },
  {
    number: "02",
    title: "Authenticate",
    description: "Connect your Gmail securely.",
    icon: "key",
  },
  {
    number: "03",
    title: "Audit",
    description: "Nudge scans your conversations.",
    icon: "search",
  },
  {
    number: "04",
    title: "Review",
    description: "See opportunities and draft previews.",
    icon: "edit",
  },
  {
    number: "05",
    title: "Send",
    description: "Send when you're ready.",
    icon: "send",
  },
];

export const FEATURE_TERMINALS: FeatureTerminal[] = [
  {
    title: "nudge audit",
    heading: "Never forget a follow-up",
    lines: [
      { type: "command", content: "$ nudge audit --limit 50" },
      { type: "output", content: "Scanning sent threads..." },
      { type: "success", content: "✓ Found 7 opportunities" },
      { type: "output", content: "Oldest thread: 14 days ago" },
      { type: "cursor", content: "$ " },
    ],
  },
  {
    title: "nudge draft",
    heading: "Runs locally",
    lines: [
      { type: "command", content: "$ nudge draft --list" },
      { type: "output", content: "Draft #1 — Alex Chen (7d)" },
      { type: "output", content: "Draft #2 — Maya Patel (12d)" },
      { type: "output", content: "Draft #3 — Sam Lee (3d)" },
      { type: "cursor", content: "$ " },
    ],
  },
  {
    title: "~/.nudge/",
    heading: "Privacy by default",
    lines: [
      { type: "command", content: "$ ls ~/.nudge/" },
      { type: "output", content: "history.db   token.json" },
      { type: "output", content: ".env" },
      { type: "blank", content: "" },
      { type: "output", content: "# All local. Zero cloud." },
      { type: "cursor", content: "$ " },
    ],
  },
  {
    title: "nudge --tone",
    heading: "Natural AI writing",
    lines: [
      { type: "command", content: "$ nudge draft --tone check-in" },
      { type: "output", content: "Hey Alex, just circling back" },
      { type: "output", content: "on our chat from last week." },
      { type: "output", content: "Would love your thoughts." },
      { type: "cursor", content: "$ " },
    ],
  },
  {
    title: "nudge --auto",
    heading: "Fits into your workflow",
    lines: [
      { type: "command", content: "$ nudge --auto" },
      { type: "success", content: "✓ 3 drafts created in Gmail" },
      { type: "output", content: "Review in Gmail before send." },
      { type: "blank", content: "" },
      { type: "cursor", content: "$ " },
    ],
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: "Does Nudge send emails automatically?",
    answer:
      "No. Nudge creates drafts inside your Gmail account. You review and send every email manually — always.",
  },
  {
    question: "Is my email data safe?",
    answer:
      "Yes. Your Gmail token, SQLite history, and all local state are stored exclusively in ~/.nudge/ on your machine. Nothing leaves your computer except the AI prompt sent to Groq.",
  },
  {
    question: "Which models does Nudge use?",
    answer:
      "Nudge uses Groq's Llama 3.3 70B model for generating follow-up drafts. It is fast, privacy-respecting, and produces natural-sounding text.",
  },
  {
    question: "Can I customize the follow-up style?",
    answer:
      "Yes. Nudge supports three tones: Check-in, Value-Add, and Breakup. You can switch tones interactively during the review step.",
  },
  {
    question: "Does it work offline?",
    answer:
      "Nudge requires internet access to connect to Gmail and the Groq API for draft generation. All history and tokens are stored locally.",
  },
];
