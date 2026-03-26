import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

const slides = [
  {
    bg: 'linear-gradient(160deg, #0C0B0A 0%, #1E1C1A 40%, #0C0B0A 100%)',
    accent: 'radial-gradient(ellipse 70% 50% at 65% 40%, rgba(184,149,106,0.06) 0%, transparent 70%)',
    label: '01',
    title: ['Spring', 'Summer'],
    subtitle: '2026 Collection',
    align: 'left',
  },
  {
    bg: 'linear-gradient(160deg, #1B2838 0%, #263A50 40%, #1B2838 100%)',
    accent: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(100,150,200,0.04) 0%, transparent 70%)',
    label: '02',
    title: ['The Art of', 'Dressing'],
    subtitle: 'Curated Elegance',
    align: 'center',
  },
  {
    bg: 'linear-gradient(160deg, #2A2420 0%, #3A3430 40%, #1A1614 100%)',
    accent: 'radial-gradient(ellipse 60% 50% at 30% 60%, rgba(184,149,106,0.06) 0%, transparent 70%)',
    label: '03',
    title: ['Crafted', 'By Hand'],
    subtitle: 'Artisan Excellence',
    align: 'right',
  },
];

const DURATION = 6000;

const textV = {
  enter: { opacity: 0, y: 40 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);
  const sectionRef = useRef(null);

  /* Parallax on scroll */
  const { scrollY } = useScroll();
  const contentY = useTransform(scrollY, [0, 600], [0, 100]);
  const contentOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const bgScale = useTransform(scrollY, [0, 600], [1, 1.12]);

  const goTo = useCallback((i) => {
    setCurrent(i);
  }, []);

  const next = useCallback(() => {
    setCurrent((p) => (p + 1) % slides.length);
  }, []);

  /* Auto-advance */
  useEffect(() => {
    timerRef.current = setTimeout(next, DURATION);
    return () => clearTimeout(timerRef.current);
  }, [current, next]);

  const slide = slides[current];
  const isCenter = slide.align === 'center';
  const isRight = slide.align === 'right';

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        height: '100vh',
        minHeight: '600px',
        overflow: 'hidden',
      }}
    >
      {/* Background — crossfade with scale */}
      <AnimatePresence mode="sync">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: 'absolute', inset: 0 }}
        >
          <motion.div style={{ width: '100%', height: '100%', background: slide.bg, scale: bgScale }}>
            <div style={{ position: 'absolute', inset: 0, background: slide.accent }} />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Subtle grid texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          opacity: 0.015,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial="enter"
          animate="center"
          exit="exit"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            display: 'flex',
            alignItems: isCenter ? 'center' : 'flex-end',
            justifyContent: isCenter ? 'center' : isRight ? 'flex-end' : 'flex-start',
          }}
        >
          <motion.div
            className="container"
            style={{
              paddingBottom: isCenter ? 0 : 'clamp(100px, 14vh, 160px)',
              textAlign: slide.align,
              y: contentY,
              opacity: contentOpacity,
            }}
          >
            {/* Label number */}
            <motion.p
              variants={textV}
              transition={{ duration: 0.7, delay: 0.15 }}
              style={{
                fontFamily: 'var(--sans)',
                fontSize: '0.55rem',
                fontWeight: 500,
                letterSpacing: '0.4em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.25)',
                marginBottom: '28px',
              }}
            >
              {slide.label}
            </motion.p>

            {/* Title — each line staggers */}
            <div style={{ marginBottom: '28px' }}>
              {slide.title.map((line, i) => (
                <div key={i} style={{ overflow: 'hidden' }}>
                  <motion.span
                    variants={textV}
                    transition={{
                      duration: 0.9,
                      delay: 0.25 + i * 0.14,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{
                      display: 'block',
                      fontFamily: 'var(--serif)',
                      fontSize: 'clamp(3.5rem, 10vw, 9rem)',
                      fontWeight: 300,
                      color: '#FEFEFE',
                      lineHeight: 0.92,
                      letterSpacing: '-0.03em',
                    }}
                  >
                    {line}
                  </motion.span>
                </div>
              ))}
            </div>

            {/* Subtitle */}
            <motion.p
              variants={textV}
              transition={{ duration: 0.6, delay: 0.6 }}
              style={{
                fontFamily: 'var(--sans)',
                fontSize: '0.68rem',
                fontWeight: 300,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.2)',
                marginBottom: '44px',
              }}
            >
              {slide.subtitle}
            </motion.p>

            {/* CTA */}
            <motion.div variants={textV} transition={{ duration: 0.6, delay: 0.75 }}>
              <Link
                to="/shop"
                className="btn"
                style={{
                  borderColor: 'rgba(255,255,255,0.18)',
                  color: 'rgba(255,255,255,0.65)',
                  fontSize: '0.6rem',
                  padding: '15px 44px',
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.6)';
                  e.target.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.18)';
                  e.target.style.color = 'rgba(255,255,255,0.65)';
                }}
              >
                Discover
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Progress bars */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 5,
          display: 'flex',
          padding: '0 48px 36px',
          gap: '8px',
        }}
      >
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            style={{
              flex: 1,
              height: '2px',
              background: 'rgba(255,255,255,0.08)',
              position: 'relative',
              overflow: 'hidden',
              padding: '8px 0',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 0,
                height: '2px',
                width: '100%',
                background: 'rgba(255,255,255,0.08)',
              }}
            />
            {i === current ? (
              <motion.div
                key={`p-${current}`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: DURATION / 1000, ease: 'linear' }}
                style={{
                  position: 'absolute',
                  left: 0,
                  height: '2px',
                  width: '100%',
                  background: 'rgba(255,255,255,0.5)',
                  transformOrigin: 'left',
                }}
              />
            ) : (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  height: '2px',
                  width: '100%',
                  background: i < current ? 'rgba(255,255,255,0.35)' : 'transparent',
                }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Slide counter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        style={{
          position: 'absolute',
          bottom: '56px',
          right: '48px',
          zIndex: 5,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontFamily: 'var(--sans)',
          fontSize: '0.62rem',
          fontWeight: 400,
          letterSpacing: '0.15em',
        }}
      >
        <span style={{ color: 'rgba(255,255,255,0.6)' }}>
          {String(current + 1).padStart(2, '0')}
        </span>
        <span
          style={{ width: '24px', height: '1px', background: 'rgba(255,255,255,0.15)' }}
        />
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>
          {String(slides.length).padStart(2, '0')}
        </span>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        style={{
          position: 'absolute',
          bottom: '56px',
          left: '48px',
          zIndex: 5,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: '1px',
            height: '32px',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.2), transparent)',
          }}
        />
        <span
          style={{
            fontFamily: 'var(--sans)',
            fontSize: '0.5rem',
            fontWeight: 400,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.15)',
          }}
        >
          Scroll
        </span>
      </motion.div>

      <style>{`
        @media (max-width: 768px) {
          section > div:last-of-type { display: none; }
        }
      `}</style>
    </section>
  );
}
