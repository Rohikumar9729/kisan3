import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BlurCircle from '../components/Blurcircle';
import { Upload, Tag, FileText, IndianRupee, Leaf, CheckCircle, Sparkles, Image as ImageIcon, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

const categories = ['Seeds', 'Fertilizers', 'Pesticides', 'Tools & Equipment', 'Organic Produce', 'Grains', 'Other'];

const SAMPLE_IMAGES = [
  { label: 'Wheat', url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80' },
  { label: 'Rice', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80' },
  { label: 'Mustard', url: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=800&q=80' },
  { label: 'Tomatoes', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80' },
  { label: 'Compost', url: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=800&q=80' },
];

const Sell = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    category: 'Seeds',
    price: '',
    dummyprice: '',
    quantity: '',
    unit: 'kg',
    description: '',
    imageUrl: SAMPLE_IMAGES[0].url,
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please sign in to list your products.');
      navigate('/login', { state: { from: { pathname: '/Sell' } } });
      return;
    }

    if (!form.title || !form.category || !form.price || !form.quantity) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title: form.title.trim(),
        category: form.category,
        price: `₹${form.price.toString().replace(/[^0-9.]/g, '')}`,
        dummyprice: form.dummyprice ? `₹${form.dummyprice.toString().replace(/[^0-9.]/g, '')}` : '',
        quantity: Number(form.quantity),
        unit: form.unit,
        overview: form.description.trim(),
        poster_path: form.imageUrl.trim() || SAMPLE_IMAGES[0].url,
        backdrop_path: form.imageUrl.trim() || SAMPLE_IMAGES[0].url,
        tagline: 'Farmer Direct Produce',
        vote_average: 5.0,
        vote_count: 1,
      };

      const { data } = await api.post('/api/products', payload);

      if (data.success) {
        setSubmitted(true);
        toast.success('Your produce is now live on Kisan marketplace! 🌱');
      } else {
        toast.error(data.message || 'Failed to list product');
      }
    } catch (err) {
      console.error('Failed to list product:', err);
      toast.error(err.response?.data?.message || 'Could not list product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden min-h-screen">
      <BlurCircle top="-5%" left="-10%" />
      <BlurCircle bottom="5%" right="-10%" />

      {/* Header */}
      <section className="px-6 md:px-16 lg:px-36 pt-36 pb-10">
        <span className="inline-block px-4 py-1 text-xs font-semibold tracking-widest uppercase bg-[#CEC382]/15 text-[#CEC382] rounded-full mb-5">
          Sell on Kisan
        </span>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight max-w-xl">
          List Your <span className="text-[#CEC382]">Seeds & Produce</span>
        </h1>
        <p className="mt-4 text-gray-400 max-w-lg">
          Reach thousands of farmers directly. No middlemen. Keep 100% of what you earn with direct farmer payments.
        </p>

        {!isAuthenticated && (
          <div className="mt-6 p-4 rounded-2xl bg-[#CEC382]/10 border border-[#CEC382]/30 max-w-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <LogIn className="w-5 h-5 text-[#CEC382] shrink-0" />
              <p className="text-xs text-gray-300">
                You are currently browsing as a guest. Please sign in to list items under your farmer profile.
              </p>
            </div>
            <Link
              to="/login"
              state={{ from: { pathname: '/Sell' } }}
              className="px-4 py-2 bg-[#CEC382] text-black font-semibold rounded-xl text-xs whitespace-nowrap hover:bg-[#b8a56e] transition"
            >
              Sign In
            </Link>
          </div>
        )}
      </section>

      {/* Why Sell cards */}
      <section className="px-6 md:px-16 lg:px-36 pb-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: <Leaf className="w-5 h-5 text-[#CEC382]" />, title: 'Zero Commission', desc: 'Keep 100% of what you earn.' },
          { icon: <IndianRupee className="w-5 h-5 text-[#CEC382]" />, title: 'Direct Payment', desc: 'Get paid straight to your UPI or account.' },
          { icon: <Tag className="w-5 h-5 text-[#CEC382]" />, title: 'Set Your Price', desc: 'Fair decentralized agricultural trade.' },
        ].map((b) => (
          <div key={b.title} className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-[#CEC382]/40 transition">
            <div className="bg-[#CEC382]/10 rounded-xl p-2.5 shrink-0">{b.icon}</div>
            <div>
              <p className="font-semibold text-white text-sm">{b.title}</p>
              <p className="text-gray-500 text-xs mt-1">{b.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Form */}
      <section className="px-6 md:px-16 lg:px-36 pb-28">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 max-w-3xl shadow-xl">
          {submitted ? (
            <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Product Listed Successfully!</h2>
              <p className="text-gray-400 max-w-sm text-sm">
                Your produce is now live in the Kisan marketplace. Buyers across India can discover and order it.
              </p>
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={() => navigate('/Buy')}
                  className="px-6 py-2.5 bg-[#CEC382] hover:bg-[#b8a56e] text-black font-semibold rounded-full transition text-sm cursor-pointer"
                >
                  View Marketplace
                </button>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({
                      title: '',
                      category: 'Seeds',
                      price: '',
                      dummyprice: '',
                      quantity: '',
                      unit: 'kg',
                      description: '',
                      imageUrl: SAMPLE_IMAGES[0].url,
                    });
                  }}
                  className="px-6 py-2.5 border border-white/10 hover:border-white/30 text-white font-medium rounded-full transition text-sm cursor-pointer"
                >
                  List Another Product
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <p className="text-lg font-semibold flex items-center gap-2 text-white">
                <FileText className="w-5 h-5 text-[#CEC382]" /> Produce Information
              </p>

              {/* Sample Photo selector */}
              <div>
                <label className="text-xs text-gray-400 mb-2 block flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#CEC382]" /> Choose or paste photo:
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {SAMPLE_IMAGES.map((img) => (
                    <button
                      key={img.label}
                      type="button"
                      onClick={() => setForm({ ...form, imageUrl: img.url })}
                      className={`px-3 py-1.5 rounded-xl text-xs border transition cursor-pointer flex items-center gap-1.5 ${
                        form.imageUrl === img.url
                          ? 'border-[#CEC382] bg-[#CEC382]/20 text-[#CEC382] font-semibold'
                          : 'border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      <img src={img.url} alt={img.label} className="w-4 h-4 rounded object-cover" />
                      {img.label}
                    </button>
                  ))}
                </div>
                <input
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#CEC382]/50 transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Produce / Seed Title *</label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. Certified Sharbati Wheat Seeds"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#CEC382]/50 transition"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Category *</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#CEC382]/50 transition cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Price per Unit (₹) *</label>
                  <input
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="e.g. 450"
                    required
                    min="1"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#CEC382]/50 transition"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Market / MRP Price (₹)</label>
                  <input
                    name="dummyprice"
                    type="number"
                    value={form.dummyprice}
                    onChange={handleChange}
                    placeholder="e.g. 600"
                    min="1"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#CEC382]/50 transition"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Quantity Available *</label>
                  <input
                    name="quantity"
                    type="number"
                    value={form.quantity}
                    onChange={handleChange}
                    placeholder="e.g. 200"
                    required
                    min="1"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#CEC382]/50 transition"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Unit</label>
                  <select
                    name="unit"
                    value={form.unit}
                    onChange={handleChange}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#CEC382]/50 transition cursor-pointer"
                  >
                    {['kg', 'quintal', 'bag', 'pack', 'litre', 'piece'].map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">Description & Growing Tips</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe the seed variety, harvest time, moisture percentage, germination rate..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#CEC382]/50 transition resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 px-8 py-3.5 bg-[#CEC382] hover:bg-[#b8a56e] disabled:opacity-60 text-black font-semibold rounded-full transition self-start text-sm cursor-pointer shadow-lg shadow-[#CEC382]/20"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Publish Product to Marketplace
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default Sell;
