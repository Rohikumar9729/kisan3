import React, { useEffect, useState } from 'react';
import Title from '../../components/admin/Title';
import Loading from '../../components/Loading';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import {
  Sprout,
  User,
  Phone,
  Mail,
  Calendar,
  IndianRupee,
  Package,
  Trash2,
  CheckCircle2,
  ExternalLink,
  Search,
  MapPin
} from 'lucide-react';

const SellRequests = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchSellRequests = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/products?limit=100');
      if (data.success && data.products) {
        // Filter to products that have seller information or were submitted to sell
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Error fetching sell requests:', err);
      toast.error('Failed to load client sell requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellRequests();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this client listing?')) return;

    try {
      const { data } = await api.delete(`/api/products/${id}`);
      if (data.success) {
        toast.success('Listing removed successfully');
        setProducts((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      toast.error(err.response?.data?.message || 'Failed to delete listing');
    }
  };

  const filtered = products.filter((p) => {
    const term = search.toLowerCase();
    const matchesTitle = p.title?.toLowerCase().includes(term);
    const matchesSeller = p.seller?.name?.toLowerCase().includes(term) || p.seller?.email?.toLowerCase().includes(term);
    const matchesCat = p.category?.toLowerCase().includes(term);
    return !search || matchesTitle || matchesSeller || matchesCat;
  });

  return loading ? (
    <Loading />
  ) : (
    <div className="max-w-6xl mx-auto pb-16 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Title text1="Client" text2="Sell Requests" />
          <p className="text-gray-400 text-sm mt-1">
            Produce, crops, and seeds submitted by registered farmers and clients to sell on Kisan.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search produce or farmer name..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#CEC382] transition"
          />
        </div>
      </div>

      {/* Overview Stat Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/[0.03] border border-white/10 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium">Total Items to Sell</p>
            <p className="text-2xl font-bold text-white mt-1">{products.length}</p>
          </div>
          <div className="p-3 bg-[#CEC382]/15 rounded-xl text-[#CEC382]">
            <Sprout className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium">Active Farmers / Sellers</p>
            <p className="text-2xl font-bold text-white mt-1">
              {new Set(products.map((p) => p.seller?._id || p.seller || 'direct')).size}
            </p>
          </div>
          <div className="p-3 bg-emerald-500/15 rounded-xl text-emerald-400">
            <User className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium">Categories Listed</p>
            <p className="text-2xl font-bold text-white mt-1">
              {new Set(products.map((p) => p.category)).size}
            </p>
          </div>
          <div className="p-3 bg-blue-500/15 rounded-xl text-blue-400">
            <Package className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* List of client sell submissions */}
      {filtered.length === 0 ? (
        <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-16 text-center">
          <Sprout className="w-16 h-16 text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No Client Sell Listings Found</h3>
          <p className="text-sm text-gray-400 max-w-sm mx-auto mt-1">
            When clients or farmers list their produce via the "Sell on Kisan" page, their listings appear here with contact information.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => {
            const sellerName = item.seller?.name || 'Verified Farmer / Client';
            const sellerEmail = item.seller?.email || 'Registered on Kisan';
            const sellerPhone = item.seller?.phone || 'Contact via Marketplace';

            return (
              <div
                key={item._id}
                className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 hover:border-[#CEC382]/30 transition flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
              >
                {/* Produce information */}
                <div className="flex items-start gap-4 flex-1">
                  <img
                    src={
                      item.poster_path ||
                      item.backdrop_path ||
                      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80'
                    }
                    alt={item.title}
                    className="w-24 h-24 rounded-2xl object-cover border border-white/10 shrink-0 shadow-md"
                  />

                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white text-base">{item.title}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#CEC382]/15 text-[#CEC382] border border-[#CEC382]/20">
                        {item.category || 'Seeds'}
                      </span>
                    </div>

                    <p className="text-xs text-gray-300 line-clamp-2">
                      {item.overview || 'Fresh high-yield harvest ready for immediate dispatch and trade.'}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 pt-1">
                      <span>
                        Quantity Offered: <strong className="text-white">{item.quantity} {item.unit || 'kg'}</strong>
                      </span>
                      <span>·</span>
                      <span>
                        Expected Price: <strong className="text-white">{typeof item.price === 'string' && item.price.startsWith('₹') ? item.price : `₹${item.price}`}</strong>
                        <span className="text-gray-500">/{item.unit || 'kg'}</span>
                      </span>
                      {item.dummyprice && (
                        <span>
                          · Market MRP: <span className="line-through text-gray-500">{typeof item.dummyprice === 'string' && item.dummyprice.startsWith('₹') ? item.dummyprice : `₹${item.dummyprice}`}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Seller / Farmer Contact Box */}
                <div className="w-full lg:w-72 bg-white/[0.02] border border-white/10 rounded-2xl p-4 space-y-2 shrink-0">
                  <div className="flex items-center gap-2 text-xs font-semibold text-white">
                    <User className="w-3.5 h-3.5 text-[#CEC382]" />
                    <span className="truncate">{sellerName}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Mail className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                    <span className="truncate">{sellerEmail}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Phone className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                    <span>{sellerPhone}</span>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[11px] text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.createdAt || Date.now()).toLocaleDateString()}
                    </span>

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition cursor-pointer p-1"
                      title="Remove Listing"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SellRequests;
