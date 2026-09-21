import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { dummyShowsData } from '../assets/assets';
import FarmerCard from '../components/Farmercard';
import BlurCircle from '../components/Blurcircle';
import api from '../lib/api';
import { Filter, Sparkles, Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const CATEGORIES = ['All', 'Seeds', 'Grains', 'Fertilizers', 'Tools & Equipment', 'Organic Produce'];

const Buy = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [products, setProducts] = useState(dummyShowsData);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [loading, setLoading] = useState(true);

  // Sync category state with URL search param if it changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setActiveCategory(cat);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/api/products?limit=50');
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

          setProducts(dbProducts);
        }
      } catch (err) {
        console.log('Using local catalog fallback:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const cleanPrice = (val) => {
    if (typeof val === 'number') return val;
    return parseFloat(String(val || 0).replace(/[^0-9.]/g, '')) || 0;
  };

  // Filter and sort products
  const filteredProducts = products
    .filter((p) => {
      const matchCat =
        activeCategory === 'All' ||
        (p.category || 'Seeds').toLowerCase() === activeCategory.toLowerCase();
      const matchQuery =
        !searchQuery ||
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.overview?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return cleanPrice(a.price) - cleanPrice(b.price);
      if (sortBy === 'price-high') return cleanPrice(b.price) - cleanPrice(a.price);
      if (sortBy === 'rating') return (b.vote_average || 4.8) - (a.vote_average || 4.8);
      return 0; // featured default
    });

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: cat });
    }
  };

  return (
    <div className="relative min-h-screen pb-24 overflow-hidden">
      <BlurCircle top="-5%" left="-5%" color="gold" />
      <BlurCircle bottom="10%" right="-5%" color="emerald" />

      <div className="relative z-10 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto pt-32 sm:pt-36">
        {/* Marketplace Banner Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold tracking-wider uppercase bg-[#CEC382]/15 text-[#CEC382] rounded-full mb-3 border border-[#CEC382]/30">
              <Sparkles className="w-3.5 h-3.5" /> Direct Farmer Marketplace
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Buy Verified Seeds &amp; Produce
            </h1>
            <p className="text-gray-400 text-sm mt-2 max-w-xl">
              Source certified germination seeds, farm-grown grain, and organic fertilizers directly from verified cultivators across India.
            </p>
          </div>

          <div className="text-xs text-gray-400 font-medium">
            Showing <span className="font-bold text-white">{filteredProducts.length}</span> Verified Products
          </div>
        </div>

        {/* Toolbar: Search, Categories, Sort */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8">
          {/* Search Input */}
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search wheat, seeds, compost..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#121a15] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:border-[#CEC382] transition"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
                  activeCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-[#CEC382] text-black shadow-md shadow-[#CEC382]/20'
                    : 'bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#CEC382]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#121a15] border border-white/10 text-gray-300 text-xs rounded-xl px-3 py-2 cursor-pointer focus:border-[#CEC382]"
            >
              <option value="featured">Sort: Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <FarmerCard key={product._id || product.id} product={product} />
              ))}
            </div>

            <div className="flex justify-center mt-16">
              <button
                onClick={() => {
                  navigate('/Product');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-8 py-3.5 rounded-full text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition cursor-pointer"
              >
                Explore Full Agricultural Catalog
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 rounded-3xl bg-[#111915]/60 border border-white/10 p-8">
            <p className="text-lg font-bold text-white">No products match your current filters.</p>
            <p className="text-xs text-gray-400 mt-1">Try clearing your search or switching categories.</p>
            <button
              onClick={() => {
                setActiveCategory('All');
                setSearchQuery('');
                setSearchParams({});
              }}
              className="mt-5 px-6 py-2.5 text-xs font-bold bg-[#CEC382] text-black rounded-full hover:bg-[#b8a56e] transition cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Buy;