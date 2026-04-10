import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import { useProducts } from '../context/ProductContext';
import { useLang } from '../context/LangContext';
import { assetUrl } from '../lib/api';

export default function Lookbook() {
  const { t, tp } = useLang();
  const { products } = useProducts();

  const looks = [
    {
      titleKey: 'lookTitle1',
      subtitleKey: 'lookDesc1',
      products: products.filter(p => ['p1', 'p6', 'p7'].includes(p.id)),
      gradient: 'linear-gradient(145deg, #1A1614 0%, #2A2420 50%, #1A1614 100%)',
      accent: 'rgba(184, 149, 106, 0.15)',
    },
    {
      titleKey: 'lookTitle2',
      subtitleKey: 'lookDesc2',
      products: products.filter(p => ['p2', 'p4', 'p5'].includes(p.id)),
      gradient: 'linear-gradient(145deg, #F5F0EB 0%, #E8DFD4 50%, #DDD3C5 100%)',
      accent: 'rgba(26, 22, 20, 0.06)',
      dark: false,
    },
    {
      titleKey: 'lookTitle3',
      subtitleKey: 'lookDesc3',
      products: products.filter(p => ['p3', 'p10', 'p9'].includes(p.id)),
      gradient: 'linear-gradient(145deg, #1B2838 0%, #243447 50%, #1B2838 100%)',
      accent: 'rgba(184, 149, 106, 0.1)',
    },
  ];

  return (
    <div style={{ paddingTop: 'var(--nav-h)' }}>
      {/* Header */}
      <section style={{
        padding: '80px 0 60px',
        textAlign: 'center',
      }}>
        <div className="container">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              fontFamily: 'var(--sans)',
              fontSize: '0.65rem',
              fontWeight: 500,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              marginBottom: '16px',
            }}
          >
            {t('lookbookSeason')}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 300,
              color: 'var(--text)',
              marginBottom: '16px',
            }}
          >
            {t('lookbook')}
          </motion.h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '48px' }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              height: '1px',
              background: 'var(--accent)',
              margin: '0 auto',
            }}
          />
        </div>
      </section>

      {/* Lookbook sections */}
      {looks.map((look, i) => {
        const isDark = look.dark !== false;
        return (
          <section
            key={i}
            style={{
              background: look.gradient,
              padding: 'clamp(60px, 10vh, 120px) 0',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Decorative accent */}
            <div style={{
              position: 'absolute',
              top: '10%',
              right: i % 2 === 0 ? '5%' : 'auto',
              left: i % 2 !== 0 ? '5%' : 'auto',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: look.accent,
              filter: 'blur(100px)',
            }} />

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
              <ScrollReveal>
                <div style={{
                  textAlign: 'left',
                  marginBottom: '64px',
                }}>
                  <p style={{
                    fontFamily: 'var(--sans)',
                    fontSize: '0.6rem',
                    fontWeight: 500,
                    letterSpacing: '0.35em',
                    textTransform: 'uppercase',
                    color: 'var(--accent)',
                    marginBottom: '16px',
                  }}>
                    {t('look')} {String(i + 1).padStart(2, '0')}
                  </p>
                  <h2 style={{
                    fontFamily: 'var(--serif)',
                    fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                    fontWeight: 300,
                    fontStyle: 'italic',
                    color: isDark ? 'var(--text-inv)' : 'var(--text)',
                    marginBottom: '12px',
                  }}>
                    {t(look.titleKey)}
                  </h2>
                  <p style={{
                    fontSize: '0.9rem',
                    fontWeight: 300,
                    color: isDark ? 'rgba(250, 248, 245, 0.4)' : 'var(--text-mid)',
                  }}>
                    {t(look.subtitleKey)}
                  </p>
                </div>
              </ScrollReveal>

              {/* Products row */}
              <div className="lookbook-grid">
                {look.products.map((product, j) => (
                  <ScrollReveal key={product.id} delay={j + 1}>
                    <Link to={`/product/${product.id}`} style={{ display: 'block' }}>
                      <div style={{
                        aspectRatio: '3 / 4',
                        background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                        overflow: 'hidden',
                        position: 'relative',
                        marginBottom: '16px',
                      }}>
                        {product.images?.[0] ? (
                          <img
                            src={assetUrl(product.images[0])}
                            alt={product.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                            }}
                            onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                          />
                        ) : (
                          <div style={{
                            width: '100%',
                            height: '100%',
                            background: product.gradient,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            gap: '16px',
                          }}>
                            <div style={{
                              width: '20px',
                              height: '20px',
                              border: '1px solid rgba(255,255,255,0.2)',
                              transform: 'rotate(45deg)',
                            }} />
                            <span style={{
                              fontFamily: 'var(--serif)',
                              fontSize: '0.95rem',
                              fontStyle: 'italic',
                              color: 'rgba(255,255,255,0.35)',
                            }}>
                              {product.category}
                            </span>
                          </div>
                        )}
                      </div>
                      <h4 style={{
                        fontFamily: 'var(--serif)',
                        fontSize: '1.1rem',
                        fontWeight: 400,
                        color: isDark ? 'var(--text-inv)' : 'var(--text)',
                        marginBottom: '4px',
                      }}>
                        {tp(product, 'name')}
                      </h4>
                      <p style={{
                        fontSize: '0.8rem',
                        fontWeight: 300,
                        color: isDark ? 'rgba(250, 248, 245, 0.4)' : 'var(--text-light)',
                      }}>
                        €{product.price}
                      </p>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <style>{`
        .lookbook-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        @media (max-width: 768px) {
          .lookbook-grid {
            grid-template-columns: 1fr;
            max-width: 400px;
            margin: 0 auto;
          }
        }
      `}</style>
    </div>
  );
}
