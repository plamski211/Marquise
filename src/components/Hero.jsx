import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLang } from '../context/LangContext';
import Bag1 from '../Images/Bag1.webp';
import Bag2 from '../Images/Bag2.webp';
import Grey1 from '../Images/Grey1.webp';
import Grey2 from '../Images/Grey2.webp';
import Grey3 from '../Images/Grey3.webp';
import Grey4 from '../Images/Grey4.webp';
import Grey5 from '../Images/Grey5.webp';

const slides = [
  {
    image: Bag1,
    imageFocus: '50% 20%',
    fallbackBg: 'linear-gradient(160deg, #0C0B0A 0%, #1E1C1A 40%, #0C0B0A 100%)',
    overlay: 'linear-gradient(105deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.42) 50%, rgba(0,0,0,0.18) 100%)',
    label: '01',
    titleKeys: ['heroLabel1', 'heroLabel2'],
    subtitleKey: 'heroLabel3',
    align: 'left',
  },
  {
    image: Grey1,
    imageFocus: '50% 25%',
    fallbackBg: 'linear-gradient(160deg, #1B2838 0%, #263A50 40%, #1B2838 100%)',
    overlay: 'linear-gradient(180deg, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.52) 55%, rgba(0,0,0,0.72) 100%)',
    label: '02',
    titleKeys: ['heroTitle1a', 'heroTitle1b'],
    subtitleKey: 'heroSub1',
    align: 'center',
  },
  {
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=85',
    imageFocus: '50% 30%',
    fallbackBg: 'linear-gradient(160deg, #2A2420 0%, #3A3430 40%, #1A1614 100%)',
    overlay: 'linear-gradient(255deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.42) 50%, rgba(0,0,0,0.18) 100%)',
    label: '03',
    titleKeys: ['heroTitle2a', 'heroTitle2b'],
    subtitleKey: 'heroSub2',
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
  const { t } = useLang();
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
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: 'absolute', inset: 0, background: slide.fallbackBg }}
        >
          <motion.div style={{ width: '100%', height: '100%', position: 'relative', scale: bgScale }}>
            <img
              src={slide.image}
              alt=""
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: slide.imageFocus,
              }}
            />
            {/* Directional overlay for text legibility */}
            <div style={{ position: 'absolute', inset: 0, background: slide.overlay }} />
            {/* Bottom gradient for progress bars */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 30%)',
            }} />
          </motion.div>
        </motion.div>
      </AnimatePresence>

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
              {slide.titleKeys.map((key, i) => (
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
                    {t(key)}
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
              {t(slide.subtitleKey)}
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
                {t('heroDiscover')}
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
          padding: '0 var(--px) 36px',
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
        className="hero-counter"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        style={{
          position: 'absolute',
          bottom: '56px',
          right: 'var(--px)',
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
        className="hero-scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        style={{
          position: 'absolute',
          bottom: '56px',
          left: 'var(--px)',
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
          {t('heroScroll')}
        </span>
      </motion.div>

      <style>{`
        @media (max-width: 768px) {
          .hero-counter, .hero-scroll { display: none !important; }
        }
      `}</style>
    </section>
  );
}
