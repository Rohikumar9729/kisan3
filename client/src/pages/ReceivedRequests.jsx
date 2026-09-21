import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BlurCircle from '../components/Blurcircle';
import { dateformat } from '../lib/dateformat';
import api from '../lib/api';
import toast from 'react-hot-toast';
import {
  Inbox,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  IndianRupee,
  CheckCircle2,
  Clock,
  Truck,
  ArrowRight,
  XCircle,
  Package,
  Sprout
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const STATUS_CONFIG = {
  pending: { label: 'Pending Request', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  confirmed: { label: 'Order Accepted', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  shipped: { label: 'Produce Shipped', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  delivered: { label: 'Delivered to Buyer', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  cancelled: { label: 'Declined', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
};

const ReceivedRequests = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const fetchReceivedRequests = async () => {
    try {
      setIsLoading(true);

      // Fetch directly from MongoDB if authenticated
      if (isAuthenticated) {
        try {
          const { data } = await api.get('/api/orders/received');
          if (data.success && Array.isArray(data.orders)) {
            setRequests(data.orders);
            return;
          }
        } catch (err) {
          console.error('Error fetching received requests from API:', err);
        }
      }

      // Check localStorage only as a fallback
      const localRequests = JSON.parse(localStorage.getItem('kisan_received_requests') || '[]');
      setRequests(localRequests);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReceivedRequests();
  }, [isAuthenticated]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      if (orderId && orderId.length === 24) {
        await api.patch(`/api/orders/${orderId}/status`, { status: newStatus });
      }

      // Update state & local storage
      setRequests((prev) =>
        prev.map((ord) => (ord._id === orderId ? { ...ord, status: newStatus } : ord))
      );

      const local = JSON.parse(localStorage.getItem('kisan_received_requests') || '[]');
      const updatedLocal = local.map((ord) =>
        ord._id === orderId ? { ...ord, status: newStatus } : ord
      );
      localStorage.setItem('kisan_received_requests', JSON.stringify(updatedLocal));

      const statusLabels = {
        confirmed: 'Order accepted! Notify the buyer when harvest is dispatched. 🌾',
        shipped: 'Produce marked as shipped! 🚚',
        delivered: 'Order marked as delivered successfully! 🎉',
        cancelled: 'Order request declined.',
      };

      toast.success(statusLabels[newStatus] || `Status updated to ${newStatus}`);
    } catch (err) {
      console.error('Failed to update status:', err);
      toast.error(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (activeFilter === 'all') return true;
    return r.status === activeFilter;
  });

  const pendingCount = requests.filter((r) => r.status === 'pending').length;

  return !isLoading ? (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pt-32 sm:pt-36 min-h-[85vh] pb-24 relative overflow-hidden">
      <BlurCircle top="-5%" left="-5%" color="gold" />
      <BlurCircle bottom="10%" right="-5%" color="emerald" />

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#CEC382]/15 border border-[#CEC382]/30 text-[#CEC382]">
                <Inbox className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-white flex items-center gap-2.5">
                  Received Requests
                  {pendingCount > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-500 text-black animate-pulse">
                      {pendingCount} New
                    </span>
                  )}
                </h1>
                <p className="text-gray-400 text-xs sm:text-sm mt-0.5">
                  Customers who want to buy produce you published. Review buyer contacts and manage fulfillment.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/Sell')}
            className="px-5 py-2.5 text-xs font-bold rounded-full bg-[#CEC382] hover:bg-[#b8a56e] text-black transition cursor-pointer flex items-center gap-2 shadow-lg shadow-[#CEC382]/20 shrink-0"
          >
            <Sprout className="w-4 h-4" />
            <span>List More Produce</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition capitalize shrink-0 cursor-pointer ${
                activeFilter === tab
                  ? 'bg-white/15 text-white border border-[#CEC382]/50 shadow-sm'
                  : 'text-gray-400 hover:text-white bg-white/5 border border-white/5'
              }`}
            >
              {tab === 'all' ? `All Requests (${requests.length})` : tab}
            </button>
          ))}
        </div>

        {/* Request Cards List */}
        {filteredRequests.length === 0 ? (
          <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-16 text-center">
            <Inbox className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white">No Received Requests</h3>
            <p className="text-gray-400 text-sm max-w-md mx-auto mt-2 leading-relaxed">
              When customers place orders for produce or seeds you have published, their buy requests will appear here with buyer contact numbers and addresses.
            </p>
            <button
              onClick={() => navigate('/Sell')}
              className="mt-6 px-8 py-3 bg-[#CEC382] text-black font-bold rounded-full hover:bg-[#b8a56e] transition text-xs uppercase tracking-wider cursor-pointer"
            >
              Publish Produce on Market
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredRequests.map((item, index) => {
              const statusCfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.pending;
              const isUpdating = updatingId === item._id;

              return (
                <div
                  key={item._id || index}
                  className="bg-[#111915]/90 border border-white/10 hover:border-[#CEC382]/35 rounded-3xl p-6 transition-all duration-300 shadow-xl relative overflow-hidden"
                >
                  {/* Top Bar: Order ID, Date & Status */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 pb-4 mb-5 text-xs text-gray-400">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-white/90">
                        Order #{String(item._id).slice(-8).toUpperCase()}
                      </span>
                      <span className="flex items-center gap-1 text-gray-400">
                        <Calendar className="w-3.5 h-3.5" />
                        {dateformat(item.createdAt || new Date())}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusCfg.color}`}>
                        {statusCfg.label}
                      </span>
                    </div>
                  </div>

                  {/* Prominent Buyer Notification Strip */}
                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 mb-5 text-xs">
                    <div className="w-9 h-9 rounded-full bg-emerald-400 text-black flex items-center justify-center font-black text-sm shrink-0">
                      {item.user?.name ? item.user.name[0].toUpperCase() : 'B'}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-bold text-sm flex items-center gap-1.5 flex-wrap">
                        Request received from <span className="text-emerald-300 font-extrabold">{item.user?.name || 'Customer'}</span>
                      </p>
                      <p className="text-gray-300 text-xs mt-0.5">
                        They are trying to buy <span className="text-[#CEC382] font-semibold">{item.Quantity} {item.product?.unit || 'kg'}</span> of your published produce <span className="text-white font-semibold">"{item.product?.title || 'Published Item'}"</span>.
                      </p>
                    </div>
                  </div>

                  {/* Main Grid: Produce Info on Left, Buyer Details on Right */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Produce Information (7 cols) */}
                    <div className="lg:col-span-6 flex gap-4">
                      <img
                        src={
                          item.product?.poster_path ||
                          item.product?.backdrop_path ||
                          'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80'
                        }
                        alt="Produce"
                        className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-2xl border border-white/10 shrink-0"
                      />

                      <div className="flex flex-col justify-between space-y-2">
                        <div>
                          <span className="text-[10px] font-bold text-[#CEC382] uppercase tracking-wider">
                            {item.product?.category || 'Crop Seeds'}
                          </span>
                          <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                            {item.product?.title || 'Your Published Produce'}
                          </h3>
                        </div>

                        <div className="space-y-1 text-xs">
                          <p className="text-gray-300">
                            Quantity Requested:{' '}
                            <span className="font-bold text-white">
                              {item.Quantity} {item.product?.unit || 'kg'}
                            </span>
                          </p>
                          <p className="text-gray-300 flex items-center gap-1">
                            Amount to Receive:{' '}
                            <span className="font-black text-emerald-400 text-sm">
                              ₹{item.amount?.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              ({item.paymentMethod || 'Cash on Delivery'})
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Buyer Contact & Delivery Box (6 cols) */}
                    <div className="lg:col-span-6 bg-black/40 border border-white/10 rounded-2xl p-4 space-y-3">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#CEC382] flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" /> Buyer Contact &amp; Shipping Details
                      </p>

                      <div className="space-y-1.5 text-xs text-gray-300">
                        <p className="font-bold text-white text-sm">
                          {item.user?.name || 'Customer'}
                        </p>

                        {item.user?.email && (
                          <p className="flex items-center gap-2 text-gray-400">
                            <Mail className="w-3.5 h-3.5 text-[#CEC382] shrink-0" />
                            <a href={`mailto:${item.user.email}`} className="hover:underline text-gray-300">
                              {item.user.email}
                            </a>
                          </p>
                        )}

                        <p className="flex items-start gap-2 text-gray-400">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="text-white/90 leading-relaxed">
                            {item.DeliveryAddress || 'Address on record'}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Strip: Seller Controls */}
                  <div className="mt-6 pt-4 border-t border-white/8 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-gray-400">
                      {item.status === 'pending' && (
                        <span className="text-amber-300 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> Awaiting your confirmation to fulfill this order.
                        </span>
                      )}
                      {item.status === 'confirmed' && (
                        <span className="text-blue-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Order accepted! Prepare harvest for collection/dispatch.
                        </span>
                      )}
                      {item.status === 'shipped' && (
                        <span className="text-purple-300 flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5" /> In transit to buyer destination.
                        </span>
                      )}
                      {item.status === 'delivered' && (
                        <span className="text-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Completed &amp; delivered successfully.
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {item.status === 'pending' && (
                        <>
                          <button
                            disabled={isUpdating}
                            onClick={() => handleUpdateStatus(item._id, 'confirmed')}
                            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Accept Request</span>
                          </button>

                          <button
                            disabled={isUpdating}
                            onClick={() => handleUpdateStatus(item._id, 'cancelled')}
                            className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold transition cursor-pointer flex items-center gap-1 active:scale-95 disabled:opacity-50"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Decline</span>
                          </button>
                        </>
                      )}

                      {item.status === 'confirmed' && (
                        <button
                          disabled={isUpdating}
                          onClick={() => handleUpdateStatus(item._id, 'shipped')}
                          className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-black font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-purple-500/20 active:scale-95 disabled:opacity-50"
                        >
                          <Truck className="w-4 h-4" />
                          <span>Mark as Shipped</span>
                        </button>
                      )}

                      {item.status === 'shipped' && (
                        <button
                          disabled={isUpdating}
                          onClick={() => handleUpdateStatus(item._id, 'delivered')}
                          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Mark as Delivered</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="min-h-[85vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#CEC382] border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

export default ReceivedRequests;
