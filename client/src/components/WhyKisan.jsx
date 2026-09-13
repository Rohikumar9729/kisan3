import React from 'react';
import { ShieldCheck, Coins, Truck, Users } from 'lucide-react';

const PILLARS = [
  {
    icon: Coins,
    title: 'Direct Farmer Pricing',
    desc: '0% Middleman cuts. Buyers get genuine wholesale agricultural rates while farmers earn up to 35% higher profits.',
    badge: 'Fair Trade',
    color: 'text-[#CEC382]',
    bgGlow: 'from-[#CEC382]/10 to-transparent',
  },
  {
    icon: ShieldCheck,
    title: 'Certified Germination',
    desc: 'Every listed seed batch undergoes certified viability checks to guarantee 95%+ germination rate.',
    badge: 'Lab Verified',
    color: 'text-emerald-400',
    bgGlow: 'from-emerald-500/10 to-transparent',
  },
  {
    icon: Truck,
    title: 'Direct Farm Logistics',
    desc: 'Safe heavy-produce logistics with doorstep farm delivery, moisture-proof packaging, and real-time tracking.',
    badge: 'Pan-India',
    color: 'text-blue-400',
    bgGlow: 'from-blue-500/10 to-transparent',
  },
  {
    icon: Users,
    title: 'Farmer Community Network',
    desc: 'Over 12,000 active growers exchanging surplus seeds, pest management advice, and seasonal cropping insights.',
    badge: 'Community',
    color: 'text-amber-400',
    bgGlow: 'from-amber-500/10 to-transparent',
  },
];

const WhyKisan = () => {
  return (
    <section className="py-20 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Built Specifically for Indian Agriculture
        </h2>
        <p className="text-gray-400 text-sm mt-2">
          Eliminating middlemen and empowering cultivators with transparent technology, secure payments, and verified quality.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PILLARS.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div
              key={idx}
              className="relative p-6 rounded-3xl bg-[#111915]/80 hover:bg-[#14201a] border border-white/8 hover:border-[#CEC382]/30 transition-all duration-300 hover:-translate-y-2 shadow-xl hover:shadow-2xl overflow-hidden group"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${p.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}
              />

              <div className="flex items-center justify-between mb-5">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                  <Icon className={`w-6 h-6 ${p.color}`} />
                </div>
                <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10">
                  {p.badge}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-[#CEC382] transition-colors mb-2">
                {p.title}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                {p.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default WhyKisan;
