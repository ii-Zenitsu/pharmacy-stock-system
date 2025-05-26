import { createSlice } from '@reduxjs/toolkit';
import Cookies from "js-cookie";

// Helper functions for cookie management
const loadCartFromCookies = () => {
  try {
    const cartData = Cookies.get('cartItems');
    return cartData ? JSON.parse(cartData) : [];
  } catch (error) {
    console.error('Error loading cart from cookies:', error);
    return [];
  }
};

const saveCartToCookies = (cartItems) => {
  try {
    Cookies.set('cartItems', JSON.stringify(cartItems), { expires: 7 });
  } catch (error) {
    console.error('Error saving cart to cookies:', error);
  }
};

const initialState = {
  cartItems: loadCartFromCookies(),
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const { id, quantity = 1, max_quantity, price, name } = action.payload;
      const existingItem = state.cartItems.find(item => item.id === id);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        existingItem.quantity = max_quantity ? Math.min(newQuantity, max_quantity) : newQuantity;
      } else {
        state.cartItems.push({ id, quantity, max_quantity, price, name });
      }
      saveCartToCookies(state.cartItems);
    },
    removeFromCart(state, action) {
      const id = action.payload;
      state.cartItems = state.cartItems.filter(item => item.id !== id);
      saveCartToCookies(state.cartItems);
    },
    updateCartItemQuantity(state, action) {
      const { id, quantity } = action.payload;
      const existingItem = state.cartItems.find(item => item.id === id);
      
      if (existingItem) {
        if (quantity <= 0) {
          state.cartItems = state.cartItems.filter(item => item.id !== id);
        } else {
          const maxQuantity = existingItem.max_quantity;
          existingItem.quantity = maxQuantity ? Math.min(quantity, maxQuantity) : quantity;
        }
      }
      saveCartToCookies(state.cartItems);
    },
    incrementCartItem(state, action) {
      const id = action.payload;
      const existingItem = state.cartItems.find(item => item.id === id);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + 1;
        existingItem.quantity = existingItem.max_quantity ? Math.min(newQuantity, existingItem.max_quantity) : newQuantity;
      }
      saveCartToCookies(state.cartItems);
    },
    decrementCartItem(state, action) {
      const id = action.payload;
      const existingItem = state.cartItems.find(item => item.id === id);
      
      if (existingItem) {
        if (existingItem.quantity <= 1) {
          state.cartItems = state.cartItems.filter(item => item.id !== id);
        } else {
          existingItem.quantity -= 1;
        }
      }
      saveCartToCookies(state.cartItems);
    },
    clearCart(state) {
      state.cartItems = [];
      saveCartToCookies(state.cartItems);
    },
    setCartItems(state, action) {
      state.cartItems = action.payload;
      saveCartToCookies(state.cartItems);
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    }
  },
});

export const { 
  addToCart, 
  removeFromCart, 
  updateCartItemQuantity, 
  incrementCartItem, 
  decrementCartItem, 
  clearCart, 
  setCartItems, 
  setLoading, 
  setError 
} = cartSlice.actions;

const CartReducer = cartSlice.reducer;

export default CartReducer;
