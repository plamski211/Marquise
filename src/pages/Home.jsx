import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import HorizontalGallery from '../components/HorizontalGallery';
import EditorialBand from '../components/EditorialBand';
import ProductCard from '../components/ProductCard';
import ScrollReveal from '../components/ScrollReveal';
import { useProducts } from '../context/ProductContext';
import { useLang } from '../context/LangContext';

export default function Home() {
  const { t } = useLang();
  const { getFeatured, getNew } = useProducts();
  const featured = getFeatured().slice(0, 10);
  const newArrivals = getNew().slice(0, 4);

  return (
    <div>
      <Hero />

      {/* Horizontal drag gallery — the "Dior swipe" */}
      <HorizontalGallery products={featured} />

      {/* Editorial band — cinematic brand moment */}
      <EditorialBand />

      {/* New Arrivals grid */}
      {newArrivals.length > 0 && (
        <section
          className="new-arrivals-section"
          style={{
            padding: 'clamp(100px, 14vh, 180px) 0',
            background: 'var(--bg-alt)',
          }}
        >
          <div className="container">
            <ScrollReveal>
              <div
                className="new-arrivals-header"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  marginBottom: '56px',
                }}
              >
                <div>
                  <p
                    className="label"
                    style={{ marginBottom: '12px', color: 'var(--accent)' }}
                  >
                    {t('justArrived')}
                  </p>
                  <h2>{t('newIn')}</h2>
                </div>
                <Link
                  to="/shop?filter=new"
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: '0.62rem',
                    fontWeight: 500,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'var(--text-light)',
                    borderBottom: '1px solid var(--border)',
                    paddingBottom: '4px',
                    transition: 'color 0.3s ease, border-color 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = 'var(--text)';
                    e.target.style.borderColor = 'var(--text)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = 'var(--text-light)';
                    e.target.style.borderColor = 'var(--border)';
                  }}
                >
                  {t('viewAll')}
                </Link>
              </div>
            </ScrollReveal>

            <div className="home-grid">
              {newArrivals.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <style>{`
        .home-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px 20px;
        }
        @media (max-width: 1024px) {
          .home-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .new-arrivals-section {
            padding: 56px 0 !important;
          }
          .new-arrivals-header {
            margin-bottom: 32px !important;
          }
        }
        @media (max-width: 540px) {
          .home-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px 12px;
          }
        }
      `}</style>
    </div>
  );
}
