import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState(localStorage.getItem("role") || "");

  // Update userRole when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setUserRole(localStorage.getItem("role") || "");
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logout = () => {
    // Animate logout
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUserRole("");
    navigate("/login");
  };

  // Animation variants
  const navbarVariants = {
    initial: {
      y: -100,
      opacity: 0
    },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 0.6
      }
    }
  };

  const scrolledNavbarVariants = {
    initial: {
      backgroundColor: "rgba(31, 41, 55, 0.95)",
      backdropFilter: "blur(10px)",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
    },
    animate: {
      backgroundColor: "rgba(17, 24, 39, 0.98)",
      backdropFilter: "blur(10px)",
      boxShadow: "0 4px 30px rgba(0,0,0,0.2)",
      transition: {
        duration: 0.3
      }
    }
  };

  const logoVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      rotate: [0, -5, 5, -5, 0],
      transition: {
        duration: 0.5,
        rotate: {
          repeat: Infinity,
          repeatDelay: 2,
          duration: 0.5
        }
      }
    },
    tap: { scale: 0.95 }
  };

  const linkVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.1,
      color: "#60a5fa",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: { scale: 0.95 }
  };

  const activeLinkVariants = {
    initial: { scale: 1 },
    animate: {
      color: "#60a5fa",
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      backgroundColor: "#ef4444",
      boxShadow: "0 5px 15px rgba(239, 68, 68, 0.4)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: { scale: 0.95 }
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const mobileItemVariants = {
    closed: {
      x: -20,
      opacity: 0
    },
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    }
  };

  const getLinkClass = (path) => {
    return location.pathname === path 
      ? "text-blue-400 font-semibold relative" 
      : "text-white hover:text-blue-400 transition-colors relative";
  };

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 ${
          isScrolled ? "bg-gray-900 shadow-lg" : "bg-gray-800"
        }`}
        variants={navbarVariants}
        initial="initial"
        animate="animate"
        whileHover={scrolledNavbarVariants.animate}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo with animation */}
          <motion.div
            variants={logoVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            className="cursor-pointer"
            onClick={() => navigate("/")}
          >
            <motion.h1 
              className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0%", "100%", "0%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                backgroundSize: "200% 200%",
              }}
            >
              JobPortal
            </motion.h1>
          </motion.div>

          {/* Desktop Menu */}
          <motion.div 
            className="hidden md:flex items-center space-x-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, staggerChildren: 0.1 }}
          >
            <motion.div variants={linkVariants} whileHover="hover" whileTap="tap">
              <Link 
                to="/" 
                className={`${getLinkClass("/")} px-3 py-2 rounded-lg transition-all`}
              >
                Jobs
                {location.pathname === "/" && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400"
                    layoutId="underline"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            </motion.div>

            {token ? (
              <>
                <motion.div variants={linkVariants} whileHover="hover" whileTap="tap">
                  <Link 
                    to="/dashboard" 
                    className={`${getLinkClass("/dashboard")} px-3 py-2 rounded-lg transition-all`}
                  >
                    Dashboard
                    {location.pathname === "/dashboard" && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400"
                        layoutId="underline"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Link>
                </motion.div>

                <motion.div variants={linkVariants} whileHover="hover" whileTap="tap">
                  <Link 
                    to="/create-job" 
                    className={`${getLinkClass("/create-job")} px-3 py-2 rounded-lg transition-all`}
                  >
                    Create Job
                    {location.pathname === "/create-job" && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400"
                        layoutId="underline"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Link>
                </motion.div>

                {/* User avatar with role indicator */}
                <motion.div 
                  className="flex items-center space-x-3"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <motion.div
                    className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {userRole === "ADMIN" ? "A" : userRole === "EMPLOYER" ? "E" : "U"}
                  </motion.div>
                  
                  <motion.button
                    onClick={logout}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <motion.span
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      🚪
                    </motion.span>
                    <span>Logout</span>
                  </motion.button>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div variants={linkVariants} whileHover="hover" whileTap="tap">
                  <Link 
                    to="/login" 
                    className={`${getLinkClass("/login")} px-3 py-2 rounded-lg transition-all`}
                  >
                    Login
                    {location.pathname === "/login" && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400"
                        layoutId="underline"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Link>
                </motion.div>

                <motion.div variants={linkVariants} whileHover="hover" whileTap="tap">
                  <Link 
                    to="/register" 
                    className={`${getLinkClass("/register")} px-3 py-2 rounded-lg transition-all relative overflow-hidden group`}
                  >
                    <motion.span
                      className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-20"
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    Register
                    {location.pathname === "/register" && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400"
                        layoutId="underline"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Link>
                </motion.div>
              </>
            )}
          </motion.div>

          {/* Mobile menu button */}
          <motion.button
            className="md:hidden text-white text-2xl"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isMobileMenuOpen ? "✕" : "☰"}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden mt-4 space-y-3 overflow-hidden"
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <motion.div variants={mobileItemVariants}>
                <Link 
                  to="/" 
                  className="block text-white hover:text-blue-400 px-3 py-2 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Jobs
                </Link>
              </motion.div>

              {token ? (
                <>
                  <motion.div variants={mobileItemVariants}>
                    <Link 
                      to="/dashboard" 
                      className="block text-white hover:text-blue-400 px-3 py-2 rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </motion.div>

                  <motion.div variants={mobileItemVariants}>
                    <Link 
                      to="/create-job" 
                      className="block text-white hover:text-blue-400 px-3 py-2 rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Create Job
                    </Link>
                  </motion.div>

                  <motion.div variants={mobileItemVariants}>
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left text-red-400 hover:text-red-300 px-3 py-2 rounded-lg transition-colors"
                    >
                      Logout
                    </button>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div variants={mobileItemVariants}>
                    <Link 
                      to="/login" 
                      className="block text-white hover:text-blue-400 px-3 py-2 rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                  </motion.div>

                  <motion.div variants={mobileItemVariants}>
                    <Link 
                      to="/register" 
                      className="block text-white hover:text-blue-400 px-3 py-2 rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </motion.div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer to prevent content from hiding under fixed navbar */}
      <div className="h-20" />
    </>
  );
}