import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Title from '../../components/admin/Title';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import {
  PackagePlus,
  Image as ImageIcon,
  IndianRupee,
  Layers,
  FileText,
  Tag,
  Sparkles,
  ArrowRight,
  Eye,
  Check
} from 'lucide-react';

const CATEGORIES = [
  'Seeds',
  'Grains',
  'Fertilizers',
  'Pesticides',
  'Organic Produce',
  'Tools & Equipment',
  'Fruits',
  'Vegetables'
];

const SAMPLE_PRESETS = [
  {
    name: 'Wheat Seeds',
    title: 'HD-2967 High Yield Wheat Seeds',
    category: 'Seeds',
    price: '450',
    dummyprice: '600',
    quantity: 100,
    unit: 'kg',
    tagline: 'Disease Resistant & High Protein',
    overview: 'Premium certified wheat seeds offering exceptional yield, rust resistance, and high milling quality for Indian soil conditions.',
    poster_path: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
    seed: 'PBW-343, Sharbati, Desi'
  },
  {
    name: 'Basmati Rice',
    title: 'Pusa 1121 Extra Long Grain Basmati',
    category: 'Seeds',
    price: '950',
    dummyprice: '1200',
    quantity: 80,
    unit: 'kg',
    tagline: 'Aromatic & Export Quality',
    overview: 'World renowned traditional basmati paddy seeds with exceptional elongation ratio and heavenly aroma after cooking.',
    poster_path: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    seed: 'Pusa-1121, 1509, Sugandha'
  },
  {
    name: 'Organic Compost',
    title: '100% Pure Vermicompost Bio-Fertilizer',
    category: 'Fertilizers',
    price: '320',
    dummyprice: '450',
    quantity: 250,
    unit: 'bag',
    tagline: 'Enriched with Micro-nutrients',
    overview: 'Odorless, weed-free organic vermicompost that dramatically enhances soil water retention and microbial activity.',
    poster_path: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=800&q=80',
    seed: 'Organic, Nitrogen Rich, Earthworm'
  },
  {
    name: 'Mustard Seeds',
    title: 'Yellow Mustard High-Oil Variety',
    category: 'Seeds',
    price: '280',
    dummyprice: '350',
    quantity: 150,
    unit: 'kg',
    tagline: '42% Oil Content Variety',
    overview: 'Certified bold yellow sarson seeds with high resistance to aphids and alternaria blight.',
    poster_path: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=800&q=80',
    seed: 'Pusa Bold, Kranti, Giriraj'
  }
];

const Addproduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Seeds',
    price: '',
    dummyprice: '',
    quantity: '',
    unit: 'kg',
    tagline: '',
    overview: '',
    poster_path: '',
    backdrop_path: '',
    seedVarieties: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const applyPreset = (preset) => {
    setFormData({
      title: preset.title,
      category: preset.category,
      price: preset.price,
      dummyprice: preset.dummyprice,
      quantity: preset.quantity,
      unit: preset.unit,
      tagline: preset.tagline,
      overview: preset.overview,
      poster_path: preset.poster_path,
      backdrop_path: preset.poster_path,
      seedVarieties: preset.seed
    });
    toast.success(`Preset "${preset.name}" loaded!`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.price || !formData.quantity) {
      toast.error('Please fill in title, price, and quantity');
      return;
    }

    setLoading(true);

    try {
      const seedArray = formData.seedVarieties
        ? formData.seedVarieties.split(',').map((s, idx) => ({ id: idx + 1, name: s.trim() }))
        : [];

      const payload = {
        title: formData.title.trim(),
        category: formData.category,
        price: `₹${formData.price.toString().replace(/[^0-9.]/g, '')}`,
        dummyprice: formData.dummyprice ? `₹${formData.dummyprice.toString().replace(/[^0-9.]/g, '')}` : '',
        quantity: Number(formData.quantity) || 0,
        unit: formData.unit || 'kg',
        tagline: formData.tagline.trim(),
        overview: formData.overview.trim(),
        poster_path: formData.poster_path.trim() || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
        backdrop_path: formData.backdrop_path.trim() || formData.poster_path.trim() || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
        seed: seedArray,
        vote_average: 4.8,
        vote_count: 1
      };

      const { data } = await api.post('/api/products', payload);

      if (data.success) {
        toast.success('Product listed successfully in the Kisan catalog! 🌾');
        navigate('/admin');
      } else {
        toast.error(data.message || 'Failed to create product');
      }
    } catch (err) {
      console.error('Error creating product:', err);
      const msg = err.response?.data?.message || err.message || 'Error saving product';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <Title text1="Add" text2="Product" />
          <p className="text-gray-400 text-sm mt-1">
            Create a new seed, crop, or agricultural equipment listing for the Kisan marketplace.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/admin')}
          className="px-4 py-2 text-xs font-medium rounded-xl border border-white/10 hover:border-[#CEC382] text-gray-300 hover:text-white transition"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Quick sample presets */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#CEC382] mb-3">
          <Sparkles className="w-4 h-4" /> Quick Demo Presets (Click to autofill):
        </div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => applyPreset(p)}
              className="px-3 py-1.5 bg-white/5 hover:bg-[#CEC382]/20 border border-white/10 hover:border-[#CEC382] rounded-lg text-xs text-gray-300 hover:text-white transition cursor-pointer"
            >
              + {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Container */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <PackagePlus className="w-5 h-5 text-[#CEC382]" /> Basic Product Details
            </h2>

            {/* Product Title */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">
                Product Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Certified Sharbati Wheat Seeds (Season 2025)"
                required
                className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 focus:border-[#CEC382] rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none transition"
              />
            </div>

            {/* Category and Units */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-2">
                  Category
                </label>
                <div className="relative">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#1e1e1e] border border-white/10 focus:border-[#CEC382] rounded-xl text-sm text-white focus:outline-none transition cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-2">
                  Measurement Unit
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#1e1e1e] border border-white/10 focus:border-[#CEC382] rounded-xl text-sm text-white focus:outline-none transition cursor-pointer"
                >
                  <option value="kg">Kilogram (kg)</option>
                  <option value="quintal">Quintal (q)</option>
                  <option value="bag">Bag / Sack</option>
                  <option value="packet">Packet / Pouch</option>
                  <option value="liter">Liter (L)</option>
                  <option value="piece">Piece / Unit</option>
                </select>
              </div>
            </div>

            {/* Price and Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-2">
                  Selling Price (₹) <span className="text-red-400">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-gray-400 text-sm font-semibold">₹</span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="450"
                    required
                    min="1"
                    className="w-full pl-8 pr-4 py-3 bg-white/[0.05] border border-white/10 focus:border-[#CEC382] rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-2">
                  Original / MRP (₹)
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-gray-400 text-sm font-semibold">₹</span>
                  <input
                    type="number"
                    name="dummyprice"
                    value={formData.dummyprice}
                    onChange={handleChange}
                    placeholder="600"
                    min="1"
                    className="w-full pl-8 pr-4 py-3 bg-white/[0.05] border border-white/10 focus:border-[#CEC382] rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-2">
                  Stock Quantity <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="100"
                  required
                  min="1"
                  className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 focus:border-[#CEC382] rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none transition"
                />
              </div>
            </div>

            {/* Tagline */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">
                Highlight / Tagline
              </label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                placeholder="e.g. 100% Certified Organic · High Germination Rate (98%)"
                className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 focus:border-[#CEC382] rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none transition"
              />
            </div>

            {/* Seed Varieties */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">
                Varieties / Sub-types (Comma separated)
              </label>
              <input
                type="text"
                name="seedVarieties"
                value={formData.seedVarieties}
                onChange={handleChange}
                placeholder="e.g. Desi, Sharbati, Hybrid-F1"
                className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 focus:border-[#CEC382] rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none transition"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">
                Image / Poster URL
              </label>
              <div className="relative flex items-center">
                <ImageIcon className="w-5 h-5 text-gray-500 absolute left-4 pointer-events-none" />
                <input
                  type="url"
                  name="poster_path"
                  value={formData.poster_path}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full pl-12 pr-4 py-3 bg-white/[0.05] border border-white/10 focus:border-[#CEC382] rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none transition"
                />
              </div>
            </div>

            {/* Description / Overview */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">
                Detailed Description / Cultivation Tips
              </label>
              <textarea
                rows={4}
                name="overview"
                value={formData.overview}
                onChange={handleChange}
                placeholder="Explain the germination period, soil requirement, recommended fertilizer, and yield expectations..."
                className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 focus:border-[#CEC382] rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-2xl font-bold text-black bg-[#CEC382] hover:bg-[#b8a56e] disabled:opacity-60 transition flex items-center justify-center gap-2 shadow-lg shadow-[#CEC382]/20 cursor-pointer text-base"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                <Check className="w-5 h-5" /> Publish Product to Catalog
              </>
            )}
          </button>
        </form>

        {/* Live Card Preview */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
            <Eye className="w-4 h-4 text-[#CEC382]" /> Live Marketplace Preview
          </div>

          <div className="bg-[#191919] border border-white/10 rounded-2xl overflow-hidden shadow-xl sticky top-24">
            <div className="relative h-48 bg-gray-800 overflow-hidden">
              <img
                src={
                  formData.poster_path ||
                  'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80'
                }
                alt="Product Preview"
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                onError={(e) => {
                  e.target.src =
                    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80';
                }}
              />
              <span className="absolute top-3 right-3 px-2.5 py-1 bg-black/70 backdrop-blur-md text-[#CEC382] text-xs font-semibold rounded-full">
                {formData.category}
              </span>
            </div>

            <div className="p-5 space-y-3">
              <h3 className="font-semibold text-white text-base line-clamp-1">
                {formData.title || 'Product Title Appears Here'}
              </h3>

              {formData.tagline && (
                <p className="text-xs text-[#CEC382] line-clamp-1 font-medium">
                  {formData.tagline}
                </p>
              )}

              <p className="text-xs text-gray-400 line-clamp-2">
                {formData.overview || 'Enter a description to see how it looks to buyers on Kisan...'}
              </p>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <div>
                  {formData.dummyprice && (
                    <span className="text-xs text-gray-500 line-through mr-2">
                      ₹{formData.dummyprice}
                    </span>
                  )}
                  <span className="text-lg font-bold text-white">
                    ₹{formData.price || '0'}
                  </span>
                  <span className="text-xs text-gray-400">/{formData.unit}</span>
                </div>

                <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                  Stock: {formData.quantity || '0'} {formData.unit}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Addproduct;
