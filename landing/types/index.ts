export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface TerminalLine {
  type: "command" | "output" | "success" | "blank" | "cursor";
  content: string;
}

export interface BuiltForItem {
  icon: string;
  title: string;
  description: string;
}

export interface HowItWorksStep {
  number: string;
  icon: string;
  title: string;
  description: string;
}

export interface FeatureTerminal {
  title: string;
  heading: string;
  lines: TerminalLine[];
}

export interface FAQItem {
  question: string;
  answer: string;
}
