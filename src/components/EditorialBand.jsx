import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import ScrollReveal from './ScrollReveal';
import { useLang } from '../context/LangContext';

export default function EditorialBand() {
  const { t } = useLang();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const textY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const imageY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5], [1.12, 1]);
  const lineWidth = useTransform(scrollYProgress, [0.1, 0.5], ['0%', '100%']);

  return (
    <section
      ref={ref}
      className="editorial-section"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: '#0C0B0A',
        padding: 'clamp(120px, 16vh, 200px) 0',
      }}
    >
      {/* Ambient light */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          right: '5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(184,149,106,0.04) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '10%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(184,149,106,0.03) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />

      <div className="container">
        <div className="editorial-grid">
          {/* Text side */}
          <ScrollReveal>
            <motion.div style={{ y: textY }}>
              <p
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: '0.58rem',
                  fontWeight: 500,
                  letterSpacing: '0.4em',
                  textTransform: 'uppercase',
                  color: 'var(--accent)',
                  marginBottom: '28px',
                }}
              >
                {t('editorialTitle')}
              </p>

              <h2
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                  fontWeight: 300,
                  fontStyle: 'italic',
                  color: '#FEFEFE',
                  lineHeight: 1.15,
                  marginBottom: '20px',
                }}
              >
                {t('editorialLine1')}
                <br />
                {t('editorialLine2')}
              </h2>

              {/* Animated gold line */}
              <motion.div
                style={{
                  width: lineWidth,
                  height: '1px',
                  background:
                    'linear-gradient(90deg, rgba(184,149,106,0.5), transparent)',
                  marginBottom: '28px',
                  maxWidth: '120px',
                }}
              />

              <p
                style={{
                  fontSize: '0.88rem',
                  fontWeight: 300,
                  lineHeight: 1.85,
                  color: 'rgba(255,255,255,0.28)',
                  maxWidth: '420px',
                  marginBottom: '48px',
                }}
              >
                {t('editorialBody')}
              </p>

              <Link
                to="/lookbook"
                className="btn"
                style={{
                  borderColor: 'rgba(255,255,255,0.12)',
                  color: 'rgba(255,255,255,0.5)',
                  fontSize: '0.58rem',
                  padding: '14px 40px',
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.4)';
                  e.target.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.12)';
                  e.target.style.color = 'rgba(255,255,255,0.5)';
                }}
              >
                {t('viewLookbook')}
              </Link>
            </motion.div>
          </ScrollReveal>

          {/* Visual side — parallax image/gradient */}
          <motion.div style={{ y: imageY }}>
            <div
              style={{
                aspectRatio: '3 / 4',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <motion.div
                style={{
                  width: '100%',
                  height: '100%',
                  background:
                    'linear-gradient(165deg, #1A1614 0%, #2A2420 40%, #1A1614 100%)',
                  scale: imageScale,
                }}
              >
                {/* Inset border */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 'clamp(24px, 3vw, 48px)',
                    border: '1px solid rgba(184,149,106,0.06)',
                  }}
                />

                {/* Center mark */}
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      border: '1px solid rgba(184,149,106,0.1)',
                      transform: 'rotate(45deg)',
                      margin: '0 auto 24px',
                    }}
                  />
                  <p
                    style={{
                      fontFamily: 'var(--serif)',
                      fontSize: 'clamp(1rem, 1.5vw, 1.3rem)',
                      fontStyle: 'italic',
                      color: 'rgba(255,255,255,0.08)',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {t('lookbook')}
                  </p>
                </div>
              </motion.div>

              {/* Corner accents */}
              {[
                { top: 0, left: 0 },
                { top: 0, right: 0 },
                { bottom: 0, left: 0 },
                { bottom: 0, right: 0 },
              ].map((pos, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    ...pos,
                    width: '24px',
                    height: '24px',
                    borderTop: pos.top === 0 ? '1px solid rgba(184,149,106,0.1)' : 'none',
                    borderBottom: pos.bottom === 0 ? '1px solid rgba(184,149,106,0.1)' : 'none',
                    borderLeft: pos.left === 0 ? '1px solid rgba(184,149,106,0.1)' : 'none',
                    borderRight: pos.right === 0 ? '1px solid rgba(184,149,106,0.1)' : 'none',
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        .editorial-grid {
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: clamp(40px, 6vw, 100px);
          align-items: center;
        }
        @media (max-width: 1024px) {
          .editorial-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
        }
        @media (max-width: 768px) {
          .editorial-section {
            padding: 64px 0 !important;
          }
        }
        @media (max-width: 480px) {
          .editorial-section {
            padding: 48px 0 !important;
          }
        }
      `}</style>
    </section>
  );
}
