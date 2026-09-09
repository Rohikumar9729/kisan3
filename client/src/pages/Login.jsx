import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BlurCircle from '../components/Blurcircle';
import { assets } from '../assets/assets';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const passwordInputRef = useRef(null);

  const registeredEmail = location.state?.registeredEmail || '';
  const successMessage = location.state?.successMessage || '';

  const [email, setEmail] = useState(registeredEmail);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [banner, setBanner] = useState(successMessage);

  // If user is already authenticated, redirect to home
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // If redirected from signup with an email, auto-focus password field
  useEffect(() => {
    if (registeredEmail && passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  }, [registeredEmail]);

  // Redirect destination after login (defaults to home page '/')
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setIsSubmitting(true);
    const res = await login(email.trim(), password);
    setIsSubmitting(false);

    if (res.success) {
      // Directly go to home page (or intended protected page) after login
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-28 overflow-hidden">
      {/* Ambient background glows */}
      <BlurCircle top="-10%" left="-5%" />
      <BlurCircle bottom="-10%" right="-5%" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <Link to="/" className="inline-block transition-transform hover:scale-105 mb-3">
            <img
              src={assets.logokisan5}
              alt="Kisan Logo"
              className="w-20 h-20 object-cover rounded-full border-2 border-[#CEC382]/40 shadow-lg shadow-[#CEC382]/10"
            />
          </Link>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-semibold tracking-wider uppercase bg-[#CEC382]/15 text-[#CEC382] rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Welcome to Kisan
          </span>
          <h1 className="text-3xl font-bold text-white tracking-tight">Sign In to Your Account</h1>
          <p className="text-sm text-gray-400 mt-1.5 max-w-xs">
            Directly connect with local farmers, trade seeds, and manage your orders.
          </p>
        </div>

        {/* Card */}
        <div className="backdrop-blur-xl bg-white/[0.04] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle top highlight bar */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#CEC382] to-transparent opacity-60" />

          {/* Success message banner from signup */}
          {banner && (
            <div className="mb-5 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3 text-left">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-emerald-300">Registration Successful!</p>
                <p className="text-xs text-gray-300 mt-0.5">{banner}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="w-5 h-5 text-gray-500 absolute left-4 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="farmer@example.com"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-white/[0.05] border border-white/10 focus:border-[#CEC382] rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none transition duration-200"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-medium text-gray-300">
                  Password
                </label>
              </div>
              <div className="relative flex items-center">
                <Lock className="w-5 h-5 text-gray-500 absolute left-4 pointer-events-none" />
                <input
                  ref={passwordInputRef}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-12 pr-12 py-3.5 bg-white/[0.05] border border-white/10 focus:border-[#CEC382] rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none transition duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-gray-400 hover:text-white transition p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3.5 px-6 rounded-2xl font-semibold text-black bg-[#CEC382] hover:bg-[#b8a56e] disabled:opacity-60 transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#CEC382]/20 cursor-pointer text-sm"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer separator */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="font-medium text-[#CEC382] hover:text-[#e4d799] underline underline-offset-4 transition"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-6">
          <ShieldCheck className="w-4 h-4 text-[#CEC382]" />
          <span>Secure authentication with encrypted credentials</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
