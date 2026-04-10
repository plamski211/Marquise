import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useAnimation } from 'framer-motion';
import { Link } from 'react-router-dom';
import ScrollReveal from './ScrollReveal';
import { useLang } from '../context/LangContext';
import { assetUrl } from '../lib/api';

export default function HorizontalGallery({ products }) {
  const { t } = useLang();
  const trackRef = useRef(null);
  const [constraint, setConstraint] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(-1);

  useEffect(() => {
    const measure = () => {
      const el = trackRef.current;
      if (el) {
        const total = el.scrollWidth;
        const view = el.parentElement.offsetWidth;
        setConstraint(Math.min(0, -(total - view)));
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [products]);

  if (!products || products.length === 0) return null;

  return (
    <section style={{ padding: 'clamp(100px, 14vh, 180px) 0', overflow: 'hidden' }}>
      {/* Header */}
      <div className="container" style={{ marginBottom: '56px' }}>
        <ScrollReveal>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <p
                className="label"
                style={{ marginBottom: '12px', color: 'var(--accent)' }}
              >
                {t('theCollection')}
              </p>
              <h2 style={{ lineHeight: 1.05 }}>{t('explore')}</h2>
            </div>
            <p
              style={{
                fontFamily: 'var(--sans)',
                fontSize: '0.62rem',
                fontWeight: 400,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--text-light)',
              }}
            >
              {t('dragToExplore')}
            </p>
          </div>
        </ScrollReveal>
      </div>

      {/* Drag track */}
      <motion.div
        ref={trackRef}
        drag="x"
        dragConstraints={{ left: constraint, right: 0 }}
        dragElastic={0.06}
        dragTransition={{ bounceStiffness: 300, bounceDamping: 35 }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setTimeout(() => setIsDragging(false), 150)}
        style={{
          display: 'flex',
          gap: 'clamp(16px, 2vw, 28px)',
          paddingLeft: 'var(--px)',
          paddingRight: 'clamp(60px, 10vw, 120px)',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
        }}
      >
        {products.map((product, i) => {
          const hasImage = product.images && product.images.length > 0;
          const isHov = hoveredIdx === i;

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              style={{
                minWidth: 'clamp(280px, 26vw, 400px)',
                flexShrink: 0,
              }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(-1)}
            >
              <Link
                to={`/product/${product.id}`}
                onClick={(e) => isDragging && e.preventDefault()}
                draggable={false}
                style={{
                  display: 'block',
                  pointerEvents: isDragging ? 'none' : 'auto',
                }}
              >
                {/* Image */}
                <div
                  style={{
                    aspectRatio: '3 / 4.2',
                    overflow: 'hidden',
                    position: 'relative',
                    marginBottom: '20px',
                  }}
                >
                  {hasImage ? (
                    <img
                      src={assetUrl(product.images[0])}
                      alt={product.name}
                      draggable={false}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
                        transform: isHov ? 'scale(1.06)' : 'scale(1)',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        background: product.gradient || 'var(--bg-alt)',
                        transition: 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
                        transform: isHov ? 'scale(1.06)' : 'scale(1)',
                        display: 'flex',
                        alignItems: 'flex-end',
                        padding: '32px',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--serif)',
                          fontSize: '1.1rem',
                          fontStyle: 'italic',
                          color: 'rgba(255,255,255,0.15)',
                        }}
                      >
                        {product.category}
                      </span>
                    </div>
                  )}

                  {/* Number overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '20px',
                      left: '20px',
                      fontFamily: 'var(--sans)',
                      fontSize: '0.5rem',
                      fontWeight: 500,
                      letterSpacing: '0.2em',
                      color: 'rgba(255,255,255,0.2)',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </div>

                  {/* "View" indicator on hover */}
                  <motion.div
                    initial={false}
                    animate={{ opacity: isHov ? 1 : 0, scale: isHov ? 1 : 0.8 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      position: 'absolute',
                      bottom: '20px',
                      right: '20px',
                      fontFamily: 'var(--sans)',
                      fontSize: '0.5rem',
                      fontWeight: 500,
                      letterSpacing: '0.25em',
                      textTransform: 'uppercase',
                      color: '#fff',
                      background: 'rgba(0,0,0,0.4)',
                      backdropFilter: 'blur(8px)',
                      padding: '8px 16px',
                    }}
                  >
                    {t('view')}
                  </motion.div>
                </div>

                {/* Info */}
                <h4
                  style={{
                    fontFamily: 'var(--serif)',
                    fontSize: '1.15rem',
                    fontWeight: 400,
                    color: 'var(--text)',
                    marginBottom: '5px',
                    lineHeight: 1.3,
                    transition: 'color 0.3s ease',
                  }}
                >
                  {product.name}
                </h4>
                <p
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: '0.82rem',
                    fontWeight: 300,
                    color: 'var(--text-light)',
                  }}
                >
                  ${product.price}
                </p>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* responsive padding now handled by var(--px) */}
    </section>
  );
}
