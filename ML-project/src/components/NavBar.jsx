// NavBar.jsx
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Blocks, Rocket, Paperclip } from "lucide-react";
import PraxisLogo from "../assets/praxis-logo.svg";
import { NavLink } from "react-router-dom";

export default function Navbar() {
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
        <img src={PraxisLogo} alt="Praxis Logo" className="w-32 h-32" />
      </motion.div>

      {/* icon nav */}
      <div
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
      </div>

      {/* login/signup */}
      <div
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
      </div>
    </nav>
  );
}
