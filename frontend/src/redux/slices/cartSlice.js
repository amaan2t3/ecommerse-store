import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: localStorage.getItem('cartItems') 
    ? JSON.parse(localStorage.getItem('cartItems')) 
    : [],
  shippingAddress: localStorage.getItem('shippingAddress') 
    ? JSON.parse(localStorage.getItem('shippingAddress')) 
    : {},
  paymentMethod: 'Stripe',
  itemsPrice: 0,
  shippingPrice: 0,
  taxPrice: 0,
  totalPrice: 0,
};

// Helper function to update prices
const updateCartState = (state) => {
  // Calculate prices
  state.itemsPrice = state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  state.shippingPrice = state.itemsPrice > 100 ? 0 : 10;
  state.taxPrice = Number((0.15 * state.itemsPrice).toFixed(2));
  state.totalPrice = (
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  ).toFixed(2);

  localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x.product === item.product && x.variant?.color === item.variant?.color && x.variant?.size === item.variant?.size);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x.product === existItem.product && x.variant?.color === existItem.variant?.color && x.variant?.size === existItem.variant?.size ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }
      updateCartState(state);
    },
    removeFromCart: (state, action) => {
      const { product, variant } = action.payload;
      state.cartItems = state.cartItems.filter(
        (x) => !(x.product === product && x.variant?.color === variant?.color && x.variant?.size === variant?.size)
      );
      updateCartState(state);
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('paymentMethod', JSON.stringify(action.payload));
    },
    clearCartItems: (state) => {
      state.cartItems = [];
      updateCartState(state);
    },
  },
});

export const { addToCart, removeFromCart, saveShippingAddress, savePaymentMethod, clearCartItems } = cartSlice.actions;
export default cartSlice.reducer;
