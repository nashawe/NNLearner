// This code is a React component that creates a homepage for a machine learning project called "Praxis".
// It includes a navigation bar, a hero section with a call to action, and three feature sections that describe the main functionalities of the application.
// The feature sections are interactive and provide additional information when hovered over.
// The page is styled using Tailwind CSS and animations are handled using Framer Motion.
// The footer contains links to additional resources and information about the project.

import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Blocks, Rocket, Paperclip, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NNLogo from "../assets/NNLogo.png";

function Navbar() {
  const [sticky, setSticky] = useState(false);
  const iconRef = useRef(null);
  const [triggerY, setTriggerY] = useState(0);
  const iconList = [
    { icon: Blocks, label: "Build", path: "/build" },
    { icon: Rocket, label: "Train", path: "/train" },
    { icon: Paperclip, label: "Learn", path: "/learn" },
  ];
  const SCROLL_BUFFER = 20;

  useEffect(() => {
    if (iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      setTriggerY(window.scrollY + rect.bottom - SCROLL_BUFFER);
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > triggerY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [triggerY]);

  return (
    <nav className="w-full flex items-center justify-between px-4 md:px-6 pt-3 pb-0 bg-white relative">
      {/* logo */}
      <motion.div
        className={`flex items-center gap-2 transition-opacity duration-300 ${
          sticky ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <motion.img
          src={NNLogo}
          alt="Logo"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-32 h-32"
        />
      </motion.div>

      {/* icon nav */}
      <motion.div
        ref={iconRef}
        className={`hidden md:flex gap-10 justify-center text-md text-black transition-all fixed left-1/2 transform -translate-x-1/2 ${
          sticky
            ? "top-5 z-50 gap-3 bg-white py-3 px-5 shadow-lg rounded-3xl overflow-clip"
            : "top-10"
        }`}
      >
        {iconList.map(({ icon: Icon, label, path }, i) => (
          <motion.button
            key={i}
            whileHover={{
              scale: 1.15,
              y: -5,
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            }}
            className="flex flex-col items-center px-5 py-2 rounded-xl ease-[cubic-bezier(0.25,1,0.5,1)] transition-all duration-300"
            onClick={() => (window.location.href = path)}
          >
            <div className="w-10 h-10 flex items-center justify-center bg-white rounded-xl">
              <Icon size={25} />
            </div>
            <span className="mt-1">{label}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* login/signup */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`hidden md:flex items-center gap-4 transition-opacity duration-300 ${
          sticky ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <motion.button className="px-6 py-2 rounded-full border border-black font-semibold hover:bg-black hover:text-white transition-colors duration-300">
          Log In
        </motion.button>
        <motion.button className="px-6 py-2 rounded-full border border-black font-semibold hover:bg-black hover:text-white transition-colors duration-300">
          Sign Up
        </motion.button>
      </motion.div>
    </nav>
  );
}

// HeroSection component
function HeroSection() {
  const navigate = useNavigate();
  return (
    <div className="min-h-[80vh] bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex justify-end pt-[30px] pb-[50px]"></div>

      {/* Hero Content */}
      <div className="flex flex-col items-center text-center px-0 mt-[0px]">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-bold leading-tight text-gray-900 mb-6"
        >
          Build. Train. Understand.
        </motion.h1>

        <p className="mt-[25px] mb-[25px] text-xl text-gray-600 max-w-2xl mx-auto">
          Praxis lets you design, train, and visualize neural networks from
          scratch — no code, just real understanding.
        </p>

        <div className="flex flex-row justify-center items-center gap-4 mt-8">
          <motion.button
            onClick={() => navigate("/build")}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
            className="px-10 py-4 rounded-full bg-black text-white font-semibold text-lg hover:bg-gray-800 transition-colors duration-300"
          >
            Build Your First Neural Network
          </motion.button>
        </div>

        <motion.button
          onClick={() => window.scrollBy({ top: 760, behavior: "smooth" })}
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
          className="mt-[60px] flex flex-col items-center text-black/70 cursor-pointer"
        >
          <span className="mb-1 text-sm font-medium">Learn More</span>
          <ChevronDown size={32} />
        </motion.button>
      </div>
    </div>
  );
}

// FeatureSection component
function FeatureSection({
  title,
  description,
  Icon,
  bgColor,
  isFirst = false,
  extraInfo = [],
}) {
  const [hovered, setHovered] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (hovered && ref.current) {
      setContentHeight(ref.current.scrollHeight);
    }
  }, [hovered]);

  return (
    <motion.div
      whileHover={{ scale: 1.1, y: -10 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`max-w-[900px] mx-auto ${
        isFirst ? "mt-20 mb-3" : "mt-20 mb-4"
      } px-10 py-[50px] rounded-2xl shadow-md border border-gray-300 ${bgColor}
        flex flex-col md:flex-row items-center text-center md:text-left gap-10
        transition-colors duration-300`}
    >
      {/* Icon Side */}
      <div className="flex-shrink-0">
        <Icon size={64} className="text-white" />
      </div>

      {/* Text Side */}
      <div className="flex flex-col">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
          {title}
        </h2>
        <p className="text-lg text-white">{description}</p>

        <AnimatePresence initial={false}>
          {hovered && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: contentHeight, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden mt-4"
            >
              <ul ref={ref} className="space-y-1 text-base text-white">
                {extraInfo.map((point, i) => (
                  <li key={i}>• {point}</li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// Footer component
function Footer() {
  return (
    <footer className="w-full bg-sky-150 border-t border-grey-100 py-8">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-center text-gray-600 text-sm">
        <div className="mb-4 md:mb-0">© 2025 Praxis. All rights reserved.</div>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-black transition-colors">
            About
          </a>
          <a
            href="https://github.com/nashawe/Neural-Network"
            className="hover:text-black transition-colors"
          >
            GitHub
          </a>
          <a href="#" className="hover:text-black transition-colors">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}

// Main HomePage component

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />

      <div id="features" className="bg-white pb-10 pt-0">
        <FeatureSection
          title="Build Custom Models"
          description="Customize layers, neurons, and activation functions easily."
          Icon={Blocks}
          bgColor="bg-sky-600 text-white shadow-md hover:brightness-110 transition"
          isFirst={true}
          extraInfo={[
            "Define the number of layers and neurons per layer manually",
            "Select activation functions (ReLU, Sigmoid, Tanh, etc.)",
            "View a diagram of your network's architecture before training",
            "Input binary or multi-class data and labels for training and testing",
          ]}
        />

        <FeatureSection
          title="Train and Visualize"
          description="Watch your models learn and evolve over time."
          Icon={Rocket}
          bgColor="bg-amber-600 shadow-md hover:brightness-110 transition"
          extraInfo={[
            "Choose learning rates and training epochs dynamically",
            "Live loss and accuracy line graphs while training",
            "View model performance and weight updates across training iterations",
            "Compare different models and their training outcomes",
          ]}
        />

        <FeatureSection
          title="Learn with Praxis"
          description="Explore tutorials and resources to enhance your skills."
          Icon={Paperclip}
          bgColor="bg-violet-600 text-white shadow-md hover:brightness-110 transition"
          extraInfo={[
            "Step-by-step tutorials on neural networks from scratch using NumPy",
            "Explanations of key concepts like forward pass, backprop, and more",
            "Compare different architectures and learn their similarities and differences",
            "Get insights on how activation and loss functions affect learning",
          ]}
        />
      </div>
      <Footer />
    </>
  );
}
