import { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ScrollReveal from './ScrollReveal';
import { useLang } from '../context/LangContext';
import { assetUrl } from '../lib/api';

export default function HorizontalGallery({ products }) {
  const { t } = useLang();
  const trackRef = useRef(null);
  const wrapRef = useRef(null);
  const [constraint, setConstraint] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(-1);
  const [isMobile, setIsMobile] = useState(false);

  const measure = useCallback(() => {
    const track = trackRef.current;
    const wrap = wrapRef.current;
    if (track && wrap) {
      setConstraint(Math.min(0, -(track.scrollWidth - wrap.offsetWidth)));
    }
    setIsMobile(window.innerWidth <= 768);
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [products, measure]);

  // Remeasure after images paint
  useEffect(() => {
    const timer = setTimeout(measure, 600);
    return () => clearTimeout(timer);
  }, [products, measure]);

  if (!products || products.length === 0) return null;

  // Mobile: native touch scroll. Desktop: framer drag only.
  const trackContent = products.map((product, i) => {
    const hasImage = product.images && product.images.length > 0;
    const isHov = hoveredIdx === i;

    return (
      <motion.div
        key={product.id}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-20px' }}
        transition={{ duration: 0.5, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
        className="gallery-card"
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
          <div
            style={{
              aspectRatio: '3 / 4',
              overflow: 'hidden',
              position: 'relative',
              marginBottom: '10px',
              background: '#F5F3F0',
            }}
          >
            {hasImage ? (
              <img
                src={assetUrl(product.images[0])}
                alt={product.name}
                draggable={false}
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                  transform: isHov ? 'scale(1.04)' : 'scale(1)',
                }}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', background: product.gradient || '#F5F3F0' }} />
            )}

            <div
              style={{
                position: 'absolute',
                bottom: 0, left: 0, right: 0,
                height: '2px',
                background: 'var(--accent, #8B7355)',
                transform: isHov ? 'scaleX(1)' : 'scaleX(0)',
                transformOrigin: 'left',
                transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          </div>

          <h4 style={{
            fontFamily: 'var(--serif)',
            fontSize: '0.88rem',
            fontWeight: 400,
            color: 'var(--text)',
            marginBottom: '2px',
            lineHeight: 1.3,
          }}>
            {product.name}
          </h4>
          <p style={{
            fontFamily: 'var(--sans)',
            fontSize: '0.7rem',
            fontWeight: 300,
            color: 'var(--text-light)',
            letterSpacing: '0.02em',
          }}>
            ${product.price}
          </p>
        </Link>
      </motion.div>
    );
  });

  return (
    <section style={{ padding: 'clamp(60px, 10vh, 150px) 0' }}>
      <div className="container" style={{ marginBottom: 'clamp(28px, 4vh, 40px)' }}>
        <ScrollReveal>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '16px',
          }}>
            <div>
              <p className="label" style={{ marginBottom: '12px', color: 'var(--accent)' }}>
                {t('theCollection')}
              </p>
              <h2 style={{ lineHeight: 1.05 }}>{t('explore')}</h2>
            </div>
            <p style={{
              fontFamily: 'var(--sans)',
              fontSize: '0.6rem',
              fontWeight: 400,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--text-light)',
            }}>
              {t('dragToExplore')}
            </p>
          </div>
        </ScrollReveal>
      </div>

      {isMobile ? (
        /* Mobile: native horizontal scroll — touch swipe works naturally */
        <div className="gallery-scroll-mobile">
          {trackContent}
        </div>
      ) : (
        /* Desktop: framer drag, overflow hidden — no scroll interference */
        <div ref={wrapRef} style={{ overflow: 'hidden' }}>
          <motion.div
            ref={trackRef}
            drag="x"
            dragConstraints={{ left: constraint, right: 0 }}
            dragElastic={0.08}
            dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setTimeout(() => setIsDragging(false), 200)}
            className="gallery-track-desktop"
          >
            {trackContent}
          </motion.div>
        </div>
      )}

      <style>{`
        .gallery-card {
          min-width: clamp(160px, 14vw, 220px);
          flex-shrink: 0;
        }
        .gallery-track-desktop {
          display: flex;
          gap: clamp(12px, 1.4vw, 18px);
          padding-left: var(--px);
          padding-right: clamp(40px, 8vw, 100px);
          cursor: grab;
          user-select: none;
        }
        .gallery-track-desktop:active { cursor: grabbing; }
        .gallery-scroll-mobile {
          display: flex;
          gap: 12px;
          padding-left: var(--px);
          padding-right: 32px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
        }
        .gallery-scroll-mobile::-webkit-scrollbar { display: none; }
        @media (max-width: 768px) {
          .gallery-card {
            min-width: 32vw;
            scroll-snap-align: start;
          }
        }
        @media (max-width: 480px) {
          .gallery-card {
            min-width: 36vw;
          }
        }
      `}</style>
    </section>
  );
}
