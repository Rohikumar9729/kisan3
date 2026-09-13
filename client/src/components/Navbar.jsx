import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { assets } from '../assets/assets';
import {
  Menu,
  X,
  Search,
  ShoppingBag,
  PackageCheck,
  Inbox,
  LogOut,
  Sprout,
  ChevronDown,
  User,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { user, isAuthenticated, logout } = useAuth();

  // Scroll detection for dynamic navbar glass effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync cart count from localStorage
  const updateCartCount = () => {
    try {
      const savedCart = JSON.parse(localStorage.getItem('kisan_cart') || '[]');
      const total = savedCart.reduce((sum, item) => sum + (item.qty || 1), 0);
      setCartCount(total);
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cartUpdated', updateCartCount);
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  const [receivedCount, setReceivedCount] = useState(0);

  // Sync received requests count
  const updateReceivedCount = () => {
    try {
      const local = JSON.parse(localStorage.getItem('kisan_received_requests') || '[]');
      const pending = local.filter((r) => r.status === 'pending').length;
      setReceivedCount(pending);
    } catch {
      setReceivedCount(0);
    }
  };

  useEffect(() => {
    updateReceivedCount();
    window.addEventListener('storage', updateReceivedCount);
    window.addEventListener('requestReceivedUpdated', updateReceivedCount);
    return () => {
      window.removeEventListener('storage', updateReceivedCount);
      window.removeEventListener('requestReceivedUpdated', updateReceivedCount);
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
    navigate('/');
  };

  const getUserInitials = (name) => {
    if (!name) return 'K';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Marketplace', path: '/Buy' },
    { name: 'Sell Produce', path: '/Sell' },
    { name: 'Contact', path: '/Contactus' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#090d0b]/90 backdrop-blur-xl border-b border-white/10 py-3 shadow-xl shadow-black/40'
          : 'bg-transparent py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <img
              src={assets.logokisan5}
              alt="Kisan Logo"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-[#CEC382]/60 group-hover:border-[#CEC382] transition shadow-md shadow-[#CEC382]/20"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#090d0b]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-[#CEC382] transition">
                KISAN
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-widest bg-[#CEC382]/20 text-[#CEC382]">
                MARKET
              </span>
            </div>
            <span className="text-[10px] text-gray-400 font-medium tracking-wide -mt-0.5 hidden xs:block">
              Direct Farmer Network
            </span>
          </div>
        </Link>

        {/* Center Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/[0.04] backdrop-blur-md border border-white/8">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                  isActive
                    ? 'bg-[#CEC382] text-[#090d0b] shadow-sm shadow-[#CEC382]/30'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Right Actions: Search, Cart, Profile */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Quick Search Button */}
          <button
            onClick={() => navigate('/Product')}
            aria-label="Search produce"
            className="p-2 sm:px-3 sm:py-1.5 rounded-full text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/8 transition flex items-center gap-2 text-xs"
          >
            <Search className="w-4 h-4 text-[#CEC382]" />
            <span className="hidden md:inline-block text-gray-400">Search seeds...</span>
          </button>

          {/* Cart Icon with Live Counter Badge */}
          <Link
            to="/Cart"
            className="relative p-2 sm:p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/8 text-white transition active:scale-95 group"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#CEC382] group-hover:scale-110 transition-transform" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-emerald-500 text-black text-[10px] font-black rounded-full flex items-center justify-center shadow-md animate-in zoom-in">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>

          {/* User Auth or Dropdown */}
          {!isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-xs sm:text-sm rounded-full font-bold transition text-[#090d0b] bg-[#CEC382] hover:bg-[#b8a56e] shadow-md shadow-[#CEC382]/20 active:scale-95"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="hidden sm:inline-flex px-3.5 py-2 text-xs rounded-full font-semibold transition text-gray-300 border border-white/15 hover:border-[#CEC382] hover:text-white"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1 sm:pl-1.5 sm:pr-3 sm:py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition cursor-pointer"
              >
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-[#CEC382]/50"
                  />
                ) : (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#CEC382] text-black font-extrabold flex items-center justify-center text-xs">
                    {getUserInitials(user?.name)}
                  </div>
                )}
                {receivedCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#090d0b] animate-pulse" />
                )}
                <span className="hidden sm:inline-block text-xs font-semibold text-white max-w-[90px] truncate">
                  {user?.name?.split(' ')[0]}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Profile Dropdown */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 backdrop-blur-2xl bg-[#0f1713]/95 border border-white/15 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-3 py-2.5 border-b border-white/10 mb-1">
                    <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                    <p className="text-[11px] text-gray-400 truncate mt-0.5">{user?.email}</p>
                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#CEC382]/20 text-[#CEC382]">
                      {user?.role === 'farmer'
                        ? '🌱 Verified Farmer'
                        : '🌾 Member'}
                    </div>
                  </div>

                  <div className="flex flex-col gap-0.5 text-xs">
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate('/Myorder');
                      }}
                      className="flex items-center gap-2.5 w-full px-3 py-2 text-gray-200 hover:text-white hover:bg-white/10 rounded-xl transition text-left cursor-pointer"
                    >
                      <PackageCheck className="w-4 h-4 text-[#CEC382]" />
                      <span>My Orders</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate('/ReceivedRequests');
                      }}
                      className="flex items-center justify-between w-full px-3 py-2 text-gray-200 hover:text-white hover:bg-white/10 rounded-xl transition text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Inbox className="w-4 h-4 text-emerald-400" />
                        <span>Received Requests</span>
                      </div>
                      {receivedCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-emerald-500 text-black font-black text-[10px] animate-pulse">
                          {receivedCount} New
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate('/Cart');
                      }}
                      className="flex items-center justify-between w-full px-3 py-2 text-gray-200 hover:text-white hover:bg-white/10 rounded-xl transition text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <ShoppingBag className="w-4 h-4 text-[#CEC382]" />
                        <span>My Cart</span>
                      </div>
                      {cartCount > 0 && (
                        <span className="px-1.5 py-0.2 bg-[#CEC382] text-black font-bold text-[10px] rounded-full">
                          {cartCount}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate('/Sell');
                      }}
                      className="flex items-center gap-2.5 w-full px-3 py-2 text-gray-200 hover:text-white hover:bg-white/10 rounded-xl transition text-left cursor-pointer"
                    >
                      <Sprout className="w-4 h-4 text-[#CEC382]" />
                      <span>Sell on Kisan</span>
                    </button>

                    <div className="my-1 border-t border-white/10" />

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 w-full px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[65px] bg-[#090d0b]/98 backdrop-blur-2xl border-b border-white/10 p-6 shadow-2xl transition-all duration-300 max-h-[85vh] overflow-y-auto">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between ${
                    isActive
                      ? 'bg-[#CEC382] text-black'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <span>{link.name}</span>
                {link.path === '/Buy' && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/20 text-current">
                    Verified
                  </span>
                )}
              </NavLink>
            ))}

            <div className="my-2 border-t border-white/10" />

            <Link
              to="/Cart"
              onClick={() => setIsOpen(false)}
              className="px-4 py-3 rounded-xl text-sm font-semibold text-gray-300 hover:bg-white/5 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4 text-[#CEC382]" />
                <span>My Cart</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#CEC382] text-black text-xs font-bold">
                {cartCount}
              </span>
            </Link>

            <Link
              to="/ReceivedRequests"
              onClick={() => setIsOpen(false)}
              className="px-4 py-3 rounded-xl text-sm font-semibold text-gray-300 hover:bg-white/5 flex items-center gap-2.5"
            >
              <Inbox className="w-4 h-4 text-emerald-400" />
              <span>Received Requests</span>
            </Link>

            <Link
              to="/Sell"
              onClick={() => setIsOpen(false)}
              className="px-4 py-3 rounded-xl text-sm font-semibold text-gray-300 hover:bg-white/5 flex items-center gap-2.5"
            >
              <Sprout className="w-4 h-4 text-[#CEC382]" />
              <span>Sell Your Produce</span>
            </Link>

            {!isAuthenticated && (
              <div className="grid grid-cols-2 gap-3 mt-4">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="py-2.5 text-center text-xs font-bold rounded-xl bg-[#CEC382] text-black shadow-md"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="py-2.5 text-center text-xs font-semibold rounded-xl border border-white/20 text-white"
                >
                  Create Account
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;