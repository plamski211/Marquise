import { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLang } from '../context/LangContext';
import { assetUrl } from '../lib/api';

export default function ProductCard({ product, index = 0 }) {
  const { t, tp } = useLang();
  const [hovered, setHovered] = useState(false);
  const imgRef = useRef(null);
  const hasImage = product.images && product.images.length > 0;

  /* Subtle magnetic tilt on hover */
  const handleMouseMove = useCallback((e) => {
    const el = imgRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `scale(1.03) translate(${x * 6}px, ${y * 6}px)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    const el = imgRef.current;
    if (el) el.style.transform = 'scale(1)';
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        to={`/product/${product.id}`}
        style={{ display: 'block' }}
        onMouseEnter={() => setHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Image */}
        <div
          style={{
            position: 'relative',
            aspectRatio: '3 / 4',
            overflow: 'hidden',
            background: 'var(--bg-alt)',
            marginBottom: '16px',
          }}
        >
          {hasImage ? (
            <img
              ref={imgRef}
              src={assetUrl(product.images[0])}
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                willChange: 'transform',
              }}
            />
          ) : (
            <div
              ref={imgRef}
              style={{
                width: '100%',
                height: '100%',
                background: product.gradient || '#F0EEEC',
                transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                willChange: 'transform',
              }}
            />
          )}

          {product.isNew && (
            <div
              style={{
                position: 'absolute',
                top: '14px',
                left: '14px',
                fontFamily: 'var(--sans)',
                fontSize: '0.52rem',
                fontWeight: 500,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--text)',
                background: 'var(--bg)',
                padding: '5px 12px',
              }}
            >
              {t('new')}
            </div>
          )}

          {/* Hover reveal line */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'var(--accent)',
              transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
              transformOrigin: 'left',
              transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
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
          {tp(product, 'name')}
        </h4>
        <p
          style={{
            fontFamily: 'var(--sans)',
            fontSize: '0.82rem',
            fontWeight: 300,
            color: 'var(--text-light)',
          }}
        >
          €{product.price}
        </p>
      </Link>
    </motion.div>
  );
}
