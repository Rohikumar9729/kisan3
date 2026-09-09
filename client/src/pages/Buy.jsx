import React, { useEffect, useState } from 'react';
import { dummyShowsData } from '../assets/assets';
import FarmerCard from '../components/Farmercard';
import BlurCircle from '../components/Blurcircle';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Filter, Sparkles } from 'lucide-react';

const CATEGORIES = ['All', 'Seeds', 'Grains', 'Fertilizers', 'Organic Produce', 'Tools & Equipment'];

const Buy = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState(dummyShowsData);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/api/products?limit=50');
        if (data.success && data.products?.length > 0) {
          // Put newly added database products first, then existing starter demo products
          const dbProducts = data.products.map((p) => ({
            ...p,
            _id: p._id,
            title: p.title,
            poster_path: p.poster_path || p.backdrop_path,
            price: typeof p.price === 'string' ? p.price.replace(/[^0-9.]/g, '') : p.price,
            dummyprice: p.dummyprice ? p.dummyprice.replace(/[^0-9.]/g, '') : '',
            vote_average: p.vote_average || 4.8,
            category: p.category || 'Seeds',
          }));

          // Avoid duplicates
          const dbIds = new Set(dbProducts.map((p) => p._id));
          const filteredDummy = dummyShowsData.filter((d) => !dbIds.has(d._id));
          setProducts([...dbProducts, ...filteredDummy]);
        }
      } catch (err) {
        console.log('Using local catalog fallback:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter((p) => (p.category || 'Seeds').toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="relative min-h-screen overflow-visible pb-24">
      <BlurCircle top="-10%" left="-10%" />
      <BlurCircle bottom="-15%" right="-15%" />
      <BlurCircle top="40%" left="60%" />

      <div className="relative z-10 px-6 py-12 max-w-7xl mx-auto">
        <div className="pt-20 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-semibold tracking-wider uppercase bg-[#CEC382]/15 text-[#CEC382] rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Direct Farmer Marketplace
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white">Buy Verified Seeds & Crops</h1>
            <p className="text-gray-400 text-sm mt-2 max-w-lg">
              Purchase genuine agricultural seeds, organic fertilizers, and fresh farm harvests directly from verified producers.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#CEC382] text-black font-semibold shadow-md shadow-[#CEC382]/20'
                    : 'bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filteredProducts?.length > 0 ? (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <FarmerCard key={product._id || product.id} product={product} />
              ))}
            </div>

            <div className="flex justify-center mt-16">
              <button
                onClick={() => {
                  navigate('/product');
                  window.scrollTo(0, 0);
                }}
                className="px-10 py-3 text-sm bg-[#CEC382] hover:bg-[#b8a56e] text-black transition rounded-full font-semibold cursor-pointer shadow-lg shadow-[#CEC382]/20"
              >
                View Full Catalog
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-24 text-gray-500">
            <p className="text-xl font-semibold">No products found in this category.</p>
            <button
              onClick={() => setActiveCategory('All')}
              className="mt-4 px-5 py-2 text-xs font-semibold bg-white/10 text-white rounded-full hover:bg-white/20 transition"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Buy;