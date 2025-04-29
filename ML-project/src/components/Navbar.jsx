import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import PraxisLogo from "../assets/praxis-logo.svg";
import { Blocks, Rocket, Paperclip } from "lucide-react";

export default function Navbar() {
  const [sticky, setSticky] = useState(false);
  const iconRef = useRef(null);
  const [triggerY, setTriggerY] = useState(0);

  const SCROLL_BUFFER = 20; // start transition earlier

  // figure out the scroll point once after mount
  useEffect(() => {
    if (iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      const pageY = window.scrollY;
      setTriggerY(pageY + rect.bottom - SCROLL_BUFFER);
    }
  }, []);

  // toggle sticky when past triggerY
  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > triggerY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [triggerY]);

  const iconList = [
    { icon: Blocks, label: "Build" },
    { icon: Rocket, label: "Test" },
    { icon: Paperclip, label: "Learn" },
  ];

  const vertVariants = {
    hidden: { opacity: 0, x: 35 },
    show: { opacity: 1, x: 0, transition: { duration: 0.35 } },
    exit: { opacity: 0, x: 35, transition: { duration: 0.25 } },
  };

  return (
    <nav className="w-full flex items-center justify-between px-4 md:px-6 pt-3 pb-0 bg-white">
      {/* logo */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex items-center gap-2"
      >
        <img src={PraxisLogo} alt="Praxis Logo" className="w-32 h-32" />
      </motion.div>

      {/* horizontal icon nav – no fade, always present */}
      <div
        ref={iconRef}
        className="hidden md:flex gap-12 pl-[90px] justify-center text-md text-black"
      >
        {iconList.map(({ icon: Icon, label }, i) => (
          <motion.button
            key={i}
            whileHover={{
              scale: 1.15,
              y: 10,
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            }}
            className="flex flex-col items-center transform-gpu origin-bottom transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] hover:text-black px-3 py-2 rounded-xl"
          >
            <div className="w-16 h-16 flex items-center justify-center bg-white rounded-xl">
              <Icon size={25} />
            </div>
            <span className="mt-1">{label}</span>
          </motion.button>
        ))}
      </div>

      {/* vertical icon nav – appears when sticky */}
      {sticky && (
        <motion.div
          variants={vertVariants}
          initial="hidden"
          animate="show"
          exit="exit"
          className="hidden md:flex flex-col items-end gap-2 fixed top-28 right-6 text-md text-black z-50"
        >
          {iconList.map(({ icon: Icon, label }, i) => (
            <motion.button
              key={i}
              whileHover={{
                scale: 1.15,
                x: -10,
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              }}
              className="flex flex-row-reverse items-center gap-2 transform-gpu transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] hover:text-black px-3 py-2 rounded-xl"
            >
              <div className="w-16 h-16 flex items-center justify-center bg-white rounded-xl">
                <Icon size={25} />
              </div>
              <span>{label}</span>
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* auth buttons */}
      <div className="hidden md:flex items-center gap-4">
        <motion.button
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          whileHover={{ scale: 1.05 }}
          className="px-6 py-2 rounded-full border border-black text-black font-semibold hover:bg-black hover:text-white transition-colors duration-300"
        >
          Log In
        </motion.button>
        <motion.button
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          whileHover={{ scale: 1.05 }}
          className="px-6 py-2 rounded-full border border-black text-black font-semibold hover:bg-black hover:text-white transition-colors duration-300"
        >
          Sign Up
        </motion.button>
      </div>
    </nav>
  );
}
