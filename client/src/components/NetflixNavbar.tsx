import { Menu, Search, Bell, User, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useThemeMode } from "@/contexts/ThemeModeContext";

export function NetflixNavbar() {
  const { config, mode, setMode } = useThemeMode();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Início", id: "home" },
    { label: "Crianças", id: "kids" },
    { label: "Jovens", id: "teens" },
    { label: "Adultos", id: "adults" },
    { label: "Bombando", id: "trending" },
    { label: "Minha lista", id: "mylist" },
    { label: "Navegar por idiomas", id: "languages" },
  ];

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b"
        style={{
          backgroundColor: "#141414dd",
          borderBottomColor: "#333333",
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="text-3xl font-bold flex items-center gap-2"
            style={{ color: "#E50914" }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
              AI
            </div>
            <span>AI KIDS LABS</span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-6 items-center flex-1 ml-8">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                className="text-white font-medium text-sm hover:text-gray-300 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
              </motion.button>
            ))}
          </div>

          {/* Right Menu */}
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 hover:bg-white/10 rounded-lg"
            >
              <Search size={20} color="#ffffff" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 hover:bg-white/10 rounded-lg relative"
            >
              <Bell size={20} color="#ffffff" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 hover:bg-white/10 rounded-lg"
            >
              <User size={20} color="#ffffff" />
            </motion.button>

            {/* Mobile Menu Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="md:hidden p-2 hover:bg-white/10 rounded-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X size={20} color="#ffffff" />
              ) : (
                <Menu size={20} color="#ffffff" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black/80 border-t border-gray-700"
            >
              <div className="px-4 py-4 flex flex-col gap-4">
                {navItems.map((item) => (
                  <motion.button
                    key={item.id}
                    className="text-white font-medium text-left hover:text-red-600 transition-colors"
                    whileHover={{ x: 10 }}
                  >
                    {item.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16"></div>
    </>
  );
}
