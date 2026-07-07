import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { TrashIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { removeFromCart, addToCart } from '../../redux/slices/cartSlice';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, totalPrice, itemsPrice, taxPrice, shippingPrice } = useSelector((state) => state.cart);

  const checkoutHandler = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 md:px-8 py-20 text-center">
        <h2 className="text-3xl font-bold text-text mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
      <h1 className="text-3xl font-bold text-text mb-8">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1">
          <div className="space-y-6">
            {cartItems.map((item, index) => (
              <div key={index} className="flex gap-6 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 items-center">
                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl" />
                <div className="flex-1">
                  <Link to={`/product/${item.product}`} className="font-semibold text-text hover:text-primary transition-colors">
                    {item.name}
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">Color: {item.variant?.color} | Size: {item.variant?.size}</p>
                  <p className="font-bold text-primary mt-2">PKR {item.price.toFixed(2)}</p>
                </div>
                
                <div className="flex items-center border-2 border-gray-100 rounded-xl px-3">
                  <button onClick={() => dispatch(addToCart({...item, qty: Math.max(1, item.qty - 1)}))} className="p-2 hover:text-primary transition-colors">-</button>
                  <span className="w-8 text-center">{item.qty}</span>
                  <button onClick={() => dispatch(addToCart({...item, qty: item.qty + 1}))} className="p-2 hover:text-primary transition-colors">+</button>
                </div>
                
                <button 
                  onClick={() => dispatch(removeFromCart({ product: item.product, variant: item.variant }))}
                  className="p-3 text-gray-400 hover:text-error hover:bg-error/10 rounded-xl transition-colors"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="w-full lg:w-[400px]">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-text mb-6">Order Summary</h3>
            
            <div className="space-y-4 text-sm text-gray-600 mb-6">
              <div className="flex justify-between">
                <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
                <span className="font-medium text-text">PKR {itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-medium text-text">{shippingPrice === 0 ? 'Free' : `PKR ${shippingPrice.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span className="font-medium text-text">PKR {taxPrice.toFixed(2)}</span>
              </div>
              
              <div className="pt-4 border-t border-gray-100 flex justify-between text-lg font-bold text-text">
                <span>Total</span>
                <span className="text-primary">PKR {totalPrice}</span>
              </div>
            </div>
            
            <button 
              onClick={checkoutHandler}
              className="w-full btn-primary flex items-center justify-center gap-2 group"
            >
              Proceed to Checkout
              <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
