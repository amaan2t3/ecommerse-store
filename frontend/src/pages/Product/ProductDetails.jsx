import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/outline';
import { StarIcon, HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import { toggleWishlist } from '../../redux/slices/wishlistSlice';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const [qty, setQty] = useState(1);
  const [selectedColor, setSelectedColor] = useState('Beige');
  const [selectedSize, setSelectedSize] = useState('M');

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await api.get(`/products/${id}`);
      return res.data;
    }
  });



  const handleAddToCart = () => {
    dispatch(addToCart({
      product: product.id || product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      qty,
      countInStock: product.count_in_stock,
      variant: { color: selectedColor, size: selectedSize }
    }));
    toast.success('Added to cart!');
  };

  const handleToggleWishlist = () => {
    dispatch(toggleWishlist({
      id: product.id || product._id,
      name: product.name,
      image: product.image,
      price: product.price
    }));
    toast.success('Wishlist updated!');
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-20 text-center text-gray-500">Loading product details...</div>;
  }

  if (!product) {
    return <div className="container mx-auto px-4 py-20 text-center text-gray-500">Product not found.</div>;
  }

  // Fallbacks for colors/sizes since they might not exist in db yet
  const colors = ['Beige', 'White', 'Navy'];
  const sizes = ['S', 'M', 'L', 'XL'];

  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-3xl overflow-hidden bg-gray-50 h-[500px]">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </motion.div>
        </div>


        {/* Details */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col justify-center">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex text-secondary">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className={`h-5 w-5 ${i < Math.floor(product.rating || 5) ? 'text-secondary' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="text-sm text-gray-500">({product.numReviews || 12} reviews)</span>
          </div>
          
          <h1 className="text-4xl font-bold text-text mb-4">{product.name}</h1>
          <p className="text-2xl font-bold text-primary mb-6">PKR {Number(product.price).toFixed(2)}</p>
          
          <p className="text-gray-600 mb-8 leading-relaxed">{product.description}</p>
          
          {/* Variants */}
          <div className="mb-6">
            <h4 className="font-semibold text-text mb-3">Color: {selectedColor}</h4>
            <div className="flex gap-3">
              {colors.map(color => (
                <button 
                  key={color} 
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-full border-2 ${selectedColor === color ? 'border-primary' : 'border-gray-200'}`}
                  style={{ backgroundColor: color === 'Beige' ? '#EFEBE9' : color === 'White' ? '#FFFFFF' : '#1A237E' }}
                />
              ))}
            </div>
          </div>
          
          <div className="mb-8">
            <h4 className="font-semibold text-text mb-3">Size: {selectedSize}</h4>
            <div className="flex gap-3">
              {sizes.map(size => (
                <button 
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 flex items-center justify-center rounded-xl border-2 font-medium transition-colors ${selectedSize === size ? 'border-primary bg-primary text-white' : 'border-gray-200 text-text hover:border-primary'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex items-center border-2 border-gray-200 rounded-xl px-4">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="text-xl text-text hover:text-primary transition-colors">-</button>
              <span className="w-12 text-center font-medium">{qty}</span>
              <button onClick={() => setQty(Math.min(product.count_in_stock, qty + 1))} className="text-xl text-text hover:text-primary transition-colors">+</button>
            </div>
            {product.count_in_stock > 0 ? (
              <button onClick={handleAddToCart} className="flex-1 btn-primary flex items-center justify-center gap-2">
                <ShoppingCartIcon className="h-5 w-5" /> Add to Cart
              </button>
            ) : (
              <button disabled className="flex-1 bg-gray-300 text-gray-500 rounded-lg flex items-center justify-center gap-2 cursor-not-allowed font-bold">
                Out of Stock
              </button>
            )}
            <button 
              onClick={handleToggleWishlist}
              className={`w-14 h-14 flex items-center justify-center border-2 rounded-xl transition-colors ${
                wishlistItems.some(x => x.id === (product.id || product._id))
                  ? 'border-error text-error bg-error/10'
                  : 'border-gray-200 text-gray-500 hover:text-error hover:border-error'
              }`}
            >
              {wishlistItems.some(x => x.id === (product.id || product._id)) ? (
                <HeartIconSolid className="h-6 w-6" />
              ) : (
                <HeartIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetails;
