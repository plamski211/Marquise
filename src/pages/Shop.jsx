import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';
import { categories } from '../data/defaultProducts';
import { useLang } from '../context/LangContext';

export default function Shop() {
  const { t } = useLang();
  const { products, getByCategory, getNew } = useProducts();
  const [searchParams] = useSearchParams();
  const isNewFilter = searchParams.get('filter') === 'new';
  const [activeCategory, setActiveCategory] = useState(isNewFilter ? 'New' : 'All');
  const [sortBy, setSortBy] = useState('newest');

  const displayProducts = useMemo(() => {
    let filtered = activeCategory === 'New' ? getNew() : getByCategory(activeCategory);
    switch (sortBy) {
      case 'price-asc': return [...filtered].sort((a, b) => a.price - b.price);
      case 'price-desc': return [...filtered].sort((a, b) => b.price - a.price);
      case 'name': return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
      default: return filtered;
    }
  }, [activeCategory, sortBy, products, getByCategory, getNew]);

  const allCategories = ['All', 'New', ...categories.filter(c => c !== 'All')];

  return (
    <div style={{ paddingTop: 'var(--nav-h)' }}>
      {/* Header */}
      <section style={{ padding: '64px 0 48px' }}>
        <div className="container">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ marginBottom: '0' }}
          >
            {activeCategory === 'All' ? t('collection') :
             activeCategory === 'New' ? t('newArrivals') : activeCategory}
          </motion.h1>
        </div>
      </section>

      {/* Filter bar */}
      <section style={{
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 'var(--nav-h)',
        zIndex: 100,
        background: 'rgba(254,254,254,0.95)',
        backdropFilter: 'blur(12px)',
      }}>
        <div className="container shop-filter-bar">
          <div className="shop-filter-cats">
            {allCategories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                fontFamily: 'var(--sans)',
                fontSize: '0.6rem',
                fontWeight: activeCategory === cat ? 600 : 400,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: activeCategory === cat ? 'var(--text)' : 'var(--text-light)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                padding: '4px 0',
                transition: 'color 0.2s ease',
                whiteSpace: 'nowrap',
              }}>
                {cat}
                {activeCategory === cat && (
                  <motion.div
                    layoutId="cat"
                    style={{
                      position: 'absolute',
                      bottom: '-1px',
                      left: 0,
                      right: 0,
                      height: '1.5px',
                      background: 'var(--text)',
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="shop-filter-sort">
            <span style={{ fontSize: '0.72rem', fontWeight: 300, color: 'var(--text-light)' }}>
              {displayProducts.length}
            </span>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
              fontFamily: 'var(--sans)',
              fontSize: '0.62rem',
              fontWeight: 400,
              letterSpacing: '0.06em',
              color: 'var(--text-mid)',
              cursor: 'pointer',
              padding: '4px 16px 4px 0',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='1.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right center',
            }}>
              <option value="newest">{t('newest')}</option>
              <option value="price-asc">{t('priceAsc')}</option>
              <option value="price-desc">{t('priceDesc')}</option>
              <option value="name">{t('aToZ')}</option>
            </select>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section style={{ padding: '56px 0 120px' }}>
        <div className="container">
          {displayProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <p style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', color: 'var(--text-mid)' }}>
                {t('noPiecesYet')}
              </p>
            </div>
          ) : (
            <div className="shop-grid">
              {displayProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      <style>{`
        .shop-filter-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 50px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .shop-filter-bar::-webkit-scrollbar { display: none; }
        .shop-filter-cats {
          display: flex;
          gap: 28px;
          flex-shrink: 0;
        }
        .shop-filter-sort {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-shrink: 0;
        }
        .shop-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 32px 20px;
        }
        @media (max-width: 1024px) {
          .shop-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .shop-filter-cats { gap: 18px; }
        }
        @media (max-width: 540px) {
          .shop-grid {
            grid-template-columns: 1fr;
            max-width: 380px;
            margin: 0 auto;
          }
        }
      `}</style>
    </div>
  );
}
