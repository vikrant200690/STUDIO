// src/pages/SignupOTP.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import InputField from "../components/InputField";
import AuthButton from "../components/AuthButton";
import AnimatedBackground from "../components/AnimatedBackground";
import AIimage from "../assets/AIimage.jpg";
import TopBar from "../components/TopBar";
import { useAuth } from "../../context/AuthContext";
import { signupRequestOTP, signupVerifyOTP } from "../services/tokenService";
import axios from "axios";


const backgroundImage = AIimage;

// Create axios instance with credentials
const api = axios.create({
  baseURL: "http://localhost:8077",
  withCredentials: true,
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.18, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

function SignupOTP() {
  const navigate = useNavigate();
  const { verifyAuth } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      console.log('📤 Requesting OTP for:', formData.email);
      
      const response = await api.post('/api/auth/signup/request-otp', formData);
      
      console.log('✅ OTP sent successfully');
      setMessage(response.data.message);
      setStep(2);
      
    } catch (err) {
      console.error('❌ Failed to send OTP:', err.response?.data);
      setError(err.response?.data?.detail || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      console.log('🔐 Verifying OTP for:', formData.email);
      console.log('📝 OTP entered:', otp);
      
      const response = await api.post('/api/auth/signup/verify-otp', {
        email: formData.email,
        otp: otp
      });
      
      console.log('✅ OTP verified, account created:', response.data);
      
      // Cookie is automatically set by backend
      setMessage('Account created successfully! Redirecting...');
      
      // Verify authentication to update context
      console.log('🔄 Updating auth context...');
      await verifyAuth();
      
      console.log('✅ Auth context updated, navigating to chat...');
      
      // Navigate to main page (chat)
      setTimeout(() => {
        navigate('/chat', { replace: true });
      }, 1500);
      
    } catch (err) {
      console.error('❌ OTP verification failed:', err.response?.data);
      setError(err.response?.data?.detail || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      console.log('🔄 Resending OTP to:', formData.email);
      
      await api.post('/api/auth/signup/request-otp', formData);
      
      setMessage('New OTP sent to your email!');
      setTimeout(() => setMessage(''), 3000);
      
    } catch (err) {
      console.error('❌ Failed to resend OTP:', err.response?.data);
      setError(err.response?.data?.detail || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 overflow-hidden">
      <TopBar />
      <AnimatedBackground />
      <div className="absolute inset-0 bg-black/35" />

      <div className="relative z-10 flex h-full items-center justify-center p-4">
        <motion.div
          className="flex w-full max-w-5xl overflow-hidden rounded-3xl bg-slate-900/65 backdrop-blur-lg border border-slate-700/40 shadow-2xl"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Left side - form */}
          <motion.div
            className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center"
            variants={itemVariants}
          >
            <motion.h1
              className="text-4xl font-bold text-center text-white mb-10 tracking-tight"
              variants={itemVariants}
            >
              {step === 1 ? '🚀 CREATE ACCOUNT' : '📧 VERIFY EMAIL'}
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
                <motion.div variants={itemVariants}>
                  <InputField
                    type="text"
                    name="username"
                    placeholder="Username"
                    iconType="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    minLength={3}
                    disabled={loading}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <InputField
                    type="email"
                    name="email"
                    placeholder="Email address"
                    iconType="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <InputField
                    type="password"
                    name="password"
                    placeholder="Create password"
                    iconType="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    minLength={6}
                    disabled={loading}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <AuthButton
                    type="submit"
                    className="mt-4 bg-purple-600 hover:bg-purple-700"
                    disabled={loading}
                  >
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
                  variants={itemVariants}
                >
                  We've sent a 6-digit code to<br />
                  <span className="text-purple-400 font-semibold">{formData.email}</span>
                </motion.p>
                
                <motion.div variants={itemVariants}>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white text-center text-3xl tracking-[1em] font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    maxLength={6}
                    placeholder="000000"
                    required
                    disabled={loading}
                    autoFocus
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <AuthButton 
                    type="submit" 
                    className="mt-4 bg-green-600 hover:bg-green-700" 
                    disabled={loading || otp.length !== 6}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verifying...
                      </span>
                    ) : (
                      '✅ VERIFY & CREATE ACCOUNT'
                    )}
                  </AuthButton>
                </motion.div>

                <motion.div 
                  variants={itemVariants}
                  className="flex justify-center gap-4 text-sm mt-4"
                >
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={loading}
                    className="text-purple-400 hover:text-purple-300 disabled:opacity-50 transition-colors"
                  >
                    🔄 Resend OTP
                  </button>
                  <span className="text-gray-500">|</span>
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setOtp('');
                      setError('');
                      setMessage('');
                    }}
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    ✏️ Change Email
                  </button>
                </motion.div>
              </form>
            )}

            

            <motion.p
              className="text-center text-gray-400 mt-6 text-sm"
              variants={itemVariants}
            >
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
              >
                Login with OTP
              </button>
            </motion.p>
          </motion.div>

          {/* Right side - image */}
          <motion.div
            className="hidden md:block w-1/2 bg-cover bg-center relative"
            style={{ backgroundImage: `url(${backgroundImage})` }}
            variants={itemVariants}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />
            <div className="absolute bottom-12 left-10 text-white">
              <motion.h2
                className="text-4xl font-bold mb-3"
                variants={itemVariants}
              >
                {step === 1 ? 'Secure Signup' : 'Almost There!'}
              </motion.h2>
              <motion.p
                className="text-lg opacity-90"
                variants={itemVariants}
              >
                {step === 1 ? 'Create your account with email verification' : 'Check your email for the verification code'}
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default SignupOTP;
