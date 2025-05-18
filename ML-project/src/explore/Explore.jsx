import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/GeneralNavBar";
import ExploreHero from "../components/ExploreHero";
import ArchitectureGallery from "../components/ArchitectureGallery";
import ActivationVisualizer from "../components/ActivationVisualizer";
import NNAnatomy from "../components/NNAnatomy";
import ConceptCarousel from "../components/ConceptCarousel";
import Timeline from "../components/Timeline";
import ScrollToTop from "../components/ScrollToTop";

/**
 * Top‑level page for the "/explore" route.
 * Each imported section component manages its own spacing and id for in‑page anchors.
 */
export default function Explore() {
  return (
    <>
      {/* Ensure the viewport is reset when navigating here */}
      <ScrollToTop />

      {/* Main layout */}
      <main className="flex flex-col gap-24">
        <ExploreHero />
        <ArchitectureGallery />
        <ActivationVisualizer />
        <NNAnatomy />
        <ConceptCarousel />
        <Timeline />
      </main>

      {/* Render nested routes, if any */}
      <Outlet />
    </>
  );
}
