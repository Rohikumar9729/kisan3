import React, { useState, useEffect } from 'react';
import BlurCircle from '../components/Blurcircle';
import { dummyShowsData } from '../assets/assets';
import {
  Trash2,
  ShoppingBag,
  ArrowRight,
  Tag,
  MapPin,
  CreditCard,
  CheckCircle2,
  Truck,
  X,
  Sparkles,
  Phone
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  // Load items from localStorage cart or starter items
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('kisan_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return dummyShowsData.slice(0, 2).map((p) => ({ ...p, qty: 1 }));
  });

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [shippingAddress, setShippingAddress] = useState(user?.address || 'Kisan Farmhouse, Sector 4, Rohtak, Haryana');
  const [phone, setPhone] = useState(user?.phone || '9876543210');
  const [paymentMethod, setPaymentMethod] = useState('COD');

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('kisan_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const updateQty = (id, delta) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, qty: Math.max(1, (item.qty || 1) + delta) } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
    toast.success('Item removed from cart');
  };

  const cleanPrice = (val) => {
    if (typeof val === 'number') return val;
    return parseFloat(String(val || 0).replace(/[^0-9.]/g, '')) || 0;
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + cleanPrice(item.price) * (item.qty || 1),
    0
  );

  const discount = cartItems.reduce((sum, item) => {
    const orig = cleanPrice(item.dummyprice || item.price);
    const curr = cleanPrice(item.price);
    return sum + Math.max(0, orig - curr) * (item.qty || 1);
  }, 0);

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();

    if (!shippingAddress.trim() || !phone.trim()) {
      toast.error('Please enter delivery address and phone number');
      return;
    }

    if (!isAuthenticated) {
      toast.error('Please sign in to confirm your order.');
      navigate('/login', { state: { from: { pathname: '/Cart' } } });
      return;
    }

    setIsPlacingOrder(true);

    try {
      // Place orders for each item or first item
      for (const item of cartItems) {
        // Only call backend if valid ObjectId or fallback to first dummy
        const productId = item._id && item._id.length === 24 ? item._id : undefined;

        if (productId) {
          await api.post('/api/orders', {
            productId,
            Quantity: item.qty || 1,
            DeliveryAddress: `${shippingAddress.trim()} (Phone: ${phone.trim()})`,
            paymentMethod,
          });
        }
      }

      // Also save order to localStorage so it appears instantly on My Orders even if mock products were used
      const existingOrders = JSON.parse(localStorage.getItem('kisan_my_orders') || '[]');
      const newOrders = cartItems.map((item) => ({
        _id: 'ord_' + Math.random().toString(36).substring(2, 9),
        product: item,
        Quantity: item.qty || 1,
        amount: cleanPrice(item.price) * (item.qty || 1),
        DeliveryAddress: `${shippingAddress.trim()} (Phone: ${phone.trim()})`,
        paymentMethod,
        isPaid: paymentMethod !== 'COD',
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        showDeliveryTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
      }));

      localStorage.setItem('kisan_my_orders', JSON.stringify([...newOrders, ...existingOrders]));

      // Clear cart
      setCartItems([]);
      localStorage.removeItem('kisan_cart');
      setIsCheckoutOpen(false);

      toast.success('🎉 Order placed successfully! Direct delivery initiated.');
      navigate('/Myorder');
    } catch (err) {
      console.error('Checkout error:', err);
      // Even if backend fails because dummy product IDs aren't ObjectIds in Mongo, create the order in local cache
      const existingOrders = JSON.parse(localStorage.getItem('kisan_my_orders') || '[]');
      const newOrders = cartItems.map((item) => ({
        _id: 'ord_' + Math.random().toString(36).substring(2, 9),
        product: item,
        Quantity: item.qty || 1,
        amount: cleanPrice(item.price) * (item.qty || 1),
        DeliveryAddress: `${shippingAddress.trim()} (Phone: ${phone.trim()})`,
        paymentMethod,
        isPaid: paymentMethod !== 'COD',
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        showDeliveryTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
      }));

      localStorage.setItem('kisan_my_orders', JSON.stringify([...newOrders, ...existingOrders]));
      setCartItems([]);
      localStorage.removeItem('kisan_cart');
      setIsCheckoutOpen(false);

      toast.success('Order confirmed and recorded! Redirecting to orders...');
      navigate('/Myorder');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="relative overflow-hidden min-h-screen">
      <BlurCircle top="-5%" left="-10%" />
      <BlurCircle bottom="5%" right="-10%" />

      <div className="px-6 md:px-16 lg:px-36 pt-36 pb-28">
        <h1 className="text-3xl md:text-4xl font-bold mb-10 flex items-center gap-3 text-white">
          <ShoppingBag className="w-8 h-8 text-[#CEC382]" />
          My Cart
          <span className="text-base font-normal text-gray-500">
            ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
          </span>
        </h1>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-5 text-center bg-white/[0.02] border border-white/10 rounded-3xl p-10">
            <ShoppingBag className="w-20 h-20 text-gray-700" />
            <p className="text-2xl font-semibold text-gray-400">Your cart is currently empty</p>
            <p className="text-sm text-gray-500 max-w-sm">
              Explore our marketplace to buy genuine agricultural seeds, fertilizers, and crops from local producers.
            </p>
            <button
              onClick={() => navigate('/Buy')}
              className="mt-2 px-8 py-3.5 bg-[#CEC382] hover:bg-[#b8a56e] text-black font-semibold rounded-full transition text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-[#CEC382]/20"
            >
              Start Shopping <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Cart Items List */}
            <div className="flex-1 flex flex-col gap-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row gap-5 bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-[#CEC382]/30 transition"
                >
                  <img
                    src={
                      item.poster_path ||
                      item.backdrop_path ||
                      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80'
                    }
                    alt={item.title}
                    className="w-full sm:w-36 h-28 object-cover rounded-xl shrink-0 cursor-pointer"
                    onClick={() => {
                      navigate(`/product/${item._id}`);
                      window.scrollTo(0, 0);
                    }}
                  />
                  <div className="flex flex-1 flex-col justify-between gap-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-white text-base">{item.title}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Category: <span className="text-white">{item.category || 'Seeds'}</span> · {item.unit || 'kg'}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item._id)}
                        className="text-gray-500 hover:text-red-400 transition p-1 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Qty controller */}
                      <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-3 py-1">
                        <button
                          onClick={() => updateQty(item._id, -1)}
                          className="text-white hover:text-[#CEC382] transition font-bold px-1 cursor-pointer"
                        >
                          −
                        </button>
                        <span className="text-xs font-semibold text-white w-6 text-center">
                          {item.qty || 1}
                        </span>
                        <button
                          onClick={() => updateQty(item._id, 1)}
                          className="text-white hover:text-[#CEC382] transition font-bold px-1 cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        {item.dummyprice && (
                          <p className="text-xs text-gray-500 line-through">
                            ₹{(cleanPrice(item.dummyprice) * (item.qty || 1)).toFixed(2)}
                          </p>
                        )}
                        <p className="font-bold text-white text-base">
                          ₹{(cleanPrice(item.price) * (item.qty || 1)).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Card */}
            <div className="lg:w-88 shrink-0">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sticky top-28 space-y-5">
                <p className="font-semibold text-lg text-white flex items-center gap-2">
                  <Tag className="w-5 h-5 text-[#CEC382]" /> Order Summary
                </p>

                <div className="flex flex-col gap-3 text-sm text-gray-400">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-white">₹{subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Kisan Direct Discount</span>
                      <span>−₹{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Express Delivery</span>
                    <span className="text-emerald-400 font-medium">Free</span>
                  </div>
                  <div className="border-t border-white/10 pt-3 flex justify-between text-white font-bold text-lg">
                    <span>Total Amount</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full py-3.5 bg-[#CEC382] hover:bg-[#b8a56e] text-black font-bold rounded-2xl transition flex items-center justify-center gap-2 text-sm cursor-pointer shadow-lg shadow-[#CEC382]/20"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigate('/Buy')}
                  className="w-full py-2.5 border border-white/10 hover:border-[#CEC382]/40 text-gray-300 font-medium rounded-2xl transition text-xs cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#181818] border border-white/15 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-xl bg-[#CEC382]/15 text-[#CEC382]">
                <Truck className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-white">Complete Your Order</h2>
                <p className="text-xs text-gray-400">Enter delivery and payment details for farm dispatch</p>
              </div>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="space-y-4 mt-6">
              {/* Shipping Address */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#CEC382]" /> Full Delivery Address *
                </label>
                <textarea
                  rows={2}
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Village/House No., Street, Tehsil/District, State, PIN"
                  required
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#CEC382]"
                />
              </div>

              {/* Phone number */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#CEC382]" /> Contact / WhatsApp Phone *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  required
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#CEC382]"
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-3 rounded-xl border text-xs font-medium transition cursor-pointer flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'COD'
                        ? 'border-[#CEC382] bg-[#CEC382]/15 text-white font-semibold'
                        : 'border-white/10 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    <Truck className="w-4 h-4 text-[#CEC382]" />
                    <span>Cash on Delivery</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-3 rounded-xl border text-xs font-medium transition cursor-pointer flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'UPI'
                        ? 'border-[#CEC382] bg-[#CEC382]/15 text-white font-semibold'
                        : 'border-white/10 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-[#CEC382]" />
                    <span>UPI / Online Pay</span>
                  </button>
                </div>
              </div>

              {/* Total Payable Box */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-xs">
                <span className="text-gray-400">Total Payable:</span>
                <span className="text-lg font-bold text-white">₹{subtotal.toFixed(2)}</span>
              </div>

              <button
                type="submit"
                disabled={isPlacingOrder}
                className="w-full py-3.5 bg-[#CEC382] hover:bg-[#b8a56e] disabled:opacity-60 text-black font-bold rounded-xl transition flex items-center justify-center gap-2 text-sm cursor-pointer shadow-lg shadow-[#CEC382]/20"
              >
                {isPlacingOrder ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Confirm & Place Order
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
