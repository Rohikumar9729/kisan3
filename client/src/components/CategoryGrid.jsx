import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, Wheat, FlaskConical, Wrench, Apple, Shovel, Sparkles, ArrowRight } from 'lucide-react';

const CATEGORIES = [
  {
    id: 'Seeds',
    title: 'Certified Seeds',
    count: '250+ Varieties',
    desc: 'Hybrid & desi seeds with 98%+ germination guarantee.',
    icon: Sprout,
    badge: 'Popular',
    color: 'from-amber-500/20 to-emerald-500/10',
    iconColor: 'text-[#CEC382]',
  },
  {
    id: 'Grains',
    title: 'Organic Grains',
    count: '120+ Strains',
    desc: 'Pure basmati rice, sharbati wheat, millet & pulses.',
    icon: Wheat,
    badge: 'Direct Farm',
    color: 'from-yellow-500/20 to-orange-500/10',
    iconColor: 'text-amber-400',
  },
  {
    id: 'Fertilizers',
    title: 'Bio-Fertilizers',
    count: '80+ Products',
    desc: '100% natural vermicompost, cow dung manure & neem cake.',
    icon: FlaskConical,
    badge: 'Eco Friendly',
    color: 'from-emerald-500/20 to-teal-500/10',
    iconColor: 'text-emerald-400',
  },
  {
    id: 'Tools & Equipment',
    title: 'Farming Equipment',
    count: '45+ Tools',
    desc: 'Seed sprayers, manual weeders, drip kits & hand tools.',
    icon: Wrench,
    badge: 'Durable',
    color: 'from-blue-500/20 to-indigo-500/10',
    iconColor: 'text-blue-400',
  },
  {
    id: 'Organic Produce',
    title: 'Fresh Farm Harvest',
    count: '60+ Crops',
    desc: 'Direct harvest onions, garlic, potatoes & seasonal veggies.',
    icon: Apple,
    badge: 'Pesticide Free',
    color: 'from-rose-500/20 to-pink-500/10',
    iconColor: 'text-rose-400',
  },
];

const CategoryGrid = () => {
  const navigate = useNavigate();

  const handleSelectCategory = (catName) => {
    navigate(`/Buy?category=${encodeURIComponent(catName)}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-16 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CEC382]/15 border border-[#CEC382]/30 text-[#CEC382] text-xs font-semibold uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Marketplace Catalog</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Explore by Agricultural Category
          </h2>
          <p className="text-gray-400 text-sm mt-1.5 max-w-lg">
            Certified inputs and harvested crops directly listed by fellow cultivators across India.
          </p>
        </div>

        <button
          onClick={() => {
            navigate('/Product');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#CEC382] hover:text-white group transition"
        >
          <span>View All 500+ Items</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id)}
              className="group relative flex flex-col justify-between p-5 rounded-2xl 
                         bg-[#101713]/80 hover:bg-[#15211b]
                         border border-white/8 hover:border-[#CEC382]/40 
                         transition-all duration-300 hover:-translate-y-1.5 
                         shadow-lg hover:shadow-xl hover:shadow-black/50 cursor-pointer overflow-hidden"
            >
              {/* Top ambient hover glow */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}
              />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                    <Icon className={`w-5 h-5 ${cat.iconColor}`} />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-gray-300 border border-white/10">
                    {cat.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-[#CEC382] transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-gray-400 mt-1.5 leading-relaxed line-clamp-2">
                  {cat.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-[11px] font-semibold text-[#CEC382]">{cat.count}</span>
                <span className="text-gray-400 group-hover:text-white group-hover:translate-x-1 transition flex items-center gap-0.5">
                  Explore →
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CategoryGrid;
