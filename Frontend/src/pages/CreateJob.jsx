import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";

export default function CreateJob() {
  const [job, setJob] = useState({
    title: "",
    description: "",
    location: "",
    salary: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCreate = async () => {
    setIsSubmitting(true);
    try {
      await API.post("/jobs/create?employerEmail=praveenboy2306@gmail.com", job);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      // Clear form after successful submission
      setJob({ title: "", description: "", location: "", salary: "" });
    } catch (error) {
      alert("Error creating job");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(139, 92, 246, 0.4)",
      transition: { duration: 0.3, yoyo: Infinity }
    },
    tap: { scale: 0.95 },
    disabled: {
      opacity: 0.6,
      scale: 0.95
    }
  };

  const inputVariants = {
    focus: {
      scale: 1.02,
      borderColor: "#8b5cf6",
      boxShadow: "0px 0px 0px 3px rgba(139, 92, 246, 0.2)",
      transition: { duration: 0.2 }
    }
  };

  const successVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 500, damping: 30 }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div 
      className="flex justify-center mt-10 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="bg-white p-8 shadow-xl rounded-2xl w-96 relative overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ boxShadow: "0px 20px 40px rgba(0,0,0,0.1)" }}
      >
        {/* Decorative background animation */}
        <motion.div
          className="absolute top-0 right-0 w-32 h-32 bg-purple-200 rounded-full opacity-20 -mr-16 -mt-16"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <motion.h2 
          className="text-3xl font-bold mb-6 text-gray-800 relative"
          variants={itemVariants}
        >
          Create New Job
          <motion.div
            className="absolute bottom-0 left-0 w-20 h-1 bg-purple-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          />
        </motion.h2>

        <motion.div variants={itemVariants}>
          <motion.input 
            className="border-2 border-gray-200 p-3 w-full mb-4 rounded-xl focus:outline-none transition-all"
            placeholder="Job Title *"
            value={job.title}
            onChange={(e) => setJob({...job, title: e.target.value})}
            whileFocus="focus"
            variants={inputVariants}
            required
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <motion.textarea 
            className="border-2 border-gray-200 p-3 w-full mb-4 rounded-xl focus:outline-none transition-all min-h-[100px]"
            placeholder="Job Description *"
            value={job.description}
            onChange={(e) => setJob({...job, description: e.target.value})}
            whileFocus="focus"
            variants={inputVariants}
            required
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <motion.input 
            className="border-2 border-gray-200 p-3 w-full mb-4 rounded-xl focus:outline-none transition-all"
            placeholder="Location *"
            value={job.location}
            onChange={(e) => setJob({...job, location: e.target.value})}
            whileFocus="focus"
            variants={inputVariants}
            required
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <motion.input 
            className="border-2 border-gray-200 p-3 w-full mb-6 rounded-xl focus:outline-none transition-all"
            placeholder="Salary *"
            value={job.salary}
            onChange={(e) => setJob({...job, salary: e.target.value})}
            whileFocus="focus"
            variants={inputVariants}
            required
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <motion.button 
            onClick={handleCreate}
            className="bg-purple-500 text-white w-full p-3 rounded-xl font-semibold text-lg relative overflow-hidden"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            animate={isSubmitting ? "disabled" : ""}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <motion.div
                className="flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Creating...
              </motion.div>
            ) : (
              "Create Job"
            )}
            
            {/* Ripple effect on button */}
            <motion.div
              className="absolute inset-0 bg-white opacity-30"
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.4 }}
            />
          </motion.button>
        </motion.div>

        {/* Success message with animation */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              className="absolute bottom-4 left-4 right-4 bg-green-500 text-white p-3 rounded-xl text-center font-semibold"
              variants={successVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              ✓ Job Created Successfully!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input validation indicators */}
        <AnimatePresence>
          {job.title && job.description && job.location && job.salary && (
            <motion.div
              className="absolute top-4 right-4 w-3 h-3 bg-green-500 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring" }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}