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
  ChevronsDown,
  Menu,
  X,
  Lightbulb,
  BarChart3,
  Settings2,
  FileText,
  CheckCircle,
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
  { id: "introduction", title: "Project Overview", Icon: Lightbulb },
  { id: "core-engine", title: "Custom NN Engine", Icon: Cpu },
  {
    id: "fullstack-architecture",
    title: "Fullstack Architecture",
    Icon: Layers,
  },
  {
    id: "training-visualization",
    title: "Training Visualization",
    Icon: BarChart3,
  },
  { id: "educational-focus", title: "Educational Platform", Icon: BookOpen },
  { id: "why-it-matters", title: "Why It Matters", Icon: Target },
  { id: "explore-further", title: "Explore Further", Icon: ExternalLink },
];

// --- Main Learn Page Component ---
const LearnPage = () => {
  const mainContentRef = useRef(null);
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const [isTocOpen, setIsTocOpen] = useState(false);

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
    let nodes = [];
    const numNodes = 30; // Reduced for performance
    const connectionDistance = 120; // Reduced
    const nodeBaseRadius = 1.2; // Reduced

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
        this.vx = (Math.random() - 0.5) * 0.2; // Further slowed
        this.vy = (Math.random() - 0.5) * 0.2;
        this.originalColor = `rgba(56, 189, 248, ${
          Math.random() * 0.15 + 0.05
        })`; // More faint
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      draw() {
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
            ctx.strokeStyle = `rgba(125, 211, 252, ${opacity * 0.08})`; // Even fainter
            ctx.lineWidth = 0.3;
            ctx.stroke();
          }
        }
      }
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    let animationFrameId;
    function animateNN() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      nodes.forEach((node) => {
        node.update();
        node.draw();
      });
      drawConnections();
      animationFrameId = requestAnimationFrame(animateNN);
    }
    animateNN();
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Animations (generally run once, less likely to cause persistent scroll issues)
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

      // Section Animations
      SECTIONS.forEach((section) => {
        const sectionElement = document.getElementById(section.id);
        if (!sectionElement) return;

        // Section Title Underline Animation
        const sectionTitle = sectionElement.querySelector(
          ".section-title-text"
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

        // General Content Item Animation (staggered fade-in)
        // This is a common pattern and usually efficient if not too many items.
        gsap.fromTo(
          sectionElement.querySelectorAll(".content-item"),
          { opacity: 0, y: 30 }, // Simplified: removed scale
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out", // Slightly faster, less stagger
            scrollTrigger: {
              trigger: sectionElement,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          }
        );

        // ScrollTrigger for Active TOC Section
        ScrollTrigger.create({
          trigger: sectionElement,
          start: "top center",
          end: "bottom center",
          onEnter: () => setActiveSection(section.id),
          onEnterBack: () => setActiveSection(section.id),
        });
      });

      // "Why It Matters" Section - SIMPLIFIED ANIMATION (NO PINNING)
      const whyMattersSection = document.getElementById("why-it-matters");
      if (whyMattersSection) {
        const comparisonColumns =
          whyMattersSection.querySelectorAll(".comparison-column");
        if (comparisonColumns.length > 0) {
          // Animate columns individually as they scroll into view
          gsap.fromTo(
            comparisonColumns,
            { opacity: 0, y: 50 }, // Simplified entrance
            {
              opacity: 1,
              y: 0,
              stagger: 0.2,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: whyMattersSection, // Trigger based on the section itself
                start: "top 70%", // Start animation when section is 70% in view
                toggleActions: "play none none none",
              },
            }
          );
        }
      }
    }, mainContentRef);
    return () => ctx.revert();
  }, []);

  const handleTocClick = (id) => {
    gsap.to(window, {
      duration: 1,
      scrollTo: { y: `#${id}`, offsetY: 80 },
      ease: "power1.inOut",
    }); // Faster scroll
    setIsTocOpen(false);
  };

  const SectionWrapper = ({
    id,
    title,
    children,
    icon: IconComponent,
    className = "",
  }) => (
    <section id={id} className={`py-16 md:py-20 relative ${className}`}>
      {" "}
      {/* Slightly reduced padding */}
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        {" "}
        {/* Slightly reduced padding */}
        <div className="flex items-center mb-6 md:mb-10 content-item">
          {" "}
          {/* Reduced margin */}
          {IconComponent && (
            <IconComponent
              className={`w-7 h-7 md:w-9 md:h-9 mr-3 text-${theme.accent}-400`}
              strokeWidth={1.5}
            />
          )}{" "}
          {/* Slightly smaller icons */}
          <h2
            className={`section-title-text text-2xl md:text-3xl font-bold ${theme.textPrimary} relative inline-block pb-1`}
            style={{
              backgroundImage: `linear-gradient(to right, ${
                "#" +
                gsap.utils.interpolate(["#0ea5e9", "#6366f1", "#ec4899"])(
                  SECTIONS.findIndex((s) => s.id === id) / SECTIONS.length
                )
              }, ${
                "#" +
                gsap.utils.interpolate(["#0ea5e9", "#6366f1", "#ec4899"])(
                  SECTIONS.findIndex((s) => s.id === id) / SECTIONS.length + 0.1
                )
              })`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "bottom left",
              backgroundSize: "0% 2px",
            }}
          >
            {title}
          </h2>
        </div>
        {children}
      </div>
    </section>
  );

  const FeatureCard = ({ icon: Icon, title, description }) => (
    <motion.div
      className={`p-5 rounded-lg shadow-lg ${theme.card} ${theme.cardHover} border border-slate-700/50 transition-colors duration-300 content-item`} // Simpler shadow, border
      whileHover={{ y: -4, boxShadow: "0 8px 15px rgba(0,0,0,0.25)" }} // Subtle hover
      transition={{ type: "spring", stiffness: 350, damping: 20 }} // Adjusted spring
    >
      <div
        className={`mb-3 inline-flex items-center justify-center p-2.5 rounded-full bg-${theme.accent}-500/15`}
      >
        {" "}
        {/* Smaller icon bg */}
        <Icon className={`w-6 h-6 text-${theme.accent}-400`} />{" "}
        {/* Smaller icon */}
      </div>
      <h3 className={`text-lg font-semibold mb-1.5 ${theme.textPrimary}`}>
        {title}
      </h3>{" "}
      {/* Smaller text */}
      <p className={`${theme.textSecondary} text-xs leading-relaxed`}>
        {description}
      </p>{" "}
      {/* Smaller text */}
    </motion.div>
  );

  const TimelineEvent = ({ title, description, isLast = false }) => (
    <div className="relative pl-10 pb-8 content-item">
      {" "}
      {/* Reduced padding */}
      {!isLast && (
        <div
          className={`absolute left-[14px] top-4 bottom-0 w-px bg-slate-700`}
        ></div>
      )}{" "}
      {/* Thinner line */}
      <div
        className={`absolute left-0 top-1.5 flex items-center justify-center w-7 h-7 rounded-full bg-${theme.accentSecondary}-500 ring-2 ring-slate-800`}
      >
        {" "}
        {/* Smaller dot */}
        <CheckCircle className="w-4 h-4 text-slate-50" /> {/* Smaller icon */}
      </div>
      <h4 className={`text-md font-medium mb-0.5 ${theme.textPrimary}`}>
        {title}
      </h4>{" "}
      {/* Smaller text */}
      <p className={`${theme.textMuted} text-xs`}>{description}</p>{" "}
      {/* Emphasize muted for description, smaller */}
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
      className={`inline-flex items-center gap-1.5 px-5 py-2.5 font-medium rounded-md ${theme.textPrimary} bg-${theme.accent}-600 hover:bg-${theme.accent}-500 transition-colors duration-200 shadow-md hover:shadow-${theme.accent}-500/40 focus:outline-none focus:ring-1 focus:ring-${theme.accent}-400 focus:ring-offset-1 focus:ring-offset-slate-950 ${className}`} // Smaller padding, shadow, ring
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }} // More subtle interaction
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      {Icon && <Icon className="w-4 h-4" />} {/* Smaller icon */}
      {children}
    </motion.a>
  );

  return (
    <>
      <canvas
        ref={nnCanvasRef}
        className={`fixed top-0 left-0 w-full h-full -z-10 ${theme.bg}`}
      ></canvas>

      <div
        className={`${theme.bg} ${theme.textSecondary} min-h-screen font-sans`}
      >
        <aside className="hidden lg:block fixed top-1/2 -translate-y-1/2 left-5 z-40">
          {" "}
          {/* Slightly less left padding */}
          <nav
            className={`p-2.5 rounded-md ${theme.surface} bg-opacity-70 backdrop-blur-sm shadow-xl border border-slate-700/50 max-w-[200px]`}
          >
            {" "}
            {/* Narrower, simpler effects */}
            <h3
              className={`text-xs font-semibold mb-1.5 ${theme.textMuted} uppercase tracking-wide px-1.5`}
            >
              Contents
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
                    <span className="truncate">{section.title}</span>
                  </motion.button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="lg:hidden fixed top-3 right-3 z-50">
          {" "}
          {/* Smaller spacing */}
          <motion.button
            onClick={() => setIsTocOpen(!isTocOpen)}
            className={`p-2.5 rounded-full ${theme.surface}/80 backdrop-blur-sm text-${theme.accent}-400 shadow-lg`}
            whileTap={{ scale: 0.9 }}
          >
            {isTocOpen ? <X size={20} /> : <Menu size={20} />}{" "}
            {/* Smaller icons */}
          </motion.button>
        </div>

        <AnimatePresence>
          {isTocOpen && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`lg:hidden fixed inset-0 ${theme.surface} z-40 p-6 pt-16 overflow-y-auto`} // Adjusted padding
            >
              <h3 className={`text-md font-semibold mb-4 ${theme.textPrimary}`}>
                Navigation
              </h3>{" "}
              {/* Smaller */}
              <ul>
                {SECTIONS.map((section) => (
                  <li key={section.id} className="mb-2">
                    {" "}
                    {/* Reduced margin */}
                    <button
                      onClick={() => handleTocClick(section.id)}
                      className={`w-full text-left py-1.5 text-md flex items-center gap-2 ${
                        activeSection === section.id
                          ? `text-${theme.accent}-400 font-medium`
                          : theme.textSecondary
                      }`} // Smaller
                    >
                      <section.Icon className="w-4 h-4" /> {section.title}{" "}
                      {/* Smaller */}
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
              <motion.h1
                className={`hero-title text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 ${theme.textPrimary} tracking-tight`}
                aria-label="Neural Networks: Built from Scratch"
              >
                {"Neural Network Project:".split("").map((char, i) => (
                  <span key={i} className="hero-title-char inline-block">
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
                <br className="hidden md:block" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-400">
                  {"Built from Scratch.".split("").map((char, i) => (
                    <span key={i} className="hero-title-char inline-block">
                      {char === " " ? "\u00A0" : char}
                    </span>
                  ))}
                </span>
              </motion.h1>
              <p
                className={`hero-subtitle-word text-lg md:text-xl max-w-2xl mx-auto mb-10 ${theme.textSecondary}`}
              >
                {splitTextToSpans(
                  "Explore a custom-coded neural network engine and the full-stack application that brings machine learning fundamentals to life."
                )}
              </p>
              <div className="hero-cta">
                <PulsatingButton
                  href="#introduction"
                  onClick={(e) => {
                    e.preventDefault();
                    handleTocClick("introduction");
                  }}
                  icon={Zap}
                >
                  Discover the Engine
                </PulsatingButton>
              </div>
            </div>
            <div className="hero-scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-xs text-slate-400">
              {" "}
              {/* Smaller */}
              <span>Scroll to Learn</span>
              <ChevronsDown className="w-5 h-5 mt-0.5" /> {/* Smaller */}
            </div>
          </header>

          {/* Content Sections - Text and structure remain largely the same, styling simplified via components */}
          <SectionWrapper
            id="introduction"
            title="Project Overview: A Deep Dive into Neural Networks"
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
              Every critical component of a neural network—from{" "}
              <strong>forward and backward propagation</strong> to{" "}
              <strong>
                gradient descent, activation functions, and loss calculations
              </strong>
              —has been implemented from scratch. This approach offers
              unparalleled transparency into the inner workings of machine
              learning models.
            </p>
          </SectionWrapper>

          <SectionWrapper
            id="core-engine"
            title="The Custom Neural Network Engine"
            icon={Cpu}
            className={`${theme.surface}`}
          >
            <p className="text-md md:text-lg leading-relaxed mb-6 content-item">
              The core of this endeavor is a powerful, lightweight neural
              network engine developed exclusively in Python with NumPy for
              numerical operations. It's designed for flexibility, educational
              insight, and robust performance.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mb-6">
              <FeatureCard
                icon={Settings2}
                title="Flexible Architectures"
                description="Supports multi-layer sequential networks with user-defined layer sizes and activation functions."
              />
              <FeatureCard
                icon={Zap}
                title="Diverse Activations"
                description="Includes Sigmoid, Tanh, ReLU, Leaky ReLU, and Softmax for various modeling needs."
              />
              <FeatureCard
                icon={Target}
                title="Loss Functions"
                description="Implements Mean Squared Error (MSE) for regression and Categorical Cross-Entropy for classification."
              />
              <FeatureCard
                icon={Layers}
                title="Batch Training"
                description="Features mini-batch gradient descent with data shuffling for efficient and stable learning."
              />
              <FeatureCard
                icon={Brain}
                title="Full Backpropagation"
                description="Accurate gradient computation through a carefully implemented backpropagation algorithm."
              />
              <FeatureCard
                icon={Code}
                title="Modular Design"
                description="A clean, object-oriented structure promotes extensibility and easy understanding of each component."
              />
            </div>
            <p className="text-center content-item">
              <PulsatingButton
                href="https://drive.google.com/drive/u/0/folders/1VW3BlBr7E5cSYQKeAR7YvYL9XvSm0Nqt"
                icon={FileText}
              >
                Access Technical Documentation
              </PulsatingButton>
            </p>
          </SectionWrapper>

          <SectionWrapper
            id="fullstack-architecture"
            title="Full-Stack Architecture: From Python to Pixel"
            icon={Layers}
          >
            <p className="text-md md:text-lg leading-relaxed mb-4 content-item">
              The raw power of the Python engine is made accessible and
              interactive through a sophisticated full-stack web application.
            </p>
            <ul className="space-y-3 mb-6 text-sm md:text-base">
              <li className="content-item flex items-start">
                <Code
                  className={`w-5 h-5 mr-2.5 mt-0.5 text-${theme.accent}-400 shrink-0`}
                />
                <div>
                  <strong>Backend (FastAPI):</strong> A high-performance Python
                  framework handles dataset uploads (CSVs), model training
                  requests, and serves training history (loss/accuracy)
                  post-completion. All endpoints are asynchronous and stateless,
                  ensuring scalability and robustness.
                </div>
              </li>
              <li className="content-item flex items-start">
                <Zap
                  className={`w-5 h-5 mr-2.5 mt-0.5 text-${theme.accent}-400 shrink-0`}
                />
                <div>
                  <strong>Frontend (React):</strong> A dynamic React application
                  provides the user interface. It communicates with the FastAPI
                  backend via HTTP, allowing users to configure and train
                  models.
                </div>
              </li>
              <li className="content-item flex items-start">
                <BarChart3
                  className={`w-5 h-5 mr-2.5 mt-0.5 text-${theme.accent}-400 shrink-0`}
                />
                <div>
                  <strong>
                    Data Visualization (Chart.js & Framer Motion):
                  </strong>{" "}
                  Training progress and results are visualized using Chart.js,
                  enhanced with Framer Motion and GSAP for smooth, animated
                  graph presentations.
                </div>
              </li>
            </ul>
            <p
              className={`content-item p-3 rounded-md ${theme.card} border border-slate-700/50 text-center italic text-xs md:text-sm`}
            >
              This seamless integration demonstrates a holistic approach to
              software engineering—bridging complex backend algorithms with
              intuitive frontend user experiences.
            </p>
          </SectionWrapper>

          <SectionWrapper
            id="training-visualization"
            title="Visualizing the Learning Journey"
            icon={BarChart3}
            className={`${theme.surface}`}
          >
            <p className="text-md md:text-lg leading-relaxed mb-4 content-item">
              Understanding a model's training process is crucial. This platform
              provides clear, animated visualizations of key metrics like{" "}
              <strong>loss and accuracy</strong> over epochs.
            </p>
            <div className="content-item p-4 bg-slate-800/70 rounded-md shadow-lg border border-slate-700/50">
              <img
                src="https://placehold.co/800x400/1e293b/94a3b8?text=Animated+Loss/Accuracy+Chart"
                alt="Example of Training Visualization"
                className="rounded w-full h-auto object-cover"
              />
              <p className={`mt-3 text-center text-xs ${theme.textMuted}`}>
                Graphs are rendered using Chart.js and animated with GSAP/Framer
                Motion for engaging feedback on model performance.
              </p>
            </div>
            <p className="mt-4 content-item text-sm md:text-base">
              These visualizations aren't static. They update dynamically,
              offering real-time (simulated for demo purposes) insights into how
              hyperparameter choices and dataset characteristics influence the
              learning trajectory.
            </p>
          </SectionWrapper>

          <SectionWrapper
            id="educational-focus"
            title="An Educational Platform at Heart"
            icon={BookOpen}
          >
            <p className="text-md md:text-lg leading-relaxed mb-4 content-item">
              Beyond being a functional application, this project is
              fundamentally an <strong>educational tool</strong>. It's designed
              to demystify neural networks by exposing their core mechanics.
            </p>
            <div className="space-y-5 mb-6">
              <TimelineEvent
                title="Transparency by Design"
                description="Every component is built for clarity. Users can inspect how data transforms and gradients flow."
              />
              <TimelineEvent
                title="Interactive Learning"
                description="Experiment with hyperparameters, activation functions, and datasets to observe direct impacts on model behavior."
              />
              <TimelineEvent
                title="In-Depth Explanations"
                description="Detailed write-ups accompany the project, explaining the 'how' and 'why' behind each implementation choice."
                isLast={true}
              />
            </div>
            <p className="text-xs italic text-center mb-4 content-item ${theme.textMuted}">
              The available documentation covers:
            </p>
            <ul
              className={`grid md:grid-cols-2 gap-3 mb-6 text-xs ${theme.textSecondary} list-none p-0`}
            >
              <li className="content-item p-3 bg-slate-800/70 rounded-md border border-slate-700/50">
                <strong className={`text-${theme.accent}-400`}>
                  Propagation Mechanics:
                </strong>{" "}
                Forward and backward passes explained step-by-step.
              </li>
              <li className="content-item p-3 bg-slate-800/70 rounded-md border border-slate-700/50">
                <strong className={`text-${theme.accent}-400`}>
                  Function Internals:
                </strong>{" "}
                Deep dives into activation and loss function implementations.
              </li>
              <li className="content-item p-3 bg-slate-800/70 rounded-md border border-slate-700/50">
                <strong className={`text-${theme.accent}-400`}>
                  Training Dynamics:
                </strong>{" "}
                Visual guides to weight updates and optimization.
              </li>
              <li className="content-item p-3 bg-slate-800/70 rounded-md border border-slate-700/50">
                <strong className={`text-${theme.accent}-400`}>
                  Mathematical Foundations:
                </strong>{" "}
                The linear algebra and calculus that power NNs.
              </li>
            </ul>
            <p className="text-center content-item">
              <PulsatingButton
                href="https://drive.google.com/drive/u/0/folders/1VW3BlBr7E5cSYQKeAR7YvYL9XvSm0Nqt"
                icon={FileText}
              >
                Study the Detailed Write-ups
              </PulsatingButton>
            </p>
          </SectionWrapper>

          {/* "Why It Matters" section now has simplified GSAP, no pinning */}
          <SectionWrapper
            id="why-it-matters"
            title="Why This 'From Scratch' Approach Matters"
            icon={Target}
            className={`${theme.surface}`}
          >
            <p className="text-md md:text-lg leading-relaxed mb-6 content-item">
              In a world awash with ML tools and libraries, building from
              scratch is a deliberate choice that signifies a deeper level of
              understanding and capability.
            </p>
            {/* The .comparison-column elements will be animated by the general .content-item GSAP in their parent SectionWrapper */}
            <div className="grid md:grid-cols-2 gap-5 mb-6">
              <div
                className={`comparison-column p-4 rounded-md border border-dashed border-slate-600/70 ${theme.card}/80 content-item`}
              >
                {" "}
                {/* Added content-item */}
                <h4 className={`text-lg font-semibold mb-2 ${theme.textMuted}`}>
                  Typical ML Projects
                </h4>
                <ul className="space-y-1.5 text-xs list-disc list-inside ${theme.textMuted}">
                  <li>
                    Utilize high-level libraries (TensorFlow, PyTorch,
                    Scikit-learn).
                  </li>
                  <li>
                    Focus on applying pre-built models or abstracted APIs.
                  </li>
                  <li>Core mechanics often remain a "black box."</li>
                  <li>Limited insight into fundamental operations.</li>
                </ul>
              </div>
              <div
                className={`comparison-column p-4 rounded-md border border-${theme.accent}-500/70 ${theme.card} shadow-lg shadow-${theme.accent}-500/10 content-item`}
              >
                {" "}
                {/* Added content-item */}
                <h4
                  className={`text-lg font-semibold mb-2 text-${theme.accent}-400`}
                >
                  This Project's Distinction
                </h4>
                <ul className="space-y-1.5 text-xs list-disc list-inside">
                  <li>
                    <strong>Zero reliance on high-level ML libraries</strong>{" "}
                    for core NN logic.
                  </li>
                  <li>
                    Handwritten implementations of all key algorithms using only
                    NumPy.
                  </li>
                  <li>
                    Full-stack integration of a custom multiclass classification
                    pipeline.
                  </li>
                  <li>
                    Sophisticated frontend with custom data flows and animated
                    visualizations.
                  </li>
                </ul>
              </div>
            </div>
            <p
              className={`text-center text-lg font-medium p-4 rounded-md ${theme.card} border border-slate-700/50 content-item`}
            >
              This dedication to first principles demonstrates not just
              proficient coding, but a{" "}
              <strong className={`text-${theme.accent}-400`}>
                profound grasp of machine learning fundamentals
              </strong>{" "}
              and rigorous software engineering discipline—qualities highly
              valued by forward-thinking teams and recruiters.
            </p>
          </SectionWrapper>

          <SectionWrapper
            id="explore-further"
            title="Explore the Code & Concepts"
            icon={ExternalLink}
          >
            <p className="text-md md:text-lg leading-relaxed mb-6 text-center content-item">
              The entire project, from its mathematical underpinnings to the
              deployed application, is open for exploration. Dive into the
              source code, review the documentation, and see how these complex
              concepts translate into working software.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 content-item">
              <PulsatingButton
                href="https://github.com/nashawe/neural-network"
                icon={Github}
              >
                View Source on GitHub
              </PulsatingButton>
              <PulsatingButton
                href="https://drive.google.com/drive/u/0/folders/1VW3BlBr7E5cSYQKeAR7YvYL9XvSm0Nqt"
                icon={FileText}
                className={`bg-${theme.accentSecondary}-600 hover:bg-${theme.accentSecondary}-500 shadow-${theme.accentSecondary}-500/40 focus:ring-${theme.accentSecondary}-400`}
              >
                Access All Documentation
              </PulsatingButton>
            </div>
          </SectionWrapper>

          <footer
            className={`py-10 text-center border-t border-slate-800/50 ${theme.textMuted}`}
          >
            <p className="text-xs">
              © {new Date().getFullYear()} Nathaniel Shawe. Passionately
              engineered from the ground up.
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
