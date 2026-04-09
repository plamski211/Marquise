import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setError(null);
      const data = await api.get('/api/products');
      setProducts(data);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = useCallback(async (productData) => {
    const product = await api.post('/api/products', productData);
    setProducts(prev => [product, ...prev]);
    return product;
  }, []);

  const updateProduct = useCallback(async (id, updates) => {
    const product = await api.put(`/api/products/${id}`, updates);
    setProducts(prev => prev.map(p => p.id === id ? product : p));
    return product;
  }, []);

  const deleteProduct = useCallback(async (id) => {
    await api.delete(`/api/products/${id}`);
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const getProduct = useCallback((id) => {
    return products.find(p => p.id === id || p.slug === id) || null;
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

  return (
    <ProductContext.Provider value={{
      products, loading, error,
      addProduct, updateProduct, deleteProduct,
      getProduct, getByCategory, getFeatured, getNew,
      refreshProducts: fetchProducts,
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => useContext(ProductContext);
