import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function ApplyJob() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    coverLetter: "",
    resume: null
  });
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/jobs/${id}`);
      setJob(res.data);
    } catch (error) {
      console.error("Error fetching job:", error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.coverLetter.trim()) newErrors.coverLetter = "Cover letter is required";
    if (!formData.resume) newErrors.resume = "Resume is required";
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowSuccess(true);
      
      setTimeout(() => {
        navigate("/jobs");
      }, 3000);
      
    } catch (error) {
      setErrors({ submit: "Failed to submit application. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, resume: file });
    if (errors.resume) setErrors({ ...errors, resume: null });
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 50 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -50,
      transition: {
        duration: 0.4
      }
    }
  };

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
        stiffness: 200,
        damping: 15
      }
    }
  };

  const stepVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      transition: {
        duration: 0.3
      }
    })
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
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0px 10px 20px -5px rgba(59, 130, 246, 0.5)",
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

  if (loading) {
    return (
      <motion.div
        className="flex justify-center items-center min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div className="text-center">
          <motion.div
            className="w-20 h-20 border-4 border-blue-200 border-t-blue-500 rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.p
            className="text-gray-600 text-lg"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading job details...
          </motion.p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Success Overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 max-w-md text-center"
              variants={successVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 360, 360]
                }}
                transition={{ duration: 1 }}
              >
                <span className="text-4xl text-white">✓</span>
              </motion.div>
              <motion.h2
                className="text-2xl font-bold text-gray-800 mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Application Submitted!
              </motion.h2>
              <motion.p
                className="text-gray-600 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Thank you for applying. We'll review your application and get back to you soon.
              </motion.p>
              <motion.div
                className="h-2 bg-gray-200 rounded-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <motion.div
                  className="h-full bg-green-500"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3, ease: "linear" }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-3xl mx-auto">
        {/* Job Summary Card */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-6 mb-6"
          variants={itemVariants}
        >
          <motion.h1
            className="text-2xl font-bold text-gray-800 mb-2"
            whileHover={{ scale: 1.02, color: "#3b82f6" }}
          >
            Applying for: {job?.title}
          </motion.h1>
          <motion.div className="flex items-center space-x-4 text-gray-600">
            <motion.span
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
            >
              📍 {job?.location}
            </motion.span>
            <motion.span
              className="flex items-center text-green-600 font-semibold"
              whileHover={{ scale: 1.05 }}
            >
              💰 ₹ {job?.salary?.toLocaleString()}
            </motion.span>
          </motion.div>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          className="flex justify-between mb-8"
          variants={itemVariants}
        >
          {[1, 2, 3].map((step) => (
            <motion.div
              key={step}
              className="flex-1 text-center"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center font-bold ${
                  currentStep >= step
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
                animate={
                  currentStep === step
                    ? {
                        scale: [1, 1.2, 1],
                        boxShadow: [
                          "0 0 0 0 rgba(59, 130, 246, 0.4)",
                          "0 0 0 10px rgba(59, 130, 246, 0)",
                        ]
                      }
                    : {}
                }
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {step}
              </motion.div>
              <p className="text-sm text-gray-600">
                {step === 1 && "Personal Info"}
                {step === 2 && "Cover Letter"}
                {step === 3 && "Resume"}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Application Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Step 1: Personal Information */}
          <AnimatePresence mode="wait" custom={currentStep}>
            {currentStep === 1 && (
              <motion.div
                key="step1"
                custom={1}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-4"
              >
                <motion.h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Personal Information
                </motion.h2>

                <motion.div variants={itemVariants}>
                  <label className="block text-gray-700 font-medium mb-2">
                    Full Name *
                  </label>
                  <motion.input
                    type="text"
                    className={`w-full p-3 border-2 rounded-xl focus:outline-none ${
                      errors.name ? "border-red-300" : "border-gray-200"
                    }`}
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: null });
                    }}
                    whileFocus="focus"
                    variants={inputVariants}
                    animate={errors.name ? "error" : {}}
                  />
                  <AnimatePresence>
                    {errors.name && (
                      <motion.p
                        className="text-red-500 text-sm mt-1"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        {errors.name}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-gray-700 font-medium mb-2">
                    Email Address *
                  </label>
                  <motion.input
                    type="email"
                    className={`w-full p-3 border-2 rounded-xl focus:outline-none ${
                      errors.email ? "border-red-300" : "border-gray-200"
                    }`}
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: null });
                    }}
                    whileFocus="focus"
                    variants={inputVariants}
                    animate={errors.email ? "error" : {}}
                  />
                  <AnimatePresence>
                    {errors.email && (
                      <motion.p
                        className="text-red-500 text-sm mt-1"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        {errors.email}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-gray-700 font-medium mb-2">
                    Phone Number *
                  </label>
                  <motion.input
                    type="tel"
                    className={`w-full p-3 border-2 rounded-xl focus:outline-none ${
                      errors.phone ? "border-red-300" : "border-gray-200"
                    }`}
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      if (errors.phone) setErrors({ ...errors, phone: null });
                    }}
                    whileFocus="focus"
                    variants={inputVariants}
                    animate={errors.phone ? "error" : {}}
                  />
                  <AnimatePresence>
                    {errors.phone && (
                      <motion.p
                        className="text-red-500 text-sm mt-1"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        {errors.phone}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )}

            {/* Step 2: Cover Letter */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                custom={2}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-4"
              >
                <motion.h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Cover Letter
                </motion.h2>

                <motion.div variants={itemVariants}>
                  <label className="block text-gray-700 font-medium mb-2">
                    Why are you a good fit for this position? *
                  </label>
                  <motion.textarea
                    rows="6"
                    className={`w-full p-3 border-2 rounded-xl focus:outline-none ${
                      errors.coverLetter ? "border-red-300" : "border-gray-200"
                    }`}
                    value={formData.coverLetter}
                    onChange={(e) => {
                      setFormData({ ...formData, coverLetter: e.target.value });
                      if (errors.coverLetter) setErrors({ ...errors, coverLetter: null });
                    }}
                    whileFocus="focus"
                    variants={inputVariants}
                    animate={errors.coverLetter ? "error" : {}}
                  />
                  <AnimatePresence>
                    {errors.coverLetter && (
                      <motion.p
                        className="text-red-500 text-sm mt-1"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        {errors.coverLetter}
                      </motion.p>
                    )}
                  </AnimatePresence>
                  <motion.p
                    className="text-sm text-gray-500 mt-2"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {formData.coverLetter.length}/500 characters
                  </motion.p>
                </motion.div>
              </motion.div>
            )}

            {/* Step 3: Resume Upload */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                custom={3}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-4"
              >
                <motion.h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Upload Resume
                </motion.h2>

                <motion.div variants={itemVariants}>
                  <label className="block text-gray-700 font-medium mb-2">
                    Resume (PDF, DOC, DOCX) *
                  </label>
                  <motion.div
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer ${
                      errors.resume ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-blue-500"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => document.getElementById("resume").click()}
                  >
                    <input
                      type="file"
                      id="resume"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                    />
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <span className="text-4xl mb-2 block">📄</span>
                    </motion.div>
                    <p className="text-gray-600">
                      {formData.resume ? (
                        <motion.span
                          className="text-green-600 font-semibold"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          ✓ {formData.resume.name}
                        </motion.span>
                      ) : (
                        "Click to upload or drag and drop"
                      )}
                    </p>
                  </motion.div>
                  <AnimatePresence>
                    {errors.resume && (
                      <motion.p
                        className="text-red-500 text-sm mt-1"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        {errors.resume}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <motion.div
            className="flex justify-between mt-8"
            variants={itemVariants}
          >
            {currentStep > 1 && (
              <motion.button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 bg-gray-500 text-white rounded-xl font-semibold"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                ← Previous
              </motion.button>
            )}
            
            {currentStep < 3 ? (
              <motion.button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold ml-auto"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Next →
              </motion.button>
            ) : (
              <motion.button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 bg-green-500 text-white rounded-xl font-semibold ml-auto relative overflow-hidden"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                animate={submitting ? "disabled" : ""}
              >
                {submitting ? (
                  <motion.div
                    className="flex items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Submitting...
                  </motion.div>
                ) : (
                  "Submit Application"
                )}
              </motion.button>
            )}
          </motion.div>

          {/* Form Progress */}
          <motion.div
            className="mt-6 h-2 bg-gray-200 rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-green-500"
              initial={{ width: "0%" }}
              animate={{ width: `${(currentStep / 3) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
        </motion.form>
      </div>
    </motion.div>
  );
}