import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BlurCircle from '../components/Blurcircle';
import { assets } from '../assets/assets';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Sparkles, Sprout, ShoppingBag, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user', // 'user' (Buyer) or 'farmer' (Seller)
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If user is already authenticated, redirect to home
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    const res = await register({
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      role: formData.role,
    });
    setIsSubmitting(false);

    if (res.success) {
      // Redirect to login page with registered email prefilled and success message
      navigate('/login', {
        state: {
          registeredEmail: formData.email.trim(),
          successMessage: 'Account created successfully! Please enter your password to sign in.',
        },
        replace: true,
      });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-28 overflow-hidden">
      {/* Ambient background glows */}
      <BlurCircle top="-10%" left="-5%" />
      <BlurCircle bottom="-10%" right="-5%" />

      <div className="w-full max-w-lg relative z-10">
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
            <Sparkles className="w-3.5 h-3.5" /> Join the Community
          </span>
          <h1 className="text-3xl font-bold text-white tracking-tight">Create Your Account</h1>
          <p className="text-sm text-gray-400 mt-1.5 max-w-sm">
            Join the decentralized agricultural network and trade directly with local producers.
          </p>
        </div>

        {/* Card */}
        <div className="backdrop-blur-xl bg-white/[0.04] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle top highlight bar */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#CEC382] to-transparent opacity-60" />

          {/* Account Type Selector */}
          <div className="mb-6">
            <label className="block text-xs font-medium text-gray-300 mb-2">
              I want to use Kisan primarily as:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'user' })}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border text-sm font-medium transition duration-200 cursor-pointer ${
                  formData.role === 'user'
                    ? 'bg-[#CEC382]/15 border-[#CEC382] text-white shadow-md shadow-[#CEC382]/10'
                    : 'bg-white/[0.03] border-white/10 text-gray-400 hover:border-white/20'
                }`}
              >
                <ShoppingBag className="w-4 h-4 text-[#CEC382]" />
                <span>Buyer / Farmer</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'farmer' })}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border text-sm font-medium transition duration-200 cursor-pointer ${
                  formData.role === 'farmer'
                    ? 'bg-[#CEC382]/15 border-[#CEC382] text-white shadow-md shadow-[#CEC382]/10'
                    : 'bg-white/[0.03] border-white/10 text-gray-400 hover:border-white/20'
                }`}
              >
                <Sprout className="w-4 h-4 text-[#CEC382]" />
                <span>Seller / Producer</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Full Name
              </label>
              <div className="relative flex items-center">
                <User className="w-5 h-5 text-gray-500 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ramesh Kumar"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white/[0.05] border border-white/10 focus:border-[#CEC382] rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none transition duration-200"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="w-5 h-5 text-gray-500 absolute left-4 pointer-events-none" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ramesh@example.com"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white/[0.05] border border-white/10 focus:border-[#CEC382] rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none transition duration-200"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-5 h-5 text-gray-500 absolute left-4 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  required
                  className="w-full pl-12 pr-12 py-3 bg-white/[0.05] border border-white/10 focus:border-[#CEC382] rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none transition duration-200"
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

            {/* Confirm Password Field */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-5 h-5 text-gray-500 absolute left-4 pointer-events-none" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  required
                  className="w-full pl-12 pr-12 py-3 bg-white/[0.05] border border-white/10 focus:border-[#CEC382] rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none transition duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 text-gray-400 hover:text-white transition p-1"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-3 py-3.5 px-6 rounded-2xl font-semibold text-black bg-[#CEC382] hover:bg-[#b8a56e] disabled:opacity-60 transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#CEC382]/20 cursor-pointer text-sm"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  Create Account <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer separator */}
          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-[#CEC382] hover:text-[#e4d799] underline underline-offset-4 transition"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-6">
          <ShieldCheck className="w-4 h-4 text-[#CEC382]" />
          <span>Your data is protected with secure encryption</span>
        </div>
      </div>
    </div>
  );
};

export default Signup;
