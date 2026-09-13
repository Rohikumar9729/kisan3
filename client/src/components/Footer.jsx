import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';
import {
  Mail,
  Phone
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-28 border-t border-white/10 bg-[#070b09]/95 text-gray-300 relative overflow-hidden">

      {/* Main Footer Links & Information */}
      <div className="px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand & Mission */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src={assets.logokisan5}
                alt="Kisan Logo"
                className="w-12 h-12 rounded-full object-cover border-2 border-[#CEC382]/60 group-hover:border-[#CEC382] transition shadow-lg shadow-[#CEC382]/20"
              />
              <div>
                <span className="text-2xl font-black text-white tracking-tight group-hover:text-[#CEC382] transition">
                  KISAN
                </span>
                <p className="text-[10px] text-[#CEC382] font-semibold uppercase tracking-widest -mt-1">
                  Direct Farm Market
                </p>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Empowering India's agricultural ecosystem by connecting cultivators directly with buyers. Trade certified seeds, organic fertilizers, and surplus crop harvests at fair, transparent rates.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <img
                src={assets.googlePlay}
                alt="Download on Google Play"
                className="h-9 w-auto opacity-85 hover:opacity-100 transition cursor-pointer"
              />
              <img
                src={assets.appStore}
                alt="Download on App Store"
                className="h-9 w-auto opacity-85 hover:opacity-100 transition cursor-pointer"
              />
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Marketplace</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/Buy" className="text-gray-400 hover:text-[#CEC382] transition">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/Buy?category=Seeds" className="text-gray-400 hover:text-[#CEC382] transition">
                  Certified Seeds
                </Link>
              </li>
              <li>
                <Link to="/Buy?category=Grains" className="text-gray-400 hover:text-[#CEC382] transition">
                  Organic Grains
                </Link>
              </li>
              <li>
                <Link to="/Buy?category=Fertilizers" className="text-gray-400 hover:text-[#CEC382] transition">
                  Bio-Fertilizers
                </Link>
              </li>
              <li>
                <Link to="/Sell" className="text-gray-400 hover:text-[#CEC382] transition">
                  Sell on Kisan
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Company</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="text-gray-400 hover:text-[#CEC382] transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/Aboutus" className="text-gray-400 hover:text-[#CEC382] transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/Contactus" className="text-gray-400 hover:text-[#CEC382] transition">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/Privacy" className="text-gray-400 hover:text-[#CEC382] transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/Myorder" className="text-gray-400 hover:text-[#CEC382] transition">
                  Order Tracking
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Support */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Help &amp; Support</h3>
            <div className="text-xs text-gray-400 space-y-2 pt-1">
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#CEC382]" />
                <span>support@kisanmarket.in</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#CEC382]" />
                <span>Toll-Free: 1800-200-KISAN (9am - 7pm)</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Strip */}
      <div className="border-t border-white/8 py-6 px-4 text-center text-xs text-gray-400">
        <p className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 px-4">
          <span>
            © {new Date().getFullYear()} Kisan Direct Farmer Network. All rights reserved.
          </span>
          <span className="flex items-center gap-1 text-[11px] text-gray-400">
            Dedicated to the farmers who feed our nation 🌱
          </span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
