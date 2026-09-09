import React, { useEffect, useState } from 'react';
import Title from '../../components/admin/Title';
import Loading from '../../components/Loading';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  IndianRupee,
  MapPin,
  Calendar,
  User,
  Phone,
  Mail,
  Search,
  ExternalLink,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

const STATUS_STEPS = ['pending', 'confirmed', 'shipped', 'delivered'];

const STATUS_CONFIG = {
  pending: { label: 'Order Placed', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
  confirmed: { label: 'Confirmed by Farmer', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
  shipped: { label: 'Dispatched & Shipped', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
  delivered: { label: 'Successfully Delivered', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
  cancelled: { label: 'Cancelled', color: 'text-red-400 bg-red-500/10 border-red-500/30' },
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/orders');
      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Failed to load placed orders:', err);
      toast.error('Unable to fetch orders from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const { data } = await api.patch(`/api/orders/${orderId}/status`, { status: newStatus });
      if (data.success) {
        toast.success(`Order status updated to "${newStatus}"!`);
        setOrders((prev) =>
          prev.map((ord) => (ord._id === orderId ? { ...ord, status: newStatus } : ord))
        );
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      toast.error(err.response?.data?.message || 'Failed to update order status');
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const term = search.toLowerCase();
    const matchesSearch =
      !search ||
      o._id?.toLowerCase().includes(term) ||
      o.product?.title?.toLowerCase().includes(term) ||
      o.DeliveryAddress?.toLowerCase().includes(term) ||
      o.user?.name?.toLowerCase().includes(term) ||
      o.user?.email?.toLowerCase().includes(term);
    return matchesStatus && matchesSearch;
  });

  return loading ? (
    <Loading />
  ) : (
    <div className="max-w-6xl mx-auto pb-16 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Title text1="Placed" text2="Orders Tracker" />
          <p className="text-gray-400 text-sm mt-1">
            Trace and process all placed customer seed & crop orders in real time.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, buyer, produce..."
              className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#CEC382]"
            />
          </div>

          <button
            onClick={fetchOrders}
            className="px-3.5 py-2 text-xs font-semibold bg-white/5 border border-white/10 hover:border-[#CEC382] rounded-xl text-gray-300 hover:text-white transition cursor-pointer shrink-0"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium capitalize transition cursor-pointer ${
              statusFilter === st
                ? 'bg-[#CEC382] text-black font-semibold shadow-md shadow-[#CEC382]/20'
                : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
            }`}
          >
            {st} ({st === 'all' ? orders.length : orders.filter((o) => o.status === st).length})
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-16 text-center">
          <Package className="w-16 h-16 text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No Placed Orders Found</h3>
          <p className="text-sm text-gray-400 max-w-sm mx-auto mt-1">
            {statusFilter === 'all'
              ? 'When buyers checkout and place orders from their cart, they will appear here to trace.'
              : `No orders are currently in "${statusFilter}" status.`}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const currentStatus = order.status || 'pending';
            const statusConfig = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.pending;
            const currentStepIdx = STATUS_STEPS.indexOf(currentStatus);

            return (
              <div
                key={order._id}
                className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 hover:border-white/20 transition space-y-5"
              >
                {/* Header row: Order ID, Placement Date & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[#CEC382]">
                      ORDER #{order._id.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-500" />
                      Placed on: {new Date(order.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.color}`}>
                      {statusConfig.label}
                    </span>

                    {/* Status updater dropdown */}
                    <select
                      value={currentStatus}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="px-3 py-1.5 bg-[#1a1a1a] border border-white/15 focus:border-[#CEC382] rounded-xl text-xs text-white cursor-pointer"
                    >
                      <option value="pending">Mark as Placed (Pending)</option>
                      <option value="confirmed">Mark as Confirmed</option>
                      <option value="shipped">Mark as Shipped</option>
                      <option value="delivered">Mark as Delivered</option>
                      <option value="cancelled">Mark as Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Visual Shipment Trace Tracker */}
                {currentStatus !== 'cancelled' && (
                  <div className="py-2">
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      Order Trace Progress
                    </p>
                    <div className="grid grid-cols-4 gap-2 relative">
                      {STATUS_STEPS.map((step, idx) => {
                        const isDone = currentStepIdx >= idx;
                        const isCurrent = currentStepIdx === idx;

                        return (
                          <div key={step} className="flex flex-col items-center text-center space-y-1.5">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                                isDone
                                  ? 'bg-[#CEC382] text-black ring-4 ring-[#CEC382]/20'
                                  : 'bg-white/5 border border-white/15 text-gray-500'
                              }`}
                            >
                              {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                            </div>
                            <p
                              className={`text-[11px] font-medium capitalize ${
                                isCurrent
                                  ? 'text-[#CEC382] font-semibold'
                                  : isDone
                                  ? 'text-gray-300'
                                  : 'text-gray-600'
                              }`}
                            >
                              {step}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Details Grid: Product Info + Client Contact Info */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                  {/* Product Column */}
                  <div className="lg:col-span-2 flex items-start gap-4">
                    <img
                      src={
                        order.product?.poster_path ||
                        order.product?.backdrop_path ||
                        'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80'
                      }
                      alt={order.product?.title || 'Product item'}
                      className="w-20 h-20 rounded-2xl object-cover border border-white/10 shrink-0"
                    />

                    <div className="space-y-1.5">
                      <p className="font-bold text-white text-base">
                        {order.product?.title || 'Certified Crop Item'}
                      </p>
                      <p className="text-xs text-gray-400">
                        Category: <strong className="text-gray-300">{order.product?.category || 'Seeds'}</strong> · Quantity: <strong className="text-white">{order.Quantity} {order.product?.unit || 'kg'}</strong>
                      </p>
                      <div className="flex items-center gap-3 text-xs pt-1">
                        <span className="text-base font-bold text-white">
                          Total: ₹{order.amount}
                        </span>
                        <span className="text-gray-400">
                          Payment: <strong className="text-[#CEC382]">{order.paymentMethod || 'COD'}</strong>
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            order.isPaid
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {order.isPaid ? 'Paid' : 'Payment Pending'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Buyer / Client Contact Column */}
                  <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 space-y-2 text-xs">
                    <p className="font-semibold text-white text-xs uppercase tracking-wider text-[#CEC382] mb-1">
                      Client / Buyer Trace
                    </p>

                    <div className="flex items-center gap-2 text-gray-300">
                      <User className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                      <span className="font-medium text-white">{order.user?.name || 'Verified Kisan Customer'}</span>
                    </div>

                    {order.user?.email && (
                      <div className="flex items-center gap-2 text-gray-400">
                        <Mail className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                        <span className="truncate">{order.user.email}</span>
                      </div>
                    )}

                    <div className="flex items-start gap-2 text-gray-400 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#CEC382] shrink-0 mt-0.5" />
                      <span className="line-clamp-2 leading-relaxed text-gray-300">
                        {order.DeliveryAddress || 'Address on file'}
                      </span>
                    </div>
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

export default Orders;
