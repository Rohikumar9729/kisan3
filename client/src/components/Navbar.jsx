import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { MenuIcon, SearchIcon, ShoppingBag, PackageCheck, LogOut, LayoutDashboard, Sprout, ChevronDown, XIcon, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const closeMenu = () => setIsOpen(false);

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

  return (
    <div className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5">
      {/* Brand Logo */}
      <Link to="/" className="max-md:flex-1">
        <img
          src={assets.logokisan5}
          alt="Logo"
          className="w-16 h-16 md:w-20 md:h-20 object-cover"
          style={{ borderRadius: '50%' }}
        />
      </Link>

      {/* Navigation Links */}
      <div
        className={`
          max-md:absolute max-md:top-0 max-md:left-0
          max-md:font-medium max-md:text-lg z-50 flex flex-col md:flex-row items-center
          max-md:justify-center gap-8 px-8 py-3 max-md:h-screen
          min-md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border
          border-gray-300/20 overflow-hidden transition-[width] duration-300
          ${isOpen ? 'max-md:w-full' : 'max-md:w-0'}
        `}
      >
        <XIcon
          className="md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer"
          onClick={closeMenu}
        />

        <Link onClick={() => { window.scrollTo(0, 0); closeMenu(); }} to="/" className="hover:text-[#CEC382] transition">
          Home
        </Link>
        <Link onClick={() => { window.scrollTo(0, 0); closeMenu(); }} to="/Buy" className="hover:text-[#CEC382] transition">
          Buy
        </Link>
        <Link onClick={() => { window.scrollTo(0, 0); closeMenu(); }} to="/Sell" className="hover:text-[#CEC382] transition">
          Sell
        </Link>
        <Link onClick={() => { window.scrollTo(0, 0); closeMenu(); }} to="/Contactus" className="hover:text-[#CEC382] transition">
          Contact us
        </Link>
      </div>

      {/* Auth & Actions */}
      <div className="flex items-center gap-4 sm:gap-6">
        <SearchIcon className="max-md:hidden w-5 h-5 cursor-pointer text-gray-400 hover:text-white transition" />

        {!isAuthenticated ? (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-5 py-2 text-sm rounded-full font-semibold transition cursor-pointer text-black bg-[#CEC382] hover:bg-[#b8a56e] shadow-md shadow-[#CEC382]/20"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="hidden sm:inline-flex px-4 py-2 text-sm rounded-full font-medium transition cursor-pointer text-gray-300 border border-white/20 hover:border-[#CEC382] hover:text-white"
            >
              Sign Up
            </Link>
          </div>
        ) : (
          <div className="relative" ref={dropdownRef}>
            {/* User Button */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2.5 p-1 sm:px-3 sm:py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 transition cursor-pointer"
            >
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-[#CEC382]/40"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#CEC382] text-black font-bold flex items-center justify-center text-xs">
                  {getUserInitials(user?.name)}
                </div>
              )}
              <span className="hidden md:inline-block text-sm font-medium text-white max-w-[100px] truncate">
                {user?.name?.split(' ')[0]}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-64 backdrop-blur-2xl bg-[#121212]/95 border border-white/15 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {/* User Info Header */}
                <div className="px-3.5 py-3 border-b border-white/10 mb-1">
                  <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{user?.email}</p>
                  <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-[#CEC382]/20 text-[#CEC382]">
                    {user?.role === 'admin' ? '👑 Admin' : user?.role === 'farmer' ? '🌱 Seller / Farmer' : '🌾 Member'}
                  </div>
                </div>

                {/* Menu Items */}
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigate('/Myorder');
                    }}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-200 hover:text-white hover:bg-white/10 rounded-xl transition text-left cursor-pointer"
                  >
                    <PackageCheck className="w-4 h-4 text-[#CEC382]" />
                    <span>My Orders</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigate('/Cart');
                    }}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-200 hover:text-white hover:bg-white/10 rounded-xl transition text-left cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#CEC382]" />
                    <span>My Cart</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigate('/Sell');
                    }}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-200 hover:text-white hover:bg-white/10 rounded-xl transition text-left cursor-pointer"
                  >
                    <Sprout className="w-4 h-4 text-[#CEC382]" />
                    <span>Sell on Kisan</span>
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate('/admin');
                      }}
                      className="flex items-center gap-3 w-full px-3 py-2 text-sm text-yellow-400 hover:bg-white/10 rounded-xl transition text-left cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Admin Dashboard</span>
                    </button>
                  )}

                  <div className="my-1 border-t border-white/10" />

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <MenuIcon
          className="max-md:ml-2 md:hidden w-8 h-8 cursor-pointer text-gray-200 hover:text-white"
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
    </div>
  );
};

export default Navbar;