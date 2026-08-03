import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-ibm-mono",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nudge — AI Gmail Follow-up Agent for Your Terminal",
  description:
    "Nudge audits your Gmail conversations, finds follow-up opportunities, and drafts thoughtful emails directly from your terminal. Open source. Privacy first.",
  keywords: [
    "nudge",
    "gmail follow-up",
    "cli tool",
    "ai email",
    "terminal email",
    "open source",
  ],
  authors: [{ name: "Dhruvil", url: "https://github.com/dhruvil-codes" }],
  creator: "Dhruvil",
  openGraph: {
    title: "Nudge — AI Gmail Follow-up Agent",
    description:
      "Never lose an opportunity because you forgot to follow up. Nudge audits your Gmail and drafts follow-ups from the terminal.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nudge — AI Gmail Follow-up Agent",
    description:
      "Never lose an opportunity because you forgot to follow up. Open source CLI tool.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${ibmPlexMono.variable} ${spaceMono.variable}`}
      suppressHydrationWarning
    >
      <body
        className="bg-[#FAFAF8] dark:bg-[#0A0A09] text-[#0A0A0A] dark:text-[#F5F5F0] transition-colors duration-300"
        style={{
          fontFamily: "var(--font-ibm-mono), 'Courier New', monospace",
        }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
