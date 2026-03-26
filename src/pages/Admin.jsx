import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '../context/ProductContext';
import { categories as categoryList } from '../data/defaultProducts';

const CATEGORIES = categoryList.filter(c => c !== 'All');

const emptyProduct = {
  name: '',
  price: '',
  category: CATEGORIES[0],
  description: '',
  sizes: [],
  colors: [],
  featured: false,
  isNew: false,
  gradient: 'linear-gradient(145deg, #E8E2DA 0%, #D4CCC0 100%)',
  images: [],
};

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];
const GRADIENT_PRESETS = [
  { label: 'Noir', value: 'linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 40%, #1a1a1a 100%)' },
  { label: 'Ivory', value: 'linear-gradient(145deg, #F5F0EB 0%, #E8DFD4 40%, #DDD3C5 100%)' },
  { label: 'Navy', value: 'linear-gradient(145deg, #1B2838 0%, #243447 40%, #1B2838 100%)' },
  { label: 'Gold', value: 'linear-gradient(145deg, #C5A97C 0%, #D4BA8A 30%, #B8956A 70%, #C5A97C 100%)' },
  { label: 'Blush', value: 'linear-gradient(145deg, #E8D5D0 0%, #F0DDD6 40%, #E2CFC8 100%)' },
  { label: 'Charcoal', value: 'linear-gradient(145deg, #3A3A3A 0%, #4A4A4A 40%, #363636 100%)' },
  { label: 'Taupe', value: 'linear-gradient(145deg, #9C9489 0%, #ADA69D 40%, #8E8780 100%)' },
  { label: 'Cognac', value: 'linear-gradient(145deg, #8B6914 0%, #A67B2E 40%, #7A5C10 100%)' },
];

export default function Admin() {
  const { products, addProduct, updateProduct, deleteProduct, resetToDefaults } = useProducts();
  const [form, setForm] = useState({ ...emptyProduct });
  const [editingId, setEditingId] = useState(null);
  const [colorInput, setColorInput] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [toast, setToast] = useState('');
  const fileRef = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2400);
  };

  /* ── Image handling ── */
  const handleImageUpload = useCallback((files) => {
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        setForm(prev => ({
          ...prev,
          images: [...prev.images, e.target.result],
        }));
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files) {
      handleImageUpload(e.dataTransfer.files);
    }
  };

  const removeImage = (index) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const moveImage = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= form.images.length) return;
    setForm(prev => {
      const images = [...prev.images];
      const [moved] = images.splice(fromIndex, 1);
      images.splice(toIndex, 0, moved);
      return { ...prev, images };
    });
  };

  const setAsMainImage = (index) => {
    if (index === 0) return;
    moveImage(index, 0);
  };

  /* ── Size & Color ── */
  const toggleSize = (size) => {
    setForm(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const addColor = () => {
    const trimmed = colorInput.trim();
    if (trimmed && !form.colors.includes(trimmed)) {
      setForm(prev => ({
        ...prev,
        colors: [...prev.colors, trimmed],
      }));
      setColorInput('');
    }
  };

  const removeColor = (color) => {
    setForm(prev => ({
      ...prev,
      colors: prev.colors.filter(c => c !== color),
    }));
  };

  /* ── Form submit ── */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      showToast('Please fill in name and price');
      return;
    }

    const productData = {
      ...form,
      price: parseFloat(form.price),
    };

    if (editingId) {
      updateProduct(editingId, productData);
      showToast('Product updated');
    } else {
      addProduct(productData);
      showToast('Product added');
    }

    setForm({ ...emptyProduct });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      description: product.description || '',
      sizes: [...(product.sizes || [])],
      colors: [...(product.colors || [])],
      featured: product.featured || false,
      isNew: product.isNew || false,
      gradient: product.gradient || emptyProduct.gradient,
      images: [...(product.images || [])],
    });
    setEditingId(product.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Remove this piece from the collection?')) {
      deleteProduct(id);
      showToast('Product removed');
    }
  };

  const cancelEdit = () => {
    setForm({ ...emptyProduct });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div style={{ paddingTop: 'var(--nav-h)', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <section style={{
        padding: '60px 0 40px',
        borderBottom: '1px solid var(--border)',
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
          }}>
            <div>
              <p style={{
                fontFamily: 'var(--sans)',
                fontSize: '0.65rem',
                fontWeight: 500,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: 'var(--accent)',
                marginBottom: '12px',
              }}>
                Atelier
              </p>
              <h1 style={{
                fontFamily: 'var(--serif)',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 300,
                color: 'var(--text)',
              }}>
                Collection Manager
              </h1>
              <p style={{
                fontSize: '0.85rem',
                fontWeight: 300,
                color: 'var(--text-light)',
                marginTop: '8px',
              }}>
                {products.length} pieces in collection
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  if (window.confirm('Reset to default collection? This removes all custom products.')) {
                    resetToDefaults();
                    showToast('Collection reset');
                  }
                }}
                className="btn btn-sm"
                style={{
                  border: '1px solid var(--border)',
                  color: 'var(--text-light)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                }}
              >
                Reset
              </button>
              <button
                onClick={() => { setShowForm(true); setEditingId(null); setForm({ ...emptyProduct }); }}
                className="btn btn-gold btn-sm"
              >
                + Add Piece
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="container" style={{ padding: '40px 48px 120px' }}>
        {/* Product Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: 'hidden', marginBottom: '48px' }}
            >
              <form onSubmit={handleSubmit} style={{
                background: '#fff',
                padding: '40px',
                border: '1px solid var(--border)',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '36px',
                }}>
                  <h3 style={{
                    fontFamily: 'var(--serif)',
                    fontSize: '1.5rem',
                    fontWeight: 400,
                    color: 'var(--text)',
                  }}>
                    {editingId ? 'Edit Piece' : 'New Piece'}
                  </h3>
                  <button type="button" onClick={cancelEdit} style={{
                    fontSize: '0.7rem',
                    fontWeight: 400,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--text-light)',
                    textDecoration: 'underline',
                    textUnderlineOffset: '3px',
                  }}>
                    Cancel
                  </button>
                </div>

                {/* Image upload area */}
                <div style={{ marginBottom: '32px' }}>
                  <label className="input-label">Product Images</label>
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileRef.current?.click()}
                    style={{
                      border: `2px dashed ${dragActive ? 'var(--accent)' : 'var(--border)'}`,
                      background: dragActive ? 'rgba(184, 149, 106, 0.04)' : 'var(--bg)',
                      padding: '40px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      marginBottom: '16px',
                    }}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      border: '1px solid var(--border)',
                      transform: 'rotate(45deg)',
                      margin: '0 auto 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-light)" strokeWidth="1.5" style={{ transform: 'rotate(-45deg)' }}>
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                        <polyline points="17,8 12,3 7,8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    </div>
                    <p style={{
                      fontSize: '0.85rem',
                      fontWeight: 300,
                      color: 'var(--text-mid)',
                      marginBottom: '4px',
                    }}>
                      Drag & drop images here
                    </p>
                    <p style={{
                      fontSize: '0.75rem',
                      fontWeight: 300,
                      color: 'var(--text-light)',
                    }}>
                      or click to browse
                    </p>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => { handleImageUpload(e.target.files); e.target.value = ''; }}
                      style={{ display: 'none' }}
                    />
                  </div>

                  {/* Image previews with reordering */}
                  {form.images.length > 0 && (
                    <>
                      <p style={{
                        fontSize: '0.7rem',
                        fontWeight: 300,
                        color: 'var(--text-light)',
                        marginBottom: '10px',
                      }}>
                        First image is the main thumbnail. Use arrows to reorder.
                      </p>
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        {form.images.map((img, i) => (
                          <div key={i} style={{
                            position: 'relative',
                            width: '100px',
                            height: '130px',
                            overflow: 'hidden',
                            border: i === 0 ? '2px solid var(--accent)' : '1px solid var(--border)',
                            flexShrink: 0,
                          }}>
                            <img src={img} alt="" style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }} />

                            {/* "Main" badge on first image */}
                            {i === 0 && (
                              <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                background: 'var(--accent)',
                                color: '#fff',
                                fontSize: '0.5rem',
                                fontWeight: 600,
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase',
                                textAlign: 'center',
                                padding: '3px 0',
                              }}>
                                Main
                              </div>
                            )}

                            {/* Reorder & action buttons */}
                            <div style={{
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: 0,
                              display: 'flex',
                              background: 'rgba(0,0,0,0.65)',
                            }}>
                              {/* Move left */}
                              <button
                                type="button"
                                onClick={() => moveImage(i, i - 1)}
                                disabled={i === 0}
                                style={{
                                  flex: 1,
                                  padding: '5px 0',
                                  color: i === 0 ? 'rgba(255,255,255,0.2)' : '#fff',
                                  fontSize: '0.7rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                                title="Move left"
                              >
                                ‹
                              </button>

                              {/* Set as main */}
                              {i !== 0 && (
                                <button
                                  type="button"
                                  onClick={() => setAsMainImage(i)}
                                  style={{
                                    flex: 1,
                                    padding: '5px 0',
                                    color: '#fff',
                                    fontSize: '0.5rem',
                                    fontWeight: 500,
                                    letterSpacing: '0.08em',
                                    textTransform: 'uppercase',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderLeft: '1px solid rgba(255,255,255,0.15)',
                                    borderRight: '1px solid rgba(255,255,255,0.15)',
                                  }}
                                  title="Set as main image"
                                >
                                  Main
                                </button>
                              )}

                              {/* Move right */}
                              <button
                                type="button"
                                onClick={() => moveImage(i, i + 1)}
                                disabled={i === form.images.length - 1}
                                style={{
                                  flex: 1,
                                  padding: '5px 0',
                                  color: i === form.images.length - 1 ? 'rgba(255,255,255,0.2)' : '#fff',
                                  fontSize: '0.7rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                                title="Move right"
                              >
                                ›
                              </button>
                            </div>

                            {/* Remove button */}
                            <button
                              type="button"
                              onClick={() => removeImage(i)}
                              style={{
                                position: 'absolute',
                                top: i === 0 ? '22px' : '4px',
                                right: '4px',
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                background: 'rgba(0,0,0,0.6)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.7rem',
                                lineHeight: 1,
                              }}
                            >
                              &times;
                            </button>

                            {/* Position number */}
                            <div style={{
                              position: 'absolute',
                              top: i === 0 ? '22px' : '4px',
                              left: '4px',
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              background: 'rgba(0,0,0,0.5)',
                              color: '#fff',
                              fontSize: '0.55rem',
                              fontWeight: 600,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                              {i + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Name & Price row */}
                <div className="admin-row-2">
                  <div>
                    <label className="input-label">Name</label>
                    <input
                      className="input"
                      placeholder="e.g. Silk Evening Gown"
                      value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="input-label">Price ($)</label>
                    <input
                      className="input"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={form.price}
                      onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                {/* Category */}
                <div style={{ marginBottom: '24px' }}>
                  <label className="input-label">Category</label>
                  <select
                    className="select"
                    value={form.category}
                    onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Toggles: Featured & New */}
                <div style={{
                  display: 'flex',
                  gap: '32px',
                  marginBottom: '24px',
                }}>
                  {[
                    { key: 'featured', label: 'Featured piece' },
                    { key: 'isNew', label: 'New arrival' },
                  ].map(({ key, label }) => (
                    <label key={key} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                    }}>
                      <div
                        onClick={() => setForm(p => ({ ...p, [key]: !p[key] }))}
                        style={{
                          width: '20px',
                          height: '20px',
                          border: `1.5px solid ${form[key] ? 'var(--accent)' : 'var(--border)'}`,
                          background: form[key] ? 'var(--accent)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease',
                          cursor: 'pointer',
                        }}
                      >
                        {form[key] && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                            <polyline points="20,6 9,17 4,12" />
                          </svg>
                        )}
                      </div>
                      <span style={{
                        fontSize: '0.8rem',
                        fontWeight: 300,
                        color: 'var(--text-mid)',
                      }}>
                        {label}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Description */}
                <div style={{ marginBottom: '24px' }}>
                  <label className="input-label">Description</label>
                  <textarea
                    className="textarea"
                    placeholder="Describe the piece, its materials, and craftsmanship..."
                    value={form.description}
                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    rows={4}
                  />
                </div>

                {/* Sizes */}
                <div style={{ marginBottom: '24px' }}>
                  <label className="input-label">Sizes</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                    {SIZE_OPTIONS.map(size => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        style={{
                          padding: '8px 16px',
                          border: form.sizes.includes(size) ? '1.5px solid var(--text)' : '1px solid var(--border)',
                          background: form.sizes.includes(size) ? 'var(--text)' : 'transparent',
                          color: form.sizes.includes(size) ? 'var(--text-inv)' : 'var(--text-mid)',
                          fontSize: '0.75rem',
                          fontWeight: 400,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div style={{ marginBottom: '24px' }}>
                  <label className="input-label">Colors</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '8px' }}>
                    <input
                      className="input"
                      style={{ flex: 1, maxWidth: '200px' }}
                      placeholder="e.g. Noir"
                      value={colorInput}
                      onChange={e => setColorInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addColor(); } }}
                    />
                    <button
                      type="button"
                      onClick={addColor}
                      className="btn btn-sm"
                      style={{ padding: '10px 20px' }}
                    >
                      Add
                    </button>
                  </div>
                  {form.colors.length > 0 && (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
                      {form.colors.map(color => (
                        <span key={color} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '6px 14px',
                          background: 'var(--bg-alt)',
                          fontSize: '0.78rem',
                          fontWeight: 300,
                          color: 'var(--text-mid)',
                        }}>
                          {color}
                          <button
                            type="button"
                            onClick={() => removeColor(color)}
                            style={{ fontSize: '0.8rem', color: 'var(--text-light)', lineHeight: 1 }}
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Gradient (placeholder background) */}
                <div style={{ marginBottom: '36px' }}>
                  <label className="input-label">Placeholder Background</label>
                  <p style={{
                    fontSize: '0.75rem',
                    fontWeight: 300,
                    color: 'var(--text-light)',
                    marginBottom: '12px',
                  }}>
                    Shown when no product image is uploaded
                  </p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {GRADIENT_PRESETS.map(preset => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setForm(p => ({ ...p, gradient: preset.value }))}
                        style={{
                          width: '48px',
                          height: '48px',
                          background: preset.value,
                          border: form.gradient === preset.value ? '2px solid var(--accent)' : '1px solid var(--border)',
                          cursor: 'pointer',
                          transition: 'border-color 0.2s ease',
                          position: 'relative',
                        }}
                        title={preset.label}
                      />
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="submit" className="btn btn-filled">
                    {editingId ? 'Update Piece' : 'Add to Collection'}
                  </button>
                  <button type="button" onClick={cancelEdit} className="btn">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product list */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
          }}>
            <h3 style={{
              fontFamily: 'var(--serif)',
              fontSize: '1.3rem',
              fontWeight: 400,
              color: 'var(--text)',
            }}>
              All Pieces
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="admin-row"
              >
                {/* Thumbnail */}
                <div style={{
                  width: '52px',
                  height: '68px',
                  overflow: 'hidden',
                  flexShrink: 0,
                }}>
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt="" style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }} />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      background: product.gradient || 'var(--bg-alt)',
                    }} />
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{
                    fontFamily: 'var(--serif)',
                    fontSize: '1rem',
                    fontWeight: 400,
                    color: 'var(--text)',
                    marginBottom: '2px',
                  }}>
                    {product.name}
                  </h4>
                  <p style={{
                    fontSize: '0.72rem',
                    fontWeight: 300,
                    color: 'var(--text-light)',
                  }}>
                    {product.category}
                    {product.isNew && ' · New'}
                    {product.featured && ' · Featured'}
                    {product.images?.length > 0 && ` · ${product.images.length} image${product.images.length > 1 ? 's' : ''}`}
                  </p>
                </div>

                {/* Price */}
                <span className="admin-col-hide" style={{
                  fontSize: '0.9rem',
                  fontWeight: 300,
                  color: 'var(--text)',
                  width: '80px',
                  textAlign: 'right',
                }}>
                  ${product.price}
                </span>

                {/* Sizes */}
                <span className="admin-col-hide-sm" style={{
                  fontSize: '0.72rem',
                  fontWeight: 300,
                  color: 'var(--text-light)',
                  width: '100px',
                }}>
                  {product.sizes?.join(', ') || '—'}
                </span>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <button
                    onClick={() => handleEdit(product)}
                    style={{
                      padding: '6px 16px',
                      border: '1px solid var(--border)',
                      fontSize: '0.65rem',
                      fontWeight: 500,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--text-mid)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      background: 'transparent',
                      fontFamily: 'var(--sans)',
                    }}
                    onMouseEnter={e => {
                      e.target.style.borderColor = 'var(--text)';
                      e.target.style.color = 'var(--text)';
                    }}
                    onMouseLeave={e => {
                      e.target.style.borderColor = 'var(--border)';
                      e.target.style.color = 'var(--text-mid)';
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Toast */}
      <div className={`toast ${toast ? 'show' : ''}`}>
        {toast}
      </div>

      <style>{`
        .admin-row-2 {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
          margin-bottom: 24px;
        }
        .admin-row {
          display: flex;
          gap: 20px;
          align-items: center;
          padding: 16px 20px;
          background: #fff;
          border: 1px solid var(--border);
          margin-bottom: -1px;
        }
        @media (max-width: 1024px) {
          .admin-row-2 { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .admin-col-hide-sm { display: none; }
        }
        @media (max-width: 540px) {
          .admin-col-hide { display: none; }
        }
      `}</style>
    </div>
  );
}
