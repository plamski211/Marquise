import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2400);
  }, []);

  const updateFromResponse = useCallback((data) => {
    // Map API response to match the shape components expect
    const mapped = data.items.map(item => ({
      key: item.id, // use the DB id as key
      id: item.product_id,
      name: item.name,
      price: item.price,
      size: item.size || '',
      color: item.color || '',
      gradient: item.gradient,
      image: item.image || null,
      qty: item.quantity,
      slug: item.slug,
    }));
    setItems(mapped);
    setTotalItems(data.totalItems);
    setTotalPrice(data.totalPrice);
  }, []);

  // Load cart on mount
  useEffect(() => {
    api.get('/api/cart')
      .then(updateFromResponse)
      .catch(() => {}); // silently fail on initial load
  }, [updateFromResponse]);

  const addItem = useCallback(async (product, selectedSize, selectedColor) => {
    try {
      const data = await api.post('/api/cart', {
        product_id: product.id,
        size: selectedSize,
        color: selectedColor,
        quantity: 1,
      });
      updateFromResponse(data);
      showToast('Added to bag');
    } catch (err) {
      showToast('Could not add to bag');
      console.error('Add to cart failed:', err);
    }
  }, [showToast, updateFromResponse]);

  const removeItem = useCallback(async (key) => {
    try {
      const data = await api.delete(`/api/cart/${key}`);
      updateFromResponse(data);
    } catch (err) {
      console.error('Remove from cart failed:', err);
    }
  }, [updateFromResponse]);

  const updateQty = useCallback(async (key, qty) => {
    try {
      if (qty < 1) {
        return removeItem(key);
      }
      const data = await api.put(`/api/cart/${key}`, { quantity: qty });
      updateFromResponse(data);
    } catch (err) {
      console.error('Update cart failed:', err);
    }
  }, [removeItem, updateFromResponse]);

  const clearCart = useCallback(async () => {
    try {
      const data = await api.delete('/api/cart');
      updateFromResponse(data);
    } catch (err) {
      console.error('Clear cart failed:', err);
    }
  }, [updateFromResponse]);

  return (
    <CartContext.Provider value={{
      items, isOpen, setIsOpen,
      addItem, removeItem, updateQty, clearCart,
      totalItems, totalPrice,
      toast, showToast,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
