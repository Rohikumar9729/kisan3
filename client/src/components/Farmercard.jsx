import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Star, ShoppingBag, Heart, Sparkles, ArrowRight } from 'lucide-react';
import api from '../lib/api';

const FarmerCard = ({ product }) => {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (!product) return null;

  const cleanPrice = (val) => {
    if (typeof val === 'number') return val;
    return parseFloat(String(val || 0).replace(/[^0-9.]/g, '')) || 0;
  };

  const rawPrice = cleanPrice(product.price);
  const rawDummy = cleanPrice(product.dummyprice);
  const discountPercent =
    rawDummy > rawPrice
      ? Math.round(((rawDummy - rawPrice) / rawDummy) * 100)
      : null;

  const handleAddToCart = async (e, navigateToCart = false) => {
    if (e && e.stopPropagation) e.stopPropagation();
    try {
      const token = localStorage.getItem('kisan_token');
      // If user is authenticated, save directly to MongoDB Cart
      if (token && product._id) {
        try {
          await api.post('/api/cart/add', { productId: product._id, qty: 1 });
        } catch (apiErr) {
          console.warn('Backend cart sync note:', apiErr.response?.data?.message || apiErr.message);
        }
      }

      const savedCart = JSON.parse(localStorage.getItem('kisan_cart') || '[]');
      const existingIdx = savedCart.findIndex((item) => String(item._id) === String(product._id));
      
      if (existingIdx > -1) {
        savedCart[existingIdx].qty = (savedCart[existingIdx].qty || 1) + 1;
      } else {
        savedCart.push({
          ...product,
          qty: 1,
          price: product.price || '450',
          dummyprice: product.dummyprice || '600',
        });
      }
      localStorage.setItem('kisan_cart', JSON.stringify(savedCart));
      window.dispatchEvent(new Event('cartUpdated'));

      toast.success(`${product.title} added to cart! 🛒`);
      if (navigateToCart) {
        navigate('/Cart');
      }
    } catch (err) {
      console.error(err);
      if (navigateToCart) navigate('/Cart');
    }
  };

  const toggleWishlist = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast.success(!isWishlisted ? 'Added to wishlist ❤️' : 'Removed from wishlist');
  };

  const imageSrc =
    product.backdrop_path ||
    product.poster_path ||
    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80';

  return (
    <div
      onClick={() => {
        navigate(`/product/${product._id}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
      className="group relative flex flex-col justify-between rounded-2xl p-3.5 
                 bg-[#111915]/80 hover:bg-[#15201b] 
                 border border-white/8 hover:border-[#CEC382]/35
                 transition-all duration-300 hover:-translate-y-1.5 
                 shadow-lg hover:shadow-2xl hover:shadow-black/60 cursor-pointer overflow-hidden"
    >
      {/* Top Media Container */}
      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-black/40 mb-3.5">
        <img
          src={imageSrc}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Gradient Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Category Pill */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-medium text-[#CEC382]">
          <Sparkles className="w-3 h-3 text-[#CEC382]" />
          <span>{product.category || 'Direct Produce'}</span>
        </div>

        {/* Discount Badge */}
        {discountPercent && discountPercent > 0 && (
          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-emerald-500/90 text-black text-[10px] font-bold tracking-wide shadow-sm">
            {discountPercent}% OFF
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={toggleWishlist}
          aria-label="Add to wishlist"
          className="absolute bottom-2.5 right-2.5 p-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-white/80 hover:text-white hover:bg-black/80 transition active:scale-90 cursor-pointer"
        >
          <Heart
            className={`w-3.5 h-3.5 transition-colors ${
              isWishlisted ? 'fill-rose-500 text-rose-500' : ''
            }`}
          />
        </button>
      </div>

      {/* Product Content Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-white group-hover:text-[#CEC382] transition-colors line-clamp-1">
              {product.title}
            </h3>
            <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/5 text-[11px] font-semibold text-[#CEC382] shrink-0">
              <Star className="w-3 h-3 fill-[#CEC382] text-[#CEC382]" />
              <span>{product.vote_average ? Number(product.vote_average).toFixed(1) : '4.8'}</span>
            </div>
          </div>

          {/* Seeds / Variety tags */}
          <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-400 truncate">
            {product.seed && Array.isArray(product.seed) && product.seed.length > 0 ? (
              <span className="truncate">
                {product.seed.slice(0, 2).map((s) => s.name || s).join(' · ')}
              </span>
            ) : (
              <span className="text-gray-400 text-[11px]">Direct Farm Harvest · 100% Pure</span>
            )}
          </div>
        </div>

        {/* Pricing row */}
        <div className="mt-3 pt-3 border-t border-white/5 flex items-baseline justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-white tracking-tight">
                {typeof product.price === 'string' && product.price.startsWith('₹')
                  ? product.price
                  : `₹${product.price}`}
              </span>
              {product.unit && (
                <span className="text-[11px] text-gray-400 font-normal">/{product.unit}</span>
              )}
            </div>
            {product.dummyprice && (
              <span className="text-[11px] text-gray-400 line-through">
                MRP: ₹{cleanPrice(product.dummyprice)}
              </span>
            )}
          </div>

          <div className="text-right text-[10px] text-emerald-400 font-medium">
            In Stock
          </div>
        </div>

        {/* Actions Row */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={(e) => handleAddToCart(e, false)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl 
                       bg-white/10 hover:bg-white/15 active:scale-95
                       text-xs font-semibold text-white border border-white/10 hover:border-[#CEC382]/50 
                       transition cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#CEC382]" />
            <span>Add to Cart</span>
          </button>

          <button
            type="button"
            onClick={(e) => handleAddToCart(e, true)}
            className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl 
                       bg-[#CEC382] hover:bg-[#b8a56e] active:scale-95 
                       text-xs font-bold text-[#0f1512] shadow-sm shadow-[#CEC382]/25 
                       transition cursor-pointer"
          >
            <span>Buy Now</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FarmerCard;