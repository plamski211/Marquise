import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const { getProduct, products } = useProducts();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const p = getProduct(id);
    if (p) {
      setProduct(p);
      setSelectedSize(p.sizes?.[0] || '');
      setSelectedColor(p.colors?.[0] || '');
      setActiveImage(0);
    }
    window.scrollTo(0, 0);
  }, [id, getProduct]);

  if (!product) {
    return (
      <div style={{ paddingTop: 'var(--nav-h)', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--serif)', fontSize: '1.3rem', color: 'var(--text-mid)', marginBottom: '16px' }}>Piece not found</p>
          <Link to="/shop" className="btn btn-sm">Back to Collection</Link>
        </div>
      </div>
    );
  }

  const hasImages = product.images && product.images.length > 0;
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const showSizes = product.sizes?.length > 0 && product.sizes[0] !== 'One Size';
  const showColors = product.colors?.length > 0;

  return (
    <div style={{ paddingTop: 'var(--nav-h)' }}>
      {/* Breadcrumb */}
      <div className="container" style={{ padding: '16px var(--px)' }}>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {[
            { label: 'Home', to: '/' },
            { label: 'Collection', to: '/shop' },
          ].map((b, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Link to={b.to} style={{ fontSize: '0.68rem', color: 'var(--text-light)', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'var(--text)'} onMouseLeave={e => e.target.style.color = 'var(--text-light)'}>{b.label}</Link>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-light)' }}>/</span>
            </span>
          ))}
          <span style={{ fontSize: '0.68rem', color: 'var(--text-mid)' }}>{product.name}</span>
        </div>
      </div>

      {/* Product */}
      <div className="container pdp-grid">
        {/* Image */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <div style={{
            aspectRatio: '3 / 4',
            overflow: 'hidden',
            background: 'var(--bg-alt)',
          }}>
            {hasImages ? (
              <img src={product.images[activeImage]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', background: product.gradient || '#F0EEEC' }} />
            )}
          </div>

          {hasImages && product.images.length > 1 && (
            <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)} style={{
                  width: '64px', height: '84px', overflow: 'hidden', padding: 0,
                  border: activeImage === i ? '2px solid var(--text)' : '1px solid var(--border)',
                  opacity: activeImage === i ? 1 : 0.5,
                  transition: 'opacity 0.2s ease',
                }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Details */}
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.15 }} style={{ paddingTop: '8px' }}>
          <p className="label" style={{ marginBottom: '12px', color: 'var(--text-light)' }}>{product.category}</p>

          <h1 style={{
            fontFamily: 'var(--serif)',
            fontSize: 'clamp(2rem, 3.5vw, 3rem)',
            fontWeight: 300,
            lineHeight: 1.1,
            marginBottom: '16px',
          }}>
            {product.name}
          </h1>

          <p style={{
            fontFamily: 'var(--serif)',
            fontSize: '1.4rem',
            fontWeight: 300,
            color: 'var(--text)',
            marginBottom: '32px',
          }}>
            ${product.price}
          </p>

          {product.description && (
            <p style={{
              fontSize: '0.88rem',
              fontWeight: 300,
              lineHeight: 1.75,
              color: 'var(--text-mid)',
              marginBottom: '40px',
              maxWidth: '480px',
            }}>
              {product.description}
            </p>
          )}

          {/* Color */}
          {showColors && (
            <div style={{ marginBottom: '28px' }}>
              <p className="label" style={{ marginBottom: '12px' }}>
                Color — <span style={{ fontWeight: 400, color: 'var(--text)', letterSpacing: '0.02em', textTransform: 'none' }}>{selectedColor}</span>
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {product.colors.map(c => (
                  <button key={c} onClick={() => setSelectedColor(c)} style={{
                    padding: '9px 20px',
                    border: selectedColor === c ? '1.5px solid var(--text)' : '1px solid var(--border)',
                    fontFamily: 'var(--sans)', fontSize: '0.75rem', fontWeight: 300, color: 'var(--text)',
                    background: 'transparent', transition: 'all 0.2s ease',
                  }}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size */}
          {showSizes && (
            <div style={{ marginBottom: '36px' }}>
              <p className="label" style={{ marginBottom: '12px' }}>
                Size — <span style={{ fontWeight: 400, color: 'var(--text)', letterSpacing: '0.02em', textTransform: 'none' }}>{selectedSize}</span>
              </p>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {product.sizes.map(s => (
                  <button key={s} onClick={() => setSelectedSize(s)} style={{
                    width: '48px', height: '48px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: selectedSize === s ? '1.5px solid var(--text)' : '1px solid var(--border)',
                    background: selectedSize === s ? 'var(--text)' : 'transparent',
                    color: selectedSize === s ? 'var(--text-inv)' : 'var(--text)',
                    fontFamily: 'var(--sans)', fontSize: '0.72rem', fontWeight: 400,
                    transition: 'all 0.2s ease',
                  }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to bag */}
          <button onClick={() => addItem(product, selectedSize, selectedColor)}
            className="btn btn-filled btn-lg"
            style={{ width: '100%', marginBottom: '16px' }}
          >
            Add to Bag
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '28px', paddingTop: '28px', borderTop: '1px solid var(--border)' }}>
            {['Complimentary shipping', 'Free returns within 30 days', 'Gift wrapping available'].map(t => (
              <p key={t} style={{ fontSize: '0.76rem', fontWeight: 300, color: 'var(--text-light)' }}>{t}</p>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section style={{ padding: '80px 0 120px', background: 'var(--bg-alt)' }}>
          <div className="container">
            <h2 style={{ marginBottom: '48px' }}>You May Also Like</h2>
            <div className="related-grid">
              {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </div>
        </section>
      )}

      <style>{`
        .pdp-grid {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 80px;
          padding: 24px 48px 120px;
          align-items: start;
        }
        .related-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px 20px;
        }
        @media (max-width: 1024px) {
          .pdp-grid { grid-template-columns: 1fr; gap: 40px; }
        }
        @media (max-width: 768px) {
          .pdp-grid { padding: 16px 20px 80px; }
          .related-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
}
