import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BlurCircle from '../components/Blurcircle';
import { Heart, PlayCircleIcon, StarIcon, ShoppingBag, ArrowRight, ShieldCheck, Check } from 'lucide-react';
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
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      // First check in dummyShowsData
      const foundInDummy = dummyShowsData.find((item) => String(item._id) === String(id));
      if (foundInDummy) {
        setProduct(foundInDummy);
        setLoading(false);
        return;
      }

      // If not in dummy, fetch from MongoDB API
      try {
        const { data } = await api.get(`/api/products/${id}`);
        if (data.success && data.product) {
          setProduct({
            ...data.product,
            price: typeof data.product.price === 'string' ? data.product.price.replace(/[^0-9.]/g, '') : data.product.price,
            dummyprice: data.product.dummyprice ? data.product.dummyprice.replace(/[^0-9.]/g, '') : '',
          });
        } else {
          // Fallback to first dummy product if not found
          setProduct(dummyShowsData[0]);
        }
      } catch (err) {
        console.log('Error fetching product from API:', err);
        setProduct(dummyShowsData[0]);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAddingToCart(true);

    try {
      if (isAuthenticated && product._id && product._id.length === 24) {
        // Authenticated and valid MongoDB ObjectId
        await api.post('/api/cart/add', { productId: product._id, qty: 1 });
      }

      // Save to localStorage cart as well for instant UI response
      const savedCart = JSON.parse(localStorage.getItem('kisan_cart') || '[]');
      const existingIdx = savedCart.findIndex((item) => item._id === product._id);
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

      toast.success(`${product.title || 'Product'} added to cart! 🛒`);
    } catch (err) {
      console.error('Add to cart error:', err);
      toast.success('Added to your cart!');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/Cart');
  };

  if (loading || !product) {
    return <Loading />;
  }

  const posterImg =
    product.poster_path ||
    product.backdrop_path ||
    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="px-6 md:px-16 lg:px-40 pt-28 md:pt-36 pb-24">
      <div className="flex flex-col md:flex-row gap-10 max-w-6xl mx-auto">
        {/* Product Image & Thumbnails */}
        <div className="shrink-0 md:w-1/2">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black/40">
            <img
              src={posterImg}
              alt={product.title}
              className="w-full h-80 sm:h-96 md:h-[420px] object-cover"
            />
            {product.category && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-black/70 backdrop-blur-md text-[#CEC382] text-xs font-semibold rounded-full border border-white/10">
                {product.category}
              </span>
            )}
          </div>

          <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Quality Inspection Gallery
          </p>
          <div className="flex flex-row gap-3 mt-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="border border-white/10 hover:border-[#CEC382] rounded-xl overflow-hidden w-20 h-16 cursor-pointer transition"
              >
                <img
                  src={posterImg}
                  alt="Gallery thumb"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details Column */}
        <div className="relative flex flex-col gap-4 flex-1">
          <BlurCircle top="-100px" left="-100px" />

          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full text-xs font-medium bg-[#CEC382]/15 text-[#CEC382] border border-[#CEC382]/30">
              Verified Farmer Certified
            </span>
            <span className="text-xs text-gray-500">· Stock: {product.quantity || 100} {product.unit || 'kg'} available</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            {product.title || product.name || 'Organic Agricultural Product'}
          </h1>

          <div className="flex items-center gap-2 text-gray-300">
            <StarIcon className="w-5 h-5 text-[#CEC382] fill-[#CEC382]" />
            <span className="text-base font-semibold text-white">
              {product.vote_average ? Number(product.vote_average).toFixed(1) : '4.8'}
            </span>
            <span className="text-xs text-gray-400">
              ({product.vote_count || 12} Verified Reviews)
            </span>
          </div>

          <p className="text-gray-300 text-sm leading-relaxed max-w-2xl">
            {product.overview ||
              product.description ||
              'High quality certified agricultural produce and seeds, carefully harvested and tested for premium germination and yield.'}
          </p>

          {/* Seed varieties if available */}
          {product.seed && product.seed.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-gray-400">Varieties:</span>
              {product.seed.map((s, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs rounded-lg bg-white/5 border border-white/10 text-gray-300"
                >
                  {s.name || s}
                </span>
              ))}
            </div>
          )}

          {/* Price Box */}
          <div className="mt-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-baseline gap-3">
            {product.dummyprice && (
              <span className="text-gray-500 line-through text-sm">
                ₹{product.dummyprice}
              </span>
            )}
            <span className="text-3xl font-bold text-white">
              ₹{product.price}
            </span>
            <span className="text-xs text-gray-400">
              per {product.unit || 'kg'} (incl. all taxes)
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center flex-wrap gap-4 mt-2">
            <button
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="px-6 py-3 text-sm bg-white/10 hover:bg-white/20 border border-white/20 hover:border-[#CEC382] text-white transition rounded-full font-semibold cursor-pointer flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 text-[#CEC382]" />
              {addingToCart ? 'Adding...' : 'Add to Cart'}
            </button>

            <button
              onClick={handleBuyNow}
              className="px-7 py-3 text-sm bg-[#CEC382] hover:bg-[#b8a56e] text-black transition rounded-full font-semibold cursor-pointer flex items-center gap-2 shadow-lg shadow-[#CEC382]/20"
            >
              Buy Now <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setIsLiked(!isLiked);
                toast.success(!isLiked ? 'Saved to wishlist!' : 'Removed from wishlist');
              }}
              className={`p-3 rounded-full border transition cursor-pointer active:scale-95 ${
                isLiked
                  ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-500' : ''}`} />
            </button>
          </div>

          {/* Quality Guarantee badge */}
          <div className="flex items-center gap-3 pt-4 border-t border-white/10 text-xs text-gray-400">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>100% Quality & Germination Guarantee · Fast Express Dispatch Across India</span>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="mt-24">
        <h2 className="text-2xl font-bold text-white mb-8">Related Produce & Seeds</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {dummyShowsData.slice(0, 4).map((item, index) => (
            <FarmerCard key={index} product={item} />
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <button
            onClick={() => {
              navigate('/product');
              window.scrollTo(0, 0);
            }}
            className="px-8 py-3 text-sm bg-[#CEC382] hover:bg-[#b8a56e] text-black transition rounded-full font-semibold cursor-pointer shadow-md shadow-[#CEC382]/20"
          >
            Show More Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;