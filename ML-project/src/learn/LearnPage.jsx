// --- START OF FILE LearnPage.jsx ---

import React, { useEffect, useRef, useLayoutEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  Cpu,
  Brain,
  Code,
  Zap,
  Target,
  ExternalLink,
  BookOpen,
  Github,
  Menu,
  X,
  Lightbulb,
  BarChart3,
  Settings2,
  FileText,
  CheckCircle,
  Home,
  ChevronDown,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// --- Helper for GSAP Text Animations (Basic Word Splitting) ---
const splitTextToSpans = (text) => {
  return text.split(/\s+/).map((word, index) => (
    <span key={index} className="inline-block overflow-hidden">
      <span className="inline-block translate-y-full">{word} </span>
    </span>
  ));
};

// --- Configuration for Sections and TOC ---
const SECTIONS = [
  {
    id: "introduction",
    title: "Project Overview",
    Icon: Lightbulb,
    shortTitle: "Overview",
  }, // Added shortTitle for TOC
  {
    id: "core-engine",
    title: "Custom NN Engine",
    Icon: Cpu,
    shortTitle: "Engine",
  },
  {
    id: "fullstack-architecture",
    title: "Fullstack Architecture",
    Icon: Layers,
    shortTitle: "Architecture",
  },
  {
    id: "training-visualization",
    title: "Training Visualization",
    Icon: BarChart3,
    shortTitle: "Visualization",
  },
  {
    id: "educational-focus",
    title: "Educational Platform",
    Icon: BookOpen,
    shortTitle: "Education",
  },
  {
    id: "why-it-matters",
    title: "Why It Matters",
    Icon: Target,
    shortTitle: "Significance",
  },
  {
    id: "explore-further",
    title: "Explore Further",
    Icon: ExternalLink,
    shortTitle: "Explore",
  },
];

// --- Main Learn Page Component ---
const LearnPage = () => {
  const mainContentRef = useRef(null);
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const [isTocOpen, setIsTocOpen] = useState(false);
  const allSectionRefs = useRef([]);

  const theme = {
    bg: "bg-slate-950",
    surface: "bg-slate-900",
    card: "bg-slate-800",
    cardHover: "hover:bg-slate-700",
    textPrimary: "text-slate-50",
    textSecondary: "text-slate-300",
    textMuted: "text-slate-400",
    accent: "sky",
    accentSecondary: "rose",
  };

  const nnCanvasRef = useRef(null);
  useEffect(() => {
    const canvas = nnCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return; // Added check for context

    let nodes = [];
    const numNodes = 30;
    const connectionDistance = 120;
    const nodeBaseRadius = 1.2;
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initNodes();
    };

    class Node {
      constructor(x, y) {
        this.x = x || Math.random() * canvas.width;
        this.y = y || Math.random() * canvas.height;
        this.radius = nodeBaseRadius + Math.random() * 1;
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = (Math.random() - 0.5) * 0.2;
        this.originalColor = `rgba(56, 189, 248, ${
          Math.random() * 0.15 + 0.05
        })`;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x - this.radius < 0 || this.x + this.radius > canvas.width)
          this.vx *= -1;
        if (this.y - this.radius < 0 || this.y + this.radius > canvas.height)
          this.vy *= -1;
      }
      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.originalColor;
        ctx.fill();
      }
    }

    function initNodes() {
      nodes = [];
      for (let i = 0; i < numNodes; i++) nodes.push(new Node());
    }

    function drawConnections() {
      if (!ctx) return;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < connectionDistance) {
            const opacity = 1 - distance / connectionDistance;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(125, 211, 252, ${opacity * 0.08})`;
            ctx.lineWidth = 0.3;
            ctx.stroke();
          }
        }
      }
    }

    function animateNN() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      nodes.forEach((node) => {
        node.update();
        node.draw();
      });
      drawConnections();
      animationFrameId = requestAnimationFrame(animateNN);
    }

    resizeCanvas(); // Initial call
    animateNN(); // Start animation

    window.addEventListener("resize", resizeCanvas);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
      nodes = [];
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, []);

  useLayoutEffect(() => {
    allSectionRefs.current = gsap.utils.toArray(
      ".content-section-wrapper",
      mainContentRef.current
    );

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-title-char",
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.03,
          duration: 0.8,
          delay: 0.5,
          ease: "power3.out",
        }
      );
      gsap.fromTo(
        ".hero-subtitle-word > span",
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.05,
          duration: 0.6,
          delay: 1.2,
          ease: "power3.out",
        }
      );
      gsap.fromTo(
        ".hero-cta",
        { scale: 0.5, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          delay: 1.8,
          ease: "elastic.out(1, 0.5)",
        }
      );
      gsap.fromTo(
        ".hero-scroll-indicator",
        { y: -20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 2.5,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        }
      );

      allSectionRefs.current.forEach((section, index) => {
        const sectionId = section.id;
        const contentItems = section.querySelectorAll(".content-item");
        const sectionTitle = section.querySelector(".section-title-text");
        const sectionContentContainer = section.querySelector(
          ".section-content-container"
        );

        if (sectionTitle) {
          gsap.fromTo(
            sectionTitle,
            { backgroundSize: "0% 2px" },
            {
              backgroundSize: "100% 2px",
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: sectionTitle,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            }
          );
        }

        gsap.fromTo(
          contentItems,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          }
        );

        ScrollTrigger.create({
          trigger: section,
          start: "top center+=10%",
          end: "bottom center-=10%",
          onEnter: () => {
            setActiveSection(sectionId);
            gsap.to(sectionContentContainer, {
              scale: 1.03,
              opacity: 1,
              duration: 0.4,
              ease: "power2.out",
            });
            allSectionRefs.current.forEach((otherSection) => {
              if (otherSection !== section) {
                gsap.to(
                  otherSection.querySelector(".section-content-container"),
                  {
                    scale: 0.97,
                    opacity: 0.6,
                    duration: 0.4,
                    ease: "power2.out",
                  }
                );
              }
            });
          },
          onEnterBack: () => {
            setActiveSection(sectionId);
            gsap.to(sectionContentContainer, {
              scale: 1.03,
              opacity: 1,
              duration: 0.4,
              ease: "power2.out",
            });
            allSectionRefs.current.forEach((otherSection) => {
              if (otherSection !== section) {
                gsap.to(
                  otherSection.querySelector(".section-content-container"),
                  {
                    scale: 0.97,
                    opacity: 0.6,
                    duration: 0.4,
                    ease: "power2.out",
                  }
                );
              }
            });
          },
        });
      });
    }, mainContentRef);
    return () => ctx.revert();
  }, []);

  const handleTocClick = (id) => {
    gsap.to(window, {
      duration: 1.2, // Slightly slower for smoother feel
      scrollTo: { y: `#${id}`, offsetY: 0 }, // Offset 0 to bring top of section to top of viewport
      ease: "power2.inOut",
    });
    setIsTocOpen(false);
  };

  const SectionWrapper = ({
    id,
    title,
    children,
    icon: IconComponent,
    className = "",
  }) => (
    <section
      id={id}
      className={`content-section-wrapper min-h-screen py-12 md:py-16 flex flex-col items-center justify-center relative ${className}`}
    >
      <div className="section-content-container w-full transition-opacity duration-300">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
          <div className="flex items-center justify-center mb-6 md:mb-8">
            {IconComponent && (
              <IconComponent
                className={`w-8 h-8 md:w-10 md:h-10 mr-3 text-${theme.accent}-400`}
                strokeWidth={1.5}
              />
            )}
            <h2
              className={`section-title-text text-3xl md:text-4xl lg:text-5xl font-bold ${theme.textPrimary} relative inline-block pb-1`}
            >
              {title}
            </h2>
          </div>
          {children}
        </div>
      </div>
    </section>
  );

  const FeatureCard = ({ icon: Icon, title, description }) => (
    <motion.div
      className={`p-4 text-left rounded-lg shadow-lg ${theme.card} ${theme.cardHover} border border-slate-700/50 transition-colors duration-300 content-item`}
      whileHover={{ y: -4, boxShadow: "0 8px 15px rgba(0,0,0,0.25)" }}
      transition={{ type: "spring", stiffness: 350, damping: 20 }}
    >
      <div
        className={`mb-2 inline-flex items-center justify-center p-2 rounded-full bg-${theme.accent}-500/15`}
      >
        <Icon className={`w-5 h-5 text-${theme.accent}-400`} />
      </div>
      <h3 className={`text-md font-semibold mb-1 ${theme.textPrimary}`}>
        {title}
      </h3>
      <p className={`${theme.textSecondary} text-xs leading-relaxed`}>
        {description}
      </p>
    </motion.div>
  );

  const TimelineEvent = ({ title, description, isLast = false }) => (
    <div className="relative pl-10 pb-6 text-left content-item">
      {!isLast && (
        <div
          className={`absolute left-[14px] top-4 bottom-0 w-px bg-slate-700`}
        ></div>
      )}
      <div
        className={`absolute left-0 top-1.5 flex items-center justify-center w-7 h-7 rounded-full bg-${theme.accentSecondary}-500 ring-2 ring-slate-800`}
      >
        <CheckCircle className="w-4 h-4 text-slate-50" />
      </div>
      <h4 className={`text-lg font-italic mb-0.5 ${theme.textPrimary}`}>
        {title}
      </h4>
      <p className={`${theme.textMuted} text-xs`}>{description}</p>
    </div>
  );

  const PulsatingButton = ({
    href,
    children,
    icon: Icon,
    className = "",
    target = "_blank",
    rel = "noopener noreferrer",
    onClick,
  }) => (
    <motion.a
      href={href}
      target={target}
      rel={rel}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-5 py-2.5 font-medium rounded-md ${theme.textPrimary} bg-${theme.accent}-600 hover:bg-${theme.accent}-500 transition-colors duration-200 shadow-md hover:shadow-${theme.accent}-500/40 focus:outline-none focus:ring-1 focus:ring-${theme.accent}-400 focus:ring-offset-1 focus:ring-offset-slate-950 ${className}`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </motion.a>
  );

  return (
    <>
      <canvas
        ref={nnCanvasRef}
        className="fixed top-0 left-0 w-[full] h-full -z-10 pointer-events-none" // Added pointer-events-none
      ></canvas>

      <div
        className={`${theme.bg} ${theme.textSecondary} min-h-screen font-sans`}
      >
        {/* Sticky TOC for Desktop */}
        <aside className="hidden lg:block fixed top-1/2 -translate-y-1/2 left-5 z-40">
          <nav
            className={`p-2.5 rounded-md ${theme.surface} bg-opacity-70 backdrop-blur-sm shadow-xl border border-slate-700/50 max-w-[200px]`}
          >
            {/* Home Button for Desktop TOC */}
            <motion.a
              href="/" // Assuming your home page is at the root
              className={`w-full text-left px-1.5 py-1.5 mb-2 rounded text-xs transition-all duration-150 flex items-center gap-1 ${theme.textMuted} hover:${theme.textSecondary} hover:bg-slate-700/30`}
              whileHover={{ x: 1.5 }}
              title="Go to Home Page"
            >
              <Home
                className={`w-3.5 h-3.5 shrink-0 text-${theme.accent}-400/80`}
              />
              <span className="truncate">Home</span>
            </motion.a>

            <h3
              className={`text-xs font-semibold mb-1.5 ${theme.textMuted} uppercase tracking-wide px-1.5`}
            >
              Page Contents
            </h3>
            <ul>
              {SECTIONS.map((section) => (
                <li key={section.id} className="my-0.5">
                  <motion.button
                    onClick={() => handleTocClick(section.id)}
                    className={`w-full text-left px-1.5 py-1 rounded text-xs transition-all duration-150 flex items-center gap-1 ${
                      activeSection === section.id
                        ? `${theme.textPrimary} bg-${theme.accent}-600/80 shadow-sm`
                        : `${theme.textMuted} hover:${theme.textSecondary} hover:bg-slate-700/30`
                    }`}
                    whileHover={{ x: activeSection !== section.id ? 1.5 : 0 }}
                  >
                    <section.Icon
                      className={`w-3 h-3 shrink-0 ${
                        activeSection === section.id
                          ? theme.textPrimary
                          : `text-${theme.accent}-400/80`
                      }`}
                    />
                    <span className="truncate">
                      {section.shortTitle || section.title}
                    </span>{" "}
                    {/* Use shortTitle if available */}
                  </motion.button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Mobile Header with Home and Menu Toggle */}
        <div className="lg:hidden fixed top-3 right-3 z-50 flex items-center gap-2">
          {/* Home Button for Mobile */}
          <motion.a
            href="/" // Assuming your home page is at the root
            className={`p-2.5 rounded-full ${theme.surface}/80 backdrop-blur-sm text-${theme.accent}-400 shadow-lg`}
            whileTap={{ scale: 0.9 }}
            title="Go to Home Page"
          >
            <Home size={20} />
          </motion.a>
          {/* Menu Toggle for Mobile TOC */}
          <motion.button
            onClick={() => setIsTocOpen(!isTocOpen)}
            className={`p-2.5 rounded-full ${theme.surface}/80 backdrop-blur-sm text-${theme.accent}-400 shadow-lg`}
            whileTap={{ scale: 0.9 }}
          >
            {isTocOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </div>

        <AnimatePresence>
          {isTocOpen && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`lg:hidden fixed inset-0 ${theme.surface} z-40 p-6 pt-16 overflow-y-auto`}
            >
              <h3 className={`text-md font-semibold mb-4 ${theme.textPrimary}`}>
                Navigation
              </h3>
              <ul>
                {SECTIONS.map((section) => (
                  <li key={section.id} className="mb-2">
                    <button
                      onClick={() => handleTocClick(section.id)}
                      className={`w-full text-left py-1.5 text-md flex items-center gap-2 ${
                        activeSection === section.id
                          ? `text-${theme.accent}-400 font-medium`
                          : theme.textSecondary
                      }`}
                    >
                      <section.Icon className="w-4 h-4" /> {section.title}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        <main ref={mainContentRef} className="relative z-10">
          <header className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative">
            <div className="absolute inset-0 pointer-events-none">
              <div
                className={`absolute inset-0 bg-gradient-to-br from-${theme.accent}-500/5 via-transparent to-transparent`}
              ></div>
            </div>
            <div className="relative z-10">
              <h1
                className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold ${theme.textPrimary} tracking-tighter leading-none sm:leading-tight md:leading-tight lg:leading-tight xl:leading-tight`}
              >
                <span
                  className={`animate-main-title-line block overflow-hidden bg-clip-text bg-gradient-to-r from-${theme.accent}-400 via-${theme.accentSecondary}-400 to-${theme.accentTertiary}-400`}
                >
                  <span className="inline-block">Learn</span>
                </span>
                <span className="animate-main-title-line block overflow-hidden">
                  <span className="inline-block">Neural</span>
                </span>
                <span className="animate-main-title-line block overflow-hidden">
                  <span className="inline-block">Networks</span>
                </span>
              </h1>
              <p
                className={`hero-subtitle-word text-lg md:text-xl max-w-2xl mx-auto mb-10 ${theme.textSecondary}`}
              >
                {splitTextToSpans(
                  "Explore a custom-coded neural network engine and the full-stack application that brings machine learning fundamentals to life."
                )}
              </p>
            </div>
            <button
              onClick={() => handleTocClick("introduction")} // Scroll to first content section
              className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-slate-400 hover:text-sky-300 transition-colors z-10 cursor-pointer group"
              title="Discover More"
            >
              <span
                className={`text-xs mb-1 -mt-10 group-hover:text-${theme.accent}-300 transition-colors`}
              >
                Begin Exploration
              </span>
              <ChevronDown
                size={26}
                className={`opacity-70 group-hover:opacity-90 transition-opacity`}
              />
            </button>
          </header>

          {/* Content Sections */}
          <SectionWrapper
            id="introduction"
            title="Project Overview"
            icon={Lightbulb}
          >
            <p className="text-md md:text-lg leading-relaxed mb-4 content-item">
              Welcome to an in-depth exploration of a unique machine learning
              project. This isn't just another application leveraging
              off-the-shelf ML libraries; it's a{" "}
              <strong>fully custom, end-to-end neural network engine</strong>,
              meticulously crafted from foundational principles using only
              Python and NumPy.
            </p>
            <p className="mb-3 content-item text-sm md:text-base">
              This engine is encapsulated within a modern, full-stack web
              application. Users can interactively upload datasets, define
              network architectures, initiate training, and visualize
              performance metrics—all seamlessly within their browser.
            </p>
            <p className="content-item text-sm md:text-base">
              What sets this project apart is its commitment to fundamentals.
            </p>
          </SectionWrapper>

          <SectionWrapper
            id="core-engine"
            title="Custom NN Engine"
            icon={Cpu}
            className={`${theme.surface}`}
          >
            <p className="text-md md:text-lg leading-relaxed mb-6 content-item">
              The core of this endeavor is a powerful, lightweight neural
              network engine.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-6 max-w-2xl mx-auto">
              <FeatureCard
                icon={Settings2}
                title="Flexible Architectures"
                description="Multi-layer networks with custom layer sizes."
              />
              <FeatureCard
                icon={Zap}
                title="Diverse Activations"
                description="Sigmoid, Tanh, ReLU, Leaky ReLU, Softmax."
              />
              <FeatureCard
                icon={Target}
                title="Loss Functions"
                description="MSE & Categorical Cross-Entropy."
              />
              <FeatureCard
                icon={Layers}
                title="Batch Training"
                description="Mini-batch gradient descent with shuffling."
              />
              <FeatureCard
                icon={Brain}
                title="Backpropagation"
                description="Accurate gradient computation."
              />
              <FeatureCard
                icon={Code}
                title="Modular Design"
                description="Clean, object-oriented, and extensible."
              />
            </div>
            <p className="text-center content-item">
              <PulsatingButton
                href="https://drive.google.com/drive/u/0/folders/1VW3BlBr7E5cSYQKeAR7YvYL9XvSm0Nqt"
                icon={FileText}
              >
                Technical Docs
              </PulsatingButton>
            </p>
          </SectionWrapper>

          <SectionWrapper
            id="fullstack-architecture"
            title="Fullstack Architecture"
            icon={Layers}
          >
            <p className="text-md md:text-lg leading-relaxed mb-4 content-item">
              The Python engine is made accessible via a sophisticated
              full-stack web application.
            </p>
            <ul className="space-y-3 mb-6 text-sm md:text-base max-w-xl mx-auto">
              <li className="content-item flex items-start p-3 bg-slate-800/50 rounded-md text-left">
                <Code className="w-6 h-6 mr-2.5 mt-0.5 text-sky-400 shrink-0" />
                <div>
                  <strong>FastAPI Backend:</strong> Handles CSV uploads,
                  training requests, and serves results. Asynchronous &
                  stateless.
                </div>
              </li>
              <li className="content-item flex items-start p-3 bg-slate-800/50 rounded-md text-left">
                <Zap className="w-6 h-6 mr-2.5 mt-0.5 text-sky-400 shrink-0" />
                <div>
                  <strong>React Frontend:</strong> Dynamic UI for model
                  configuration and interaction with the API.
                </div>
              </li>
              <li className="content-item flex items-start p-3 bg-slate-800/50 rounded-md text-left">
                <BarChart3 className="w-6 h-6 mr-2.5 mt-0.5 text-sky-400 shrink-0" />
                <div>
                  <strong>Visualization:</strong> Chart.js & Framer Motion/GSAP
                  for animated training graphs.
                </div>
              </li>
            </ul>
            <p
              className={`content-item p-3 rounded-md ${theme.card}/70 border border-slate-700/50 text-center italic text-xs md:text-sm max-w-md mx-auto`}
            >
              Bridging backend algorithms with intuitive frontend experiences.
            </p>
          </SectionWrapper>

          <SectionWrapper
            id="training-visualization"
            title="Training Visualization"
            icon={BarChart3}
            className={`${theme.surface}`}
          >
            <p className="text-md md:text-lg leading-relaxed mb-4 content-item">
              Understanding model training is key. This platform offers clear,
              animated visualizations.
            </p>
            <div className="content-item p-4 bg-slate-800/70 rounded-md shadow-lg border border-slate-700/50 max-w-xl mx-auto">
              <img
                src="https://placehold.co/800x400/1e293b/94a3b8?text=Animated+Loss/Accuracy+Chart"
                alt="Training Visualization Example"
                className="rounded w-full h-auto object-cover"
              />
              <p className={`mt-3 text-center text-xs ${theme.textMuted}`}>
                Insights into learning trajectories.
              </p>
            </div>
            <p className="mt-4 content-item text-sm md:text-base">
              Compare training runs of the same model with the "rerun" feature.
            </p>
          </SectionWrapper>

          <SectionWrapper
            id="educational-focus"
            title="Educational Platform"
            icon={BookOpen}
          >
            <p className="text-md md:text-lg leading-relaxed mb-4 content-item">
              This project is fundamentally an educational tool.
            </p>
            <div className="space-y-5 mb-6 max-w-md mx-auto">
              <TimelineEvent
                title="Transparency by Design"
                description="Inspect data transforms and gradient flows."
              />
              <TimelineEvent
                title="Interactive Learning"
                description="Experiment with hyperparameters and datasets."
              />
              <TimelineEvent
                title="In-Depth Explanations"
                description="Detailed write-ups on the 'how' and 'why.'"
                isLast={true}
              />
            </div>
            <p
              className={`text-xs italic text-center mb-4 content-item ${theme.textMuted}`}
            >
              The available documentation covers:
            </p>
            <ul
              className={`grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 text-xs ${theme.textSecondary} list-none p-0 max-w-lg mx-auto`}
            >
              <li className="content-item p-3 bg-slate-800/70 rounded-md border border-slate-700/50">
                <strong className={`text-${theme.accent}-400`}>
                  Propagation Mechanics
                </strong>
              </li>
              <li className="content-item p-3 bg-slate-800/70 rounded-md border border-slate-700/50">
                <strong className={`text-${theme.accent}-400`}>
                  Function Internals
                </strong>
              </li>
              <li className="content-item p-3 bg-slate-800/70 rounded-md border border-slate-700/50">
                <strong className={`text-${theme.accent}-400`}>
                  Training Dynamics
                </strong>
              </li>
              <li className="content-item p-3 bg-slate-800/70 rounded-md border border-slate-700/50">
                <strong className={`text-${theme.accent}-400`}>
                  Mathematical Foundations
                </strong>
              </li>
            </ul>
            <p className="text-center content-item">
              <PulsatingButton
                href="https://drive.google.com/drive/u/0/folders/1VW3BlBr7E5cSYQKeAR7YvYL9XvSm0Nqt"
                icon={FileText}
              >
                Study Write-ups
              </PulsatingButton>
            </p>
          </SectionWrapper>

          <SectionWrapper
            id="why-it-matters"
            title="Why It Matters"
            icon={Target}
            className={`${theme.surface}`}
          >
            <p className="text-md md:text-lg leading-relaxed mb-6 content-item">
              {" "}
              Building from scratch signifies deep understanding.
            </p>
            <div className="grid md:grid-cols-2 gap-4 md:gap-5 mb-6 max-w-2xl mx-auto">
              <div
                className={`comparison-column p-4 rounded-md border border-dashed border-slate-600/70 ${theme.card}/80 content-item text-left`}
              >
                <h4 className={`text-md font-semibold mb-2 ${theme.textMuted}`}>
                  Typical ML Projects
                </h4>
                <ul className="space-y-1.5 text-xs list-disc list-inside ${theme.textMuted}">
                  <li>Relies on high-level libraries.</li>
                  <li>Core mechanics as "black box."</li>
                </ul>
              </div>
              <div
                className={`comparison-column p-4 rounded-md border border-${theme.accent}-500/70 ${theme.card} shadow-lg shadow-${theme.accent}-500/10 content-item text-left`}
              >
                <h4
                  className={`text-md font-semibold mb-2 text-${theme.accent}-400`}
                >
                  This Project's Distinction
                </h4>
                <ul className="space-y-1.5 text-xs list-disc list-inside">
                  <li>Zero high-level ML libraries for core logic.</li>
                  <li>Handwritten algorithms (NumPy).</li>
                  <li>Full-stack custom pipeline.</li>
                </ul>
              </div>
            </div>
            <p
              className={`text-center text-md font-medium p-3 rounded-md ${theme.card} border border-slate-700/50 content-item max-w-xl mx-auto`}
            >
              Demonstrates profound grasp of ML fundamentals.
            </p>
          </SectionWrapper>

          <SectionWrapper
            id="explore-further"
            title="Explore Further"
            icon={ExternalLink}
          >
            <p className="text-md md:text-lg leading-relaxed mb-6 text-center content-item">
              The entire project is open for exploration.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 content-item">
              <PulsatingButton
                href="https://github.com/nashawe/neural-network"
                icon={Github}
              >
                GitHub Source
              </PulsatingButton>
              <PulsatingButton
                href="https://drive.google.com/drive/u/0/folders/1VW3BlBr7E5cSYQKeAR7YvYL9XvSm0Nqt"
                icon={FileText}
                className={`bg-${theme.accentSecondary}-600 hover:bg-${theme.accentSecondary}-500 shadow-${theme.accentSecondary}-500/40 focus:ring-${theme.accentSecondary}-400`}
              >
                Full Documentation
              </PulsatingButton>
            </div>
          </SectionWrapper>

          <footer
            className={`py-10 text-center border-t border-slate-800/50 ${theme.textMuted}`}
          >
            <p className="text-xs">
              © {new Date().getFullYear()} Nathaniel Shawe. Passionately
              engineered.
            </p>
            <p className="text-xs mt-1.5">
              Built with React, Tailwind CSS, GSAP, Framer Motion, and Lucide
              Icons.
            </p>
          </footer>
        </main>
      </div>
    </>
  );
};

export default LearnPage;

// --- END OF FILE LearnPage.jsx ---
