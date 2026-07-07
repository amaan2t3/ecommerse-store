import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import api from '../../services/api';
import { motion } from 'framer-motion';
import { logout } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { UserIcon, ShoppingBagIcon, HeartIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

const UserDashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userInfo) return;
      try {
        const res = await api.get('/orders/myorders');
        setOrders(res.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userInfo]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  // If user is somehow not logged in, redirect them or show a message
  if (!userInfo) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-text mb-4">Please log in to view your profile</h2>
        <button 
          onClick={() => navigate('/login')}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-12 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-text mb-2">My Account</h1>
          <p className="text-gray-500">Welcome back, {userInfo.name}!</p>
        </div>
        <button 
          onClick={handleLogout}
          className="mt-4 md:mt-0 flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors font-medium"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          Log Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <UserIcon className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text">{userInfo.name}</h2>
              <p className="text-gray-500 text-sm">{userInfo.email}</p>
            </div>
          </div>
          <div className="space-y-4 border-t border-gray-100 pt-6">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Account Status</span>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium uppercase tracking-wider">Active</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Member Since</span>
              <span className="font-medium text-text">July 2026</span>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              onClick={() => setActiveTab('orders')}
              className={`bg-white p-6 rounded-2xl shadow-sm border flex items-center gap-4 transition-colors cursor-pointer ${activeTab === 'orders' ? 'border-primary shadow-md' : 'border-gray-100 hover:border-primary/50'}`}
            >
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
                <ShoppingBagIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Orders</p>
                <p className="text-2xl font-bold text-text">{orders.length}</p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={() => setActiveTab('wishlist')}
              className={`bg-white p-6 rounded-2xl shadow-sm border flex items-center gap-4 transition-colors cursor-pointer ${activeTab === 'wishlist' ? 'border-accent shadow-md' : 'border-gray-100 hover:border-accent/50'}`}
            >
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                <HeartIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Wishlist Items</p>
                <p className="text-2xl font-bold text-text">{wishlistItems?.length || 0}</p>
              </div>
            </motion.div>
          </div>

          {/* Conditional Content: Orders vs Wishlist */}
          {activeTab === 'orders' ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-text">Recent Orders</h3>
              </div>
              
              {loading ? (
                <div className="p-12 text-center text-gray-500">Loading your orders...</div>
              ) : orders.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBagIcon className="h-8 w-8 text-gray-300" />
                  </div>
                  <h4 className="text-lg font-medium text-text mb-2">No orders yet</h4>
                  <p className="text-gray-500 mb-6 max-w-sm">When you place an order, it will appear here so you can easily track its status.</p>
                  <button 
                    onClick={() => navigate('/shop')}
                    className="bg-text text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-sm">
                      <tr>
                        <th className="py-3 px-6 font-medium">Order ID</th>
                        <th className="py-3 px-6 font-medium">Date</th>
                        <th className="py-3 px-6 font-medium">Total</th>
                        <th className="py-3 px-6 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {orders.map((order) => (
                        <tr key={order.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-6 font-medium text-text">#{order.id.slice(-6)}</td>
                          <td className="py-4 px-6 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td className="py-4 px-6 font-medium">PKR {order.totalPrice}</td>
                          <td className="py-4 px-6">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${order.isDelivered ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              {order.isDelivered ? 'Delivered' : 'Processing'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-text">My Wishlist</h3>
              </div>
              
              {wishlistItems.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <HeartIcon className="h-8 w-8 text-gray-300" />
                  </div>
                  <h4 className="text-lg font-medium text-text mb-2">Your wishlist is empty</h4>
                  <p className="text-gray-500 mb-6 max-w-sm">Explore our collection and heart your favorite items to save them for later.</p>
                  <button 
                    onClick={() => navigate('/shop')}
                    className="bg-text text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Discover Products
                  </button>
                </div>
              ) : (
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {wishlistItems.map((item) => (
                    <div key={item.id} className="group border border-gray-100 rounded-2xl overflow-hidden hover:shadow-soft transition-shadow cursor-pointer" onClick={() => navigate(`/product/${item.id}`)}>
                      <div className="relative h-48 overflow-hidden bg-gray-50">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-4">
                        <h4 className="font-medium text-text line-clamp-1">{item.name}</h4>
                        <p className="text-primary font-bold mt-1">PKR {item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
