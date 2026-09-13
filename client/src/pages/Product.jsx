import React, { useEffect, useState } from 'react';
import { dummyShowsData } from '../assets/assets';
import FarmerCard from '../components/Farmercard';
import BlurCircle from '../components/Blurcircle';
import api from '../lib/api';
import { Search, Sparkles, ArrowUpDown, Filter } from 'lucide-react';

const CATEGORIES = ['All', 'Seeds', 'Grains', 'Fertilizers', 'Tools & Equipment', 'Organic Produce'];

const Product = () => {
  const [products, setProducts] = useState(dummyShowsData);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
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

          const dbIds = new Set(dbProducts.map((p) => String(p._id)));
          const filteredDummy = dummyShowsData.filter((d) => !dbIds.has(String(d._id)));
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

  const cleanPrice = (val) => {
    if (typeof val === 'number') return val;
    return parseFloat(String(val || 0).replace(/[^0-9.]/g, '')) || 0;
  };

  const filtered = products
    .filter((p) => {
      const matchesCat =
        activeCategory === 'All' ||
        (p.category || 'Seeds').toLowerCase() === activeCategory.toLowerCase();
      const matchesSearch =
        !search ||
        p.title?.toLowerCase().includes(search.toLowerCase()) ||
        p.overview?.toLowerCase().includes(search.toLowerCase());
      return matchesCat && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return cleanPrice(a.price) - cleanPrice(b.price);
      if (sortBy === 'price-high') return cleanPrice(b.price) - cleanPrice(a.price);
      if (sortBy === 'rating') return (b.vote_average || 4.8) - (a.vote_average || 4.8);
      return 0;
    });

  return (
    <div className="relative min-h-screen overflow-hidden pb-24">
      <BlurCircle top="-5%" left="-10%" color="emerald" />
      <BlurCircle bottom="10%" right="-5%" color="gold" />

      <div className="relative z-10 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto pt-32 sm:pt-36">
        {/* Header Title */}
        <div className="mb-8 space-y-3 pb-6 border-b border-white/10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-semibold tracking-wider uppercase bg-[#CEC382]/15 text-[#CEC382] rounded-full border border-[#CEC382]/30">
            <Sparkles className="w-3.5 h-3.5" /> Full Agricultural Catalog
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Certified Crops, Seeds &amp; Farming Supplies
          </h1>
          <p className="text-gray-400 text-sm max-w-2xl">
            Explore verified listings from verified cultivators across India. All seeds are tested for germination viability and purity before dispatch.
          </p>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8">
          {/* Search bar */}
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search wheat, seeds, fertilizers..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#121a15] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:border-[#CEC382] transition"
            />
          </div>

          {/* Category pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
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

          {/* Sort selector */}
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

        {/* Product Cards Grid */}
        {filtered?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <FarmerCard key={product._id || product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 rounded-3xl bg-[#111915]/60 border border-white/10 p-8">
            <p className="text-lg font-bold text-white">No products matched your search or category.</p>
            <p className="text-xs text-gray-400 mt-1">Try adjusting keywords or selecting another category.</p>
            <button
              onClick={() => {
                setSearch('');
                setActiveCategory('All');
              }}
              className="mt-5 px-6 py-2.5 text-xs font-bold bg-[#CEC382] text-black rounded-full hover:bg-[#b8a56e] transition cursor-pointer"
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