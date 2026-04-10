import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ScrollReveal from './ScrollReveal';
import { useLang } from '../context/LangContext';
import { assetUrl } from '../lib/api';

export default function HorizontalGallery({ products }) {
  const { t } = useLang();
  const [hoveredIdx, setHoveredIdx] = useState(-1);

  if (!products || products.length === 0) return null;

  return (
    <section style={{ padding: 'clamp(80px, 12vh, 150px) 0' }}>
      {/* Header */}
      <div className="container" style={{ marginBottom: '40px' }}>
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
                fontSize: '0.6rem',
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

      {/* Scroll track — plain overflow, no scroll hijack */}
      <div
        className="gallery-scroll"
        style={{
          display: 'flex',
          gap: 'clamp(12px, 1.4vw, 18px)',
          paddingLeft: 'var(--px)',
          paddingRight: 'clamp(40px, 8vw, 100px)',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {products.map((product, i) => {
          const hasImage = product.images && product.images.length > 0;
          const isHov = hoveredIdx === i;

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.55, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              style={{
                minWidth: 'clamp(160px, 14vw, 220px)',
                flexShrink: 0,
              }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(-1)}
            >
              <Link
                to={`/product/${product.id}`}
                draggable={false}
                style={{ display: 'block' }}
              >
                {/* Image */}
                <div
                  style={{
                    aspectRatio: '3 / 4',
                    overflow: 'hidden',
                    position: 'relative',
                    marginBottom: '12px',
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
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        background: product.gradient || '#F5F3F0',
                      }}
                    />
                  )}

                  {/* Hover reveal line at bottom */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: 'var(--accent, #8B7355)',
                      transform: isHov ? 'scaleX(1)' : 'scaleX(0)',
                      transformOrigin: 'left',
                      transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  />
                </div>

                {/* Info */}
                <h4
                  style={{
                    fontFamily: 'var(--serif)',
                    fontSize: '0.88rem',
                    fontWeight: 400,
                    color: 'var(--text)',
                    marginBottom: '3px',
                    lineHeight: 1.3,
                  }}
                >
                  {product.name}
                </h4>
                <p
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: '0.7rem',
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
      </div>

      <style>{`
        .gallery-scroll::-webkit-scrollbar { display: none; }
        .gallery-scroll { scrollbar-width: none; }
      `}</style>
    </section>
  );
}
