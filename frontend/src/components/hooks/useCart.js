import { useSelector, useDispatch } from 'react-redux';
import { 
  addToCart, 
  removeFromCart, 
  updateCartItemQuantity, 
  incrementCartItem, 
  decrementCartItem, 
  clearCart 
} from '../Redux/slices/CartSlice';

export function useCart() {
  const dispatch = useDispatch();
  const { cartItems, loading, error } = useSelector((state) => state.cart);

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const totalItemPrice = (id) => {
    const item = getCartItem(id);
    return item ? item.price * item.quantity : 0;
  };

  // Get cart item by id
  const getCartItem = (id) => cartItems.find(item => item.id === id);

  // Check if item is in cart
  const isInCart = (id) => cartItems.some(item => item.id === id);
  // const isInCart = (id, name) => cartItems.some(item => item.id === id || item.name === name);

  // Check if item is at maximum quantity
  const isAtMaxQuantity = (id) => {
    const item = getCartItem(id);
    return item && item.max_quantity && item.quantity >= item.max_quantity;
  };
  // Cart actions
  const addItem = (id, quantity = 1, max_quantity, price, name) => {
    dispatch(addToCart({ id, quantity, max_quantity, price, name }));
  };

  const removeItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const updateQuantity = (id, quantity) => {
    dispatch(updateCartItemQuantity({ id, quantity }));
  };

  const increment = (id) => {
    dispatch(incrementCartItem(id));
  };

  const decrement = (id) => {
    dispatch(decrementCartItem(id));
  };

  const clear = () => {
    dispatch(clearCart());
  };

  return {
    cartItems,
    totalItems,
    totalPrice,
    totalItemPrice,
    loading,
    error,
    getCartItem,
    isInCart,
    isAtMaxQuantity,
    addItem,
    removeItem,
    updateQuantity,
    increment,
    decrement,
    clear
  };
}
