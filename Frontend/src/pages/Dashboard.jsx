import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [greeting, setGreeting] = useState("");
  const [stats, setStats] = useState([
    { label: "Total Jobs", value: 0, icon: "💼", color: "from-purple-500 to-pink-500" },
    { label: "Applications", value: 0, icon: "📝", color: "from-blue-500 to-cyan-500" },
    { label: "Interviews", value: 0, icon: "🤝", color: "from-green-500 to-emerald-500" },
    { label: "Messages", value: 0, icon: "💬", color: "from-orange-500 to-red-500" }
  ]);

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    },
    hover: {
      scale: 1.05,
      y: -5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: { scale: 0.95 }
  };

  const statValueVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
        delay: 0.3
      }
    }
  };

  // Simulate loading stats (replace with actual data fetching)
  useEffect(() => {
    const timer = setTimeout(() => {
      setStats([
        { label: "Total Jobs", value: 0, icon: "💼", color: "from-purple-500 to-pink-500" },
        { label: "Applications", value: 0, icon: "📝", color: "from-blue-500 to-cyan-500" },
        { label: "Interviews", value: 0, icon: "🤝", color: "from-green-500 to-emerald-500" },
        { label: "Messages", value: 0, icon: "💬", color: "from-orange-500 to-red-500" }
      ]);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated background elements */}
      <motion.div
        className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-purple-200 opacity-10"
            style={{
              width: Math.random() * 300 + 100,
              height: Math.random() * 300 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      {/* Header Section */}
      <motion.div 
        className="relative z-10 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <motion.h1 
              className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
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
              Dashboard
            </motion.h1>
            <motion.p 
              className="text-gray-600 mt-2 text-lg"
              variants={itemVariants}
            >
              {greeting}! Welcome back to your dashboard
            </motion.p>
          </div>
          
          {/* Animated notification icon */}
          <motion.div
            className="relative"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
              }}
            />
            <span className="text-3xl cursor-pointer">🔔</span>
          </motion.div>
        </motion.div>

        {/* Date display */}
        <motion.p 
          className="text-gray-500 mt-2"
          variants={itemVariants}
        >
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </motion.p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer"
            variants={cardVariants}
            whileHover="hover"
            whileTap="tap"
            custom={index}
          >
            <div className={`p-6 bg-gradient-to-br ${stat.color}`}>
              <motion.div 
                className="text-4xl mb-2"
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.2,
                }}
              >
                {stat.icon}
              </motion.div>
              <motion.h3 
                className="text-white text-lg font-semibold"
                variants={itemVariants}
              >
                {stat.label}
              </motion.h3>
              <motion.p 
                className="text-white text-3xl font-bold"
                variants={statValueVariants}
              >
                {stat.value}
              </motion.p>
            </div>
            
            {/* Progress bar animation */}
            <motion.div 
              className="h-1 bg-purple-100"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <motion.div 
                className={`h-full bg-gradient-to-r ${stat.color}`}
                initial={{ width: 0 }}
                animate={{ width: "70%" }}
                transition={{ duration: 1, delay: 0.8 }}
              />
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Activity Section */}
      <motion.div 
        className="bg-white rounded-2xl shadow-lg p-6 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2 
          className="text-2xl font-semibold mb-4 flex items-center"
          variants={itemVariants}
        >
          Recent Activity
          <motion.div
            className="ml-2 w-2 h-2 bg-green-500 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
        </motion.h2>

        {/* Activity list with staggered animations */}
        <motion.div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <motion.div
              key={item}
              className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors"
              variants={itemVariants}
              whileHover={{ x: 10 }}
            >
              <motion.div 
                className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white mr-3"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                {item === 1 ? "📋" : item === 2 ? "✅" : "📧"}
              </motion.div>
              <div className="flex-1">
                <p className="font-medium">
                  {item === 1 ? "New job application received" : 
                   item === 2 ? "Interview scheduled" : 
                   "New message from candidate"}
                </p>
                <p className="text-sm text-gray-500">
                  {item * 5} minutes ago
                </p>
              </div>
              <motion.div
                className="text-purple-500"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* View all button */}
        <motion.button
          className="mt-6 text-purple-600 font-semibold flex items-center mx-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          View All Activity
          <motion.span
            className="ml-2"
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            →
          </motion.span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}