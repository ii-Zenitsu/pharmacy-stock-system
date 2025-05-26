import React from 'react';
import { useCart } from '../hooks/useCart';
import { Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';

/**
 * Example Cart Component demonstrating the use of the cart slice
 * 
 * This component shows how to:
 * - Add items to cart
 * - Remove items from cart
 * - Update item quantities
 * - Display cart contents
 * - Clear the entire cart
 */
export default function CartExample() {  const {
    cartItems,
    totalItems,
    loading,
    error,
    addItem,
    removeItem,
    updateQuantity,
    increment,
    decrement,
    clear,
    isInCart,
    isAtMaxQuantity
  } = useCart();
  // Example items to add to cart
  const sampleItems = [
    { id: 1, name: "Paracetamol", price: 15.00, stock: 50 },
    { id: 2, name: "Ibuprofen", price: 25.50, stock: 30 },
    { id: 3, name: "Aspirin", price: 12.75, stock: 100 },
  ];

  const handleAddToCart = (item) => {
    addItem(item.id, 1, item.stock);
  };

  const handleQuantityChange = (id, quantity) => {
    const numQuantity = parseInt(quantity);
    if (numQuantity > 0) {
      updateQuantity(id, numQuantity);
    } else {
      removeItem(id);
    }
  };

  if (loading) {
    return <div className="text-center">Loading cart...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sample Items Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <ShoppingCart size={20} />
            Available Items
          </h2>
          <div className="space-y-3">            {sampleItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-gray-600">${item.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Stock: {item.stock}</p>
                </div>
                <button
                  onClick={() => handleAddToCart(item)}
                  className={`btn btn-sm ${isInCart(item.id) ? 'btn-secondary' : 'btn-primary'}`}
                  disabled={isInCart(item.id)}
                >
                  {isInCart(item.id) ? 'In Cart' : 'Add to Cart'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ShoppingCart size={20} />
              Cart ({totalItems} items)
            </h2>
            {cartItems.length > 0 && (
              <button
                onClick={clear}
                className="btn btn-error btn-sm"
              >
                <Trash2 size={16} />
                Clear All
              </button>
            )}
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Your cart is empty
            </div>
          ) : (
            <div className="space-y-3">              {cartItems.map((cartItem) => {
                const item = sampleItems.find(i => i.id === cartItem.id);
                return (
                  <div key={cartItem.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <h3 className="font-medium">{item?.name || `Item ${cartItem.id}`}</h3>
                      <p className="text-gray-600">
                        ${item?.price?.toFixed(2) || '0.00'} each
                      </p>
                      <p className="text-xs text-gray-500">
                        {cartItem.quantity}/{cartItem.max_quantity || '∞'} available
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decrement(cartItem.id)}
                        className="btn btn-circle btn-sm btn-outline"
                      >
                        <Minus size={14} />
                      </button>
                      <input
                        type="number"
                        value={cartItem.quantity}
                        onChange={(e) => handleQuantityChange(cartItem.id, e.target.value)}
                        className="input input-sm w-16 text-center"
                        min="1"
                        max={cartItem.max_quantity || undefined}                      />                      <button
                        onClick={() => increment(cartItem.id)}
                        className="btn btn-circle btn-sm btn-outline"
                        disabled={isAtMaxQuantity(cartItem.id)}
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        onClick={() => removeItem(cartItem.id)}
                        className="btn btn-circle btn-sm btn-error"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Cart Summary */}
      {cartItems.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-2">Cart Summary</h3>
          <div className="space-y-1">
            <p>Total Items: {totalItems}</p>
            <p>
              Total Value: $
              {cartItems
                .reduce((total, cartItem) => {
                  const item = sampleItems.find(i => i.id === cartItem.id);
                  return total + (item?.price || 0) * cartItem.quantity;
                }, 0)
                .toFixed(2)}
            </p>
          </div>
        </div>
      )}

      {/* Usage Instructions */}
      <div className="mt-6 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-2">Cart Slice Usage</h3>        <div className="text-sm space-y-1">
          <p><strong>Cart Structure:</strong> Each item has {'{id, quantity, max_quantity}'}</p>
          <p><strong>Import hook:</strong> import {'{useCart}'} from '../hooks/useCart'</p>
          <p><strong>Available actions:</strong> addItem, removeItem, updateQuantity, increment, decrement, clear</p>
          <p><strong>State access:</strong> cartItems, totalItems, loading, error, isInCart, isAtMaxQuantity, getCartItem</p>
        </div>
      </div>
    </div>
  );
}
