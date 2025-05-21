// src/components/HomePage/InfoHighlightSection.jsx
import React, { useRef, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { Atom, Layers, CodeXml } from "lucide-react";
import { gsap } from "gsap";
// ScrollTrigger should be registered in HomePage.jsx if not here
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// gsap.registerPlugin(ScrollTrigger);

const theme = {
  // Simplified theme for this component if imported separately
  surface: "bg-slate-900",
  textPrimary: "text-slate-50",
  textSecondary: "text-slate-300",
  accent: "sky",
  card: "bg-slate-800/50", // Make cards slightly more transparent
};

// Reusable AnimatedTextWord component (can be moved to a common folder)
const AnimatedTextWord = ({ text, delay = 0, className = "", as = "p" }) => {
  const textRef = useRef(null);
  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const words = el.innerText.split(" ");
    el.innerHTML = ""; // Clear existing
    words.forEach((word) => {
      const wordSpan = document.createElement("span");
      wordSpan.className = "inline-block overflow-hidden mr-1.5"; // Added margin for space
      const innerSpan = document.createElement("span");
      innerSpan.className = "inline-block translate-y-full opacity-0";
      innerSpan.innerText = word;
      wordSpan.appendChild(innerSpan);
      el.appendChild(wordSpan);
    });

    gsap.to(el.querySelectorAll("span > span"), {
      y: 0,
      opacity: 1,
      stagger: 0.04, // Fine-tune stagger
      duration: 0.5, // Fine-tune duration
      delay: delay,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%", // When 85% of the element is visible
        toggleActions: "play none none none",
      },
    });
  }, [text, delay]);

  const Component = as;
  return (
    <Component ref={textRef} className={className}>
      {text}
    </Component>
  );
};

const InfoHighlightSection = () => {
  const sectionRef = useRef(null);

  const highlights = [
    {
      icon: CodeXml,
      title: "Pure Implementation",
      text: "No high-level ML libraries. Core logic meticulously coded using only Python & NumPy for true transparency.",
    },
    {
      icon: Layers,
      title: "Full-Stack Integration",
      text: "A Python engine seamlessly connected to a dynamic React frontend via a robust FastAPI backend.",
    },
    {
      icon: Atom,
      title: "Fundamental Focus",
      text: "Designed to demystify. Explore forward/backward propagation, activation functions, and more, step-by-step.",
    },
  ];

  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    // Entrance animation for the cards
    gsap.fromTo(
      el.querySelectorAll(".highlight-card"),
      { opacity: 0, y: 60, scale: 0.9, filter: "blur(2px)" },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        stagger: 0.15,
        duration: 0.8,
        ease: "expo.out", // More expressive ease
        scrollTrigger: {
          trigger: el,
          start: "top 70%", // Trigger a bit earlier
          toggleActions: "play none none none",
        },
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      id="project-highlights"
      className={`${theme.surface} py-20 sm:py-28`}
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <AnimatedTextWord
          as="h2"
          text="Project&nbsp;Highlights"
          className={`text-center text-3xl sm:text-4xl md:text-5xl font-bold mb-12 sm:mb-16 ${theme.textPrimary}`}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
          {highlights.map((item, index) => (
            <motion.div
              key={index}
              className="highlight-card p-6 rounded-xl border border-slate-700/70 bg-slate-800/60 shadow-xl text-center backdrop-blur-sm" // Added backdrop blur
              whileHover={{
                y: -7,
                boxShadow: `0 12px 30px rgba(14, 165, 233, 0.15), 0 0 15px rgba(14, 165, 233, 0.1)`, // Enhanced shadow
                borderColor: `rgba(14, 165, 233, 0.5)`, // Sky accent border on hover
              }}
              transition={{ type: "spring", stiffness: 260, damping: 15 }}
            >
              <div
                className={`inline-flex p-3.5 mb-5 rounded-full bg-gradient-to-br from-${theme.accent}-500/10 to-slate-800/30 border border-${theme.accent}-500/30`}
              >
                <item.icon size={30} className={`text-${theme.accent}-400`} />
              </div>
              <h3
                className={`text-xl sm:text-2xl font-semibold mb-3 ${theme.textPrimary}`}
              >
                {item.title}
              </h3>
              <p
                className={`${theme.textSecondary} text-sm sm:text-base leading-relaxed`}
              >
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InfoHighlightSection;
