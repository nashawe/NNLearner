// --- START OF FILE LearnPage.jsx ---
import React, { useEffect, useRef, useLayoutEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom"; // Added for navbar
import {
  Layers,
  Cpu,
  Brain,
  Code,
  Zap,
  Target,
  ExternalLink,
  BookOpen,
  CodeXml,
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
  Blocks,
  Waypoints, // Added Blocks, Waypoints for navLinks
} from "lucide-react";
import MainNavbar from "../components/layout/MainNavbar";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const splitTextToSpans = (text) => {
  /* ... (same as before) ... */
  return text.split(/\s+/).map((word, index) => (
    <span key={index} className="inline-block overflow-hidden">
      <span className="inline-block translate-y-full">{word} </span>
    </span>
  ));
};

const SECTIONS = [
  /* ... (same as before) ... */
  {
    id: "introduction",
    title: "Project Overview",
    Icon: Lightbulb,
    shortTitle: "Overview",
  },
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

// Consistent navLinks definition
const navLinks = [
  { label: "Learn", path: "/learn", Icon: BookOpen },
  { label: "Build", path: "/build", Icon: Blocks },
  { label: "Explore", path: "/explore", Icon: Waypoints },
];

const LearnPage = () => {
  const [isScrolled, setIsScrolled] = React.useState(false); // For Navbar scroll effect
  const mainContentRef = useRef(null);
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const [isTocOpen, setIsTocOpen] = useState(false);
  const allSectionRefs = useRef([]);
  const navigate = useNavigate(); // For top-right navbar
  const location = useLocation(); // For top-right navbar active state

  const theme = {
    bg: "bg-slate-950",
    surface: "bg-slate-900",
    card: "bg-slate-800",
    cardHover: "hover:bg-slate-700",
    textPrimary: "text-slate-50",
    textSecondary: "text-slate-300",
    textMuted: "text-slate-400",
    accent: "sky", // Main accent for LearnPage
    accentSecondary: "rose",
    accentTertiary: "emerald",
    // Navbar specific (consistent with others)
    navbarBg: "bg-slate-900/60 backdrop-blur-lg",
    navbarText: "text-slate-300",
    navbarHoverText: "text-sky-300", // Using page's main accent for hover
    navbarActiveText: "text-sky-300 font-semibold",
  };

  const nnCanvasRef = useRef(null);
  useEffect(() => {
    /* ... (NN Canvas animation - same as before) ... */
    const canvas = nnCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

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

    resizeCanvas();
    animateNN();

    window.addEventListener("resize", resizeCanvas);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
      nodes = [];
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, []);

  useLayoutEffect(() => {
    /* ... (GSAP animations for page content - same as before) ... */
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

      allSectionRefs.current.forEach((section) => {
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
    /* ... (same as before) ... */
    gsap.to(window, {
      duration: 1.2,
      scrollTo: { y: `#${id}`, offsetY: 0 },
      ease: "power2.inOut",
    });
    setIsTocOpen(false);
  };

  // Reusable components (SectionWrapper, FeatureCard, TimelineEvent, PulsatingButton) are the same as before.
  // For brevity, I'll omit them here, but assume they are present in your actual file.
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
        className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
      ></canvas>

      <div
        className={`${theme.bg} ${theme.textSecondary} min-h-screen font-sans`}
      >
        {/* --- INTEGRATED NAVBAR --- */}
        <motion.nav
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.2,
            delay: 0.1,
            ease: "easeOut",
          }} // Slightly faster entrance
          className={`w-full fixed top-4 right-0 z-50 flex items-center justify-between px-4 sm:px-6 md:px-10 py-3 transition-all duration-200 ease-in-out
                   ${
                     isScrolled
                       ? `${theme.surface} shadow-xl bg-opacity-80 backdrop-blur-lg border-b border-slate-700/50`
                       : "bg-transparent border-b border-transparent"
                   }`}
        >
          {/* Left Side: Logo/Project Name */}
          <motion.div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            title="Go to Homepage"
          >
            <CodeXml size={28} className={`text-${theme.accent}-400`} />
            <span
              className={`text-xl font-bold ${theme.textPrimary} hidden sm:inline`}
            >
              NN<span className={`text-${theme.accent}-400`}>Learner</span>
            </span>
          </motion.div>

          {/* Right Side: Navigation Links */}
          <div className="flex items-center gap-2 md:gap-3">
            {navLinks.map(({ label, path, Icon }) => (
              <motion.button
                key={label}
                onClick={() => navigate(path)} // CORRECTLY USE navigate
                className={`px-2.5 py-1.5 md:px-3 md:py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200
                         ${
                           (location.pathname.startsWith(path) &&
                             path !== "/") ||
                           (location.pathname === "/" && path === "/")
                             ? `${theme.navbarActiveText} bg-${theme.accent}-500/20 ring-1 ring-${theme.accent}-500/50`
                             : `${theme.navbarText} hover:${theme.navbarHoverText} hover:bg-slate-700/50`
                         } 
                         focus:outline-none focus:ring-2 focus:ring-${
                           theme.accent
                         }-500/70 focus:ring-offset-2 focus:ring-offset-slate-900`}
                whileHover={{ y: -2, scale: 1.03, borderColor: theme.accent }}
                whileTap={{ scale: 0.97 }}
                title={`Go to ${label}`}
              >
                {Icon && (
                  <Icon size={14} className="mr-1 md:mr-1.5 inline -mt-0.5" />
                )}
                {label}
              </motion.button>
            ))}
          </div>
        </motion.nav>
        {/* --- END OF INTEGRATED NAVBAR --- */}

        {/* Sticky TOC for Desktop (ensure z-index is below new top-right navbar) */}
        <aside className="hidden lg:block fixed top-1/2 -translate-y-1/2 left-5 z-40">
          {/* ... (Desktop TOC content - same as before, ensure Home button in TOC also uses navigate if it's for client-side routing) ... */}
          <nav
            className={`p-2.5 rounded-md ${theme.surface} bg-opacity-70 backdrop-blur-sm shadow-xl border border-slate-700/50 max-w-[200px]`}
          >
            <motion.button // Changed to button for consistent client-side nav
              onClick={() => navigate("/")}
              className={`w-full text-left px-1.5 py-1.5 mb-2 rounded text-xs transition-all duration-150 flex items-center gap-1 ${theme.textMuted} hover:${theme.textSecondary} hover:bg-slate-700/30`}
              whileHover={{ x: 1.5 }}
              title="Go to Home Page"
            >
              <Home
                className={`w-3.5 h-3.5 shrink-0 text-${theme.accent}-400/80`}
              />
              <span className="truncate">Home</span>
            </motion.button>
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
                    </span>
                  </motion.button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Mobile Header with Menu Toggle (Home button here is separate from top-right nav) */}
        {/* Consider if you need TWO home buttons on mobile if top-right nav is always visible */}
        <div className="lg:hidden fixed top-3 left-3 right-3 z-50 flex items-center justify-between">
          {" "}
          {/* Adjusted to be full width and space-between */}
          {/* Home Button for Mobile (Can be part of top-right nav too) */}
          <motion.button // Changed to button for consistent client-side nav
            onClick={() => navigate("/")}
            className={`p-2.5 rounded-full ${theme.surface}/80 backdrop-blur-sm text-${theme.accent}-400 shadow-lg`}
            whileTap={{ scale: 0.9 }}
            title="Go to Home Page"
          >
            <Home size={20} />
          </motion.button>
          {/* Menu Toggle for Mobile TOC */}
          <motion.button
            onClick={() => setIsTocOpen(!isTocOpen)}
            className={`p-2.5 rounded-full ${theme.surface}/80 backdrop-blur-sm text-${theme.accent}-400 shadow-lg`}
            whileTap={{ scale: 0.9 }}
          >
            {isTocOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </div>

        {/* ... (Mobile TOC AnimatePresence - same as before) ... */}
        <AnimatePresence>
          {isTocOpen && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`lg:hidden fixed inset-0 ${theme.surface} z-40 p-6 pt-20 overflow-y-auto`}
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

        <main
          ref={mainContentRef}
          className="relative z-10 pt-10 -mt-10 md:pt-20"
        >
          {" "}
          <header className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative">
            <div className="absolute inset-0 pointer-events-none">
              <div
                className={`absolute inset-0 bg-gradient-to-br from-${theme.accent}-500/5 via-transparent to-transparent`}
              ></div>
            </div>
            <div className="relative z-10 -mt-32">
              <h1
                className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 
                     font-extrabold tracking-tighter leading-none 
                     sm:leading-tight md:leading-tight lg:leading-tight xl:leading-tight 
                     ${theme.textPrimary}`}
              >
                {/* Line 1: "Learn" or "Explore" - WITH GRADIENT */}
                <span className="animate-main-title-line block overflow-hidden">
                  <span
                    className={`inline-block bg-clip-text text-transparent 
                         bg-gradient-to-r from-${theme.accent}-400 via-${theme.accentSecondary}-400 to-${theme.accentTertiary}-400 
                         brightness-125 saturate-150`}
                  >
                    Learn
                  </span>
                </span>
              </h1>
            </div>
            <button
              onClick={() => handleTocClick("introduction")}
              className="hero-scroll-indicator absolute bottom-6 mb-24 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-slate-400 hover:text-sky-300 transition-colors z-10 cursor-pointer group"
              title="Discover More"
            >
              <span
                className={`text-xs mb-1 group-hover:text-${theme.accent}-300 transition-colors`}
              >
                Begin Exploration
              </span>
              <ChevronDown
                size={26}
                className={`opacity-70 group-hover:opacity-90 transition-opacity`}
              />
            </button>
          </header>
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
