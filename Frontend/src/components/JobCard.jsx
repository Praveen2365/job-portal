import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function JobCard({ job }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const [isHovered, setIsHovered] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleApply = () => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (role !== "USER") {
      alert("Only users can apply for jobs.");
      return;
    }

    navigate(`/apply/${job.id}`);
  };

  const handleCreate = () => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (role !== "EMPLOYER") {
      alert("Only employers can create jobs.");
      return;
    }

    navigate("/create-job");
  };

  const handleSaveJob = (e) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  // Animation variants
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        mass: 1
      }
    },
    hover: {
      y: -10,
      scale: 1.02,
      boxShadow: "0px 25px 35px -12px rgba(0, 0, 0, 0.15)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15
      }
    },
    tap: {
      scale: 0.98
    }
  };

  const headerVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.2
      }
    }
  };

  const detailVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: (custom) => ({
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.3 + (custom * 0.1)
      }
    })
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.95
    },
    disabled: {
      opacity: 0.6,
      scale: 0.95
    }
  };

  const saveIconVariants = {
    saved: {
      scale: [1, 1.3, 1],
      rotate: [0, 10, -10, 0],
      color: "#ef4444",
      transition: {
        duration: 0.5,
        times: [0, 0.3, 0.6, 1]
      }
    },
    unsaved: {
      scale: 1,
      rotate: 0,
      color: "#9ca3af"
    }
  };

  const shimmerVariants = {
    animate: {
      x: ["0%", "100%"],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const badgeVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.4
      }
    },
    hover: {
      scale: 1.1,
      rotate: [0, -5, 5, -5, 0],
      transition: {
        duration: 0.3
      }
    }
  };

  const descriptionVariants = {
    collapsed: {
      height: "4.5em",
      opacity: 0.8,
      overflow: "hidden"
    },
    expanded: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer border border-gray-100 relative"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => setShowDetails(!showDetails)}
    >
      {/* Shimmer effect on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 pointer-events-none"
            variants={shimmerVariants}
            animate="animate"
            initial={{ x: "-100%" }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Animated gradient border */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          border: "2px solid transparent",
          background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899) border-box",
          WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "destination-out",
          maskComposite: "exclude",
          opacity: 0
        }}
        animate={{ opacity: isHovered ? [0, 0.5, 0] : 0 }}
        transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
      />

      {/* Content */}
      <div className="p-6 relative z-10">
        {/* Header with job title and save button */}
        <motion.div 
          className="flex justify-between items-start mb-3"
          variants={headerVariants}
        >
          <motion.h2 
            className="text-2xl font-bold text-gray-800 pr-4"
            whileHover={{ scale: 1.02, color: "#3b82f6" }}
          >
            {job.title}
          </motion.h2>
          
          {/* Save button for logged-in users */}
          {token && role === "USER" && (
            <motion.button
              className="text-2xl focus:outline-none"
              onClick={handleSaveJob}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              animate={isSaved ? "saved" : "unsaved"}
              custom={saveIconVariants}
            >
              {isSaved ? "❤️" : "🤍"}
            </motion.button>
          )}
        </motion.div>

        {/* Location with animation */}
        <motion.div 
          className="flex items-center mb-2"
          variants={detailVariants}
          custom={0}
        >
          <motion.span 
            className="text-xl mr-2"
            animate={{ 
              y: [0, -2, 0, 2, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatDelay: 2
            }}
          >
            📍
          </motion.span>
          <span className="text-gray-600 text-lg">{job.location}</span>
        </motion.div>

        {/* Salary with animation */}
        <motion.div 
          className="mb-4"
          variants={detailVariants}
          custom={1}
        >
          <motion.p 
            className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent inline-block"
            animate={{ 
              scale: [1, 1.02, 1],
              textShadow: [
                "0 0 0px rgba(16,185,129,0)",
                "0 0 8px rgba(16,185,129,0.3)",
                "0 0 0px rgba(16,185,129,0)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            💰 ₹ {job.salary?.toLocaleString()}
          </motion.p>
        </motion.div>

        {/* Description with expand/collapse */}
        {job.description && (
          <motion.div
            className="mb-4"
            variants={detailVariants}
            custom={2}
          >
            <motion.p 
              className="text-gray-700 leading-relaxed"
              variants={descriptionVariants}
              animate={showDetails ? "expanded" : "collapsed"}
              style={{ cursor: 'pointer' }}
            >
              {job.description}
            </motion.p>
            
            {/* Read more indicator */}
            <motion.div 
              className="text-xs text-blue-500 mt-1 font-semibold"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {showDetails ? "▲ Click to show less" : "▼ Click to read more"}
            </motion.div>
          </motion.div>
        )}

        {/* Company badge (if available) */}
        {job.company && (
          <motion.div 
            className="mb-4"
            variants={badgeVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
          >
            <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-semibold">
              <motion.span
                className="mr-1"
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🏢
              </motion.span>
              {job.company}
            </span>
          </motion.div>
        )}

        {/* Buttons Section */}
        <motion.div 
          className="flex gap-3 mt-4 pt-4 border-t border-gray-100"
          variants={detailVariants}
          custom={3}
        >
          {/* Apply Button (User Only) */}
          {role === "USER" && (
            <motion.button
              onClick={handleApply}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold flex-1 relative overflow-hidden"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <motion.span
                className="absolute inset-0 bg-white opacity-0"
                whileHover={{ 
                  scale: 1.5, 
                  opacity: 0.2,
                  transition: { duration: 0.4 }
                }}
              />
              <span className="relative z-10 flex items-center justify-center">
                <motion.span
                  className="mr-2"
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  📝
                </motion.span>
                Apply Now
              </span>
            </motion.button>
          )}

          {/* Create Job Button (Employer Only) */}
          {role === "EMPLOYER" && (
            <motion.button
              onClick={handleCreate}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold flex-1 relative overflow-hidden"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <motion.span
                className="absolute inset-0 bg-white opacity-0"
                whileHover={{ 
                  scale: 1.5, 
                  opacity: 0.2,
                  transition: { duration: 0.4 }
                }}
              />
              <span className="relative z-10 flex items-center justify-center">
                <motion.span
                  className="mr-2"
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ➕
                </motion.span>
                Post New Job
              </span>
            </motion.button>
          )}

          {/* If Not Logged In */}
          {!token && (
            <motion.button
              onClick={() => navigate("/login")}
              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-xl font-semibold flex-1 relative overflow-hidden"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <motion.span
                className="absolute inset-0 bg-white opacity-0"
                whileHover={{ 
                  scale: 1.5, 
                  opacity: 0.2,
                  transition: { duration: 0.4 }
                }}
              />
              <span className="relative z-10 flex items-center justify-center">
                <motion.span
                  className="mr-2"
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🔐
                </motion.span>
                Login to Apply
              </span>
            </motion.button>
          )}
        </motion.div>

        {/* Role indicator badge */}
        {token && (
          <motion.div
            className="absolute top-4 right-4"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
              role === "USER" 
                ? "bg-blue-100 text-blue-600" 
                : role === "EMPLOYER" 
                ? "bg-green-100 text-green-600"
                : "bg-purple-100 text-purple-600"
            }`}>
              {role === "USER" && "👤 Job Seeker"}
              {role === "EMPLOYER" && "💼 Employer"}
              {role === "ADMIN" && "⚙️ Admin"}
            </span>
          </motion.div>
        )}
      </div>

      {/* Animated bottom bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      />

      {/* Pulse animation for new jobs */}
      {job.isNew && (
        <motion.div
          className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full font-semibold"
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          NEW
        </motion.div>
      )}
    </motion.div>
  );
}