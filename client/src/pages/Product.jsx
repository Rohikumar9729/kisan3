import React, { useEffect, useState } from 'react';
import { dummyShowsData } from '../assets/assets';
import FarmerCard from '../components/Farmercard';
import BlurCircle from '../components/Blurcircle';
import api from '../lib/api';
import { Search, Sparkles } from 'lucide-react';

const CATEGORIES = ['All', 'Seeds', 'Grains', 'Fertilizers', 'Organic Produce', 'Tools & Equipment'];

const Product = () => {
  const [products, setProducts] = useState(dummyShowsData);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/api/products?limit=100');
        if (data.success && data.products?.length > 0) {
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

          const dbIds = new Set(dbProducts.map((p) => p._id));
          const filteredDummy = dummyShowsData.filter((d) => !dbIds.has(d._id));
          setProducts([...dbProducts, ...filteredDummy]);
        }
      } catch (err) {
        console.log('Using catalog fallback:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filtered = products.filter((p) => {
    const matchesCat =
      activeCategory === 'All' ||
      (p.category || 'Seeds').toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch =
      !search ||
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.overview?.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="relative min-h-screen overflow-visible pb-24">
      <BlurCircle top="-10%" left="-10%" />
      <BlurCircle bottom="-15%" right="-15%" />
      <BlurCircle top="40%" left="60%" />

      <div className="relative z-10 px-6 py-12 max-w-7xl mx-auto">
        <div className="pt-20 mb-8 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-semibold tracking-wider uppercase bg-[#CEC382]/15 text-[#CEC382] rounded-full">
            <Sparkles className="w-3.5 h-3.5" /> Full Agricultural Catalog
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white">Our Products</h1>
          <p className="text-gray-400 text-sm max-w-xl">
            Explore our curated inventory of certified seeds, organic fertilizers, quality compost, and farming essentials.
          </p>

          {/* Search bar & Category filters */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search wheat, seeds, fertilizers..."
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-full text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#CEC382] transition"
              />
            </div>

            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-[#CEC382] text-black font-semibold shadow-md shadow-[#CEC382]/20'
                      : 'bg-white/5 border border-white/10 text-gray-300 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filtered?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filtered.map((product) => (
              <FarmerCard key={product._id || product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 text-gray-500">
            <p className="text-xl font-semibold">No products matched your search.</p>
            <button
              onClick={() => {
                setSearch('');
                setActiveCategory('All');
              }}
              className="mt-4 px-5 py-2 text-xs font-semibold bg-white/10 text-white rounded-full hover:bg-white/20 transition"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;