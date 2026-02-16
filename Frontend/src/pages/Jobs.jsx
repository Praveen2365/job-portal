import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";
import JobCard from "../components/JobCard";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedJob, setSelectedJob] = useState(null);
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await API.get("/jobs");
      setJobs(res.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter jobs based on search and filter type
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === "all") return matchesSearch;
    if (filterType === "remote") return matchesSearch && job.location?.toLowerCase().includes("remote");
    if (filterType === "highSalary") return matchesSearch && job.salary > 50000; // Example condition
    
    return matchesSearch;
  });

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

  const headerVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const filterVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
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
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated background */}
      <motion.div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-purple-200 opacity-10"
            style={{
              width: 400,
              height: 400,
              left: `${i * 30}%`,
              top: `${i * 20}%`,
            }}
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 15 + i * 5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          className="mb-8 text-center"
          variants={headerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            className="text-5xl font-bold mb-4"
            animate={{
              backgroundPosition: ["0%", "100%", "0%"],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              background: "linear-gradient(90deg, #8b5cf6, #ec4899, #8b5cf6)",
              backgroundSize: "200% 200%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Find Your Dream Job
          </motion.h1>
          
          <motion.p 
            className="text-gray-600 text-lg max-w-2xl mx-auto"
            variants={filterVariants}
          >
            Discover amazing opportunities that match your skills and aspirations
          </motion.p>

          {/* Job count with animation */}
          <motion.div 
            className="mt-4 inline-block"
            variants={filterVariants}
          >
            <motion.span 
              className="bg-purple-100 text-purple-600 px-4 py-2 rounded-full text-sm font-semibold"
              whileHover={{ scale: 1.05 }}
            >
              {filteredJobs.length} Jobs Available
            </motion.span>
          </motion.div>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div 
          className="mb-8 space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={filterVariants} className="relative">
            <motion.input
              type="text"
              placeholder="Search jobs by title, description, or location..."
              className="w-full p-4 pl-12 rounded-2xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none shadow-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <motion.span 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🔍
            </motion.span>
          </motion.div>

          <motion.div className="flex gap-3 flex-wrap" variants={containerVariants}>
            {["all", "remote", "highSalary"].map((filter) => (
              <motion.button
                key={filter}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  filterType === filter
                    ? "bg-purple-500 text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
                variants={filterVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterType(filter)}
              >
                {filter === "all" && "📋 All Jobs"}
                {filter === "remote" && "🏠 Remote"}
                {filter === "highSalary" && "💰 High Salary"}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        {/* Jobs Grid */}
        {loading ? (
          <motion.div 
            className="flex justify-center items-center h-64"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="text-center">
              <motion.div
                className="w-20 h-20 border-4 border-purple-200 border-t-purple-500 rounded-full mx-auto mb-4"
                variants={loadingVariants}
                animate="animate"
              />
              <motion.p 
                className="text-gray-600 text-lg"
                variants={pulseVariants}
                animate="animate"
              >
                Loading amazing jobs...
              </motion.p>
            </motion.div>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            {filteredJobs.length > 0 ? (
              <motion.div 
                key="jobs-grid"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: 20 }}
              >
                {filteredJobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    variants={{
                      hidden: { y: 50, opacity: 0 },
                      visible: {
                        y: 0,
                        opacity: 1,
                        transition: {
                          type: "spring",
                          stiffness: 100,
                          damping: 12,
                          delay: index * 0.1
                        }
                      }
                    }}
                    whileHover={{ 
                      scale: 1.03,
                      transition: { type: "spring", stiffness: 400 }
                    }}
                  >
                    <JobCard 
                      job={job} 
                      userRole={userRole} 
                      onSelect={() => setSelectedJob(job)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="no-results"
                className="text-center py-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="text-6xl mb-4"
                >
                  🔍
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">No Jobs Found</h3>
                <p className="text-gray-500">Try adjusting your search or filters</p>
                <motion.button
                  className="mt-4 px-6 py-2 bg-purple-500 text-white rounded-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSearchTerm("");
                    setFilterType("all");
                  }}
                >
                  Clear Filters
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Scroll to top button */}
        <AnimatePresence>
          {window.scrollY > 300 && (
            <motion.button
              className="fixed bottom-8 right-8 bg-purple-500 text-white p-4 rounded-full shadow-lg"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              ↑
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}