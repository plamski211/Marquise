import { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ScrollReveal from './ScrollReveal';
import { useLang } from '../context/LangContext';
import { assetUrl } from '../lib/api';

export default function HorizontalGallery({ products }) {
  const { t } = useLang();
  const trackRef = useRef(null);
  const containerRef = useRef(null);
  const [constraint, setConstraint] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(-1);
  const [imagesLoaded, setImagesLoaded] = useState(0);

  const measure = useCallback(() => {
    const el = trackRef.current;
    const parent = containerRef.current;
    if (el && parent) {
      const total = el.scrollWidth;
      const view = parent.offsetWidth;
      setConstraint(Math.min(0, -(total - view)));
    }
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [products, measure]);

  // Remeasure after images load
  useEffect(() => {
    measure();
  }, [imagesLoaded, measure]);

  if (!products || products.length === 0) return null;

  return (
    <section
      ref={containerRef}
      style={{ padding: 'clamp(100px, 14vh, 180px) 0', overflow: 'hidden' }}
    >
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
                minWidth: 'clamp(260px, 22vw, 340px)',
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
                    aspectRatio: '3 / 4',
                    overflow: 'hidden',
                    position: 'relative',
                    marginBottom: '20px',
                    background: '#F5F3F0',
                  }}
                >
                  {hasImage ? (
                    <img
                      src={assetUrl(product.images[0])}
                      alt={product.name}
                      draggable={false}
                      onLoad={() => setImagesLoaded(c => c + 1)}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
                        transform: isHov ? 'scale(1.05)' : 'scale(1)',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        background: product.gradient || '#F5F3F0',
                      }}
                    />
                  )}

                  {/* Subtle number overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '16px',
                      left: '16px',
                      fontFamily: 'var(--sans)',
                      fontSize: '0.48rem',
                      fontWeight: 500,
                      letterSpacing: '0.2em',
                      color: 'rgba(0,0,0,0.15)',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </div>

                  {/* "View" indicator on hover */}
                  <motion.div
                    initial={false}
                    animate={{ opacity: isHov ? 1 : 0, y: isHov ? 0 : 6 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      position: 'absolute',
                      bottom: '16px',
                      right: '16px',
                      fontFamily: 'var(--sans)',
                      fontSize: '0.48rem',
                      fontWeight: 500,
                      letterSpacing: '0.25em',
                      textTransform: 'uppercase',
                      color: '#fff',
                      background: 'rgba(0,0,0,0.35)',
                      backdropFilter: 'blur(12px)',
                      padding: '7px 14px',
                    }}
                  >
                    {t('view')}
                  </motion.div>
                </div>

                {/* Info */}
                <h4
                  style={{
                    fontFamily: 'var(--serif)',
                    fontSize: '1.05rem',
                    fontWeight: 400,
                    color: 'var(--text)',
                    marginBottom: '4px',
                    lineHeight: 1.3,
                  }}
                >
                  {product.name}
                </h4>
                <p
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: '0.78rem',
                    fontWeight: 300,
                    color: 'var(--text-light)',
                    letterSpacing: '0.02em',
                  }}
                >
                  ${product.price}
                </p>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
