import { ArrowRight, Leaf } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const FarmerSection = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{ backgroundImage: "url('/background2.jpg')" }}
      className="
        flex flex-col items-start justify-center gap-6
        px-6 md:px-16 lg:px-36
        bg-cover bg-center bg-no-repeat
        h-screen relative overflow-hidden
      "
    >
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

      <div className="relative z-10 flex flex-col gap-5">
        {/* Badge */}
        <span className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold tracking-widest uppercase bg-[#CEC382]/15 border border-[#CEC382]/30 text-[#CEC382] rounded-full w-fit backdrop-blur-sm">
          <Leaf className="w-3.5 h-3.5" />
          India's Farmer Marketplace
        </span>

        <h1 className="text-5xl md:text-[70px] md:leading-[1.1] font-bold max-w-[560px]">
          Quality Seeds,<br />
          <span className="text-[#CEC382]">Directly</span> Online
        </h1>

        <p className="text-gray-300 max-w-md text-base leading-relaxed">
          A platform where farmers interact, exchange unused seeds &amp; products,
          and buy quality inputs — at fair prices, without middlemen.
        </p>

        <div className="flex flex-wrap items-center gap-4 mt-2">
          <button
            onClick={() => navigate('/Buy')}
            className="flex items-center gap-2 px-7 py-3 text-sm font-semibold rounded-full cursor-pointer transition hover:scale-105 active:scale-95"
            style={{ backgroundColor: '#CEC382', color: '#1a1a1a' }}
          >
            Shop Now
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate('/Sell')}
            className="flex items-center gap-2 px-7 py-3 text-sm font-semibold rounded-full cursor-pointer border border-white/30 text-white hover:bg-white/10 transition backdrop-blur-sm"
          >
            Start Selling
          </button>
        </div>

        {/* Mini Stats */}
        <div className="flex gap-8 mt-4">
          {[
            { label: 'Farmers', value: '12K+' },
            { label: 'Seed Varieties', value: '500+' },
            { label: 'States', value: '18' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-xl font-bold text-[#CEC382]">{s.value}</p>
              <p className="text-xs text-gray-400">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FarmerSection;