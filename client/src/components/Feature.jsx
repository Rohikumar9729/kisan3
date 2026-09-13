import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import BlurCircle from './Blurcircle';
import { dummyShowsData } from '../assets/assets';
import FarmerCard from './Farmercard';

const CATEGORIES = ['All', 'Seeds', 'Grains', 'Fertilizers', 'Organic Produce'];

const Feature = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProducts =
    selectedCategory === 'All'
      ? dummyShowsData.slice(0, 8)
      : dummyShowsData
          .filter(
            (p) =>
              (p.category || 'Seeds').toLowerCase() === selectedCategory.toLowerCase()
          )
          .slice(0, 8);

  return (
    <section className="relative py-16 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto overflow-visible">
      <BlurCircle top="0%" right="-5%" color="gold" />
      <BlurCircle bottom="10%" left="-5%" color="emerald" />

      {/* Header & Category Pills */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CEC382]/15 border border-[#CEC382]/30 text-[#CEC382] text-xs font-semibold uppercase tracking-wider mb-2.5">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Featured Marketplace Items</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Top Quality Verified Seeds &amp; Crops
          </h2>
          <p className="text-gray-400 text-sm mt-1.5 max-w-xl">
            Inspected by local agricultural experts for germination rates, purity, and fair farm pricing.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#CEC382] text-black shadow-md shadow-[#CEC382]/20'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Farmer Cards - Properly Aligned */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <FarmerCard key={product._id || product.id} product={product} />
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 pt-6">
        <button
          onClick={() => {
            navigate('/Product');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold bg-[#CEC382] hover:bg-[#b8a56e] text-black shadow-lg shadow-[#CEC382]/25 active:scale-95 transition cursor-pointer"
        >
          <span>Explore All 500+ Farm Products</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};

export default Feature;