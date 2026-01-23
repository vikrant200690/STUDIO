// src/pages/LoginOTP.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import InputField from "../components/InputField";
import AuthButton from "../components/AuthButton";
import TopBar from "../components/TopBar";
import AnimatedBackground from "../components/AnimatedBackground";
import Loginimg from '../assets/Login.jpg';
import { useAuth } from "../../context/AuthContext";

const backgroundImage = Loginimg;

// Create axios instance with credentials
const api = axios.create({
  baseURL: 'http://localhost:8077',
  withCredentials: true,  // ✅ Enable cookies
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

function LoginOTP() {
  const [step, setStep] = useState(1); // 1: credentials, 2: OTP
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const { verifyAuth, setUser, setIsAuthenticated } = useAuth();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleRequestOTP = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    // ✅ Ensure JSON is properly sent
    const response = await api.post('/api/auth/login/request-otp', {
      email: formData.email,
      password: formData.password
    });
    setMessage(response.data.message);
    setStep(2);
  } catch (err) {
    console.error('OTP Request Error:', err.response?.data); // Add logging
    setError(err.response?.data?.detail || 'Invalid credentials');
  } finally {
    setLoading(false);
  }
};


  const handleVerifyOTP = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const response = await api.post('/api/auth/login/verify-otp', { 
      email: formData.email, 
      otp 
    });
    
    // ✅ Set auth immediately from response
    const userData = {
      id: response.data.user_id,
      username: response.data.username,
      email: response.data.email
    };
    
    setUser(userData);
    setIsAuthenticated(true);
    
    // ✅ Navigate immediately
    navigate('/chat', { replace: true });
    
    // ✅ Verify in background
    setTimeout(() => verifyAuth(), 100);
    
  } catch (err) {
    setError(err.response?.data?.detail || 'Invalid or expired OTP');
  } finally {
    setLoading(false);
  }
};


  const handleResendOTP = async () => {
    setLoading(true);
    setError('');
    
    try {
      await api.post('/api/auth/login/request-otp', formData);
      setMessage('New OTP sent to your email!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 overflow-hidden flex flex-col">
      <AnimatedBackground />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-20">
        <TopBar center />
      </div>
      <div className="relative z-10 flex-1 flex items-center justify-center p-4">
        <motion.div
          className="flex w-full max-w-5xl overflow-hidden rounded-3xl bg-slate-900/70 backdrop-blur-lg border border-slate-700/50 shadow-2xl"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div
            className="hidden md:block w-1/2 bg-cover bg-center relative"
            style={{ backgroundImage: `url(${backgroundImage})` }}
            variants={childVariants}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
            <div className="absolute bottom-10 left-10 text-white">
              <motion.h2 className="text-4xl font-bold mb-2" variants={childVariants}>
                {step === 1 ? 'Secure Login' : 'Verify OTP'}
              </motion.h2>
              <motion.p className="text-lg opacity-90" variants={childVariants}>
                {step === 1 ? 'Login with email verification' : 'Check your email for the code'}
              </motion.p>
            </div>
          </motion.div>
          <motion.div
            className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center"
            variants={childVariants}
          >
            <motion.h1
              className="text-4xl font-bold text-center text-white mb-10 tracking-tight"
              variants={childVariants}
            >
              {step === 1 ? '🔐 LOGIN WITH OTP' : '📧 VERIFY OTP'}
            </motion.h1>
            
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400 text-sm text-center"
              >
                {message}
              </motion.div>
            )}

            {step === 1 ? (
              <form onSubmit={handleRequestOTP} className="space-y-5">
                <motion.div variants={childVariants}>
                  <InputField
                    type="email"
                    name="email"
                    placeholder="Email"
                    iconType="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </motion.div>
                <motion.div variants={childVariants}>
                  <InputField
                    type="password"
                    name="password"
                    placeholder="Password"
                    iconType="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </motion.div>
                <motion.div variants={childVariants}>
                  <AuthButton type="submit" className="mt-4" disabled={loading}>
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending OTP...
                      </span>
                    ) : (
                      "📨 SEND OTP"
                    )}
                  </AuthButton>
                </motion.div>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-5">
                <motion.p 
                  className="text-sm text-gray-300 mb-4 text-center"
                  variants={childVariants}
                >
                  Code sent to <span className="text-indigo-400 font-semibold">{formData.email}</span>
                </motion.p>
                
                <motion.div variants={childVariants}>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white text-center text-3xl tracking-[1em] font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    maxLength={6}
                    placeholder="000000"
                    required
                    disabled={loading}
                  />
                </motion.div>

                <motion.div variants={childVariants}>
                  <AuthButton 
                    type="submit" 
                    className="mt-4" 
                    disabled={loading || otp.length !== 6}
                  >
                    {loading ? 'Verifying...' : '✅ VERIFY & LOGIN'}
                  </AuthButton>
                </motion.div>

                <motion.div 
                  variants={childVariants}
                  className="flex justify-center gap-4 text-sm mt-4"
                >
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={loading}
                    className="text-indigo-400 hover:text-indigo-300 disabled:opacity-50 transition-colors"
                  >
                    🔄 Resend OTP
                  </button>
                  <span className="text-gray-500">|</span>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    ✏️ Change Email
                  </button>
                </motion.div>
              </form>
            )}

           

            <motion.p
              className="text-center text-gray-400 mt-6 text-sm"
              variants={childVariants}
            >
              Don&apos;t have an account?{" "}
              <Link
                to="/signup-otp"
                className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
              >
                Sign up
              </Link>
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default LoginOTP;
