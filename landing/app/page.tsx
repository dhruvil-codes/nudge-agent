import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Demo } from "@/components/landing/Demo";
import { BuiltFor } from "@/components/landing/BuiltFor";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { FAQ } from "@/components/landing/FAQ";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Demo />
        <BuiltFor />
        <HowItWorks />
        <Features />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
