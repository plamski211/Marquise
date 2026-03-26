import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import defaultProducts from '../data/defaultProducts';

const STORAGE_KEY = 'marquise_products';
const ProductContext = createContext();

function loadProducts() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return defaultProducts;
}

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(loadProducts);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const addProduct = useCallback((product) => {
    const newProduct = {
      ...product,
      id: 'p' + Date.now(),
      isNew: product.isNew !== undefined ? product.isNew : true,
    };
    setProducts(prev => [newProduct, ...prev]);
    return newProduct;
  }, []);

  const updateProduct = useCallback((id, updates) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const deleteProduct = useCallback((id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const getProduct = useCallback((id) => {
    return products.find(p => p.id === id) || null;
  }, [products]);

  const getByCategory = useCallback((category) => {
    if (!category || category === 'All') return products;
    return products.filter(p => p.category === category);
  }, [products]);

  const getFeatured = useCallback(() => {
    return products.filter(p => p.featured);
  }, [products]);

  const getNew = useCallback(() => {
    return products.filter(p => p.isNew);
  }, [products]);

  const resetToDefaults = useCallback(() => {
    setProducts(defaultProducts);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <ProductContext.Provider value={{
      products, addProduct, updateProduct, deleteProduct,
      getProduct, getByCategory, getFeatured, getNew,
      resetToDefaults,
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => useContext(ProductContext);
