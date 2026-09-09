import React, { useEffect, useState } from 'react';
import Title from '../../components/admin/Title';
import Loading from '../../components/Loading';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
  ChartLineIcon,
  Package,
  ShoppingBag,
  IndianRupee,
  PlusCircle,
  Trash2,
  ExternalLink,
  Layers
} from 'lucide-react';
import { dummyShowsData } from '../../assets/assets';

const Mycart = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [prodRes, orderRes] = await Promise.allSettled([
        api.get('/api/products?limit=50'),
        api.get('/api/orders')
      ]);

      if (prodRes.status === 'fulfilled' && prodRes.value.data.success) {
        setProducts(prodRes.value.data.products || []);
      } else {
        // Fallback to starter catalog
        setProducts(dummyShowsData.map((d) => ({
          _id: d._id,
          title: d.title,
          category: 'Seeds',
          price: d.price,
          quantity: 100,
          unit: 'kg',
          poster_path: d.poster_path,
          isActive: true
        })));
      }

      if (orderRes.status === 'fulfilled' && orderRes.value.data.success) {
        setOrders(orderRes.value.data.orders || []);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to remove this product?')) return;

    try {
      const { data } = await api.delete(`/api/products/${id}`);
      if (data.success) {
        toast.success('Product removed successfully');
        setProducts((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      toast.error(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const totalRevenue = orders
    .filter((o) => o.isPaid)
    .reduce((sum, o) => sum + (Number(o.amount) || 0), 0);

  const statsCards = [
    {
      title: 'Total Products',
      value: products.length,
      icon: Package,
      color: 'text-amber-400 bg-amber-500/10'
    },
    {
      title: 'Active Orders',
      value: orders.length,
      icon: ShoppingBag,
      color: 'text-blue-400 bg-blue-500/10'
    },
    {
      title: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: IndianRupee,
      color: 'text-emerald-400 bg-emerald-500/10'
    }
  ];

  return loading ? (
    <Loading />
  ) : (
    <div className="max-w-6xl mx-auto pb-16 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Title text1="My" text2="Cart" />
          <p className="text-gray-400 text-sm mt-1">
            Overview of marketplace metrics, active product catalog, and order flows.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/orders')}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-white/15 hover:border-[#CEC382] text-gray-300 hover:text-white transition cursor-pointer"
          >
            View Orders ({orders.length})
          </button>
          <button
            onClick={() => navigate('/admin/add-product')}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#CEC382] hover:bg-[#b8a56e] text-black transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#CEC382]/20"
          >
            <PlusCircle className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div
              key={index}
              className="bg-white/[0.03] border border-white/10 p-6 rounded-3xl shadow-lg hover:border-white/20 transition flex items-center justify-between"
            >
              <div>
                <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">{card.title}</p>
                <p className="text-3xl font-bold text-white mt-1.5">{card.value}</p>
              </div>
              <div className={`p-3.5 rounded-2xl ${card.color}`}>
                <IconComponent className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Product Inventory Section */}
      <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#CEC382]" /> Product Catalog ({products.length})
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Live seeds, fertilizers, and crops available on the marketplace.
            </p>
          </div>

          <button
            onClick={() => navigate('/Buy')}
            className="text-xs text-[#CEC382] hover:underline flex items-center gap-1"
          >
            View on Store <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Package className="w-10 h-10 mx-auto mb-2 text-gray-600" />
            <p>No products in the catalog yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-gray-400 border-b border-white/10">
                <tr>
                  <th className="pb-3 font-medium">Product</th>
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 font-medium">Price</th>
                  <th className="pb-3 font-medium">Stock</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((item) => (
                  <tr key={item._id} className="hover:bg-white/[0.02] transition">
                    <td className="py-3.5 pr-4 flex items-center gap-3">
                      <img
                        src={
                          item.poster_path ||
                          item.backdrop_path ||
                          'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=200&q=80'
                        }
                        alt={item.title}
                        className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0"
                      />
                      <div>
                        <p className="font-medium text-white line-clamp-1">{item.title}</p>
                        <p className="text-[11px] text-gray-500 font-mono">ID: {item._id?.slice(-6)}</p>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4 text-xs text-gray-300">
                      <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                        {item.category || 'Seeds'}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 font-semibold text-white">
                      {typeof item.price === 'string' && item.price.startsWith('₹')
                        ? item.price
                        : `₹${item.price}`}
                    </td>
                    <td className="py-3.5 pr-4 text-xs text-emerald-400">
                      {item.quantity || 100} {item.unit || 'kg'}
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => handleDeleteProduct(item._id)}
                        className="p-2 text-gray-500 hover:text-red-400 transition cursor-pointer"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Mycart;
