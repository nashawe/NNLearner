"use client";
import React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Outlet } from "react-router-dom";
import ExploreHero from "../components/ExploreHero";
import ArchitectureGallery from "../components/ArchitectureGallery";
import ActivationVisualizer from "../components/ActivationVisualizer";
import NNAnatomy from "../components/NNAnatomy";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

export default function Explore() {
  const navigate = useNavigate();
  return (
    <>
      <motion.div
        className="fixed top-8 right-8 z-50"
        whileHover={{
          scale: 1.15,
          y: -5,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 px-6 py-3 bg-white text-black font-semibold rounded-2xl shadow-md hover:bg-gray-100 transition-all duration-200"
        >
          <Home size={24} />
          <span className="text-md">Home</span>
        </button>
      </motion.div>

      <main className="flex flex-col">
        <ExploreHero />
        {/* pinned gallery (handles its own pin/unpin) */}
        <div className="w-full">
          <ArchitectureGallery />
        </div>
        <hr className="border-t bg-gray-900 border-gray-300 pb-16" />
        <div className="w-full">
          <ActivationVisualizer />
        </div>
        <hr className=" border-t bg-gray-900 border-gray-300 " />
        <div className="w-full">
          <NNAnatomy />
        </div>
      </main>
      <Outlet />
    </>
  );
}
