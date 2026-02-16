import { Navigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);

  useEffect(() => {
    // Simulate a brief check for smooth transition
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!token && !isChecking) {
      setShowRedirectMessage(true);
      const timer = setTimeout(() => {
        setShowRedirectMessage(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [token, isChecking]);

  // Animation variants
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3
      }
    }
  };

  const loadingVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const redirectMessageVariants = {
    initial: {
      opacity: 0,
      y: 50,
      scale: 0.8
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30
      }
    },
    exit: {
      opacity: 0,
      y: -50,
      scale: 0.8,
      transition: {
        duration: 0.3
      }
    }
  };

  const glowVariants = {
    animate: {
      boxShadow: [
        "0 0 20px rgba(59, 130, 246, 0.3)",
        "0 0 40px rgba(59, 130, 246, 0.5)",
        "0 0 20px rgba(59, 130, 246, 0.3)"
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // If checking authentication
  if (isChecking) {
    return (
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div className="text-center">
          {/* Animated lock icon */}
          <motion.div
            className="relative mb-6"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <motion.div
              className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-4xl text-white shadow-xl mx-auto"
              variants={glowVariants}
              animate="animate"
            >
              🔒
            </motion.div>
            
            {/* Rotating rings */}
            <motion.div
              className="absolute inset-0 border-4 border-blue-500 rounded-2xl"
              variants={loadingVariants}
              animate="animate"
              style={{ borderTopColor: "transparent" }}
            />
          </motion.div>

          {/* Loading text with pulse */}
          <motion.h2 
            className="text-2xl font-bold text-gray-800 mb-2"
            variants={pulseVariants}
            animate="animate"
          >
            Verifying Access
          </motion.h2>
          
          <motion.p 
            className="text-gray-600"
            variants={pulseVariants}
            animate="animate"
            custom={1}
          >
            Please wait while we check your credentials...
          </motion.p>

          {/* Animated dots */}
          <motion.div className="flex justify-center space-x-2 mt-4">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-blue-500 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  // If authenticated, show protected content with entrance animation
  if (token) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {/* Security badge for authenticated users */}
          <motion.div
            className="fixed top-20 right-4 z-50 bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow-lg"
            initial={{ scale: 0, x: 100 }}
            animate={{ scale: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30, delay: 0.5 }}
          >
            <motion.span
              className="flex items-center space-x-1"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span>🔒</span>
              <span>Secure Session</span>
            </motion.span>
          </motion.div>
          
          {children}
        </motion.div>
      </AnimatePresence>
    );
  }

  // If not authenticated, show redirect message before navigating
  return (
    <>
      <AnimatePresence>
        {showRedirectMessage && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center"
              variants={redirectMessageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {/* Warning icon with animation */}
              <motion.div
                className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 0.5,
                  repeat: 2
                }}
              >
                <span className="text-4xl">⚠️</span>
              </motion.div>

              <motion.h2 
                className="text-2xl font-bold text-gray-800 mb-2"
                variants={pulseVariants}
                animate="animate"
              >
                Access Denied
              </motion.h2>

              <motion.p 
                className="text-gray-600 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                You need to be logged in to view this page.
              </motion.p>

              {/* Progress bar for redirect */}
              <motion.div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3, ease: "linear" }}
                />
              </motion.div>

              <motion.p 
                className="text-sm text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Redirecting to login page...
              </motion.p>

              {/* Animated arrow */}
              <motion.div
                className="mt-4"
                animate={{
                  x: [0, 10, 0],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <span className="text-2xl">→</span>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigate to login (happens immediately) */}
      <Navigate to="/login" state={{ from: location }} replace />
    </>
  );
}