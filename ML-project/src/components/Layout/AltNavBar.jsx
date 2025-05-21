// src/components/Layout/MainNavbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import { CodeXml, BookOpen, Blocks, Waypoints } from "lucide-react"; // Added nav icons

// Consistent navLinks definition
const navLinks = [
  { label: "Learn", path: "/learn", Icon: BookOpen },
  { label: "Build", path: "/build", Icon: Blocks },
  { label: "Explore", path: "/explore", Icon: Waypoints },
];

// Theme for the Navbar
const theme = {
  surface: "bg-slate-900", // Base for scrolled state
  textPrimary: "text-slate-50", // For Project Name
  textSecondary: "text-slate-300", // For nav links default
  accent: "sky", // Primary accent (e.g., for active link, logo icon)
  navbarLinkHoverText: "text-sky-300", // Specific hover for nav links
  navbarLinkActiveText: "text-sky-300 font-semibold", // Specific active for nav links
};

const AltNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // For active link styling
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30); // Trigger effect sooner
    };
    window.addEventListener("scroll", handleScroll, { passive: true }); // Passive for performance
    handleScroll(); // Initial check in case page is loaded already scrolled

    // Optional: GSAP entrance animation for the navbar if desired
    // if (navRef.current) {
    //   gsap.fromTo(
    //     navRef.current,
    //     { y: -80, opacity: 0 },
    //     { y: 0, opacity: 1, duration: 0.7, delay: 0.3, ease: "power2.out" }
    //   );
    // }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      ref={navRef}
      initial={{ y: -80, opacity: 0 }} // Framer Motion entrance animation
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.3, ease: [0.6, 0.05, -0.01, 0.9] }} // Smoother ease
      className={`w-full fixed top-0 left-0 z-50 flex items-center justify-between px-4 sm:px-6 md:px-10 py-3 transition-all duration-250 ease-in-out
                 ${
                   isScrolled
                     ? `${theme.surface} shadow-2xl bg-opacity-80 backdrop-blur-lg border-b border-slate-700/60`
                     : "bg-transparent border-b border-transparent" // Transparent border to prevent layout shift
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
        <CodeXml size={26} className={`text-${theme.accent}-400`} />{" "}
        {/* Slightly smaller icon */}
        <span
          className={`text-lg sm:text-xl font-bold ${theme.textPrimary} hidden sm:inline`}
        >
          Neural
          <span className={`text-${theme.accent}-400`}>Ops</span>{" "}
          {/* Example Name */}
        </span>
      </motion.div>

      {/* Right Side: Navigation Links */}
      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
        {navLinks.map(({ label, path, Icon }) => (
          <motion.button
            key={label}
            onClick={() => navigate(path)}
            className={`px-2.5 py-1.5 md:px-3 md:py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200
                       focus:outline-none focus:ring-2 focus:ring-${
                         theme.accent
                       }-500/70 
                       focus:ring-offset-2 focus:ring-offset-${
                         isScrolled ? "slate-900" : "transparent"
                       }
                       ${
                         location.pathname.startsWith(path) &&
                         (path !== "/" || location.pathname === "/")
                           ? `${theme.navbarLinkActiveText} bg-${theme.accent}-500/15` // Active state with subtle bg
                           : `${theme.textSecondary} hover:${theme.navbarLinkHoverText} hover:bg-slate-700/40`
                       }`}
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
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
  );
};

export default AltNavbar;
