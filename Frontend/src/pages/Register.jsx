import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "JOB_SEEKER"
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const navigate = useNavigate();

  // Password strength checker
  useEffect(() => {
    let strength = 0;
    if (form.password.length > 0) {
      if (form.password.length >= 8) strength++;
      if (/[A-Z]/.test(form.password)) strength++;
      if (/[0-9]/.test(form.password)) strength++;
      if (/[^A-Za-z0-9]/.test(form.password)) strength++;
    }
    setPasswordStrength(strength);
  }, [form.password]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name.trim()) newErrors.name = "Name is required";
    else if (form.name.length < 2) newErrors.name = "Name must be at least 2 characters";
    
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    
    return newErrors;
  };

  const handleRegister = async () => {
    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});
    
    try {
      await API.post("/auth/register", form);
      setRegistrationSuccess(true);
      
      // Show success message then redirect to login
      setTimeout(() => {
        navigate("/login");
      }, 3000);
      
    } catch (err) {
      setErrors({ 
        general: err.response?.data?.message || "Registration failed. Please try again." 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
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
        stiffness: 200,
        damping: 15
      }
    }
  };

  const formVariants = {
    hidden: { scale: 0.9, opacity: 0, rotateX: -15 },
    visible: {
      scale: 1,
      opacity: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 15,
        delay: 0.2
      }
    },
    hover: {
      scale: 1.02,
      boxShadow: "0px 30px 50px rgba(0,0,0,0.15)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const inputVariants = {
    focus: {
      scale: 1.02,
      borderColor: "#10b981",
      boxShadow: "0px 0px 0px 3px rgba(16, 185, 129, 0.2)",
      transition: { duration: 0.2 }
    },
    error: {
      borderColor: "#ef4444",
      boxShadow: "0px 0px 0px 3px rgba(239, 68, 68, 0.2)",
      transition: { duration: 0.2 }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0px 10px 20px -5px rgba(16, 185, 129, 0.5)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: { scale: 0.95 },
    disabled: {
      opacity: 0.6,
      scale: 0.95
    }
  };

  const floatingAnimation = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const strengthColors = [
    "bg-gray-200",
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500"
  ];

  return (
    <motion.div 
      className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated background elements */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Floating shapes */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-green-200 opacity-20"
            style={{
              width: Math.random() * 300 + 100,
              height: Math.random() * 300 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
              scale: [1, 1.3, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
          />
        ))}

        {/* Gradient orbs */}
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </motion.div>

      {/* Success overlay */}
      <AnimatePresence>
        {registrationSuccess && (
          <motion.div
            className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <motion.div
                className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 360, 360],
                }}
                transition={{ duration: 1, times: [0, 0.5, 1] }}
              >
                <span className="text-4xl">✓</span>
              </motion.div>
              <motion.h2 
                className="text-3xl font-bold text-gray-800 mb-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Registration Successful!
              </motion.h2>
              <motion.p 
                className="text-gray-600"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Redirecting you to login...
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Registration Form */}
      <motion.div
        className="relative z-10 w-full max-w-md px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="bg-white p-8 shadow-2xl rounded-2xl backdrop-blur-lg bg-opacity-95"
          variants={formVariants}
          whileHover="hover"
        >
          {/* Animated icon */}
          <motion.div 
            className="flex justify-center mb-6"
            variants={itemVariants}
          >
            <motion.div
              className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-4xl text-white shadow-lg"
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileHover={{ scale: 1.2, rotate: 360 }}
            >
              📝
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.h2 
            className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Create Account
          </motion.h2>
          
          <motion.p 
            className="text-gray-500 text-center mb-6"
            variants={itemVariants}
          >
            Join our community today
          </motion.p>

          {/* General error message */}
          <AnimatePresence>
            {errors.general && (
              <motion.div
                className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <p className="text-red-600 text-sm text-center">{errors.general}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Name input */}
          <motion.div variants={itemVariants} className="mb-4">
            <motion.label className="block text-gray-700 text-sm font-semibold mb-2">
              Full Name
            </motion.label>
            <motion.div className="relative">
              <motion.span 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                animate={floatingAnimation.animate}
              >
                👤
              </motion.span>
              <motion.input
                type="text"
                placeholder="Enter your full name"
                className={`w-full pl-10 pr-3 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                  errors.name ? "border-red-300 bg-red-50" : "border-gray-200"
                }`}
                value={form.name}
                onChange={(e) => {
                  setForm({...form, name: e.target.value});
                  if (errors.name) setErrors({...errors, name: null});
                }}
                whileFocus="focus"
                variants={inputVariants}
                animate={errors.name ? "error" : {}}
              />
            </motion.div>
            <AnimatePresence>
              {errors.name && (
                <motion.p 
                  className="text-red-500 text-xs mt-1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {errors.name}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Email input */}
          <motion.div variants={itemVariants} className="mb-4">
            <motion.label className="block text-gray-700 text-sm font-semibold mb-2">
              Email Address
            </motion.label>
            <motion.div className="relative">
              <motion.span 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                animate={floatingAnimation.animate}
              >
                ✉️
              </motion.span>
              <motion.input
                type="email"
                placeholder="Enter your email"
                className={`w-full pl-10 pr-3 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                  errors.email ? "border-red-300 bg-red-50" : "border-gray-200"
                }`}
                value={form.email}
                onChange={(e) => {
                  setForm({...form, email: e.target.value});
                  if (errors.email) setErrors({...errors, email: null});
                }}
                whileFocus="focus"
                variants={inputVariants}
                animate={errors.email ? "error" : {}}
              />
            </motion.div>
            <AnimatePresence>
              {errors.email && (
                <motion.p 
                  className="text-red-500 text-xs mt-1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {errors.email}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Password input */}
          <motion.div variants={itemVariants} className="mb-4">
            <motion.label className="block text-gray-700 text-sm font-semibold mb-2">
              Password
            </motion.label>
            <motion.div className="relative">
              <motion.span 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                animate={floatingAnimation.animate}
              >
                🔒
              </motion.span>
              <motion.input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                className={`w-full pl-10 pr-10 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                  errors.password ? "border-red-300 bg-red-50" : "border-gray-200"
                }`}
                value={form.password}
                onChange={(e) => {
                  setForm({...form, password: e.target.value});
                  if (errors.password) setErrors({...errors, password: null});
                }}
                whileFocus="focus"
                variants={inputVariants}
                animate={errors.password ? "error" : {}}
              />
              <motion.button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </motion.button>
            </motion.div>

            {/* Password strength indicator */}
            {form.password && (
              <motion.div 
                className="mt-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4].map((level) => (
                    <motion.div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        passwordStrength >= level 
                          ? strengthColors[passwordStrength] 
                          : "bg-gray-200"
                      }`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: level * 0.1 }}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  {passwordStrength === 0 && "Enter a password"}
                  {passwordStrength === 1 && "Weak password"}
                  {passwordStrength === 2 && "Fair password"}
                  {passwordStrength === 3 && "Good password"}
                  {passwordStrength === 4 && "Strong password"}
                </p>
              </motion.div>
            )}

            <AnimatePresence>
              {errors.password && (
                <motion.p 
                  className="text-red-500 text-xs mt-1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {errors.password}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Role selection */}
          <motion.div variants={itemVariants} className="mb-6">
            <motion.label className="block text-gray-700 text-sm font-semibold mb-2">
              I want to
            </motion.label>
            <motion.select
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-all cursor-pointer"
              value={form.role}
              onChange={(e) => setForm({...form, role: e.target.value})}
              whileFocus={{ scale: 1.02 }}
            >
              <motion.option value="JOB_SEEKER" whileHover={{ scale: 1.05 }}>
                🔍 Find Jobs (Job Seeker)
              </motion.option>
              <motion.option value="EMPLOYER" whileHover={{ scale: 1.05 }}>
                💼 Hire Talent (Employer)
              </motion.option>
            </motion.select>
          </motion.div>

          {/* Role-specific animation */}
          <AnimatePresence>
            {form.role === "EMPLOYER" && (
              <motion.div
                className="mb-4 p-2 bg-blue-50 rounded-lg text-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <span className="text-sm text-blue-600">🏢 Post jobs and find the best talent</span>
              </motion.div>
            )}
            {form.role === "JOB_SEEKER" && (
              <motion.div
                className="mb-4 p-2 bg-green-50 rounded-lg text-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <span className="text-sm text-green-600">🎯 Discover your dream career</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Terms and conditions */}
          <motion.div 
            className="flex items-center mb-6"
            variants={itemVariants}
          >
            <motion.input
              type="checkbox"
              id="terms"
              className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
              I agree to the{" "}
              <motion.a
                href="#"
                className="text-green-600 hover:text-green-800"
                whileHover={{ scale: 1.05 }}
              >
                Terms and Conditions
              </motion.a>
            </label>
          </motion.div>

          {/* Register button */}
          <motion.div variants={itemVariants}>
            <motion.button
              onClick={handleRegister}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white p-3 rounded-xl font-semibold text-lg relative overflow-hidden"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              animate={isLoading ? "disabled" : ""}
              disabled={isLoading}
            >
              {isLoading ? (
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
                  Creating Account...
                </motion.div>
              ) : (
                "Create Account"
              )}

              {/* Ripple effect */}
              <motion.div
                className="absolute inset-0 bg-white opacity-30"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.4 }}
              />
            </motion.button>
          </motion.div>

          {/* Login link */}
          <motion.div 
            className="mt-6 text-center"
            variants={itemVariants}
          >
            <p className="text-gray-600">
              Already have an account?{" "}
              <motion.a
                href="/login"
                className="text-green-600 font-semibold hover:text-green-800"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign in
              </motion.a>
            </p>
          </motion.div>

          {/* Progress indicator */}
          <motion.div 
            className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-600"
              initial={{ width: "0%" }}
              animate={{ 
                width: Object.keys(form).filter(key => form[key]).length * 25 + "%" 
              }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}