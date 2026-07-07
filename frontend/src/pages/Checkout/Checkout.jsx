import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSelector, useDispatch } from 'react-redux';
import { saveShippingAddress, clearCartItems } from '../../redux/slices/cartSlice';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

const schema = z.object({
  fullName: z.string().min(2, { message: 'Full name is required' }),
  address: z.string().min(5, { message: 'Address is required' }),
  city: z.string().min(2, { message: 'City is required' }),
  postalCode: z.string().min(3, { message: 'Postal code is required' }),
  country: z.string().min(2, { message: 'Country is required' }),
});

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const [step, setStep] = useState(1);
  const [placingOrder, setPlacingOrder] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: cart.shippingAddress,
  });

  const onSubmitShipping = (data) => {
    dispatch(saveShippingAddress(data));
    setStep(2); // Move to payment
  };

  const handlePlaceOrder = async () => {
    setPlacingOrder(true);
    try {
      await api.post('/orders', {
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: 'Credit Card (Stripe)',
        itemsPrice: cart.itemsPrice,
        taxPrice: cart.taxPrice,
        shippingPrice: cart.shippingPrice,
        totalPrice: cart.totalPrice
      });
      dispatch(clearCartItems());
      toast.success('Order placed successfully!');
      navigate('/profile'); // Redirect to user dashboard to see order
    } catch (error) {
      toast.error('Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold text-text mb-8">Checkout</h1>
      
      {/* Stepper */}
      <div className="flex items-center mb-12">
        <div className={`flex-1 border-b-2 pb-4 text-center ${step >= 1 ? 'border-primary text-primary font-bold' : 'border-gray-200 text-gray-400'}`}>1. Shipping</div>
        <div className={`flex-1 border-b-2 pb-4 text-center ${step >= 2 ? 'border-primary text-primary font-bold' : 'border-gray-200 text-gray-400'}`}>2. Payment</div>
        <div className={`flex-1 border-b-2 pb-4 text-center ${step >= 3 ? 'border-primary text-primary font-bold' : 'border-gray-200 text-gray-400'}`}>3. Place Order</div>
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        <div className="flex-1">
          {step === 1 && (
            <form onSubmit={handleSubmit(onSubmitShipping)} className="space-y-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input {...register('fullName')} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20" />
                {errors.fullName && <p className="text-error text-xs mt-1">{errors.fullName.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input {...register('address')} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20" />
                {errors.address && <p className="text-error text-xs mt-1">{errors.address.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input {...register('city')} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20" />
                  {errors.city && <p className="text-error text-xs mt-1">{errors.city.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                  <input {...register('postalCode')} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20" />
                  {errors.postalCode && <p className="text-error text-xs mt-1">{errors.postalCode.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input {...register('country')} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20" />
                {errors.country && <p className="text-error text-xs mt-1">{errors.country.message}</p>}
              </div>

              <button type="submit" className="btn-primary w-full mt-6">Continue to Payment</button>
            </form>
          )}

          {step === 2 && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border border-primary bg-primary/5 rounded-xl cursor-pointer">
                  <input type="radio" name="payment" defaultChecked className="accent-primary" />
                  <span className="font-medium text-text">Credit Card (Stripe)</span>
                </label>
                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-gray-300">
                  <input type="radio" name="payment" className="accent-primary" />
                  <span className="font-medium text-gray-600">PayPal</span>
                </label>
              </div>
              <div className="flex gap-4 mt-8">
                <button onClick={() => setStep(1)} className="px-6 py-3 rounded-xl border border-gray-200 font-medium hover:bg-gray-50">Back</button>
                <button onClick={() => setStep(3)} className="btn-primary flex-1">Continue to Review</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-4">Review Order</h2>
              {/* Review items would go here */}
              <p className="text-gray-500 mb-6">Review your items and shipping details before placing the order.</p>
              <div className="flex gap-4">
                <button onClick={() => setStep(2)} className="px-6 py-3 rounded-xl border border-gray-200 font-medium hover:bg-gray-50">Back</button>
                <button 
                  onClick={handlePlaceOrder}
                  disabled={placingOrder}
                  className="btn-primary flex-1 bg-success text-white disabled:opacity-50"
                >
                  {placingOrder ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="w-full md:w-80">
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <h3 className="font-bold text-text mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between"><span>Items:</span> <span>PKR {cart.itemsPrice}</span></div>
              <div className="flex justify-between"><span>Shipping:</span> <span>PKR {cart.shippingPrice}</span></div>
              <div className="flex justify-between"><span>Tax:</span> <span>PKR {cart.taxPrice}</span></div>
            </div>
            <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-lg">
              <span>Total:</span> <span className="text-primary">PKR {cart.totalPrice}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
