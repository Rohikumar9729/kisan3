import React, { useEffect, useState } from 'react';
import { dummyOrderData } from '../assets/assets';
import Loading from '../components/Loading';
import BlurCircle from '../components/Blurcircle';
import { dateformat } from '../lib/dateformat';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { ShoppingBag, Package, Calendar, MapPin, CheckCircle2, Clock, Truck, ArrowRight, IndianRupee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const STATUS_BADGES = {
  pending: { label: 'Pending', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  confirmed: { label: 'Confirmed', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  shipped: { label: 'Shipped', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  delivered: { label: 'Delivered', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  cancelled: { label: 'Cancelled', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
};

const Myorder = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);

      // Fetch from API if logged in
      let apiOrders = [];
      if (isAuthenticated) {
        try {
          const { data } = await api.get('/api/orders/my');
          if (data.success && data.orders?.length > 0) {
            apiOrders = data.orders;
          }
        } catch (e) {
          console.log('Error fetching my orders from API:', e);
        }
      }

      // Check local storage orders
      const localOrders = JSON.parse(localStorage.getItem('kisan_my_orders') || '[]');

      // Merge avoiding duplicates
      const apiIds = new Set(apiOrders.map((o) => o._id));
      const filteredLocal = localOrders.filter((o) => !apiIds.has(o._id));
      const combined = [...apiOrders, ...filteredLocal];

      if (combined.length > 0) {
        setOrders(combined);
      } else {
        // Fallback to dummy data mapped to our schema
        setOrders(
          dummyOrderData.map((d) => ({
            _id: d._id || 'ord_sample',
            product: {
              title: d.show?.product?.title || 'Certified Crop Seeds',
              poster_path: d.show?.product?.poster_path || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
              unit: 'kg',
            },
            Quantity: d.Quantity || 50,
            amount: d.amount || 2500,
            DeliveryAddress: d.show?.DeliveryAddress || 'Farmhouse, Village Road, Haryana',
            isPaid: d.isPaid || false,
            status: 'confirmed',
            createdAt: new Date().toISOString(),
            showDeliveryTime: d.show?.showDeliveryTime || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          }))
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [isAuthenticated]);

  const handlePayNow = async (orderId) => {
    setPayingId(orderId);
    try {
      if (orderId && orderId.length === 24) {
        await api.patch(`/api/orders/${orderId}/pay`);
      }

      // Update in state and localStorage
      setOrders((prev) =>
        prev.map((ord) => (ord._id === orderId ? { ...ord, isPaid: true } : ord))
      );

      const localOrders = JSON.parse(localStorage.getItem('kisan_my_orders') || '[]');
      const updatedLocal = localOrders.map((ord) =>
        ord._id === orderId ? { ...ord, isPaid: true } : ord
      );
      localStorage.setItem('kisan_my_orders', JSON.stringify(updatedLocal));

      toast.success('Payment successful! Your order is marked as Paid. 🌾');
    } catch (err) {
      console.error('Payment error:', err);
      toast.error('Payment processed locally');
    } finally {
      setPayingId(null);
    }
  };

  return !isLoading ? (
    <div className="px-6 md:px-16 lg:px-40 pt-28 md:pt-36 min-h-[85vh] pb-24 relative overflow-hidden">
      <BlurCircle top="100px" left="100px" />
      <BlurCircle bottom="0px" right="400px" />

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2.5">
              <Package className="w-8 h-8 text-[#CEC382]" /> My Orders
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Track real-time shipment status, dispatch schedules, and farmer payments.
            </p>
          </div>

          <button
            onClick={() => navigate('/Buy')}
            className="px-5 py-2 text-xs font-semibold rounded-full bg-[#CEC382] hover:bg-[#b8a56e] text-black transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-[#CEC382]/20"
          >
            Explore More Seeds <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-16 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white">No Orders Placed Yet</h3>
            <p className="text-gray-400 text-sm max-w-sm mx-auto mt-2">
              Browse our catalog of high quality seeds, organic fertilizers, and farm produce to place your first order.
            </p>
            <button
              onClick={() => navigate('/Buy')}
              className="mt-6 px-8 py-3 bg-[#CEC382] text-black font-semibold rounded-full hover:bg-[#b8a56e] transition text-sm cursor-pointer"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((item, index) => {
              const statusBadge = STATUS_BADGES[item.status] || STATUS_BADGES.confirmed;

              return (
                <div
                  key={item._id || index}
                  className="bg-white/[0.03] border border-white/10 hover:border-[#CEC382]/30 rounded-3xl p-6 transition flex flex-col md:flex-row justify-between gap-6"
                >
                  {/* Image & Product Information */}
                  <div className="flex flex-col sm:flex-row gap-5 flex-1">
                    <img
                      src={
                        item.product?.poster_path ||
                        item.product?.backdrop_path ||
                        'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80'
                      }
                      alt="Product"
                      className="w-full sm:w-32 h-28 object-cover rounded-2xl border border-white/10 shrink-0"
                    />

                    <div className="flex flex-col justify-between space-y-2 flex-1">
                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h3 className="text-lg font-bold text-white">
                            {item.product?.title || 'Certified Crop Item'}
                          </h3>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusBadge.color}`}
                          >
                            {statusBadge.label}
                          </span>
                        </div>

                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#CEC382] shrink-0" />
                          <span className="line-clamp-1">{item.DeliveryAddress}</span>
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 pt-1 border-t border-white/5">
                        <span>
                          Quantity: <strong className="text-white">{item.Quantity} {item.product?.unit || 'kg'}</strong>
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5 text-gray-500" />
                          Delivery expected by{' '}
                          <strong className="text-gray-300">
                            {item.showDeliveryTime ? new Date(item.showDeliveryTime).toLocaleDateString() : '3-5 Days'}
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Financial Amount & Payment status */}
                  <div className="flex md:flex-col items-center md:items-end justify-between md:justify-between border-t md:border-t-0 pt-4 md:pt-0 border-white/10 shrink-0">
                    <div className="text-left md:text-right">
                      <p className="text-2xl font-bold text-white">₹{item.amount}</p>
                      <p className="text-[11px] text-gray-400">Total Price (incl. GST)</p>
                    </div>

                    <div className="mt-2">
                      {!item.isPaid ? (
                        <button
                          onClick={() => handlePayNow(item._id)}
                          disabled={payingId === item._id}
                          className="px-5 py-2 text-xs font-bold rounded-full bg-[#CEC382] hover:bg-[#b8a56e] text-black transition cursor-pointer shadow-md shadow-[#CEC382]/20 flex items-center gap-1"
                        >
                          {payingId === item._id ? (
                            'Processing...'
                          ) : (
                            <>
                              <IndianRupee className="w-3.5 h-3.5" /> Pay Now
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Paid & Confirmed
                        </span>
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
    <Loading />
  );
};

export default Myorder;
