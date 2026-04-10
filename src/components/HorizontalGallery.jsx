import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ScrollReveal from './ScrollReveal';
import { useLang } from '../context/LangContext';
import { assetUrl } from '../lib/api';

export default function HorizontalGallery({ products }) {
  const { t, tp } = useLang();
  const trackRef = useRef(null);
  const [hoveredIdx, setHoveredIdx] = useState(-1);

  /* Mouse-drag scrolling for desktop (trackpad scroll also works natively) */
  const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0, moved: false });

  const onMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    const el = trackRef.current;
    if (!el) return;
    dragState.current = { isDown: true, startX: e.pageX, scrollLeft: el.scrollLeft, moved: false };
  }, []);

  const onMouseUp = useCallback(() => {
    dragState.current.isDown = false;
    setTimeout(() => { dragState.current.moved = false; }, 10);
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!dragState.current.isDown) return;
    e.preventDefault();
    const el = trackRef.current;
    if (!el) return;
    const dx = e.pageX - dragState.current.startX;
    if (Math.abs(dx) > 3) dragState.current.moved = true;
    el.scrollLeft = dragState.current.scrollLeft - dx;
  }, []);

  const onLinkClick = useCallback((e) => {
    if (dragState.current.moved) e.preventDefault();
  }, []);

  if (!products || products.length === 0) return null;

  return (
    <section className="hg-section" style={{ padding: 'clamp(60px, 10vh, 150px) 0' }}>
      <div className="container hg-header" style={{ marginBottom: 'clamp(28px, 4vh, 40px)' }}>
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
            <p className="hg-hint" style={{
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

      <div
        ref={trackRef}
        className="gallery-track"
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onMouseMove={onMouseMove}
      >
        {products.map((product, i) => {
          const hasImage = product.images && product.images.length > 0;
          const isHov = hoveredIdx === i;

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.3) }}
              className="gallery-card"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(-1)}
            >
              <Link
                to={`/product/${product.id}`}
                onClick={onLinkClick}
                draggable={false}
                style={{ display: 'block' }}
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
                  {tp(product, 'name')}
                </h4>
                <p style={{
                  fontFamily: 'var(--sans)',
                  fontSize: '0.7rem',
                  fontWeight: 300,
                  color: 'var(--text-light)',
                  letterSpacing: '0.02em',
                }}>
                  €{product.price}
                </p>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <style>{`
        .gallery-card {
          min-width: clamp(160px, 14vw, 220px);
          flex-shrink: 0;
        }
        .gallery-track {
          display: flex;
          gap: clamp(12px, 1.4vw, 18px);
          padding-left: var(--px);
          padding-right: clamp(40px, 8vw, 100px);
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          overscroll-behavior-x: contain;
          cursor: grab;
          user-select: none;
        }
        .gallery-track::-webkit-scrollbar { display: none; }
        .gallery-track:active { cursor: grabbing; }
        @media (max-width: 768px) {
          .hg-section {
            padding: 32px 0 40px !important;
          }
          .hg-header {
            margin-bottom: 16px !important;
          }
          .hg-hint {
            display: none;
          }
          .gallery-track {
            padding-right: 32px;
            gap: 12px;
            cursor: default;
            scroll-snap-type: x mandatory;
          }
          .gallery-track:active { cursor: default; }
          .gallery-card {
            flex: 0 0 28vw;
            min-width: 0;
            scroll-snap-align: start;
          }
        }
        @media (max-width: 480px) {
          .hg-section {
            padding: 24px 0 32px !important;
          }
          .hg-header {
            margin-bottom: 12px !important;
          }
          .gallery-card {
            flex: 0 0 32vw;
            min-width: 0;
          }
        }
      `}</style>
    </section>
  );
}
