import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import api from '../../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import { toggleWishlist } from '../../redux/slices/wishlistSlice';
import toast from 'react-hot-toast';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();
  const { wishlistItems } = useSelector((state) => state.wishlist);

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

  const handleToggleWishlist = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist({
      id: product.id || product._id,
      name: product.name,
      image: product.image,
      price: product.price
    }));
    toast.success('Wishlist updated!');
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data.slice(0, 4));
      } catch (error) {
        console.error('Failed to load featured products', error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">Trending Now</h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.length === 0 ? (
            <div className="col-span-full py-8 text-center text-gray-500">Loading trending items...</div>
          ) : products.map((product, index) => (
            <motion.div 
              key={product.id || product._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-2xl mb-4 bg-gray-50 aspect-[4/5]">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
                
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
                
                {/* Wishlist button */}
                <button 
                  onClick={(e) => handleToggleWishlist(e, product)}
                  className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-500 hover:text-error hover:bg-white transition-colors"
                >
                  {wishlistItems.some(x => x.id === (product.id || product._id)) ? (
                    <HeartIconSolid className="h-5 w-5 text-error" />
                  ) : (
                    <HeartIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              
              <div className="px-2">
                <p className="text-sm text-gray-500 mb-1">{product.category}</p>
                <h3 className="text-lg font-medium text-text mb-1 group-hover:text-primary transition-colors">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-text">PKR {Number(product.price).toFixed(2)}</span>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <svg className="w-4 h-4 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {product.rating || '5.0'}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
