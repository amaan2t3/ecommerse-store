import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FunnelIcon, MagnifyingGlassIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import toast from 'react-hot-toast';
import api from '../../services/api';

const Shop = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [priceRange, setPriceRange] = useState(100000);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const dispatch = useDispatch();

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({
      product: product.id || product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      qty: 1,
      countInStock: product.count_in_stock || 10
    }));
    toast.success('Added to cart!');
  };

  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch !== null) {
      setSearchTerm(urlSearch);
    }
  }, [searchParams]);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', selectedCategory, priceRange, searchTerm],
    queryFn: async () => {
      const res = await api.get('/products');
      let filtered = res.data || [];
      if (selectedCategory !== 'All') {
        filtered = filtered.filter(p => p.category === selectedCategory);
      }
      filtered = filtered.filter(p => p.price <= priceRange);
      if (searchTerm) {
        filtered = filtered.filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()));
      }
      return filtered;
    }
  });

  return (
    <div className="container mx-auto px-4 md:px-8 py-12 flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 space-y-8 flex-shrink-0">
        <div>
          <h3 className="text-lg font-bold text-text flex items-center gap-2 mb-4">
            <FunnelIcon className="h-5 w-5 text-primary" /> Filters
          </h3>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" />
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-text mb-3">Categories</h4>
          <ul className="space-y-2">
            {['All', 'Men', 'Women', 'Kids', 'Accessories', 'Shoes'].map(cat => (
              <li key={cat}>
                <button 
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-sm transition-colors ${selectedCategory === cat ? 'text-primary font-bold' : 'text-gray-500 hover:text-primary'}`}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-text mb-3">Price Range (Up to PKR {priceRange})</h4>
          <input 
            type="range" 
            min="0" max="100000" step="500"
            value={priceRange} 
            onChange={(e) => setPriceRange(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-text">Shop Collection</h2>
          <select className="bg-white border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option>Sort by: Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest Arrivals</option>
          </select>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="animate-pulse bg-white rounded-2xl h-80"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.length === 0 ? (
              <div className="col-span-full py-12 text-center text-gray-500">
                No products found matching your filters.
              </div>
            ) : (
              products.map((product, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={product.id || product._id} 
                  className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-soft transition-shadow border border-gray-100"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    
                    {/* Overlay actions */}
                    <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      <button 
                        onClick={(e) => handleAddToCart(e, product)}
                        className="w-full bg-white text-text font-medium py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-colors shadow-lg"
                      >
                        <ShoppingCartIcon className="h-5 w-5" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">{product.category}</p>
                    <h3 className="text-lg font-medium text-text">{product.name}</h3>
                    <p className="font-bold text-primary mt-2">PKR {product.price}</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Shop;
