import { motion } from "framer-motion";
import { Blocks, Rocket, Paperclip, Home } from "lucide-react";
import NNLogo from "../assets/NNLogo.png";

export default function Navbar() {
  const iconList = [
    { icon: Blocks, label: "Build", path: "/build" },
    { icon: Rocket, label: "Explore", path: "/explore" },
    { icon: Paperclip, label: "Learn", path: "/learn" },
  ];

  return (
    <nav className="w-full flex items-center justify-between px-4 md:px-6 pt-3 pb-0 bg-white relative">
      {/* logo */}
      <motion.div
        className={
          "flex items-center gap-2 transition-opacity duration-300 mr-[290px]"
        }
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
        className={
          "hidden md:flex gap-10 justify-center text-md text-black transition-all relative transform -translate-x-1/2"
        }
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
      {/* home button */}
      <button
        onClick={() => navigate("/")}
        className="p-2 mr-10 rounded-full hover:bg-gray-100 transition"
        title="Home"
      >
        <Home size={24} />
      </button>
    </nav>
  );
}
