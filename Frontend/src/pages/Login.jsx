import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailValid, setEmailValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  const navigate = useNavigate();

  // Real-time validation
  useEffect(() => {
    if (email) {
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      setEmailValid(isValid);
    } else {
      setEmailValid(true);
    }
  }, [email]);

  useEffect(() => {
    if (password) {
      setPasswordValid(password.length >= 6);
    } else {
      setPasswordValid(true);
    }
  }, [password]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    if (!emailValid) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await axios.post(
        "http://localhost:8080/api/auth/login",
        { email, password }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("email", email);

      // Show success animation
      setShowSuccessAnimation(true);

      // Navigate after animation
      setTimeout(() => {
        if (res.data.role === "ADMIN") {
          navigate("/admin");
        } else if (res.data.role === "EMPLOYER") {
          navigate("/employer");
        } else {
          navigate("/user");
        }
      }, 1500);

    } catch (err) {
      setError("Invalid email or password");
      // Shake animation for error
      setEmailValid(false);
      setPasswordValid(false);
    } finally {
      setLoading(false);
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

  const cardVariants = {
    hidden: {
      scale: 0.8,
      opacity: 0,
      y: 50,
      rotateX: -15
    },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
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
      boxShadow: "0px 30px 60px rgba(0, 0, 0, 0.2)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const headerVariants = {
    hidden: { y: -20, opacity: 0 },
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

  const inputVariants = {
    focus: {
      scale: 1.02,
      borderColor: "#3b82f6",
      boxShadow: "0px 0px 0px 3px rgba(59, 130, 246, 0.2)",
      transition: { duration: 0.2 }
    },
    error: {
      borderColor: "#ef4444",
      boxShadow: "0px 0px 0px 3px rgba(239, 68, 68, 0.2)",
      transition: { duration: 0.2 }
    },
    valid: {
      borderColor: "#10b981",
      boxShadow: "0px 0px 0px 3px rgba(16, 185, 129, 0.2)",
      transition: { duration: 0.2 }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0px 10px 25px -5px rgba(59, 130, 246, 0.5)",
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

  const errorVariants = {
    hidden: {
      opacity: 0,
      y: -20,
      scale: 0.8
    },
    visible: {
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
      y: -20,
      scale: 0.8,
      transition: {
        duration: 0.2
      }
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

  const successVariants = {
    hidden: {
      scale: 0,
      opacity: 0,
      rotate: -180
    },
    visible: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    }
  };

  const backgroundVariants = {
    animate: {
      background: [
        "linear-gradient(135deg, #60a5fa 0%, #93c5fd 50%, #bfdbfe 100%)",
        "linear-gradient(135deg, #93c5fd 0%, #60a5fa 50%, #93c5fd 100%)",
        "linear-gradient(135deg, #60a5fa 0%, #93c5fd 50%, #bfdbfe 100%)"
      ],
      transition: {
        duration: 10,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  return (
    <motion.div
      className="flex justify-center items-center min-h-screen relative overflow-hidden"
      variants={backgroundVariants}
      animate="animate"
    >
      {/* Animated background elements */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Floating circles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white opacity-20"
            style={{
              width: Math.random() * 300 + 100,
              height: Math.random() * 300 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
              scale: [1, 1.2, 1],
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
      </motion.div>

      {/* Success Animation Overlay */}
      <AnimatePresence>
        {showSuccessAnimation && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 text-center"
              variants={successVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 360, 360],
                }}
                transition={{ duration: 1 }}
              >
                <span className="text-4xl">✓</span>
              </motion.div>
              <motion.h3
                className="text-2xl font-bold text-gray-800 mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Login Successful!
              </motion.h3>
              <motion.p
                className="text-gray-600"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Redirecting to dashboard...
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Form */}
      <motion.div
        className="relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="bg-white p-10 rounded-2xl shadow-2xl w-96 backdrop-blur-lg bg-opacity-95"
          variants={cardVariants}
          whileHover="hover"
        >
          {/* Animated icon */}
          <motion.div
            className="flex justify-center mb-6"
            variants={headerVariants}
          >
            <motion.div
              className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-4xl text-white shadow-lg"
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
              🔐
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.h2
            className="text-3xl font-bold text-center text-gray-800 mb-2"
            variants={headerVariants}
          >
            Welcome Back
          </motion.h2>

          <motion.p
            className="text-center text-gray-500 mb-6"
            variants={headerVariants}
          >
            Sign in to continue to your account
          </motion.p>

          {/* Error Message */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm text-center"
                variants={errorVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.span
                  className="inline-block mr-2"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  ⚠️
                </motion.span>
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email Input */}
          <motion.div
            className="mb-4"
            variants={headerVariants}
          >
            <motion.label
              className="block text-gray-700 text-sm font-semibold mb-2"
              animate={!emailValid ? { x: [0, -5, 5, -5, 5, 0] } : {}}
              transition={{ duration: 0.4 }}
            >
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
                  !emailValid
                    ? "border-red-300 bg-red-50"
                    : email && emailValid
                    ? "border-green-300 bg-green-50"
                    : "border-gray-200"
                }`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                whileFocus="focus"
                variants={inputVariants}
                animate={
                  !emailValid
                    ? "error"
                    : email && emailValid
                    ? "valid"
                    : {}
                }
              />
              {email && emailValid && (
                <motion.span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  ✓
                </motion.span>
              )}
            </motion.div>
          </motion.div>

          {/* Password Input */}
          <motion.div
            className="mb-6"
            variants={headerVariants}
          >
            <motion.label
              className="block text-gray-700 text-sm font-semibold mb-2"
              animate={!passwordValid ? { x: [0, -5, 5, -5, 5, 0] } : {}}
              transition={{ duration: 0.4 }}
            >
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
                placeholder="Enter your password"
                className={`w-full pl-10 pr-16 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                  !passwordValid
                    ? "border-red-300 bg-red-50"
                    : password && passwordValid
                    ? "border-green-300 bg-green-50"
                    : "border-gray-200"
                }`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                whileFocus="focus"
                variants={inputVariants}
                animate={
                  !passwordValid
                    ? "error"
                    : password && passwordValid
                    ? "valid"
                    : {}
                }
              />
              <motion.button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-semibold text-blue-600 hover:text-blue-800"
                onClick={() => setShowPassword(!showPassword)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {showPassword ? "Hide" : "Show"}
              </motion.button>
            </motion.div>

            {/* Password strength indicator */}
            {password && (
              <motion.div
                className="mt-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex gap-1">
                  {[1, 2, 3].map((level) => (
                    <motion.div
                      key={level}
                      className={`h-1 flex-1 rounded-full ${
                        password.length > level * 3
                          ? "bg-green-500"
                          : "bg-gray-200"
                      }`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: level * 0.1 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Forgot Password Link */}
          <motion.div
            className="text-right mb-4"
            variants={headerVariants}
          >
            <motion.a
              href="#"
              className="text-sm text-blue-600 hover:text-blue-800"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Forgot password?
            </motion.a>
          </motion.div>

          {/* Login Button */}
          <motion.div variants={headerVariants}>
            <motion.button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-xl font-semibold text-lg relative overflow-hidden"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              animate={loading ? "disabled" : ""}
            >
              {loading ? (
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
                  Logging in...
                </motion.div>
              ) : (
                "Login"
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

          {/* Register Link */}
          <motion.p
            className="text-center text-sm mt-6 text-gray-600"
            variants={headerVariants}
          >
            Don't have an account?{" "}
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link
                to="/register"
                className="text-blue-600 font-semibold hover:text-blue-800 transition-colors"
              >
                Register
              </Link>
            </motion.span>
          </motion.p>

          {/* Demo credentials */}
          <motion.div
            className="mt-4 p-3 bg-gray-50 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-xs text-gray-500 text-center">
              Demo: user@example.com / password123
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
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
              initial={{ width: "0%" }}
              animate={{
                width: `${(email ? 50 : 0) + (password ? 50 : 0)}%`,
              }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}