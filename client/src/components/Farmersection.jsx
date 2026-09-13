import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  TrendingUp
} from 'lucide-react';

const FarmerSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[92vh] flex items-center pt-28 pb-16 px-4 sm:px-8 lg:px-16 overflow-hidden">
      {/* Background with Increased Visibility */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-20 scale-105 transition-transform duration-1000"
        style={{ backgroundImage: "url('/background2.jpg')" }}
      />
      {/* Subtle gradient overlays so the background image remains clearly visible while text is crisp */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#090d0b]/80 via-[#090d0b]/40 to-transparent -z-10" />
      <div className="absolute inset-0 bg-black/20 -z-10" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Hero Text & Actions */}
        <div className="max-w-3xl flex flex-col items-start gap-6">

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12] drop-shadow-md">
            Pure Seeds &amp; Crops,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#CEC382] via-[#e5da99] to-[#b8a56e]">
              Direct From Farmers
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-gray-200 text-sm sm:text-base leading-relaxed max-w-xl drop-shadow">
            Connect directly with verified farmers across 18 states. Buy lab-tested seeds, organic fertilizers, and fresh farm harvests at fair, transparent prices.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2 w-full sm:w-auto">
            <button
              onClick={() => {
                navigate('/Buy');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm bg-[#CEC382] hover:bg-[#b8a56e] text-[#090d0b] shadow-lg shadow-[#CEC382]/25 active:scale-95 transition cursor-pointer"
            >
              <span>Explore Marketplace</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                navigate('/Sell');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm text-white bg-black/40 hover:bg-black/60 border border-white/20 hover:border-[#CEC382]/40 backdrop-blur-md active:scale-95 transition cursor-pointer"
            >
              <TrendingUp className="w-4 h-4 text-[#CEC382]" />
              <span>Sell Your Produce</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FarmerSection;