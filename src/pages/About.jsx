import { motion } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
import { useLang } from '../context/LangContext';

export default function About() {
  const { t } = useLang();

  return (
    <div style={{ paddingTop: 'var(--nav-h)' }}>
      {/* Hero */}
      <section style={{
        padding: 'clamp(80px, 12vh, 140px) 0 clamp(60px, 8vh, 100px)',
        background: '#0C0B0A',
        textAlign: 'center',
      }}>
        <div className="container">
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="label" style={{ color: 'var(--accent)', marginBottom: '16px' }}
          >
            {t('aboutLabel')}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 300, color: '#FEFEFE' }}
          >
            {t('aboutTitle')}
          </motion.h1>
        </div>
      </section>

      {/* Our Story */}
      <section style={{ padding: 'clamp(80px, 10vh, 120px) 0' }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          <ScrollReveal>
            <p className="label" style={{ color: 'var(--accent)', marginBottom: '16px' }}>{t('aboutStoryLabel')}</p>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 300, marginBottom: '28px', lineHeight: 1.25 }}>
              {t('aboutStoryTitle')}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '0.88rem', fontWeight: 300, lineHeight: 1.85, color: 'var(--text-light)' }}>
              <p>{t('aboutStoryP1')}</p>
              <p>{t('aboutStoryP2')}</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Craftsmanship */}
      <section style={{ padding: 'clamp(80px, 10vh, 120px) 0', background: 'var(--bg-alt)' }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          <ScrollReveal>
            <p className="label" style={{ color: 'var(--accent)', marginBottom: '16px' }}>{t('aboutCraftLabel')}</p>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 300, marginBottom: '28px', lineHeight: 1.25 }}>
              {t('aboutCraftTitle')}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '0.88rem', fontWeight: 300, lineHeight: 1.85, color: 'var(--text-light)' }}>
              <p>{t('aboutCraftP1')}</p>
              <p>{t('aboutCraftP2')}</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Sustainability */}
      <section style={{ padding: 'clamp(80px, 10vh, 120px) 0' }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          <ScrollReveal>
            <p className="label" style={{ color: 'var(--accent)', marginBottom: '16px' }}>{t('aboutSustainLabel')}</p>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 300, marginBottom: '28px', lineHeight: 1.25 }}>
              {t('aboutSustainTitle')}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '0.88rem', fontWeight: 300, lineHeight: 1.85, color: 'var(--text-light)' }}>
              <p>{t('aboutSustainP1')}</p>
              <p>{t('aboutSustainP2')}</p>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
