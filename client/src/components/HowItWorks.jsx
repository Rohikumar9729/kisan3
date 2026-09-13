import React from 'react';
import { Search, ShoppingCart, Truck, Sprout, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STEPS = [
  {
    step: '01',
    title: 'Browse or List Produce',
    desc: 'Farmers list surplus seeds, harvested crops, or organic fertilizers in 60 seconds with clear pricing & photos.',
    icon: Sprout,
  },
  {
    step: '02',
    title: 'Direct Connection & Escrow',
    desc: 'Buyers place orders directly without broker commissions. Funds remain safe in escrow until delivery is verified.',
    icon: ShoppingCart,
  },
  {
    step: '03',
    title: 'Doorstep Farm Delivery',
    desc: 'Inspected produce is dispatched with express rural logistics directly to your farm gate or collection center.',
    icon: Truck,
  },
];

const HowItWorks = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto">
      <div className="rounded-3xl p-8 sm:p-12 lg:p-16 bg-[#111814]/90 border border-white/10 relative overflow-hidden shadow-2xl">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#CEC382]/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#CEC382] px-3 py-1 rounded-full bg-[#CEC382]/15 border border-[#CEC382]/30 inline-block mb-3">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              How Kisan Direct Marketplace Works
            </h2>
            <p className="text-gray-400 text-sm mt-2 max-w-xl">
              From farmer seedbeds to your harvest field — a frictionless agricultural trade ecosystem.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                navigate('/Buy');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3 rounded-full text-xs font-bold bg-[#CEC382] text-black hover:bg-[#b8a56e] transition active:scale-95 cursor-pointer shadow-md shadow-[#CEC382]/20"
            >
              Start Buying
            </button>
            <button
              onClick={() => {
                navigate('/Sell');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3 rounded-full text-xs font-semibold text-white border border-white/20 hover:bg-white/5 transition active:scale-95 cursor-pointer"
            >
              Start Selling
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="relative flex flex-col p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-[#CEC382]/30 transition group"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-[#CEC382]" />
                  </div>
                  <span className="text-2xl font-black text-gray-500 font-mono">
                    {s.step}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#CEC382] transition-colors">
                  {s.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
