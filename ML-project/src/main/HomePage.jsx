// main/homepage.jsx
import React from "react";
import { Blocks, Waypoints, BookOpen } from "lucide-react";

import MainNavbar from "../components/Layout/MainNavbar";
import Footer from "../components/Layout/Footer";
import HeroSection from "../components/homepage/HeroSection";
import InfoHighlightSection from "../components/HomePage/InfoHighlightSection";
import FeatureShowcase from "../components/HomePage/FeatureShowcase";
import CTASection from "../components/HomePage/CTASection";

const theme = {
  bg: "bg-slate-950", // This will be the body bg if canvas is transparent or doesn't cover all
  surface: "bg-slate-900",
  card: "bg-slate-800",
  textPrimary: "text-slate-50",
  textSecondary: "text-slate-300",
  textMuted: "text-slate-400",
  accent: "sky",
  accentSecondary: "rose",
  accentTertiary: "emerald",
};

export default function homepage() {
  const navLinks = [
    { label: "Learn", path: "/learn", Icon: BookOpen },
    { label: "Build", path: "/build", Icon: Blocks },
    { label: "Explore", path: "/explore", Icon: Waypoints },
  ];

  return (
    <div
      className={`${theme.bg} ${theme.textSecondary} font-sans overflow-x-hidden selection:bg-sky-500 selection:text-white`}
    >
      <MainNavbar navLinks={navLinks} />
      <main className="relative z-10">
        <HeroSection />
        <InfoHighlightSection />
        <FeatureShowcase />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
