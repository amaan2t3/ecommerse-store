import React, { useState, useEffect } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  BarElement
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { CurrencyDollarIcon, ShoppingBagIcon, UsersIcon, ArrowTrendingUpIcon, TrashIcon, PlusIcon, XMarkIcon, PencilSquareIcon, ExclamationTriangleIcon, TagIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import toast from 'react-hot-toast';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const initialFormState = {
    name: '',
    price: 0,
    category: '',
    brand: '',
    countInStock: 0,
    description: '',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'
  };
  const [newProduct, setNewProduct] = useState(initialFormState);

  const [uploading, setUploading] = useState(false);

  const fetchProductsAndOrders = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.allSettled([
        api.get('/products'),
        api.get('/orders')
      ]);
      
      if (productsRes.status === 'fulfilled') {
        setProducts(productsRes.value.data || []);
      } else {
        toast.error('Failed to load products');
      }

      if (ordersRes.status === 'fulfilled') {
        setOrders(ordersRes.value.data || []);
      } else {
        toast.error('Failed to load orders');
      }
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndOrders();
  }, []);

  const handleUploadFile = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    try {
      const { data } = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // The backend now returns the full Supabase Storage public URL
      setNewProduct({...newProduct, image: data});
      setUploading(false);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error(error);
      setUploading(false);
      toast.error('Image upload failed');
    }
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, newProduct);
        toast.success('Product updated successfully!');
      } else {
        await api.post('/products', newProduct);
        toast.success('Product added successfully!');
      }
      setShowAddModal(false);
      setEditingId(null);
      setNewProduct(initialFormState);
      fetchProducts();
    } catch (error) {
      toast.error(editingId ? 'Failed to update product' : 'Failed to add product');
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setNewProduct(initialFormState);
    setShowAddModal(true);
  };

  const openEditModal = (product) => {
    setEditingId(product.id || product._id);
    setNewProduct({
      name: product.name,
      price: product.price,
      category: product.category,
      brand: product.brand,
      countInStock: product.count_in_stock,
      description: product.description,
      image: product.image,
    });
    setShowAddModal(true);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        toast.success('Product deleted successfully!');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Revenue (PKR)',
        data: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
        borderColor: '#5E8B7E',
        backgroundColor: 'rgba(94, 139, 126, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const barChartData = {
    labels: ['Shirts', 'Dresses', 'Bags', 'Watches', 'Shoes'],
    datasets: [
      {
        label: 'Sales by Category',
        data: [65, 59, 80, 81, 56],
        backgroundColor: '#E6B17E',
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  // Calculate real dynamic stats based on the products data
  const totalProducts = products.length;
  const inventoryValue = products.reduce((acc, p) => acc + (Number(p.price) * Number(p.count_in_stock)), 0);
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((acc, o) => acc + Number(o.totalPrice), 0);

  const statCards = [
    { title: 'Total Revenue', value: `PKR ${totalRevenue.toLocaleString()}`, description: 'From all orders', icon: CurrencyDollarIcon, color: 'text-primary', bg: 'bg-primary/10' },
    { title: 'Total Orders', value: totalOrders, description: 'Live on storefront', icon: ShoppingBagIcon, color: 'text-secondary', bg: 'bg-secondary/10' },
    { title: 'Total Products', value: totalProducts, description: 'In catalog', icon: TagIcon, color: 'text-success', bg: 'bg-success/10' },
    { title: 'Inventory Value', value: `PKR ${inventoryValue.toLocaleString()}`, description: 'Total value', icon: ExclamationTriangleIcon, color: 'text-error', bg: 'bg-red-100' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-text">Admin Dashboard</h1>
        <button className="btn-primary py-2 text-sm">Download Report</button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">{stat.title}</p>
              <h3 className="text-2xl font-bold text-text">{stat.value}</h3>
              <p className="text-gray-400 text-xs font-medium mt-2">{stat.description}</p>
            </div>
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-text mb-4">Revenue Overview</h3>
          <Line options={chartOptions} data={lineChartData} />
        </div>
        
        {/* Recent Orders Table inside Admin Dashboard */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-bold text-text text-lg">Recent Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white border-b border-gray-100 text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6 font-medium">Order ID</th>
                  <th className="py-4 px-6 font-medium">Customer</th>
                  <th className="py-4 px-6 font-medium">Items Ordered</th>
                  <th className="py-4 px-6 font-medium">Total</th>
                  <th className="py-4 px-6 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan="5" className="py-8 text-center text-gray-500">No orders yet.</td></tr>
                ) : orders.map(order => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="py-4 px-6 font-medium text-text">#{order.id.slice(-6)}</td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-text">{order.user?.name || order.shippingAddress?.fullName || 'Customer'}</div>
                      <div className="text-xs text-gray-500">{order.user?.email || 'No Email Provided'}</div>
                    </td>
                    <td className="py-4 px-6">
                      {order.orderItems?.map((item, i) => (
                        <div key={i} className="text-xs text-gray-600 mb-1">
                          <span className="font-bold">{item.qty}x</span> {item.name}
                        </div>
                      ))}
                    </td>
                    <td className="py-4 px-6 text-primary font-medium">PKR {order.totalPrice}</td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">Processing</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Dynamic Products Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-text text-lg">Manage Products</h3>
          <button onClick={openAddModal} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            <PlusIcon className="h-4 w-4" /> Add Product
          </button>
        </div>
        
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading products...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white border-b border-gray-100 text-gray-500 text-sm uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6 font-medium">Name</th>
                  <th className="py-4 px-6 font-medium">Category</th>
                  <th className="py-4 px-6 font-medium">Price (PKR)</th>
                  <th className="py-4 px-6 font-medium">Stock</th>
                  <th className="py-4 px-6 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-500">No products found. Add some to see them here!</td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id || product._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 font-medium text-text">{product.name}</td>
                      <td className="py-4 px-6 text-gray-500">{product.category}</td>
                      <td className="py-4 px-6 font-medium text-primary">PKR {product.price}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${product.count_in_stock > 0 ? 'bg-success/10 text-success' : 'bg-red-100 text-red-600'}`}>
                          {product.count_in_stock > 0 ? `${product.count_in_stock} in stock` : 'Out of stock'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button 
                          onClick={() => openEditModal(product)}
                          className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <PencilSquareIcon className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.id || product._id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                          title="Delete Product"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-text">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmitProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input required type="text" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (PKR)</label>
                  <input required type="number" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                  <input required type="number" value={newProduct.countInStock} onChange={(e) => setNewProduct({...newProduct, countInStock: Number(e.target.value)})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select 
                    required 
                    value={newProduct.category} 
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} 
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white"
                  >
                    <option value="" disabled>Select Category</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Shoes">Shoes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                  <input required type="text" value={newProduct.brand} onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                <input 
                  required 
                  type="file" 
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleUploadFile} 
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" 
                />
                {uploading && <p className="text-sm text-primary mt-1">Uploading image...</p>}
                {newProduct.image && newProduct.image !== 'https://images.unsplash.com/photo-1523275335684-37898b6baf30' && (
                   <img src={newProduct.image} alt="Preview" className="h-20 mt-2 rounded-lg object-cover" />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea required rows="4" value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-50 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors">
                  {editingId ? 'Update Product' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
