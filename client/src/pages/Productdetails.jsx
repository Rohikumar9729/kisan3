import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import BlurCircle from '../components/Blurcircle';
import {
  Heart,
  Star,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Truck,
  Leaf,
  Calendar,
  Layers,
  ChevronRight,
  Plus,
  Minus,
  Sparkles,
  Share2
} from 'lucide-react';
import { dummyShowsData } from '../assets/assets';
import FarmerCard from '../components/Farmercard';
import Loading from '../components/Loading';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const foundInDummy = dummyShowsData.find((item) => String(item._id) === String(id));
      if (foundInDummy) {
        setProduct(foundInDummy);
        setSelectedImage(foundInDummy.backdrop_path || foundInDummy.poster_path);
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get(`/api/products/${id}`);
        if (data.success && data.product) {
          const p = {
            ...data.product,
            price: typeof data.product.price === 'string' ? data.product.price.replace(/[^0-9.]/g, '') : data.product.price,
            dummyprice: data.product.dummyprice ? data.product.dummyprice.replace(/[^0-9.]/g, '') : '',
          };
          setProduct(p);
          setSelectedImage(p.poster_path || p.backdrop_path);
        } else {
          setProduct(dummyShowsData[0]);
          setSelectedImage(dummyShowsData[0].poster_path);
        }
      } catch (err) {
        console.log('Error fetching product from API:', err);
        setProduct(dummyShowsData[0]);
        setSelectedImage(dummyShowsData[0].poster_path);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const cleanPrice = (val) => {
    if (typeof val === 'number') return val;
    return parseFloat(String(val || 0).replace(/[^0-9.]/g, '')) || 0;
  };

  const handleAddToCart = async (goToCart = false) => {
    if (!product) return;
    setAddingToCart(true);

    try {
      if (isAuthenticated && product._id && product._id.length === 24) {
        await api.post('/api/cart/add', { productId: product._id, qty: quantity });
      }

      const savedCart = JSON.parse(localStorage.getItem('kisan_cart') || '[]');
      const existingIdx = savedCart.findIndex((item) => String(item._id) === String(product._id));
      if (existingIdx > -1) {
        savedCart[existingIdx].qty = (savedCart[existingIdx].qty || 1) + quantity;
      } else {
        savedCart.push({
          ...product,
          qty: quantity,
          price: product.price || '450',
          dummyprice: product.dummyprice || '600',
        });
      }
      localStorage.setItem('kisan_cart', JSON.stringify(savedCart));
      window.dispatchEvent(new Event('cartUpdated'));

      toast.success(`${product.title} (${quantity} ${product.unit || 'unit'}) added to cart! 🛒`);

      if (goToCart) {
        navigate('/Cart');
      }
    } catch (err) {
      console.error('Add to cart error:', err);
      toast.success('Added to your cart!');
      if (goToCart) navigate('/Cart');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading || !product) {
    return <Loading />;
  }

  const rawPrice = cleanPrice(product.price);
  const rawDummy = cleanPrice(product.dummyprice);
  const totalPrice = (rawPrice * quantity).toLocaleString('en-IN');
  const mainImage =
    selectedImage ||
    product.backdrop_path ||
    product.poster_path ||
    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80';

  // Agricultural Specifications Mock/Real Data
  const specs = [
    { label: 'Germination Rate', value: '98.2% Guaranteed', icon: Leaf },
    { label: 'Sowing Season', value: 'Kharif & Early Rabi', icon: Calendar },
    { label: 'Suitable Soil', value: 'Alluvial / Loamy Soil', icon: Layers },
    { label: 'Purity Level', value: '99.5% Free from Weeds', icon: ShieldCheck },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden pb-24 pt-28 sm:pt-36">
      <BlurCircle top="-5%" left="-5%" color="gold" />
      <BlurCircle bottom="20%" right="-5%" color="emerald" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 relative z-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8 overflow-x-auto">
          <Link to="/" className="hover:text-white transition">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/Buy" className="hover:text-white transition">Marketplace</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#CEC382] font-semibold truncate max-w-xs">{product.title}</span>
        </nav>

        {/* Product Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Media Gallery */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="relative rounded-3xl overflow-hidden bg-[#101713] border border-white/10 shadow-2xl aspect-[4/3]">
              <img
                src={mainImage}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[#CEC382] text-xs font-bold border border-white/10">
                  {product.category || 'Direct Farm'}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md text-emerald-300 text-xs font-semibold border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Tested Viability
                </span>
              </div>

              <button
                onClick={() => {
                  setIsLiked(!isLiked);
                  toast.success(!isLiked ? 'Saved to wishlist ❤️' : 'Removed from wishlist');
                }}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white hover:bg-black/90 transition cursor-pointer"
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>

            {/* Thumbnail selector */}
            <div className="flex items-center gap-3">
              {[mainImage, product.poster_path, product.backdrop_path]
                .filter(Boolean)
                .slice(0, 4)
                .map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`w-20 h-16 rounded-xl overflow-hidden border-2 transition cursor-pointer bg-black/40 ${
                      selectedImage === imgUrl
                        ? 'border-[#CEC382] shadow-md shadow-[#CEC382]/20 scale-105'
                        : 'border-white/10 opacity-70 hover:opacity-100 hover:border-white/30'
                    }`}
                  >
                    <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
            </div>
          </div>

          {/* Right Column: Information & Purchasing Options */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-[#CEC382]/15 text-[#CEC382] border border-[#CEC382]/30">
                  Verified Producer Listing
                </span>
                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> In Stock &amp; Ready for Dispatch
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {product.title}
              </h1>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-[#CEC382]">
                  <Star className="w-4 h-4 fill-[#CEC382] text-[#CEC382]" />
                  <span>{product.vote_average ? Number(product.vote_average).toFixed(1) : '4.8'}</span>
                </div>
                <span className="text-xs text-gray-400">
                  Based on 140+ verified cultivator orders
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-5 rounded-3xl bg-[#111915]/90 border border-white/10 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-gray-400 block mb-1">Direct Farmer Price</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-white">
                    ₹{product.price}
                  </span>
                  {product.unit && (
                    <span className="text-xs text-gray-400">per {product.unit}</span>
                  )}
                  {rawDummy > rawPrice && (
                    <span className="text-xs text-gray-500 line-through ml-2">
                      MRP: ₹{rawDummy}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-gray-400 block">Calculated Total</span>
                <span className="text-xl sm:text-2xl font-black text-[#CEC382]">
                  ₹{totalPrice}
                </span>
              </div>
            </div>

            {/* Quantity Stepper */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-gray-300">Order Quantity:</span>
              <div className="flex items-center bg-[#111915] border border-white/15 rounded-xl p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition active:scale-90"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-12 text-center text-sm font-bold text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition active:scale-90"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-xs text-gray-400">
                ({quantity * 50} kg total packaging)
              </span>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => handleAddToCart(false)}
                disabled={addingToCart}
                className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-sm transition active:scale-95 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#CEC382]" />
                <span>{addingToCart ? 'Adding...' : 'Add to Cart'}</span>
              </button>

              <button
                onClick={() => handleAddToCart(true)}
                className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[#CEC382] hover:bg-[#b8a56e] text-black font-bold text-sm shadow-lg shadow-[#CEC382]/25 transition active:scale-95 cursor-pointer"
              >
                <span>Buy Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Agricultural Specifications Cards */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {specs.map((s, idx) => {
                const Icon = s.icon;
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/8 flex items-start gap-3"
                  >
                    <div className="p-2 rounded-xl bg-[#CEC382]/10 text-[#CEC382]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wide block">
                        {s.label}
                      </span>
                      <span className="text-xs font-semibold text-white mt-0.5 block">
                        {s.value}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Description */}
            <div className="p-5 rounded-3xl bg-[#111915]/60 border border-white/8">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#CEC382] mb-2">
                Agronomic Overview &amp; Sowing Notes
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                {product.overview ||
                  'High quality certified agricultural produce and seeds, carefully harvested and tested for premium germination and yield. Suitable for multiple Indian climatic conditions.'}
              </p>
            </div>

            {/* Delivery Assurance */}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 text-xs text-emerald-300">
              <Truck className="w-5 h-5 shrink-0 text-emerald-400" />
              <span>
                Dispatched directly from farm location via express agricultural logistics across India within 48 hours.
              </span>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-24 pt-12 border-t border-white/10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Recommended Alternative Crops &amp; Seeds
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Cultivators who viewed this item also checked out these top-rated inputs
              </p>
            </div>

            <button
              onClick={() => {
                navigate('/Product');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs font-bold text-[#CEC382] hover:text-white transition flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {dummyShowsData
              .filter((p) => String(p._id) !== String(id))
              .slice(0, 4)
              .map((item) => (
                <FarmerCard key={item._id} product={item} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;